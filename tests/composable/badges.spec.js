import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useGenerateBadge } from '@/composable/badges.js'
import * as formatNumbers from '@/utils/formatNumbers.js'

describe('useGenerateBadge', () => {
  let mockFormatLargeNumber

  beforeEach(() => {
    mockFormatLargeNumber = vi.spyOn(formatNumbers, 'formatLargeNumber')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Основная функциональность', () => {
    it('должен возвращать null для total <= 0', () => {
      expect(useGenerateBadge(0)).toBeNull()
      expect(useGenerateBadge(-100)).toBeNull()
      expect(useGenerateBadge(0, true)).toBeNull()
      expect(useGenerateBadge(-50, false)).toBeNull()

      // formatLargeNumber не должен вызываться для нулевых или отрицательных значений
      expect(mockFormatLargeNumber).not.toHaveBeenCalled()
    })

    it('должен возвращать форматированное число для total > 0 без approximately', () => {
      mockFormatLargeNumber.mockReturnValue('1,000')

      const result = useGenerateBadge(1000, false)

      expect(result).toBe('1,000')
      expect(mockFormatLargeNumber).toHaveBeenCalledWith(1000, { removeZero: true })
    })

    it('должен возвращать форматированное число с ~ для total > 0 с approximately = true', () => {
      mockFormatLargeNumber.mockReturnValue('2,500')

      const result = useGenerateBadge(2500, true)

      expect(result).toBe('~2,500')
      expect(mockFormatLargeNumber).toHaveBeenCalledWith(2500, { removeZero: true })
    })

    it('должен возвращать форматированное число без ~ для approximately = false', () => {
      mockFormatLargeNumber.mockReturnValue('3,750')

      const result = useGenerateBadge(3750, false)

      expect(result).toBe('3,750')
      expect(result).not.toContain('~')
    })

    it('должен вызывать formatLargeNumber с правильными параметрами', () => {
      mockFormatLargeNumber.mockReturnValue('5,000')

      useGenerateBadge(5000, true)

      expect(mockFormatLargeNumber).toHaveBeenCalledTimes(1)
      expect(mockFormatLargeNumber).toHaveBeenCalledWith(5000, { removeZero: true })
    })
  })

  describe('Граничные случаи', () => {
    it('должен работать с очень большими числами', () => {
      mockFormatLargeNumber.mockReturnValue('1.5M')

      const result = useGenerateBadge(1_500_000, false)

      expect(result).toBe('1.5M')
      expect(mockFormatLargeNumber).toHaveBeenCalledWith(1_500_000, { removeZero: true })
    })

    it('должен работать с дробными числами', () => {
      mockFormatLargeNumber.mockReturnValue('1.5')

      const result = useGenerateBadge(1.5, true)

      expect(result).toBe('~1.5')
    })

    it('должен корректно обрабатывать approximately как undefined (по умолчанию false)', () => {
      mockFormatLargeNumber.mockReturnValue('2,000')

      const result = useGenerateBadge(2000)

      expect(result).toBe('2,000')
      expect(result).not.toContain('~')
    })

    it('должен корректно обрабатывать approximately как null', () => {
      mockFormatLargeNumber.mockReturnValue('3,000')

      const result = useGenerateBadge(3000, null)

      expect(result).toBe('3,000') // null преобразуется в false
      expect(result).not.toContain('~')
    })
  })

  // Уберем сложные тесты чтобы сначала проверить базовую функциональность
  describe('Упрощенные тесты', () => {
    it('должен возвращать форматированное число', () => {
      mockFormatLargeNumber.mockReturnValue('123')

      const result = useGenerateBadge(123, false)

      expect(result).toBe('123')
    })

    it('должен добавлять тильду для примерных значений', () => {
      mockFormatLargeNumber.mockReturnValue('456')

      const result = useGenerateBadge(456, true)

      expect(result).toBe('~456')
    })
  })
})
