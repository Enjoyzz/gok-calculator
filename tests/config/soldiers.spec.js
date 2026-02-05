import { describe, it, expect } from 'vitest'
import {
  defaultValues,
  soldiersItems
} from '@/config/soldiers.js'

describe('Silver Config', () => {
  describe('defaultValues', () => {
    it('должен содержать все необходимые поля с нулевыми значениями', () => {
      const expectedKeys = [
        'soldiers',
        'soldiers88K_8M',
        'soldiers10M',
        'soldiers1M',
        'soldiers100K',
        'soldiers2h',
        'soldiers1h',
        'soldiers30m',
        'soldiers15m',
        'soldiers5m',
        'medal',
        'chest'
      ]

      expectedKeys.forEach(key => {
        expect(defaultValues).toHaveProperty(key)
        expect(defaultValues[key]).toBe(0)
      })
    })
  })

  describe('soldiersItems', () => {
    it('должен содержать 11 предметов', () => {
      expect(soldiersItems).toHaveLength(11)
    })

    it('каждый предмет должен иметь обязательные поля', () => {
      soldiersItems.forEach(item => {
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
      const ids = soldiersItems.map(item => item.id)
      expect(ids).toEqual([
        'soldiers88K_8M',
        'soldiers10M',
        'soldiers1M',
        'soldiers100K',
        'soldiers2h',
        'soldiers1h',
        'soldiers30m',
        'soldiers15m',
        'soldiers5m',
        'medal',
        'chest'
      ])
    })

    it('должен правильно помечать предметы как примерные (approximately)', () => {
      expect(soldiersItems.find(item => item.id === 'soldiers88K_8M').approximately).toBe(true)
      expect(soldiersItems.find(item => item.id === 'soldiers10M').approximately).toBe(false)
      expect(soldiersItems.find(item => item.id === 'chest').approximately).toBe(true)
      expect(soldiersItems.find(item => item.id === 'medal').approximately).toBe(false)
    })

    it('должен иметь правильные имена предметов', () => {
      expect(soldiersItems.find(item => item.id === 'soldiers10M').name).toBe('Печать генерала III')
      expect(soldiersItems.find(item => item.id === 'soldiers1M').name).toBe('Печать генерала II')
      expect(soldiersItems.find(item => item.id === 'soldiers100K').name).toBe('Печать генерала I')
    })
  })
})
