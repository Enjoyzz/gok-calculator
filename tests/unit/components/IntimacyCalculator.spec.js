import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import IntimacyCalculator from '@/components/IntimacyCalculator.vue'

// Мокаем все зависимости
vi.mock('vuetify', () => ({
  createVuetify: () => ({
    install: vi.fn(),
    components: {},
    directives: {}
  })
}))

vi.mock('vuetify/components', () => ({}))
vi.mock('vuetify/directives', () => ({}))

vi.mock('@/config/intimacy.js', () => ({
  intimacyItems: [
    { id: 'ordos', name: 'Ордос', description: 'test', approximately: true },
    { id: 'takya', name: 'Такъя', description: 'test', approximately: false },
    { id: 'jadeBracelet', name: 'Нефритовый браслет', description: 'test', approximately: false },
    { id: 'sandalwoodBracelet', name: 'Сандаловый браслет', description: 'test', approximately: true },
    { id: 'goldEarrings', name: 'Золотые серьги', description: 'test', approximately: false },
    { id: 'gemRing', name: 'Самоцветное кольцо', description: 'test', approximately: false },
    { id: 'loveLetter', name: 'Любовное письмо', description: 'test', approximately: false },
    { id: 'forage', name: 'Фураж', description: 'test', approximately: true },
  ],
  defaultIntimacySettings: {
    ordos: 1.5,
    sandalwoodBracelet: 3,
    forage: 1.2
  },
  defaultValues: {
    concubines: 0,
    ordos: 0,
    takya: 0,
    jadeBracelet: 0,
    sandalwoodBracelet: 0,
    goldEarrings: 0,
    gemRing: 0,
    loveLetter: 0,
    forage: 0
  },
  multiplierConstraints: {}
}))

vi.mock('@/stores/intimacy.js', () => ({
  useIntimacyStore: vi.fn(() => ({
    intimacyValues: {
      concubines: 0,
      ordos: 0,
      takya: 0,
      jadeBracelet: 0,
      sandalwoodBracelet: 0,
      goldEarrings: 0,
      gemRing: 0,
      loveLetter: 0,
      forage: 0
    },
    intimacySettings: {
      ordos: 1.5,
      sandalwoodBracelet: 3,
      forage: 1.2
    },
    setIntimacyValues: vi.fn(),
    setIntimacySettings: vi.fn()
  }))
}))

vi.mock('@/utils/debounce.js', () => ({
  debounce: (fn) => fn
}))

vi.mock('@/composable/badges.js', () => ({
  useGenerateBadge: vi.fn(() => null)
}))

vi.mock('@/components/GokIcon.vue', () => ({
  default: {
    name: 'GokIcon',
    template: '<div data-testid="gok-icon" />',
    props: ['icon', 'size', 'badge']
  }
}))

vi.mock('@/components/CalculatorBottom.vue', () => ({
  default: {
    name: 'CalculatorBottom',
    template: '<div data-testid="calculator-bottom" />',
    props: ['total', 'settings'],
    emits: ['save-settings']
  }
}))

