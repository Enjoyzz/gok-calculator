import { describe, it, expect } from 'vitest'
import { formatLargeNumber, formatNumberShort } from '@/utils/formatNumbers.js'

describe('formatNumbers', () => {
  describe('formatLargeNumber', () => {
    it('должен форматировать тысячи с суффиксом K', () => {
      expect(formatLargeNumber(1500)).toBe('1.500K')
      expect(formatLargeNumber(9999)).toBe('9.999K') // 9.999K округляется до 10K
    })

    it('должен форматировать миллионы с суффиксом M', () => {
      expect(formatLargeNumber(1_500_000)).toBe('1.500M')
      expect(formatLargeNumber(12_345_678)).toBe('12.346M')
    })

    it('должен форматировать миллиарды с суффиксом B', () => {
      expect(formatLargeNumber(1_500_000_000)).toBe('1.500B')
    })

    it('должен форматировать триллионы с суффиксом T', () => {
      expect(formatLargeNumber(1_500_000_000_000)).toBe('1.500T')
    })

    it('должен убирать лишние нули при removeZero: true', () => {
      expect(formatLargeNumber(1000, { removeZero: true })).toBe('1K')
      expect(formatLargeNumber(1500, { removeZero: true })).toBe('1.5K')
      expect(formatLargeNumber(1000, { removeZero: false })).toBe('1.000K')
    })

    it('должен работать с отрицательными числами', () => {
      expect(formatLargeNumber(-1500)).toBe('-1.500K')
      expect(formatLargeNumber(-1_500_000)).toBe('-1.500M')
    })

    it('должен возвращать fallback при некорректных значениях', () => {
      expect(formatLargeNumber(null)).toBe('0')
      expect(formatLargeNumber(undefined)).toBe('0')
      expect(formatLargeNumber('invalid')).toBe('0')
      expect(formatLargeNumber(NaN)).toBe('0')
    })

    it('должен принимать строки как числа', () => {
      expect(formatLargeNumber('1500')).toBe('1.500K')
      expect(formatLargeNumber('1000000')).toBe('1.000M')
    })

    it('должен добавлять валюту при withCurrency: true', () => {
      expect(formatLargeNumber(1500, { withCurrency: true })).toBe('1.500K₽')
      expect(formatLargeNumber(1500, {
        withCurrency: true,
        currency: '$',
        currencyPosition: 'before'
      })).toBe('$1.500K')
    })

    it('должен форматировать маленькие числа без суффиксов', () => {
      expect(formatLargeNumber(999)).toBe('999')
      expect(formatLargeNumber(500)).toBe('500')
      expect(formatLargeNumber(0)).toBe('0')
    })

    it('должен использовать кастомное количество decimals', () => {
      expect(formatLargeNumber(1555, { decimals: 0 })).toBe('2K')
      expect(formatLargeNumber(1555, { decimals: 2 })).toBe('1.55K')
      expect(formatLargeNumber(1_555_555, { decimals: 2 })).toBe('1.56M')
    })
  })

  describe('formatNumberShort', () => {
    it('должен форматировать числа в сокращенном виде', () => {
      expect(formatNumberShort(1500)).toBe('1.5K')
      expect(formatNumberShort(1_500_000)).toBe('1.5M')
      expect(formatNumberShort(1_500_000_000)).toBe('1.5B')
      expect(formatNumberShort(999)).toBe('999')
    })

    it('должен убирать .0 из результатов', () => {
      expect(formatNumberShort(1000)).toBe('1K')
      expect(formatNumberShort(2_000_000)).toBe('2M')
    })

    it('должен работать с отрицательными числами', () => {
      expect(formatNumberShort(-1500)).toBe('-1.5K')
    })

    it('должен возвращать 0 при некорректных значениях', () => {
      expect(formatNumberShort(null)).toBe('0')
      expect(formatNumberShort('invalid')).toBe('0')
    })
  })
})
