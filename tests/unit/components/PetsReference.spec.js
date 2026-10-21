import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PetsReference from '@/components/PetsReference.vue'

vi.mock('@/config/pets.js', () => ({
  petTypeKeys: ['gold', 'silver'],
  pets: {
    gold: {
      quality: 'Золотой',
      icon: 'gold.png',
      'min-level': 9,
      'max-level': 12,
      levels: {
        9: { parts: 10, berries: 0, points: 5 },
        10: { parts: 20, berries: 1, points: 10, approxFields: ['berries'] },
        11: { parts: 30, berries: null, points: 15 },
        12: { parts: 40, berries: 2, points: null },
      },
    },
    silver: {
      quality: 'Серебряный',
      icon: 'silver.png',
      'min-level': 1,
      'max-level': 1,
      levels: { 1: { parts: 1, berries: 1, points: 1 } },
    },
  },
}))

vi.mock('@/utils/formatNumbers.js', () => ({
  formatLargeNumber: vi.fn(n => String(n)),
}))

describe('PetsReference.vue', () => {
  let wrapper

  const createWrapper = () =>
    mount(PetsReference, {
      global: {
        stubs: {
          'v-container': { template: '<div><slot /></div>' },
          'v-chip-group': { template: '<div><slot /></div>' },
          'v-chip': { template: '<div><slot /></div>' },
          'v-switch': { template: '<div />', props: ['modelValue', 'label'] },
          'v-table': { template: '<table><slot /></table>' },
        },
      },
    })

  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('обычный режим', () => {
    it('показывает значения по уровням', () => {
      const rows = wrapper.vm.rows
      expect(rows.map(r => r.level)).toEqual([9, 10, 11, 12])
      expect(rows[0].cells).toEqual({ parts: '10', berries: '0', points: '5' })
    })

    it('приблизительные значения помечаются «~»', () => {
      expect(wrapper.vm.rows[1].cells.berries).toBe('~1')
    })

    it('null отображается как «—»', () => {
      expect(wrapper.vm.rows[2].cells.berries).toBe('—')
      expect(wrapper.vm.rows[3].cells.points).toBe('—')
    })

    it('помечает призыв и вехи (кратные 10)', () => {
      const [r9, r10, r11] = wrapper.vm.rows
      expect(r9.summon).toBe(true)
      expect(r10.summon).toBe(false)
      expect(r9.milestone).toBe(false)
      expect(r10.milestone).toBe(true)
      expect(r11.milestone).toBe(false)
    })

    it('рендерит строку таблицы на каждый уровень', () => {
      expect(wrapper.findAll('tbody tr')).toHaveLength(4)
    })
  })

  describe('накопительный режим', () => {
    beforeEach(async () => {
      wrapper.vm.cumulative = true
      await wrapper.vm.$nextTick()
    })

    it('накапливает осколки', () => {
      expect(wrapper.vm.rows.map(r => r.cells.parts)).toEqual(['10', '30', '60', '100'])
    })

    it('приблизительность «залипает» после первого ~', () => {
      const berries = wrapper.vm.rows.map(r => r.cells.berries)
      expect(berries[0]).toBe('0')
      expect(berries[1]).toBe('~1')
    })

    it('после первого null накопление по полю прекращается', () => {
      // ягодки: null на 11 уровне → «—» и дальше
      expect(wrapper.vm.rows[2].cells.berries).toBe('—')
      expect(wrapper.vm.rows[3].cells.berries).toBe('—')
      // очки: null только на 12
      expect(wrapper.vm.rows.map(r => r.cells.points)).toEqual(['5', '15', '30', '—'])
    })
  })

  describe('смена типа', () => {
    it('пересчитывает строки для другого типа', async () => {
      wrapper.vm.type = 'silver'
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.rows).toHaveLength(1)
      expect(wrapper.vm.rows[0]).toMatchObject({ level: 1, summon: true })
    })

    it('по умолчанию выбран первый тип', () => {
      expect(wrapper.vm.type).toBe('gold')
    })
  })
})
