import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import SoldiersCalculator from '@/components/SoldiersCalculator.vue'

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

vi.mock('@/config/soldiers.js', () => ({
  soldiersItems: [
    { id: 'soldiers88K_8M', name: 'Набор удачи - Серебро', approximately: true },
    { id: 'soldiers10M', name: 'Эпичный купон серебра', approximately: false },
    { id: 'soldiers1M', name: 'Редкий купон серебра', approximately: false },
    { id: 'soldiers100K', name: 'Купон серебра', approximately: false },
    { id: 'soldiers2h', name: 'Сундук серебра', approximately: false },
    { id: 'soldiers1h', name: 'Ящик серебра', approximately: false },
    { id: 'soldiers30m', name: 'Сумка серебра', approximately: false },
    { id: 'soldiers15m', name: 'Мешочек серебра', approximately: false },
    { id: 'soldiers5m', name: 'Горсть серебра', approximately: false },
    { id: 'medal', name: 'Медаль сбора', approximately: false },
    { id: 'chest', name: 'Сундук ресурсов', approximately: true },
  ],
  defaultValues: {
    soldiers: 0,
    soldiers88K_8M: 0,
    soldiers10M: 0,
    soldiers1M: 0,
    soldiers100K: 0,
    soldiers2h: 0,
    soldiers1h: 0,
    soldiers30m: 0,
    soldiers15m: 0,
    soldiers5m: 0,
    medal: 0,
    chest: 0
  }
}))

vi.mock('@/stores/soldiers.js', () => ({
  useSoldiersStore: vi.fn(() => ({
    soldiersValues: {
      soldiers: 0,
      soldiers88K_8M: 0,
      soldiers10M: 0,
      soldiers1M: 0,
      soldiers100K: 0,
      soldiers2h: 0,
      soldiers1h: 0,
      soldiers30m: 0,
      soldiers15m: 0,
      soldiers5m: 0,
      medal: 0,
      chest: 0
    },
    setSoldiersValues: vi.fn()
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
vi.mock('@/assets/img/icon/1-4.png', () => ({
  default: 'mock-soldiers-icon.png'
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

describe('SoldiersCalculator.vue', () => {
  let wrapper
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  const createWrapper = () => {
    return mount(SoldiersCalculator, {
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
    it('должен рассчитывать totals для soldiers88K_8M', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.soldiers88K_8M = 3
      await wrapper.vm.$nextTick()

      // soldiers88K_8M: 3 * 4_000_000 = 12_000_000
      expect(wrapper.vm.totals.soldiers88K_8M).toBe(12_000_000)
    })

    it('должен рассчитывать totals для soldiers10M', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.soldiers10M = 2
      await wrapper.vm.$nextTick()

      // soldiers10M: 2 * 10_000_000 = 20_000_000
      expect(wrapper.vm.totals.soldiers10M).toBe(20_000_000)
    })

    it('должен рассчитывать totals для soldiers1M', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.soldiers1M = 5
      await wrapper.vm.$nextTick()

      // soldiers1M: 5 * 1_000_000 = 5_000_000
      expect(wrapper.vm.totals.soldiers1M).toBe(5_000_000)
    })

    it('должен рассчитывать totals для soldiers100K', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.soldiers100K = 10
      await wrapper.vm.$nextTick()

      // soldiers100K: 10 * 100_000 = 1_000_000
      expect(wrapper.vm.totals.soldiers100K).toBe(1_000_000)
    })

    it('должен рассчитывать totals для soldiers2h с учетом выработки серебра', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.soldiers = 1000 // выработка серебра в минуту
      wrapper.vm.input.soldiers2h = 3
      await wrapper.vm.$nextTick()

      // soldiers2h: 3 * 120 * 1000 = 360_000
      expect(wrapper.vm.totals.soldiers2h).toBe(360_000)
    })

    it('должен рассчитывать totals для soldiers1h с учетом выработки серебра', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.soldiers = 1500
      wrapper.vm.input.soldiers1h = 2
      await wrapper.vm.$nextTick()

      // soldiers1h: 2 * 60 * 1500 = 180_000
      expect(wrapper.vm.totals.soldiers1h).toBe(180_000)
    })

    it('должен рассчитывать totals для soldiers30m с учетом выработки серебра', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.soldiers = 2000
      wrapper.vm.input.soldiers30m = 4
      await wrapper.vm.$nextTick()

      // soldiers30m: 4 * 30 * 2000 = 240_000
      expect(wrapper.vm.totals.soldiers30m).toBe(240_000)
    })

    it('должен рассчитывать totals для soldiers15m с учетом выработки серебра', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.soldiers = 2500
      wrapper.vm.input.soldiers15m = 3
      await wrapper.vm.$nextTick()

      // soldiers15m: 3 * 15 * 2500 = 112_500
      expect(wrapper.vm.totals.soldiers15m).toBe(112_500)
    })

    it('должен рассчитывать totals для soldiers5m с учетом выработки серебра', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.soldiers = 3000
      wrapper.vm.input.soldiers5m = 6
      await wrapper.vm.$nextTick()

      // soldiers5m: 6 * 5 * 3000 = 90_000
      expect(wrapper.vm.totals.soldiers5m).toBe(90_000)
    })

    it('должен рассчитывать totals для medal с учетом выработки серебра', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.soldiers = 2000
      wrapper.vm.input.medal = 4
      await wrapper.vm.$nextTick()

      // medal: 4 * 30 * 2000 = 240_000
      expect(wrapper.vm.totals.medal).toBe(240_000)
    })

    it('должен рассчитывать totals для chest с учетом выработки серебра', async () => {
      wrapper = createWrapper()

      wrapper.vm.input.soldiers = 1800
      wrapper.vm.input.chest = 5
      await wrapper.vm.$nextTick()

      // chest: 5 * 60 * 1800 = 540_000
      expect(wrapper.vm.totals.chest).toBe(540_000)
    })

    it('должен рассчитывать общий total', async () => {
      wrapper = createWrapper()

      // Устанавливаем значения
      wrapper.vm.input.soldiers = 1000
      wrapper.vm.input.soldiers88K_8M = 1    // 1 * 4_000_000 = 4_000_000
      wrapper.vm.input.soldiers10M = 2       // 2 * 10_000_000 = 20_000_000
      wrapper.vm.input.soldiers1M = 3        // 3 * 1_000_000 = 3_000_000
      wrapper.vm.input.soldiers100K = 4      // 4 * 100_000 = 400_000
      wrapper.vm.input.soldiers2h = 5        // 5 * 120 * 1000 = 600_000
      wrapper.vm.input.soldiers1h = 6        // 6 * 60 * 1000 = 360_000
      wrapper.vm.input.soldiers30m = 7       // 7 * 30 * 1000 = 210_000
      wrapper.vm.input.soldiers15m = 8       // 8 * 15 * 1000 = 120_000
      wrapper.vm.input.soldiers5m = 9        // 9 * 5 * 1000 = 45_000
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
    it('должен вызывать setSoldiersValues при изменении input', async () => {
      const { useSoldiersStore } = await import('@/stores/soldiers.js')
      const mockSetSoldiersValues = vi.fn()

      useSoldiersStore.mockReturnValue({
        soldiersValues: { soldiers: 0 },
        setSoldiersValues: mockSetSoldiersValues
      })

      wrapper = createWrapper()

      wrapper.vm.input.soldiers = 2500
      await wrapper.vm.$nextTick()

      expect(mockSetSoldiersValues).toHaveBeenCalledWith({ soldiers: 2500 })
    })
  })
})
