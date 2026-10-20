import { ref, computed } from 'vue'
import { usePetsStore } from '@/stores/pets'

export function usePets(petTypes) {
  const store = usePetsStore()
  const pets = computed(() => store.pets)

  function addPet(payload) {
    store.addPet(payload)
  }


  function updatePet(id, payload) {
    store.updatePet(id, payload)
  }

  function removePet(id) {
    store.removePet(id)
  }

  function clearPets() {
    store.clearPets()
  }

  function breakdown(pet) {
    const type = petTypes[pet.type]
    if (!type) return []

    if (pet.action === 'summon') {
      const lvl = type['min-level']
      const cost = type.levels?.[lvl]
      if (!cost) return [{ level: lvl, missing: true }]
      const unknown = ['parts', 'berries', 'points'].filter(f => cost[f] == null)
      return [{
        level: lvl,
        parts: cost.parts,
        berries: cost.berries,
        points: cost.points,
        approxFields: cost.approxFields ?? [],
        unknownFields: unknown,
      }]
    }

    const rows = []
    for (let lvl = pet.currentLevel + 1; lvl <= pet.desiredLevel; lvl++) {
      const cost = type.levels?.[lvl]
      if (!cost) {
        rows.push({ level: lvl, missing: true })
        continue
      }
      const approx = cost.approxFields ?? []
      const unknown = ['parts', 'berries', 'points'].filter(f => cost[f] == null)
      rows.push({
        level: lvl,
        parts: cost.parts,
        berries: cost.berries,
        points: cost.points,
        approxFields: approx,
        unknownFields: unknown,
      })
    }
    return rows
  }

  function petTotal(pet) {
    const rows = breakdown(pet)
    const total = { parts: 0, berries: 0, points: 0, rows }
    const approxSet = new Set()
    const unknownSet = new Set()

    let hasMissing = false

    for (const r of rows) {
      if (r.missing) {
        hasMissing = true
        continue
      }
      for (const f of r.approxFields) approxSet.add(f)
      for (const f of r.unknownFields) unknownSet.add(f)

      if (r.parts != null) total.parts += r.parts
      if (r.berries != null) total.berries += r.berries
      if (r.points != null) total.points += r.points
    }

    total.approxFields = [...approxSet]
    total.unknownFields = [...unknownSet]
    total.hasMissing = hasMissing
    total.incomplete = hasMissing            // блокирует добавление
    total.hasUnknown = unknownSet.size > 0   // разрешает, но помечает

    return total
  }

  const totals = computed(() => {
    const sum = { parts: 0, berries: 0, points: 0, approxFields: new Set(), unknownFields: new Set() }
    let hasMissing = false

    for (const pet of pets.value) {
      const t = petTotal(pet)
      if (t.incomplete) { hasMissing = true; continue }
      sum.parts += t.parts
      sum.berries += t.berries
      sum.points += t.points
      for (const f of t.approxFields) sum.approxFields.add(f)
      for (const f of t.unknownFields) sum.unknownFields.add(f)
    }

    sum.approxFields = [...sum.approxFields]
    sum.unknownFields = [...sum.unknownFields]
    sum.hasMissing = hasMissing
    return sum
  })

  const petsWithCost = computed(() =>
    pets.value.map(pet => {
      const type = petTypes[pet.type]
      return {
        ...pet,
        quality: type?.quality,
        icon: type?.icon,
        total: petTotal(pet),
      }
    })
  )

  return { pets, addPet, updatePet, removePet, clearPets, totals, petsWithCost, breakdown, petTotal }
}
