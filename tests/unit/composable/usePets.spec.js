import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/config/pets.js', () => ({
  petTypeKeys: ['gold'],
  pets: {
    gold: {
      quality: 'Золотой',
      icon: 'gold.png',
      'min-level': 1,
      'max-level': 5,
      levels: {
        1: { parts: 10, berries: 0, points: 5 },
        2: { parts: 20, berries: 1, points: 10, approxFields: ['berries'] },
        3: { parts: 30, berries: null, points: 15 },
        4: { parts: 40, berries: 2, points: 20 },
        // уровня 5 нет — «нет данных»
      },
    },
  },
}))

const storeMock = {
  pets: [],
  addPet: vi.fn(),
  updatePet: vi.fn(),
  removePet: vi.fn(),
  clearPets: vi.fn(),
}
vi.mock('@/stores/pets', () => ({ usePetsStore: () => storeMock }))

import { breakdown, petTotal, findMaxLevel, usePets } from '@/composable/usePets.js'

describe('usePets', () => {
  beforeEach(() => {
    storeMock.pets = []
    vi.clearAllMocks()
  })

  describe('breakdown', () => {
    it('призыв — одна строка на min-level', () => {
      const rows = breakdown({ type: 'gold', action: 'summon' })
      expect(rows).toHaveLength(1)
      expect(rows[0]).toMatchObject({ level: 1, parts: 10, berries: 0, points: 5 })
    })

    it('поднятие уровня — строки от from+1 до to включительно', () => {
      const rows = breakdown({ type: 'gold', action: 'level-up', currentLevel: 1, desiredLevel: 3 })
      expect(rows.map(r => r.level)).toEqual([2, 3])
    })

    it('помечает отсутствующий уровень как missing', () => {
      const rows = breakdown({ type: 'gold', action: 'level-up', currentLevel: 4, desiredLevel: 5 })
      expect(rows).toEqual([{ level: 5, missing: true }])
    })

    it('помечает null-поля как unknownFields', () => {
      const [row] = breakdown({ type: 'gold', action: 'level-up', currentLevel: 2, desiredLevel: 3 })
      expect(row.unknownFields).toEqual(['berries'])
    })

    it('возвращает [] для неизвестного типа', () => {
      expect(breakdown({ type: 'nope', action: 'summon' })).toEqual([])
    })

    it('возвращает [] если уровни не целые', () => {
      expect(breakdown({ type: 'gold', action: 'level-up', currentLevel: null, desiredLevel: 3 })).toEqual([])
      expect(breakdown({ type: 'gold', action: 'level-up', currentLevel: 1, desiredLevel: 2.5 })).toEqual([])
    })
  })

  describe('petTotal', () => {
    it('суммирует по полям и сохраняет approxFields', () => {
      const t = petTotal({ type: 'gold', action: 'level-up', currentLevel: 1, desiredLevel: 2 })
      expect(t).toMatchObject({ parts: 20, berries: 1, points: 10, incomplete: false, hasUnknown: false })
      expect(t.approxFields).toEqual(['berries'])
    })

    it('неизвестные значения не учитываются, но помечаются', () => {
      const t = petTotal({ type: 'gold', action: 'level-up', currentLevel: 1, desiredLevel: 3 })
      expect(t).toMatchObject({ parts: 50, berries: 1, points: 25, hasUnknown: true, incomplete: false })
      expect(t.unknownFields).toEqual(['berries'])
    })

    it('incomplete при отсутствии данных об уровне', () => {
      const t = petTotal({ type: 'gold', action: 'level-up', currentLevel: 3, desiredLevel: 5 })
      expect(t.incomplete).toBe(true)
    })

    it('призыв считается как min-level', () => {
      const t = petTotal({ type: 'gold', action: 'summon' })
      expect(t).toMatchObject({ parts: 10, berries: 0, points: 5 })
    })
  })

  describe('findMaxLevel', () => {
    it('находит максимальный уровень по бюджету осколков', () => {
      // 2: 20, 3: 30 → 50; 4: 40 не влезает
      expect(findMaxLevel('gold', 1, 50)).toBe(3)
      expect(findMaxLevel('gold', 1, 49)).toBe(2)
    })

    it('null, если не хватает даже на один уровень', () => {
      expect(findMaxLevel('gold', 1, 19)).toBeNull()
      expect(findMaxLevel('gold', 1, 0)).toBeNull()
    })

    it('останавливается на уровне без данных', () => {
      expect(findMaxLevel('gold', 1, 10_000)).toBe(4)
    })

    it('null при некорректных аргументах', () => {
      expect(findMaxLevel('nope', 1, 100)).toBeNull()
      expect(findMaxLevel('gold', null, 100)).toBeNull()
      expect(findMaxLevel('gold', 1.5, 100)).toBeNull()
      expect(findMaxLevel('gold', 1, null)).toBeNull()
    })
  })

  describe('usePets()', () => {
    it('petsWithCost добавляет quality, icon и total', () => {
      storeMock.pets = [{ id: 1, type: 'gold', action: 'summon' }]
      const { petsWithCost } = usePets()

      expect(petsWithCost.value[0]).toMatchObject({ id: 1, quality: 'Золотой', icon: 'gold.png' })
      expect(petsWithCost.value[0].total.parts).toBe(10)
    })

    it('totals суммирует всех питомцев', () => {
      storeMock.pets = [
        { id: 1, type: 'gold', action: 'summon' },
        { id: 2, type: 'gold', action: 'level-up', currentLevel: 1, desiredLevel: 2 },
      ]
      const { totals } = usePets()

      expect(totals.value).toMatchObject({ parts: 30, berries: 1, points: 15, hasMissing: false })
    })

    it('totals пропускает incomplete-питомцев и ставит hasMissing', () => {
      storeMock.pets = [
        { id: 1, type: 'gold', action: 'summon' },
        { id: 2, type: 'gold', action: 'level-up', currentLevel: 4, desiredLevel: 5 },
      ]
      const { totals } = usePets()

      expect(totals.value.parts).toBe(10)
      expect(totals.value.hasMissing).toBe(true)
    })

    it('totals пустой при отсутствии питомцев', () => {
      const { totals } = usePets()
      expect(totals.value).toMatchObject({ parts: 0, berries: 0, points: 0, hasMissing: false })
    })

    it('пробрасывает экшены стора', () => {
      const api = usePets()
      expect(api.addPet).toBe(storeMock.addPet)
      expect(api.updatePet).toBe(storeMock.updatePet)
      expect(api.removePet).toBe(storeMock.removePet)
      expect(api.clearPets).toBe(storeMock.clearPets)
    })
  })
})
