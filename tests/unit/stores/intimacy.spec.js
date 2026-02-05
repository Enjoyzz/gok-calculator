import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useIntimacyStore } from '@/stores/intimacy.js'
import { defaultValues, defaultIntimacySettings } from '@/config/intimacy.js'

// Мокаем localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

describe('Intimacy Store', () => {
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
      if (key === 'intimacy') {
        return JSON.stringify(defaultValues)
      }
      if (key === 'intimacy-setting') {
        return JSON.stringify(defaultIntimacySettings)
      }
      return null
    })

    // Создаем store
    store = useIntimacyStore()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Инициализация', () => {
    it('должен создавать store с дефолтными значениями из localStorage', () => {
      expect(store.intimacyValues).toEqual(defaultValues)
      expect(store.intimacySettings).toEqual(defaultIntimacySettings)
    })

    it('должен возвращать дефолтные значения при ошибке парсинга JSON', () => {
      localStorageMock.getItem.mockReturnValue('invalid json')

      setActivePinia(createPinia())
      store = useIntimacyStore()

      expect(store.intimacyValues).toEqual(defaultValues)
      expect(store.intimacySettings).toEqual(defaultIntimacySettings)
    })

    it('должен использовать дефолтные значения если localStorage пустой', () => {
      localStorageMock.getItem.mockReturnValue(null)

      setActivePinia(createPinia())
      store = useIntimacyStore()

      expect(store.intimacyValues).toEqual(defaultValues)
      expect(store.intimacySettings).toEqual(defaultIntimacySettings)
    })
  })

  describe('Getters', () => {
    it('intimacyValues должен парсить JSON из intimacyValuesRaw', () => {
      const testValues = { concubines: 10, ordos: 5 }
      store.intimacyValuesRaw = JSON.stringify(testValues)

      expect(store.intimacyValues).toEqual(testValues)
    })

    it('intimacySettings должен парсить JSON из intimacySettingsRaw', () => {
      const testSettings = { ordos: 2.0, sandalwoodBracelet: 4 }
      store.intimacySettingsRaw = JSON.stringify(testSettings)

      expect(store.intimacySettings).toEqual(testSettings)
    })

    it('defaultIntimacySettings должен возвращать константу из конфига', () => {
      expect(store.defaultIntimacySettings).toEqual(defaultIntimacySettings)
    })
  })

  describe('Actions', () => {
    it('setIntimacyValues должен обновлять intimacyValuesRaw и localStorage', () => {
      const newValues = {
        concubines: 15,
        ordos: 3,
        takya: 2
      }

      store.setIntimacyValues(newValues)

      expect(store.intimacyValuesRaw).toBe(JSON.stringify(newValues))
      expect(store.intimacyValues).toEqual(newValues)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'intimacy',
        JSON.stringify(newValues)
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(newValues)
    })

    it('setIntimacySettings должен обновлять intimacySettingsRaw и localStorage', () => {
      const newSettings = {
        ordos: 2.5,
        sandalwoodBracelet: 4,
        forage: 1.5
      }

      store.setIntimacySettings(newSettings)

      expect(store.intimacySettingsRaw).toBe(JSON.stringify(newSettings))
      expect(store.intimacySettings).toEqual(newSettings)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'intimacy-setting',
        JSON.stringify(newSettings)
      )
    })
  })
})
