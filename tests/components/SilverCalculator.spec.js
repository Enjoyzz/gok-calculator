import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import SilverCalculator from '@/components/SilverCalculator.vue'

// Мокаем все зависимости аналогично MeatCalculator
vi.mock('vuetify', () => ({
  createVuetify: () => ({
    install: vi.fn(),
    components: {},
    directives: {}
  })
}))

vi.mock('vuetify/components', () => ({}))
vi.mock('vuetify/directives', () => ({}))

vi.mock('@/config/silver.js', () => ({
  silverItems: [
    { id: 'silver88K_8M', name: 'Набор удачи - Серебро', approximately: true },
    { id: 'silver10M', name: 'Эпичный купон серебра', approximately: false },
    { id: 'silver1M', name: 'Редкий купон серебра', approximately: false },
    { id: 'silver100K', name: 'Купон серебра', approximately: false },
    { id: 'silver2h', name: 'Сундук серебра', approximately: false },
    { id: 'silver1h', name: 'Ящик серебра', approximately: false },
    { id: 'silver30m', name: 'Сумка серебра', approximately: false },
    { id: 'silver15m', name: 'Мешочек серебра', approximately: false },
    { id: 'silver5m', name: 'Горсть серебра', approximately: false },
    { id: 'medal', name: 'Медаль сбора', approximately: false },
    { id: 'chest', name: 'Сундук ресурсов', approximately: true },
  ],
  defaultValues: {
    silver: 0,
    silver88K_8M: 0,
    silver10M: 0,
    silver1M: 0,
    silver100K: 0,
    silver2h: 0,
    silver1h: 0,
    silver30m: 0,
    silver15m: 0,
    silver5m: 0,
    medal: 0,
    chest: 0
  }
}))

