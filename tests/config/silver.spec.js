import { describe, it, expect } from 'vitest'
import {
  defaultValues,
  silverItems
} from '@/config/silver.js'

describe('Silver Config', () => {
  describe('defaultValues', () => {
    it('должен содержать все необходимые поля с нулевыми значениями', () => {
      const expectedKeys = [
        'silver',
        'silver88K_8M',
        'silver10M',
        'silver1M',
        'silver100K',
        'silver2h',
        'silver1h',
        'silver30m',
        'silver15m',
        'silver5m',
        'medal',
        'chest'
      ]

      expectedKeys.forEach(key => {
        expect(defaultValues).toHaveProperty(key)
        expect(defaultValues[key]).toBe(0)
      })
    })
  })

  describe('silverItems', () => {
    it('должен содержать 11 предметов', () => {
      expect(silverItems).toHaveLength(11)
    })

    it('каждый предмет должен иметь обязательные поля', () => {
      silverItems.forEach(item => {
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
      const ids = silverItems.map(item => item.id)
      expect(ids).toEqual([
        'silver88K_8M',
        'silver10M',
        'silver1M',
        'silver100K',
        'silver2h',
        'silver1h',
        'silver30m',
        'silver15m',
        'silver5m',
        'medal',
        'chest'
      ])
    })

    it('должен правильно помечать предметы как примерные (approximately)', () => {
      expect(silverItems.find(item => item.id === 'silver88K_8M').approximately).toBe(true)
      expect(silverItems.find(item => item.id === 'silver10M').approximately).toBe(false)
      expect(silverItems.find(item => item.id === 'chest').approximately).toBe(true)
      expect(silverItems.find(item => item.id === 'medal').approximately).toBe(false)
    })

    it('должен иметь правильные имена предметов', () => {
      expect(silverItems.find(item => item.id === 'silver10M').name).toBe('Эпичный купон серебра')
      expect(silverItems.find(item => item.id === 'silver1M').name).toBe('Редкий купон серебра')
      expect(silverItems.find(item => item.id === 'silver100K').name).toBe('Купон серебра')
    })
  })
})
