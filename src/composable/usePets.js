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

  // Построчная разбивка для одной записи
  function breakdown(pet) {
    const type = petTypes[pet.type]
    if (!type) return []

    if (pet.action === 'summon') {
      return [{ level: 'призыв', parts: 0, berries: 0, points: type['summon-points'] ?? 0 }]
    }

    const rows = []
    for (let lvl = pet.currentLevel + 1; lvl <= pet.desiredLevel; lvl++) {
      const cost = type.levels?.[lvl]
      if (!cost) {
        rows.push({ level: lvl, missing: true })
        break
      }
      rows.push({ level: lvl, ...cost })
    }
    return rows
  }

  // Итог по одной записи
  function petTotal(pet) {
    const rows = breakdown(pet)
    if (rows.some(r => r.missing)) return { incomplete: true, rows }
    const total = { parts: 0, berries: 0, points: 0, rows }
    for (const r of rows) {
      total.parts += r.parts
      total.berries += r.berries
      total.points += r.points
    }
    return total
  }

  const totals = computed(() => {
    const sum = { parts: 0, berries: 0, points: 0 }
    for (const pet of pets.value) {
      const t = petTotal(pet)
      if (t.incomplete) continue
      sum.parts += t.parts
      sum.berries += t.berries
      sum.points += t.points
    }
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
