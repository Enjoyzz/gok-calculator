import { describe, it, expect } from 'vitest'
import {
  defaultValues,
  meatItems
} from '@/config/meat.js'

describe('Meat Config', () => {
  describe('defaultValues', () => {
    it('должен содержать все необходимые поля с нулевыми значениями', () => {
      const expectedKeys = [
        'meat',
        'meat88K_8M',
        'meat10M',
        'meat1M',
        'meat100K',
        'meat2h',
        'meat1h',
        'meat30m',
        'meat15m',
        'meat5m',
        'medal',
        'chest'
      ]

      expectedKeys.forEach(key => {
        expect(defaultValues).toHaveProperty(key)
        expect(defaultValues[key]).toBe(0)
      })
    })
  })

  describe('meatItems', () => {
    it('должен содержать 11 предметов', () => {
      expect(meatItems).toHaveLength(11)
    })

    it('каждый предмет должен иметь обязательные поля', () => {
      meatItems.forEach(item => {
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
      const ids = meatItems.map(item => item.id)
      expect(ids).toEqual([
        'meat88K_8M',
        'meat10M',
        'meat1M',
        'meat100K',
        'meat2h',
        'meat1h',
        'meat30m',
        'meat15m',
        'meat5m',
        'medal',
        'chest'
      ])
    })

    it('должен правильно помечать предметы как примерные (approximately)', () => {
      expect(meatItems.find(item => item.id === 'meat88K_8M').approximately).toBe(true)
      expect(meatItems.find(item => item.id === 'meat10M').approximately).toBe(false)
      expect(meatItems.find(item => item.id === 'chest').approximately).toBe(true)
    })
  })
})
