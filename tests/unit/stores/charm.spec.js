import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCharmStore } from '@/stores/charm.js'
import { defaultValues, defaultCharmSettings } from '@/config/charm.js'

// Мокаем localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

describe('Charm Store', () => {
  let store
  let consoleSpy

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Устанавливаем мок localStorage
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })

    // Сбрасываем моки
    vi.clearAllMocks()

    // Создаем новый Pinia для каждого теста
    setActivePinia(createPinia())

    // Настраиваем дефолтные значения для localStorage
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'charm') {
        return JSON.stringify(defaultValues)
      }
      if (key === 'charm-setting') {
        return JSON.stringify(defaultCharmSettings)
      }
      return null
    })

    // Создаем store
    store = useCharmStore()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    consoleSpy.mockRestore()
  })

  describe('Инициализация', () => {
    it('должен создавать store с дефолтными значениями из localStorage', () => {
      expect(store.charmValues).toEqual(defaultValues)
      expect(store.charmSettings).toEqual(defaultCharmSettings)
    })

    it('должен возвращать дефолтные значения при ошибке парсинга JSON', () => {
      // Мокаем поврежденные данные в localStorage
      localStorageMock.getItem.mockReturnValue('invalid json')

      // Пересоздаем store с поврежденными данными
      setActivePinia(createPinia())
      store = useCharmStore()

      expect(store.charmValues).toEqual(defaultValues)
      expect(store.charmSettings).toEqual(defaultCharmSettings)
    })

    it('должен использовать дефолтные значения если localStorage пустой', () => {
      localStorageMock.getItem.mockReturnValue(null)

      setActivePinia(createPinia())
      store = useCharmStore()

      expect(store.charmValues).toEqual(defaultValues)
      expect(store.charmSettings).toEqual(defaultCharmSettings)
    })
  })

  describe('Getters', () => {
    it('charmValues должен парсить JSON из charmValuesRaw', () => {
      const testValues = { concubines: 10, blueHadak: 5 }
      store.charmValuesRaw = JSON.stringify(testValues)

      expect(store.charmValues).toEqual(testValues)
    })

    it('charmSettings должен парсить JSON из charmSettingsRaw', () => {
      const testSettings = { blueHadak: 2.0, silverHairpin: 4 }
      store.charmSettingsRaw = JSON.stringify(testSettings)

      expect(store.charmSettings).toEqual(testSettings)
    })

    it('defaultCharmSettings должен возвращать константу из конфига', () => {
      expect(store.defaultCharmSettings).toEqual(defaultCharmSettings)
    })
  })

  describe('Actions', () => {
    it('setCharmValues должен обновлять charmValuesRaw и localStorage', () => {
      const newValues = {
        concubines: 15,
        blueHadak: 3,
        whiteHadak: 2
      }

      store.setCharmValues(newValues)

      // Проверяем что raw значение обновлено
      expect(store.charmValuesRaw).toBe(JSON.stringify(newValues))

      // Проверяем что getter возвращает правильные значения
      expect(store.charmValues).toEqual(newValues)

      // Проверяем что localStorage обновлен
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'charm',
        JSON.stringify(newValues)
      )
    })

    it('setCharmSettings должен обновлять charmSettingsRaw и localStorage', () => {
      const newSettings = {
        blueHadak: 2.5,
        silverHairpin: 4,
        chests: 3.0,
        forage: 2.0
      }

      store.setCharmSettings(newSettings)

      // Проверяем что raw значение обновлено
      expect(store.charmSettingsRaw).toBe(JSON.stringify(newSettings))

      // Проверяем что getter возвращает правильные значения
      expect(store.charmSettings).toEqual(newSettings)

      // Проверяем что localStorage обновлен
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'charm-setting',
        JSON.stringify(newSettings)
      )
    })

    it('setCharmValues должен логировать значения в console.log', () => {
      const consoleSpy = vi.spyOn(console, 'log')
      const newValues = { concubines: 20 }

      store.setCharmValues(newValues)

      expect(consoleSpy).toHaveBeenCalledWith(newValues)
    })

    it('setCharmValues должен обрабатывать частичные обновления', () => {
      // Сначала устанавливаем полные значения
      const initialValues = {
        concubines: 10,
        blueHadak: 2,
        whiteHadak: 3,
        goldHairpin: 0,
        silverHairpin: 0,
        perfume: 0,
        chests: 0,
        forage: 0
      }
      store.setCharmValues(initialValues)

      // Затем обновляем только одно поле
      const partialUpdate = { concubines: 20 }
      store.setCharmValues(partialUpdate)

      // Проверяем что новое значение содержит только обновленное поле
      // (это зависит от реализации компонента, может потребоваться мерж)
      expect(store.charmValues.concubines).toBe(20)
    })
  })

  describe('Обработка ошибок', () => {
    it('должен возвращать дефолтные значения при ошибке в getter charmValues', () => {
      // Создаем невалидный JSON
      store.charmValuesRaw = '{ invalid json'

      const consoleSpy = vi.spyOn(console, 'error')

      expect(store.charmValues).toEqual(defaultValues)
      expect(consoleSpy).toHaveBeenCalled()
    })

    it('должен возвращать дефолтные значения при ошибке в getter charmSettings', () => {
      // Создаем невалидный JSON
      store.charmSettingsRaw = '{ invalid json'

      const consoleSpy = vi.spyOn(console, 'error')

      expect(store.charmSettings).toEqual(defaultCharmSettings)
      expect(consoleSpy).toHaveBeenCalled()
    })
  })

  describe('Интеграция с localStorage', () => {
    it('должен сохранять данные при обновлении значений', () => {
      const newValues = { concubines: 25, blueHadak: 10 }

      store.setCharmValues(newValues)

      expect(localStorageMock.setItem).toHaveBeenCalledTimes(1)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'charm',
        JSON.stringify(newValues)
      )
    })

    it('должен сохранять настройки при обновлении', () => {
      const newSettings = { blueHadak: 3.0 }

      store.setCharmSettings(newSettings)

      expect(localStorageMock.setItem).toHaveBeenCalledTimes(1)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'charm-setting',
        JSON.stringify(newSettings)
      )
    })
  })
})
