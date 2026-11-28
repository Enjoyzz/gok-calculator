// tests/unit/components/RallyCalculator.spec.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RallyCalculator from '@/components/RallyCalculator.vue'

// 2026-11-13 — пятница, 2026-11-14 — суббота. МСК = UTC+3
const FRI_12_00 = '2026-11-13T09:00:00Z'
const SAT_19_00 = '2026-11-14T16:00:00Z' // таймер 1:00:00 (фаза 1)

describe('RallyCalculator.vue', () => {
  let wrapper

  const at = iso => vi.setSystemTime(new Date(iso))

  const createWrapper = () =>
    mount(RallyCalculator, {
      global: {
        stubs: {
          VCard: { template: '<div><slot /></div>' },
          VCardText: { template: '<div><slot /></div>' },
          VTabs: { template: '<div><slot /></div>' },
          VTab: { template: '<div><slot /></div>' },
          VDivider: { template: '<hr />' },
          VList: { template: '<div><slot /></div>' },
          VListItem: {
            template: '<div><slot name="prepend" /><slot /><slot name="append" /></div>',
          },
          VAvatar: { template: '<span><slot /></span>' },
          VBtn: { template: '<button><slot /></button>' },
          VTextField: {
            template: '<input :value="modelValue" />',
            props: ['modelValue', 'label'],
          },
        },
      },
    })

  beforeEach(() => {
    vi.useFakeTimers()
    at('2026-11-10T12:00:00Z') // вторник — вне игрового окна
  })

  afterEach(() => {
    wrapper?.unmount()
    vi.useRealTimers()
  })

  describe('serverTimerAt', () => {
    const cases = [
      ['Пт 12:00:00 — старт, 32:00:00', FRI_12_00, 32 * 3600],
      ['Пт 11:59:59 — до окна', '2026-11-13T08:59:59Z', null],
      ['Пт 23:59:59', '2026-11-13T20:59:59Z', 20 * 3600 + 1],
      ['Сб 00:00:00 — непрерывно с пятницей', '2026-11-13T21:00:00Z', 20 * 3600],
      ['Сб 00:30 МСК, когда по UTC ещё пятница', '2026-11-13T21:30:00Z', 20 * 3600 - 1800],
      ['Сб 19:59:59', '2026-11-14T16:59:59Z', 1],
      ['Сб 20:00:00 — старт фазы 2, 2:00:00', '2026-11-14T17:00:00Z', 2 * 3600],
      ['Сб 21:59:59', '2026-11-14T18:59:59Z', 1],
      ['Сб 22:00:00 — конец окна', '2026-11-14T19:00:00Z', null],
      ['Воскресенье', '2026-11-15T12:00:00Z', null],
      ['Четверг', '2026-11-12T12:00:00Z', null],
    ]

    it.each(cases)('%s', (_, iso, expected) => {
      wrapper = createWrapper()
      expect(wrapper.vm.serverTimerAt(new Date(iso).getTime())).toBe(expected)
    })
  })

  describe('parseTravel', () => {
    beforeEach(() => { wrapper = createWrapper() })

    it.each([
      ['5', 300],
      ['0:30', 30],
      ['1:11', 71],
      ['1.11', 71],
      ['1,11', 71],
      ['2.24', 144],
      ['75', 4500], // минут может быть больше 59
    ])('"%s" → %i сек', (input, expected) => {
      expect(wrapper.vm.parseTravel(input)).toBe(expected)
    })

    it.each(['', '  ', 'abc', '1:2:3', '1.5.5', '-1', '1:-5', '1:ab'])(
      '"%s" → null',
      input => {
        expect(wrapper.vm.parseTravel(input)).toBeNull()
      },
    )
  })

  describe('parseTimer', () => {
    beforeEach(() => { wrapper = createWrapper() })

    it('разбирает ч:мм:сс и ч:мм', () => {
      expect(wrapper.vm.parseTimer('20:00:00')).toBe(72000)
      expect(wrapper.vm.parseTimer('20:00')).toBe(72000)
      expect(wrapper.vm.parseTimer('0:01:05')).toBe(65)
      expect(wrapper.vm.parseTimer(' 32:00:00 ')).toBe(115200)
    })

    it('возвращает null для мусора', () => {
      expect(wrapper.vm.parseTimer('')).toBeNull()
      expect(wrapper.vm.parseTimer('abc')).toBeNull()
      expect(wrapper.vm.parseTimer('20')).toBeNull()
      expect(wrapper.vm.parseTimer('20:0')).toBeNull()
    })
  })

  describe('форматирование', () => {
    beforeEach(() => { wrapper = createWrapper() })

    it('fmtTimer', () => {
      expect(wrapper.vm.fmtTimer(72144)).toBe('20:02:24')
      expect(wrapper.vm.fmtTimer(65)).toBe('0:01:05')
      expect(wrapper.vm.fmtTimer(115200)).toBe('32:00:00')
    })

    it('fmtTravel: минуты без часов', () => {
      expect(wrapper.vm.fmtTravel(71)).toBe('1:11')
      expect(wrapper.vm.fmtTravel(4500)).toBe('75:00')
    })

    it('mskClock показывает МСК независимо от пояса браузера', () => {
      expect(wrapper.vm.mskClock(new Date('2026-11-14T17:00:00Z').getTime())).toBe('Сб 20:00:00')
      expect(wrapper.vm.mskClock(new Date('2026-11-13T21:30:00Z').getTime())).toBe('Сб 00:30:00')
    })
  })

  describe('расчёт по прибытию', () => {
    beforeEach(() => {
      wrapper = createWrapper()
      wrapper.vm.arrivalTimer = '20:00:00'
      wrapper.vm.rallies[0].travel = '1.11'
      wrapper.vm.rallies[1].travel = '2.24'
    })

    it('запуск = таймер прибытия + время в пути', () => {
      const launches = Object.fromEntries(wrapper.vm.rows.map(r => [r.name, r.launch]))
      expect(launches['Сбор 1']).toBe(72000 + 71) // 20:01:11
      expect(launches['Сбор 2']).toBe(72000 + 144) // 20:02:24
    })

    it('первым стартует самый долгий (больший остаток)', () => {
      expect(wrapper.vm.rows.map(r => r.name)).toEqual(['Сбор 2', 'Сбор 1'])
    })

    it('интервал между запусками', () => {
      const [first, second] = wrapper.vm.rows
      expect(first.gap).toBeNull()
      expect(second.gap).toBe(73) // 1:13
    })

    it('сборы без валидного времени в пути пропускаются', async () => {
      wrapper.vm.rallies[0].travel = 'abc'
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.rows).toHaveLength(1)

      wrapper.vm.rallies[0].travel = ''
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.rows).toHaveLength(1)
    })

    it('невалидное прибытие → пустой список', async () => {
      wrapper.vm.arrivalTimer = 'xx'
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.arrival).toBeNull()
      expect(wrapper.vm.rows).toEqual([])
    })

    it('выводит запуски в разметке', async () => {
      await wrapper.vm.$nextTick()
      const text = wrapper.text()
      expect(text).toContain('20:02:24')
      expect(text).toContain('20:01:11')
    })
  })

  describe('расчёт по старту первого', () => {
    beforeEach(() => {
      wrapper = createWrapper()
      wrapper.vm.mode = 'start'
      wrapper.vm.startTimer = '20:10:00'
      wrapper.vm.rallies[0].travel = '1.11'
      wrapper.vm.rallies[1].travel = '2.24'
    })

    it('прибытие = старт первого − самое долгое время в пути', () => {
      expect(wrapper.vm.arrival).toBe(72600 - 144) // 20:07:36
    })

    it('самый долгий стартует ровно на введённом таймере', () => {
      const [first, second] = wrapper.vm.rows
      expect(first.launch).toBe(72600) // 20:10:00
      expect(second.launch).toBe(72456 + 71) // 20:08:47
    })

    it('старт меньше самого долгого пути → ошибка, расчёта нет', async () => {
      wrapper.vm.startTimer = '0:01:00'
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.arrival).toBeNull()
      expect(wrapper.vm.inputError).toBe(true)
      expect(wrapper.vm.rows).toEqual([])
    })

    it('старт ровно равен самому долгому пути → прибытие 0:00:00', async () => {
      wrapper.vm.startTimer = '0:02:24'
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.arrival).toBe(0)
      expect(wrapper.vm.rows).toHaveLength(2)
    })

    it('без валидных сборов расчёта нет', async () => {
      wrapper.vm.rallies[0].travel = ''
      wrapper.vm.rallies[1].travel = ''
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.arrival).toBeNull()
      expect(wrapper.vm.rows).toEqual([])
    })
  })

  describe('управление списком сборов', () => {
    beforeEach(() => { wrapper = createWrapper() })

    it('addRally добавляет сбор с уникальным id', () => {
      wrapper.vm.addRally()
      expect(wrapper.vm.rallies).toHaveLength(3)
      const ids = wrapper.vm.rallies.map(r => r.id)
      expect(new Set(ids).size).toBe(3)
    })

    it('removeRally удаляет по id', () => {
      const id = wrapper.vm.rallies[0].id
      wrapper.vm.removeRally(id)
      expect(wrapper.vm.rallies).toHaveLength(1)
      expect(wrapper.vm.rallies.some(r => r.id === id)).toBe(false)
    })

    it('имя по умолчанию «Сбор N», своё имя сохраняется', async () => {
      wrapper.vm.arrivalTimer = '20:00:00'
      wrapper.vm.rallies[0].travel = '1'
      wrapper.vm.rallies[1].travel = '2'
      wrapper.vm.rallies[1].name = 'Основной'
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.rows.map(r => r.name)).toEqual(['Основной', 'Сбор 1'])
    })
  })

  describe('реальное серверное время', () => {
    it('в игровое окно подставляет текущий таймер в поля', () => {
      at(SAT_19_00)
      wrapper = createWrapper()
      expect(wrapper.vm.currentTimer).toBe(3600)
      expect(wrapper.vm.arrivalTimer).toBe('1:00:00')
      expect(wrapper.vm.startTimer).toBe('1:00:00')
    })

    it('вне окна оставляет значения по умолчанию и currentTimer = null', () => {
      wrapper = createWrapper()
      expect(wrapper.vm.currentTimer).toBeNull()
      expect(wrapper.vm.arrivalTimer).toBe('24:00:00')
      expect(wrapper.vm.startTimer).toBe('24:00:00')
    })

    it('таймер идёт на убывание раз в секунду', async () => {
      at(SAT_19_00)
      wrapper = createWrapper()
      vi.advanceTimersByTime(5000)
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.currentTimer).toBe(3595)
    })

    it('при выходе из окна currentTimer становится null', async () => {
      at('2026-11-14T18:59:58Z') // Сб 21:59:58 → остаток 2 с
      wrapper = createWrapper()
      expect(wrapper.vm.currentTimer).toBe(2)
      vi.advanceTimersByTime(3000)
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.currentTimer).toBeNull()
    })

    it('fillNow подставляет текущий таймер в активную вкладку', async () => {
      at(SAT_19_00)
      wrapper = createWrapper()
      wrapper.vm.arrivalTimer = '5:00:00'
      wrapper.vm.startTimer = '5:00:00'

      wrapper.vm.fillNow()
      expect(wrapper.vm.arrivalTimer).toBe('1:00:00')
      expect(wrapper.vm.startTimer).toBe('5:00:00')

      wrapper.vm.mode = 'start'
      wrapper.vm.fillNow()
      expect(wrapper.vm.startTimer).toBe('1:00:00')
    })

    it('fillNow вне окна ничего не меняет', () => {
      wrapper = createWrapper()
      wrapper.vm.arrivalTimer = '5:00:00'
      wrapper.vm.fillNow()
      expect(wrapper.vm.arrivalTimer).toBe('5:00:00')
    })
  })

  describe('realInfo (реальное время запуска)', () => {
    it('вне игрового окна возвращает null', () => {
      wrapper = createWrapper()
      expect(wrapper.vm.realInfo(1800)).toBeNull()
    })

    it('null для пустого таймера', () => {
      at(SAT_19_00)
      wrapper = createWrapper()
      expect(wrapper.vm.realInfo(null)).toBeNull()
    })

    it('событие в будущем: таймер меньше текущего', () => {
      at(SAT_19_00) // 3600
      wrapper = createWrapper()
      const info = wrapper.vm.realInfo(1800)
      expect(info.delta).toBe(1800)
      expect(wrapper.vm.mskClock(info.ts)).toBe('Сб 19:30:00')
    })

    it('событие в прошлом: таймер больше текущего', () => {
      at(SAT_19_00)
      wrapper = createWrapper()
      const info = wrapper.vm.realInfo(7200)
      expect(info.delta).toBe(-3600)
      expect(wrapper.vm.mskClock(info.ts)).toBe('Сб 18:00:00')
    })

    it('в разметке показывает время МСК и «через …»', async () => {
      at(SAT_19_00)
      wrapper = createWrapper()
      wrapper.vm.arrivalTimer = '0:30:00'
      wrapper.vm.rallies[0].travel = '10' // запуск на таймере 0:40:00
      await wrapper.vm.$nextTick()

      const text = wrapper.text()
      expect(text).toContain('Сб 19:20:00 МСК')
      expect(text).toContain('через 0:20:00')
    })

    it('прошедший запуск помечается «прошло»', async () => {
      at(SAT_19_00)
      wrapper = createWrapper()
      wrapper.vm.arrivalTimer = '1:30:00'
      wrapper.vm.rallies[0].travel = '10' // запуск на 1:40:00, текущий 1:00:00
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('прошло')
    })
  })
})
