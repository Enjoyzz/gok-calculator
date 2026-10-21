import { computed } from 'vue'
import { usePetsStore } from '@/stores/pets'
import { pets } from '@/config/pets.js'

const FIELDS = ['parts', 'berries', 'points']

function toRow(level, cost) {
  if (!cost) return { level, missing: true }
  return {
    level,
    parts: cost.parts,
    berries: cost.berries,
    points: cost.points,
    approxFields: cost.approxFields ?? [],
    unknownFields: FIELDS.filter(f => cost[f] == null),
  }
}

export function breakdown(pet) {
  const type = pets[pet.type]
  if (!type) return []

  if (pet.action === 'summon') {
    const lvl = type['min-level']
    return [toRow(lvl, type.levels?.[lvl])]
  }

  const { currentLevel: from, desiredLevel: to } = pet
  if (!Number.isInteger(from) || !Number.isInteger(to)) return []

  const rows = []
  for (let lvl = from + 1; lvl <= to; lvl++) {
    rows.push(toRow(lvl, type.levels?.[lvl]))
  }
  return rows
}

function aggregate(items) {
  const sum = { parts: 0, berries: 0, points: 0 }
  const approx = new Set()
  const unknown = new Set()
  let hasMissing = false

  for (const it of items) {
    if (it.missing) { hasMissing = true; continue }
    for (const f of FIELDS) if (it[f] != null) sum[f] += it[f]
    it.approxFields.forEach(f => approx.add(f))
    it.unknownFields.forEach(f => unknown.add(f))
  }

  return {
    ...sum,
    approxFields: [...approx],
    unknownFields: [...unknown],
    hasMissing,
  }
}

export function petTotal(pet) {
  const rows = breakdown(pet)
  const total = aggregate(rows)
  return {
    ...total,
    rows,
    incomplete: total.hasMissing,              // блокирует добавление
    hasUnknown: total.unknownFields.length > 0, // разрешает, но помечает
  }
}

/** Максимальный уровень, до которого хватит осколков */
export function findMaxLevel(typeKey, currentLevel, budget) {
  const type = pets[typeKey]
  if (!type || !Number.isInteger(currentLevel) || budget == null) return null

  let spent = 0
  let last = currentLevel

  for (let lvl = currentLevel + 1; lvl <= type['max-level']; lvl++) {
    const parts = type.levels?.[lvl]?.parts
    if (parts == null || spent + parts > budget) break
    spent += parts
    last = lvl
  }

  return last > currentLevel ? last : null
}

export function usePets() {
  const store = usePetsStore()
  const pets = computed(() => store.pets)

  const petsWithCost = computed(() =>
    pets.value.map(pet => {
      const type = pets[pet.type]
      return { ...pet, quality: type?.quality, icon: type?.icon, total: petTotal(pet) }
    })
  )

  const totals = computed(() => {
    const complete = petsWithCost.value.map(p => p.total).filter(t => !t.incomplete)
    const sum = aggregate(
      complete.map(t => ({ ...t, approxFields: t.approxFields, unknownFields: t.unknownFields }))
    )
    sum.hasMissing = complete.length !== petsWithCost.value.length
    return sum
  })

  return {
    pets,
    petsWithCost,
    totals,
    addPet: store.addPet,
    updatePet: store.updatePet,
    removePet: store.removePet,
    clearPets: store.clearPets,
  }
}
