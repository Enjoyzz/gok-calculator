import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAppStore } from '@/stores/app.js'

// Мокаем localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

describe('App Store', () => {
  let store

  beforeEach(() => {
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
      if (key === 'theme') {
        return 'light'
      }
      return null
    })

    // Создаем store
    store = useAppStore()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Инициализация', () => {
    it('должен создавать store с дефолтной светлой темой', () => {
      expect(store.theme).toBe('light')
      expect(localStorageMock.getItem).toHaveBeenCalledWith('theme')
    })

    it('должен создавать store с темной темой из localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark')

      setActivePinia(createPinia())
      store = useAppStore()

      expect(store.theme).toBe('dark')
    })

    it('должен использовать light тему если localStorage пустой', () => {
      localStorageMock.getItem.mockReturnValue(null)

      setActivePinia(createPinia())
      store = useAppStore()

      expect(store.theme).toBe('light')
    })
  })

  describe('Getters', () => {
    it('isDark должен возвращать true для темной темы', () => {
      store.theme = 'dark'
      expect(store.isDark).toBe(true)
    })

    it('isDark должен возвращать false для светлой темы', () => {
      store.theme = 'light'
      expect(store.isDark).toBe(false)
    })

    it('isDark должен работать с нестандартными значениями', () => {
      store.theme = 'dark'
      expect(store.isDark).toBe(true)

      store.theme = 'light'
      expect(store.isDark).toBe(false)

      store.theme = 'other'
      expect(store.isDark).toBe(false)
    })
  })

  describe('Actions', () => {
    describe('setTheme', () => {

      it('должен сохранять тему в localStorage', () => {
        store.setTheme('dark')
        expect(localStorageMock.setItem).toHaveBeenCalledTimes(1)
        expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark')

        store.setTheme('light')
        expect(localStorageMock.setItem).toHaveBeenCalledTimes(2)
        expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light')
      })
    })

    describe('setTheme', () => {
      it('должен устанавливать светлую тему', () => {
        store.setTheme('light')

        expect(store.theme).toBe('light')
        expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light')
      })

      it('должен устанавливать темную тему', () => {
        store.setTheme('dark')

        expect(store.theme).toBe('dark')
        expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark')
      })

      it('должен сохранять любую тему в localStorage', () => {
        store.setTheme('custom-theme')

        expect(store.theme).toBe('custom-theme')
        expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'custom-theme')
      })

      it('должен обновлять getter isDark после установки темы', () => {
        store.setTheme('dark')
        expect(store.isDark).toBe(true)

        store.setTheme('light')
        expect(store.isDark).toBe(false)
      })
    })
  })

  describe('Интеграция', () => {
     it('должен корректно комбинировать setTheme', () => {
      store.setTheme('dark')
      expect(store.theme).toBe('dark')

      store.setTheme('light')
      expect(store.theme).toBe('light')

      store.setTheme('system')
      expect(store.theme).toBe('system')

      store.setTheme('custom')
      expect(store.theme).toBe('custom')
    })
  })

  describe('Граничные случаи', () => {
    it('должен обрабатывать пустую строку как тему', () => {
      store.setTheme('')
      expect(store.theme).toBe('')
      expect(store.isDark).toBe(false)
    })

    it('должен обрабатывать undefined/null значения', () => {
      // setTheme с undefined/null
      store.setTheme(undefined)
      expect(store.theme).toBeUndefined()

      store.setTheme(null)
      expect(store.theme).toBeNull()
    })
  })
})