vi.mock('@/stores/silver.js', () => ({
  useSilverStore: vi.fn(() => ({
    silverValues: {
      silver: 0,
      silver88K_8M: 0,
      silver10M: 0,
      silver1M: 0,
      silver100K: 0,
      silver2h: 0,
      silver1h: 0,
      silver30m: 0,
      silver15m: 0,
      silver5m: 0,
      medal: 0,
      chest: 0
    },
    setSilverValues: vi.fn()
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

// Важно: используем правильную иконку для серебра
vi.mock('@/assets/img/icon/1-2.png', () => ({
  default: 'mock-silver-icon.png'
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

describe('SilverCalculator.vue', () => {
  let wrapper
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  const createWrapper = () => {
    return mount(SilverCalculator, {
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
    it('должен рассчитывать totals для silver88K_8M', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.silver88K_8M = 3
      await wrapper.vm.$nextTick()

      // silver88K_8M: 3 * 4_000_000 = 12_000_000
      expect(wrapper.vm.totals.silver88K_8M).toBe(12_000_000)
    })

    it('должен рассчитывать totals для silver10M', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.silver10M = 2
      await wrapper.vm.$nextTick()

      // silver10M: 2 * 10_000_000 = 20_000_000
      expect(wrapper.vm.totals.silver10M).toBe(20_000_000)
    })

    it('должен рассчитывать totals для silver1M', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.silver1M = 5
      await wrapper.vm.$nextTick()

      // silver1M: 5 * 1_000_000 = 5_000_000
      expect(wrapper.vm.totals.silver1M).toBe(5_000_000)
    })

    it('должен рассчитывать totals для silver100K', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.silver100K = 10
      await wrapper.vm.$nextTick()

      // silver100K: 10 * 100_000 = 1_000_000
      expect(wrapper.vm.totals.silver100K).toBe(1_000_000)
    })

    it('должен рассчитывать totals для silver2h с учетом выработки серебра', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.silver = 1000 // выработка серебра в минуту
      wrapper.vm.input.silver2h = 3
      await wrapper.vm.$nextTick()

      // silver2h: 3 * 120 * 1000 = 360_000
      expect(wrapper.vm.totals.silver2h).toBe(360_000)
    })

    it('должен рассчитывать totals для silver1h с учетом выработки серебра', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.silver = 1500
      wrapper.vm.input.silver1h = 2
      await wrapper.vm.$nextTick()

      // silver1h: 2 * 60 * 1500 = 180_000
      expect(wrapper.vm.totals.silver1h).toBe(180_000)
    })

    it('должен рассчитывать totals для silver30m с учетом выработки серебра', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.silver = 2000
      wrapper.vm.input.silver30m = 4
      await wrapper.vm.$nextTick()

      // silver30m: 4 * 30 * 2000 = 240_000
      expect(wrapper.vm.totals.silver30m).toBe(240_000)
    })

    it('должен рассчитывать totals для silver15m с учетом выработки серебра', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.silver = 2500
      wrapper.vm.input.silver15m = 3
      await wrapper.vm.$nextTick()

      // silver15m: 3 * 15 * 2500 = 112_500
      expect(wrapper.vm.totals.silver15m).toBe(112_500)
    })

    it('должен рассчитывать totals для silver5m с учетом выработки серебра', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.silver = 3000
      wrapper.vm.input.silver5m = 6
      await wrapper.vm.$nextTick()

      // silver5m: 6 * 5 * 3000 = 90_000
      expect(wrapper.vm.totals.silver5m).toBe(90_000)
    })

    it('должен рассчитывать totals для medal с учетом выработки серебра', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.silver = 2000
      wrapper.vm.input.medal = 4
      await wrapper.vm.$nextTick()

      // medal: 4 * 30 * 2000 = 240_000
      expect(wrapper.vm.totals.medal).toBe(240_000)
    })

    it('должен рассчитывать totals для chest с учетом выработки серебра', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.silver = 1800
      wrapper.vm.input.chest = 5
      await wrapper.vm.$nextTick()

      // chest: 5 * 60 * 1800 = 540_000
      expect(wrapper.vm.totals.chest).toBe(540_000)
    })

    it('должен рассчитывать общий total', async () => {
      wrapper = createWrapper()

      // Устанавливаем значения
      wrapper.vm.input.silver = 1000
      wrapper.vm.input.silver88K_8M = 1    // 1 * 4_000_000 = 4_000_000
      wrapper.vm.input.silver10M = 2       // 2 * 10_000_000 = 20_000_000
      wrapper.vm.input.silver1M = 3        // 3 * 1_000_000 = 3_000_000
      wrapper.vm.input.silver100K = 4      // 4 * 100_000 = 400_000
      wrapper.vm.input.silver2h = 5        // 5 * 120 * 1000 = 600_000
      wrapper.vm.input.silver1h = 6        // 6 * 60 * 1000 = 360_000
      wrapper.vm.input.silver30m = 7       // 7 * 30 * 1000 = 210_000
      wrapper.vm.input.silver15m = 8       // 8 * 15 * 1000 = 120_000
      wrapper.vm.input.silver5m = 9        // 9 * 5 * 1000 = 45_000
      wrapper.vm.input.medal = 10          // 10 * 30 * 1000 = 300_000
      wrapper.vm.input.chest = 11          // 11 * 60 * 1000 = 660_000

      await wrapper.vm.$nextTick()

      // Общий тотал: 4_000_000 + 20_000_000 + 3_000_000 + 400_000 + 600_000 +
      // 360_000 + 210_000 + 120_000 + 45_000 + 300_000 + 660_000 = 29_695_000
      expect(wrapper.vm.total).toBe(29_695_000)
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
    it('должен вызывать setSilverValues при изменении input', async () => {
      const { useSilverStore } = await import('@/stores/silver.js')
      const mockSetSilverValues = vi.fn()

      useSilverStore.mockReturnValue({
        silverValues: { silver: 0 },
        setSilverValues: mockSetSilverValues
      })

      wrapper = createWrapper()

      wrapper.vm.input.silver = 2500
      await wrapper.vm.$nextTick()

      expect(mockSetSilverValues).toHaveBeenCalledWith({ silver: 2500 })
    })
  })
})
