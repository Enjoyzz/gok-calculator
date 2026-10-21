import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TigersTable from '@/components/TigersTable.vue'

vi.mock('@/config/tigers', () => ({
  TIGERS_START_LEVEL: 10,
  tigersCosts: [5, 10, 20], // уровни 10, 11, 12 → итого 5, 15, 35
}))

describe('TigersTable.vue', () => {
  let wrapper

  const createWrapper = () =>
    mount(TigersTable, {
      global: {
        stubs: {
          'v-card': { template: '<div><slot /></div>' },
          'v-select': { template: '<div class="select" />', props: ['modelValue', 'items'] },
          'v-table': { template: '<table><slot /></table>' },
        },
      },
    })

  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('рендерит строку на каждый уровень (кроме служебного первого) с накопленной суммой', () => {
    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)

    const cells = rows.map(r => r.findAll('td').map(td => td.text()))
    expect(cells).toEqual([
      ['11', '10', '15'],
      ['12', '20', '35'],
    ])
  })

  it('служебный первый уровень не попадает в таблицу, но доступен в селекторе «с»', () => {
    expect(wrapper.vm.tableItems.map(i => i.level)).toEqual([11, 12])
    expect(wrapper.vm.fromItems).toContain(10)
  })

  it('по умолчанию в селектах весь диапазон', () => {
    expect(wrapper.vm.fromItems).toEqual([10, 11, 12])
    expect(wrapper.vm.toItems).toEqual([11, 12])
  })

  it('«до» ограничивает список «с»', async () => {
    wrapper.vm.to = 12
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.fromItems).toEqual([10, 11])
  })

  it('«с» ограничивает список «до»', async () => {
    wrapper.vm.from = 11
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.toItems).toEqual([12])
  })

  it('rangeCost = null, пока не выбраны оба уровня', async () => {
    expect(wrapper.vm.rangeCost).toBeNull()
    wrapper.vm.from = 10
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.rangeCost).toBeNull()
  })

  it('rangeCost считает стоимость от уровня «с» (не включая) до «до» (включая)', async () => {
    wrapper.vm.from = 10
    wrapper.vm.to = 12
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.rangeCost).toBe(30) // 10 + 20
    expect(wrapper.text()).toContain('30 знаков')
  })

  it('не показывает результат без выбора диапазона', () => {
    expect(wrapper.text()).not.toContain('знаков\n')
    expect(wrapper.find('.text-headline-small').exists()).toBe(false)
  })
})
