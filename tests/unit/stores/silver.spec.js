import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useSilverStore } from '@/stores/silver.js'
import { defaultValues } from '@/config/silver.js'

// Мокаем localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

describe('Silver Store', () => {
  let store
  let consoleLogSpy
  let consoleErrorSpy

  beforeEach(() => {
    // Устанавливаем мок localStorage
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })

    // Спим на console
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Сбрасываем моки
    vi.clearAllMocks()

    // Создаем новый Pinia для каждого теста
    setActivePinia(createPinia())

    // Настраиваем дефолтные значения для localStorage
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'silver') {
        return JSON.stringify(defaultValues)
      }
      return null
    })

    // Создаем store
    store = useSilverStore()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Инициализация', () => {
    it('должен создавать store с дефолтными значениями из localStorage', () => {
      expect(store.silverValues).toEqual(defaultValues)
    })

    it('должен возвращать дефолтные значения при ошибке парсинга JSON', () => {
      localStorageMock.getItem.mockReturnValue('invalid json')

      setActivePinia(createPinia())
      store = useSilverStore()

      expect(store.silverValues).toEqual(defaultValues)
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('должен использовать дефолтные значения если localStorage пустой', () => {
      localStorageMock.getItem.mockReturnValue(null)

      setActivePinia(createPinia())
      store = useSilverStore()

      expect(store.silverValues).toEqual(defaultValues)
    })
  })

  describe('Getters', () => {
    it('silverValues должен парсить JSON из silverValuesRaw', () => {
      const testValues = { silver: 1000, silver10M: 5 }
      store.silverValuesRaw = JSON.stringify(testValues)

      expect(store.silverValues).toEqual(testValues)
    })
  })

  describe('Actions', () => {
    it('setSilverValues должен обновлять silverValuesRaw и localStorage', () => {
      const newValues = {
        silver: 1500,
        silver10M: 3,
        silver1M: 2
      }

      store.setSilverValues(newValues)

      expect(store.silverValuesRaw).toBe(JSON.stringify(newValues))
      expect(store.silverValues).toEqual(newValues)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'silver',
        JSON.stringify(newValues)
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(newValues)
    })
  })
})
