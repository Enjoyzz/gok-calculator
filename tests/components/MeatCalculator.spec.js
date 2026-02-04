import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MeatCalculator from '@/components/MeatCalculator.vue'

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

vi.mock('@/config/meat.js', () => ({
  meatItems: [
    { id: 'meat88K_8M', name: 'Набор удачи - Мясо', approximately: true },
    { id: 'meat10M', name: 'Купон мяса III', approximately: false },
    { id: 'meat1M', name: 'Купон мяса II', approximately: false },
    { id: 'meat100K', name: 'Купон мяса I', approximately: false },
    { id: 'meat2h', name: 'Бочка мяса', approximately: false },
    { id: 'meat1h', name: 'Кадка мяса', approximately: false },
    { id: 'meat30m', name: 'Мешок мяса', approximately: false },
    { id: 'meat15m', name: 'Кулёк мяса', approximately: false },
    { id: 'meat5m', name: 'Порция мяса', approximately: false },
    { id: 'medal', name: 'Медаль сбора', approximately: false },
    { id: 'chest', name: 'Сундук ресурсов', approximately: true },
  ],
  defaultValues: {
    meat: 0,
    meat88K_8M: 0,
    meat10M: 0,
    meat1M: 0,
    meat100K: 0,
    meat2h: 0,
    meat1h: 0,
    meat30m: 0,
    meat15m: 0,
    meat5m: 0,
    medal: 0,
    chest: 0
  }
}))

vi.mock('@/stores/meat.js', () => ({
  useMeatStore: vi.fn(() => ({
    meatValues: {
      meat: 0,
      meat88K_8M: 0,
      meat10M: 0,
      meat1M: 0,
      meat100K: 0,
      meat2h: 0,
      meat1h: 0,
      meat30m: 0,
      meat15m: 0,
      meat5m: 0,
      medal: 0,
      chest: 0
    },
    setMeatValues: vi.fn()
  }))
}))

vi.mock('@/utils/debounce.js', () => ({
  debounce: (fn) => fn
}))

vi.mock('@/utils/formatNumbers.js', () => ({
  formatLargeNumber: vi.fn((num, options) => {
    if (options?.withCurrency) {
      return `${num.toLocaleString()} / мин.`
    }
    return num.toLocaleString()
  })
}))

vi.mock('@/composable/badges.js', () => ({
  useGenerateBadge: vi.fn(() => null)
}))

vi.mock('@/assets/img/icon/1-3.png', () => ({
  default: 'mock-image-path.png'
}))

vi.mock('@/components/GokIcon.vue', () => ({
  default: {
    name: 'GokIcon',
    template: '<div />',
    props: ['icon', 'size', 'badge']
  }
}))

vi.mock('@/components/CalculatorBottom.vue', () => ({
  default: {
    name: 'CalculatorBottom',
    template: '<div />',
    props: ['total']
  }
}))

describe('MeatCalculator.vue', () => {
  let wrapper
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  const createWrapper = () => {
    return mount(MeatCalculator, {
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
          'GokIcon': { template: '<div />' },
          'CalculatorBottom': { template: '<div />' },
        },
      },
    })
  }

  it('должен монтироваться без ошибок', () => {
    wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('Вычисления', () => {
    it('должен рассчитывать totals для meat88K_8M', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.meat88K_8M = 3
      await wrapper.vm.$nextTick()

      // meat88K_8M: 3 * 4_000_000 = 12_000_000
      expect(wrapper.vm.totals.meat88K_8M).toBe(12_000_000)
    })

    it('должен рассчитывать totals для meat10M', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.meat10M = 2
      await wrapper.vm.$nextTick()

      // meat10M: 2 * 10_000_000 = 20_000_000
      expect(wrapper.vm.totals.meat10M).toBe(20_000_000)
    })

    it('должен рассчитывать totals для meat1M', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.meat1M = 5
      await wrapper.vm.$nextTick()

      // meat1M: 5 * 1_000_000 = 5_000_000
      expect(wrapper.vm.totals.meat1M).toBe(5_000_000)
    })

    it('должен рассчитывать totals для meat100K', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.meat100K = 10
      await wrapper.vm.$nextTick()

      // meat100K: 10 * 100_000 = 1_000_000
      expect(wrapper.vm.totals.meat100K).toBe(1_000_000)
    })

    it('должен рассчитывать totals для meat2h с учетом выработки мяса', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.meat = 1000 // выработка мяса в минуту
      wrapper.vm.input.meat2h = 3
      await wrapper.vm.$nextTick()

      // meat2h: 3 * 120 * 1000 = 360_000
      expect(wrapper.vm.totals.meat2h).toBe(360_000)
    })

    it('должен рассчитывать totals для meat1h с учетом выработки мяса', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.meat = 1500
      wrapper.vm.input.meat1h = 2
      await wrapper.vm.$nextTick()

      // meat1h: 2 * 60 * 1500 = 180_000
      expect(wrapper.vm.totals.meat1h).toBe(180_000)
    })

    it('должен рассчитывать totals для medal с учетом выработки мяса', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.meat = 2000
      wrapper.vm.input.medal = 4
      await wrapper.vm.$nextTick()

      // medal: 4 * 30 * 2000 = 240_000
      expect(wrapper.vm.totals.medal).toBe(240_000)
    })

    it('должен рассчитывать общий total', async () => {
      wrapper = createWrapper()

      // Устанавливаем значения
      wrapper.vm.input.meat = 1000
      wrapper.vm.input.meat88K_8M = 1    // 1 * 4_000_000 = 4_000_000
      wrapper.vm.input.meat10M = 2       // 2 * 10_000_000 = 20_000_000
      wrapper.vm.input.meat1M = 3        // 3 * 1_000_000 = 3_000_000
      wrapper.vm.input.meat2h = 4        // 4 * 120 * 1000 = 480_000
      wrapper.vm.input.meat1h = 5        // 5 * 60 * 1000 = 300_000
      wrapper.vm.input.medal = 6         // 6 * 30 * 1000 = 180_000
      wrapper.vm.input.chest = 7         // 7 * 60 * 1000 = 420_000

      await wrapper.vm.$nextTick()

      // Общий тотал: 4_000_000 + 20_000_000 + 3_000_000 + 480_000 + 300_000 + 180_000 + 420_000 = 28_380_000
      expect(wrapper.vm.total).toBe(28_380_000)
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
    it('должен вызывать setMeatValues при изменении input', async () => {
      const { useMeatStore } = await import('@/stores/meat.js')
      const mockSetMeatValues = vi.fn()

      useMeatStore.mockReturnValue({
        meatValues: { meat: 0 },
        setMeatValues: mockSetMeatValues
      })

      wrapper = createWrapper()

      wrapper.vm.input.meat = 2500
      await wrapper.vm.$nextTick()

      expect(mockSetMeatValues).toHaveBeenCalledWith({ meat: 2500 })
    })
  })
})