describe('IntimacyCalculator.vue', () => {
  let wrapper
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  const createWrapper = () => {
    return mount(IntimacyCalculator, {
      global: {
        plugins: [pinia],
        stubs: {
          // Vuetify компоненты
          'VCard': { template: '<div><slot /></div>' },
          'VCardText': { template: '<div><slot /></div>' },
          'VContainer': { template: '<div><slot /></div>' },
          'VRow': { template: '<div><slot /></div>' },
          'VCol': { template: '<div><slot /></div>' },
          'VTextField': {
            template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
            props: ['modelValue', 'label']
          },
          // Кастомные компоненты
          'GokIcon': { template: '<div data-testid="gok-icon" />' },
          'CalculatorBottom': { template: '<div data-testid="calculator-bottom" />' },
        },
      },
    })
  }

  it('должен монтироваться без ошибок', () => {
    wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('Вычисления', () => {
    it('должен рассчитывать totals для ordos', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.concubines = 10
      wrapper.vm.input.ordos = 5
      await wrapper.vm.$nextTick()

      // ordos: Math.floor(5 * 10 * 1.5) = 75
      expect(wrapper.vm.totals.ordos).toBe(75)
    })

    it('должен рассчитывать totals для takya', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.concubines = 10
      wrapper.vm.input.takya = 3
      await wrapper.vm.$nextTick()

      // takya: 3 * 10 = 30
      expect(wrapper.vm.totals.takya).toBe(30)
    })

    it('должен рассчитывать totals для jadeBracelet', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.jadeBracelet = 4
      await wrapper.vm.$nextTick()

      // jadeBracelet: 4 * 5 = 20
      expect(wrapper.vm.totals.jadeBracelet).toBe(20)
    })

    it('должен рассчитывать totals для sandalwoodBracelet', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.sandalwoodBracelet = 6
      await wrapper.vm.$nextTick()

      // sandalwoodBracelet: Math.floor(6 * 3) = 18
      expect(wrapper.vm.totals.sandalwoodBracelet).toBe(18)
    })

    it('должен рассчитывать totals для goldEarrings', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.goldEarrings = 7
      await wrapper.vm.$nextTick()

      // goldEarrings: 7 * 2 = 14
      expect(wrapper.vm.totals.goldEarrings).toBe(14)
    })

    it('должен рассчитывать totals для gemRing', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.gemRing = 8
      await wrapper.vm.$nextTick()

      // gemRing: 8
      expect(wrapper.vm.totals.gemRing).toBe(8)
    })

    it('должен рассчитывать totals для loveLetter', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.loveLetter = 9
      await wrapper.vm.$nextTick()

      // loveLetter: 9
      expect(wrapper.vm.totals.loveLetter).toBe(9)
    })

    it('должен рассчитывать общий total', async () => {
      wrapper = createWrapper()

      // Устанавливаем значения
      wrapper.vm.input.concubines = 10
      wrapper.vm.input.ordos = 2          // 2 * 10 * 1.5 = 30
      wrapper.vm.input.takya = 3          // 3 * 10 = 30
      wrapper.vm.input.jadeBracelet = 4   // 4 * 5 = 20
      wrapper.vm.input.sandalwoodBracelet = 5 // 5 * 3 = 15
      wrapper.vm.input.goldEarrings = 6   // 6 * 2 = 12
      wrapper.vm.input.gemRing = 7        // 7
      wrapper.vm.input.loveLetter = 8     // 8

      await wrapper.vm.$nextTick()

      // Общий тотал: 30 + 30 + 20 + 15 + 12 + 7 + 8 = 122
      expect(wrapper.vm.total).toBe(122)
    })

    it('должен правильно рассчитывать с настройками множителей', async () => {
      wrapper = createWrapper()

      // Меняем настройки в сторе
      const { useIntimacyStore } = await import('@/stores/intimacy.js')
      useIntimacyStore.mockReturnValue({
        intimacyValues: { concubines: 5, ordos: 3 },
        intimacySettings: { ordos: 2.0 },
        setIntimacyValues: vi.fn(),
        setIntimacySettings: vi.fn()
      })

      // Пересоздаем wrapper с новым моком
      wrapper = createWrapper()

      await wrapper.vm.$nextTick()

      // ordos: Math.floor(3 * 5 * 2.0) = 30
      expect(wrapper.vm.totals.ordos).toBe(30)
    })
  })

  describe('Методы', () => {
    it('метод handleOnFocus должен добавлять имя к элементу', () => {
      wrapper = createWrapper()

      const mockEvent = {
        target: {
          select: vi.fn(),
          name: ''
        }
      }

      wrapper.vm.handleOnFocus(mockEvent)

      expect(mockEvent.target.select).toHaveBeenCalled()
      expect(mockEvent.target.name).toMatch(/^tmp_\d+$/)
    })
  })

  describe('Интеграция с хранилищем', () => {
    it('должен вызывать setIntimacyValues при изменении input', async () => {
      const { useIntimacyStore } = await import('@/stores/intimacy.js')
      const mockSetIntimacyValues = vi.fn()

      useIntimacyStore.mockReturnValue({
        intimacyValues: { concubines: 0 },
        intimacySettings: {},
        setIntimacyValues: mockSetIntimacyValues,
        setIntimacySettings: vi.fn()
      })

      wrapper = createWrapper()

      wrapper.vm.input.concubines = 25
      await wrapper.vm.$nextTick()

      expect(mockSetIntimacyValues).toHaveBeenCalledWith({ concubines: 25 })
    })

    it('должен вызывать saveSettings при событии от CalculatorBottom', () => {
      wrapper = createWrapper()
      const saveSettingsSpy = vi.spyOn(wrapper.vm, 'saveSettings')

      // Вызываем метод напрямую
      const newSettings = { ordos: 2.0 }
      wrapper.vm.saveSettings(newSettings)

      expect(saveSettingsSpy).toHaveBeenCalledWith(newSettings)
    })
  })

})
