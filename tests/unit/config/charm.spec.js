import { describe, it, expect } from 'vitest'
import {
  defaultValues,
  defaultCharmSettings,
  multiplierConstraints,
  charmItems
} from '@/config/charm.js'

describe('Charm Config', () => {
  describe('defaultValues', () => {
    it('должен содержать все необходимые поля с нулевыми значениями', () => {
      const expectedKeys = [
        'concubines',
        'blueHadak',
        'whiteHadak',
        'goldHairpin',
        'silverHairpin',
        'perfume',
        'chests',
        'forage'
      ]

      expectedKeys.forEach(key => {
        expect(defaultValues).toHaveProperty(key)
        expect(defaultValues[key]).toBe(0)
      })
    })
  })

  describe('defaultCharmSettings', () => {
    it('должен содержать правильные множители по умолчанию', () => {
      expect(defaultCharmSettings).toEqual({
        blueHadak: 1.5,
        silverHairpin: 3,
        chests: 2.2,
        forage: 1.5,
      })
    })

    it('все множители должны быть положительными числами', () => {
      Object.values(defaultCharmSettings).forEach(value => {
        expect(typeof value).toBe('number')
        expect(value).toBeGreaterThan(0)
      })
    })
  })

  describe('multiplierConstraints', () => {
    it('должен содержать ограничения для предметов с множителями', () => {
      expect(Object.keys(multiplierConstraints)).toEqual([
        'blueHadak',
        'silverHairpin',
        'chests',
        'forage'
      ])
    })

    it('должен иметь корректные min/max значения', () => {
      expect(multiplierConstraints.blueHadak).toEqual({
        min: 1,
        max: 3,
      })

      expect(multiplierConstraints.silverHairpin).toEqual({
        min: 2,
        max: 5,
      })

      expect(multiplierConstraints.chests.max).toBeNull()
      expect(multiplierConstraints.forage.max).toBeNull()
    })
  })

  describe('charmItems', () => {
    it('должен содержать 7 предметов', () => {
      expect(charmItems).toHaveLength(7)
    })

    it('каждый предмет должен иметь обязательные поля', () => {
      charmItems.forEach(item => {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('name')
        expect(item).toHaveProperty('description')
        expect(item).toHaveProperty('icon')
        expect(item).toHaveProperty('approximately')
        expect(typeof item.id).toBe('string')
        expect(typeof item.name).toBe('string')
        expect(typeof item.description).toBe('string')
        expect(typeof item.approximately).toBe('boolean')
      })
    })

    it('должен содержать правильные id предметов', () => {
      const ids = charmItems.map(item => item.id)
      expect(ids).toEqual([
        'blueHadak',
        'whiteHadak',
        'goldHairpin',
        'silverHairpin',
        'perfume',
        'chests',
        'forage'
      ])
    })

    it('должен правильно помечать предметы как примерные (approximately)', () => {
      const approximatelyItems = charmItems.filter(item => item.approximately)
      const exactItems = charmItems.filter(item => !item.approximately)

      // Проверяем конкретные предметы
      expect(charmItems.find(item => item.id === 'blueHadak').approximately).toBe(true)
      expect(charmItems.find(item => item.id === 'whiteHadak').approximately).toBe(false)
      expect(charmItems.find(item => item.id === 'goldHairpin').approximately).toBe(false)
      expect(charmItems.find(item => item.id === 'silverHairpin').approximately).toBe(true)
      expect(charmItems.find(item => item.id === 'perfume').approximately).toBe(false)
      expect(charmItems.find(item => item.id === 'chests').approximately).toBe(true)
      expect(charmItems.find(item => item.id === 'forage').approximately).toBe(true)
    })
  })
})
