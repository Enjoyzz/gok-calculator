import { describe, it, expect } from 'vitest'
import {
  defaultValues,
  defaultIntimacySettings,
  multiplierConstraints,
  intimacyItems
} from '@/config/intimacy.js'

describe('Intimacy Config', () => {
  describe('defaultValues', () => {
    it('должен содержать все необходимые поля с нулевыми значениями', () => {
      const expectedKeys = [
        'concubines',
        'ordos',
        'takya',
        'jadeBracelet',
        'sandalwoodBracelet',
        'goldEarrings',
        'gemRing',
        'loveLetter',
        'forage'
      ]

      expectedKeys.forEach(key => {
        expect(defaultValues).toHaveProperty(key)
        expect(defaultValues[key]).toBe(0)
      })
    })
  })

  describe('defaultIntimacySettings', () => {
    it('должен содержать правильные множители по умолчанию', () => {
      expect(defaultIntimacySettings).toEqual({
        ordos: 1.5,
        sandalwoodBracelet: 3,
        forage: 1.2,
      })
    })

    it('все множители должны быть положительными числами', () => {
      Object.values(defaultIntimacySettings).forEach(value => {
        expect(typeof value).toBe('number')
        expect(value).toBeGreaterThan(0)
      })
    })
  })

  describe('multiplierConstraints', () => {
    it('должен содержать ограничения для предметов с множителями', () => {
      expect(Object.keys(multiplierConstraints)).toEqual([
        'ordos',
        'sandalwoodBracelet',
        'forage'
      ])
    })

    it('должен иметь корректные min/max значения', () => {
      expect(multiplierConstraints.ordos).toEqual({
        min: 1,
        max: 3,
      })

      expect(multiplierConstraints.sandalwoodBracelet).toEqual({
        min: 2,
        max: 5,
      })

      expect(multiplierConstraints.forage.max).toBeNull()
    })
  })

  describe('intimacyItems', () => {
    it('должен содержать 8 предметов', () => {
      expect(intimacyItems).toHaveLength(8)
    })

    it('каждый предмет должен иметь обязательные поля', () => {
      intimacyItems.forEach(item => {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('name')
        expect(item).toHaveProperty('description')
        expect(item).toHaveProperty('icon')
        expect(item).toHaveProperty('approximately')
      })
    })

    it('должен содержать правильные id предметов', () => {
      const ids = intimacyItems.map(item => item.id)
      expect(ids).toEqual([
        'ordos',
        'takya',
        'jadeBracelet',
        'sandalwoodBracelet',
        'goldEarrings',
        'gemRing',
        'loveLetter',
        'forage'
      ])
    })
  })
})
