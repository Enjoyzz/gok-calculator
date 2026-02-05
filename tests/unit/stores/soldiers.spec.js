import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useSoldiersStore } from '@/stores/soldiers.js'
import { defaultValues } from '@/config/soldiers.js'

// Мокаем localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

describe('Soldiers Store', () => {
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
      if (key === 'soldiers') {
        return JSON.stringify(defaultValues)
      }
      return null
    })

    // Создаем store
    store = useSoldiersStore()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Инициализация', () => {
    it('должен создавать store с дефолтными значениями из localStorage', () => {
      expect(store.soldiersValues).toEqual(defaultValues)
    })

    it('должен возвращать дефолтные значения при ошибке парсинга JSON', () => {
      localStorageMock.getItem.mockReturnValue('invalid json')

      setActivePinia(createPinia())
      store = useSoldiersStore()

      expect(store.soldiersValues).toEqual(defaultValues)
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('должен использовать дефолтные значения если localStorage пустой', () => {
      localStorageMock.getItem.mockReturnValue(null)

      setActivePinia(createPinia())
      store = useSoldiersStore()

      expect(store.soldiersValues).toEqual(defaultValues)
    })
  })

  describe('Getters', () => {
    it('soldiersValues должен парсить JSON из soldiersValuesRaw', () => {
      const testValues = { soldiers: 1000, soldiers10M: 5 }
      store.soldiersValuesRaw = JSON.stringify(testValues)

      expect(store.soldiersValues).toEqual(testValues)
    })
  })

  describe('Actions', () => {
    it('setSoldiersValues должен обновлять soldiersValuesRaw и localStorage', () => {
      const newValues = {
        soldiers: 1500,
        soldiers10M: 3,
        soldiers1M: 2
      }

      store.setSoldiersValues(newValues)

      expect(store.soldiersValuesRaw).toBe(JSON.stringify(newValues))
      expect(store.soldiersValues).toEqual(newValues)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'soldiers',
        JSON.stringify(newValues)
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(newValues)
    })
  })
})
