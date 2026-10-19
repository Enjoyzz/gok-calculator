import { ref, computed } from 'vue'

export function usePets(petTypes) {
  const pets = ref([])

  function addPet({ type, action, currentLevel, desiredLevel }) {
    if (!petTypes[type]) return
    pets.value.push({
      id: crypto.randomUUID(),
      type,
      action,
      currentLevel: action === 'level-up' ? currentLevel : null,
      desiredLevel: action === 'level-up' ? desiredLevel : null,
    })
  }

  function updatePet(id, { type, action, currentLevel, desiredLevel }) {
    if (!petTypes[type]) return
    const pet = pets.value.find(p => p.id === id)
    if (!pet) return
    pet.type = type
    pet.action = action
    pet.currentLevel = action === 'level-up' ? currentLevel : null
    pet.desiredLevel = action === 'level-up' ? desiredLevel : null
  }

  function removePet(id) {
    pets.value = pets.value.filter(p => p.id !== id)
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

  // Итог по всем — computed, пересчитывается при изменении pets
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

  // Список с уже прикреплённым расчётом — удобно для v-for
  const petsWithCost = computed(() =>
    pets.value.map(pet => ({
      ...pet,
      quality: petTypes[pet.type]?.quality,
      total: petTotal(pet),
    }))
  )

  return { pets, addPet, updatePet, removePet, totals, petsWithCost, breakdown, petTotal }
}
