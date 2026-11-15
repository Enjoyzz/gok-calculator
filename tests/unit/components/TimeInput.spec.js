import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TimeInput from '@/components/TimeInput.vue'

const mountInput = (modelValue = '') =>
  mount(TimeInput, {
    props: { modelValue },
    global: {
      stubs: {
        VTextField: {
          template:
            '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
          props: ['modelValue'],
          methods: { focus() {} },
        },
      },
    },
  })

const last = w => w.emitted('update:modelValue').at(-1)[0]

describe('TimeInput', () => {
  it('собирает ч:мм:сс из трёх полей', async () => {
    const w = mountInput()
    const [h, m, s] = w.findAll('input')
    await h.setValue('20')
    await m.setValue('02')
    await s.setValue('24')
    expect(last(w)).toBe('20:02:24')
  })

  it('неполный ввод дополняется нулями', async () => {
    const w = mountInput()
    await w.findAll('input')[0].setValue('5')
    expect(last(w)).toBe('5:00:00')
  })

  it('минуты или секунды больше 59 → пустое значение', async () => {
    const w = mountInput()
    const [h, m] = w.findAll('input')
    await h.setValue('1')
    await m.setValue('75')
    expect(last(w)).toBe('')
  })

  it('нецифровые символы отбрасываются, максимум 2 цифры', async () => {
    const w = mountInput()
    await w.findAll('input')[0].setValue('3a2z9')
    expect(last(w)).toBe('32:00:00')
  })

  it('внешнее значение раскладывается по полям', async () => {
    const w = mountInput()
    await w.setProps({ modelValue: '1:30:15' })
    expect(w.findAll('input').map(i => i.element.value)).toEqual(['1', '30', '15'])
  })

  it('пустая строка очищает поля', async () => {
    const w = mountInput('1:30:15')
    await w.setProps({ modelValue: '' })
    expect(w.findAll('input').map(i => i.element.value)).toEqual(['', '', ''])
  })
})
