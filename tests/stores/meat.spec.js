import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useMeatStore } from '@/stores/meat.js'
import { defaultValues } from '@/config/meat.js'

// Мокаем localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

describe('Meat Store', () => {
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
      if (key === 'meat') {
        return JSON.stringify(defaultValues)
      }
      return null
    })

    // Создаем store
    store = useMeatStore()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Инициализация', () => {
    it('должен создавать store с дефолтными значениями из localStorage', () => {
      expect(store.meatValues).toEqual(defaultValues)
    })

    it('должен возвращать дефолтные значения при ошибке парсинга JSON', () => {
      localStorageMock.getItem.mockReturnValue('invalid json')

      setActivePinia(createPinia())
      store = useMeatStore()

      expect(store.meatValues).toEqual(defaultValues)
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('должен использовать дефолтные значения если localStorage пустой', () => {
      localStorageMock.getItem.mockReturnValue(null)

      setActivePinia(createPinia())
      store = useMeatStore()

      expect(store.meatValues).toEqual(defaultValues)
    })
  })

  describe('Getters', () => {
    it('meatValues должен парсить JSON из meatValuesRaw', () => {
      const testValues = { meat: 1000, meat10M: 5 }
      store.meatValuesRaw = JSON.stringify(testValues)

      expect(store.meatValues).toEqual(testValues)
    })
  })

  describe('Actions', () => {
    it('setMeatValues должен обновлять meatValuesRaw и localStorage', () => {
      const newValues = {
        meat: 1500,
        meat10M: 3,
        meat1M: 2
      }

      store.setMeatValues(newValues)

      expect(store.meatValuesRaw).toBe(JSON.stringify(newValues))
      expect(store.meatValues).toEqual(newValues)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'meat',
        JSON.stringify(newValues)
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(newValues)
    })
  })
})
