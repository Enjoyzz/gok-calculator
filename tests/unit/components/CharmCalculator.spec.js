import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CharmCalculator from '@/components/CharmCalculator.vue'

// Мокаем все зависимости перед импортами
vi.mock('vuetify', () => ({
  createVuetify: () => ({
    install: vi.fn(),
    components: {},
    directives: {}
  })
}))

vi.mock('vuetify/components', () => ({}))
vi.mock('vuetify/directives', () => ({}))

vi.mock('@/config/charm.js', () => ({
  charmItems: [
    { id: 'blueHadak', name: 'Синий хадак', description: 'test', approximately: true },
    { id: 'whiteHadak', name: 'Белый хадак', description: 'test', approximately: false },
    { id: 'goldHairpin', name: 'Золотая шпилька', description: 'test', approximately: false },
    { id: 'silverHairpin', name: 'Серебряная шпилька', description: 'test', approximately: true },
    { id: 'perfume', name: 'Духи', description: 'test', approximately: false },
    { id: 'chests', name: 'Сундук', description: 'test', approximately: true },
    { id: 'forage', name: 'Фураж', description: 'test', approximately: true },
  ],
  defaultCharmSettings: {
    blueHadak: 1.5,
    silverHairpin: 3,
    chests: 2.2,
    forage: 1.5
  },
  defaultValues: {
    concubines: 0,
    blueHadak: 0,
    whiteHadak: 0,
    goldHairpin: 0,
    silverHairpin: 0,
    perfume: 0,
    chests: 0,
    forage: 0
  },
  multiplierConstraints: {}
}))

vi.mock('@/stores/charm.js', () => ({
  useCharmStore: vi.fn(() => ({
    charmValues: {
      concubines: 0,
      blueHadak: 0,
      whiteHadak: 0,
      goldHairpin: 0,
      silverHairpin: 0,
      perfume: 0,
      chests: 0,
      forage: 0
    },
    charmSettings: {
      blueHadak: 1.5,
      silverHairpin: 3,
      chests: 2.2,
      forage: 1.5
    },
    setCharmValues: vi.fn(),
    setCharmSettings: vi.fn()
  }))
}))

vi.mock('@/utils/debounce.js', () => ({
  debounce: (fn) => fn
}))

vi.mock('@/utils/formatNumbers.js', () => ({
  formatLargeNumber: vi.fn((num) => num.toString())
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

describe('CharmCalculator', () => {
  let wrapper
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  const createWrapper = () => {
    return mount(CharmCalculator, {
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
    it('должен рассчитывать totals для blueHadak', async () => {
      wrapper = createWrapper()

      // Устанавливаем значения через vm
      wrapper.vm.input.concubines = 10
      wrapper.vm.input.blueHadak = 5
      await wrapper.vm.$nextTick()

      // Проверяем расчет: 5 * 10 * 1.5 = 75
      expect(wrapper.vm.totals.blueHadak).toBe(75)
    })

    it('должен рассчитывать totals для whiteHadak', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.concubines = 10
      wrapper.vm.input.whiteHadak = 3
      await wrapper.vm.$nextTick()

      // Проверяем расчет: 3 * 10 = 30
      expect(wrapper.vm.totals.whiteHadak).toBe(30)
    })

    it('должен рассчитывать totals для goldHairpin', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.goldHairpin = 4
      await wrapper.vm.$nextTick()

      // Проверяем расчет: 4 * 5 = 20
      expect(wrapper.vm.totals.goldHairpin).toBe(20)
    })

    it('должен рассчитывать totals для silverHairpin', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.silverHairpin = 6
      await wrapper.vm.$nextTick()

      // Проверяем расчет: 6 * 3 = 18
      expect(wrapper.vm.totals.silverHairpin).toBe(18)
    })

    it('должен рассчитывать общий total', async () => {
      wrapper = createWrapper()

      // Устанавливаем значения
      wrapper.vm.input.concubines = 10
      wrapper.vm.input.blueHadak = 2    // 2 * 10 * 1.5 = 30
      wrapper.vm.input.whiteHadak = 3   // 3 * 10 = 30
      wrapper.vm.input.goldHairpin = 4  // 4 * 5 = 20
      wrapper.vm.input.silverHairpin = 5 // 5 * 3 = 15
      wrapper.vm.input.perfume = 6      // 6

      await wrapper.vm.$nextTick()

      // Общий тотал: 30 + 30 + 20 + 15 + 6 = 101
      expect(wrapper.vm.total).toBe(101)
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

    it('метод generateBadge должен возвращать корректное значение', async () => {
      wrapper = createWrapper()

      // Устанавливаем значения чтобы totals вычислялись
      wrapper.vm.input.concubines = 10
      wrapper.vm.input.blueHadak = 5
      wrapper.vm.input.silverHairpin = 10

      await wrapper.vm.$nextTick()

      // Теперь totals будет вычислено
      expect(wrapper.vm.totals.blueHadak).toBe(75) // 5 * 10 * 1.5
      expect(wrapper.vm.totals.silverHairpin).toBe(30) // 10 * 3

      // Для предмета с approximately: true
      const itemWithApprox = { id: 'blueHadak', approximately: true }
      const badge1 = wrapper.vm.generateBadge(itemWithApprox)
      // formatLargeNumber мокнут чтобы возвращать строку
      expect(badge1).toBe('~75') // ~ + 75

      // Для предмета с approximately: false
      const itemWithoutApprox = { id: 'silverHairpin', approximately: false }
      const badge2 = wrapper.vm.generateBadge(itemWithoutApprox)
      expect(badge2).toBe('30')

      // Для нулевого значения
      wrapper.vm.input.blueHadak = 0
      await wrapper.vm.$nextTick()
      const badge3 = wrapper.vm.generateBadge(itemWithApprox)
      expect(badge3).toBeNull()
    })
  })

  describe('Интеграция с хранилищем', () => {
    it('должен вызывать setCharmValues при изменении input', async () => {
      const { useCharmStore } = await import('@/stores/charm.js')
      const mockSetCharmValues = vi.fn()

      // Мокаем store с функцией
      useCharmStore.mockReturnValue({
        charmValues: { concubines: 0 },
        charmSettings: {},
        setCharmValues: mockSetCharmValues,
        setCharmSettings: vi.fn()
      })

      // Пересоздаем wrapper с новым моком
      wrapper = createWrapper()

      // Меняем значение
      wrapper.vm.input.concubines = 15
      await wrapper.vm.$nextTick()

      // Проверяем что функция вызвана
      expect(mockSetCharmValues).toHaveBeenCalledWith({ concubines: 15 })
    })
  })
})
