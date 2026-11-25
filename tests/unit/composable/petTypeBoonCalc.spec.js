// tests/unit/composable/petTypeBoonCalc.spec.js
import { describe, it, expect } from 'vitest'
import { calcHunted, staminaFromPills } from '@/composable/petTypeBoonCalc.js'

describe('staminaFromPills', () => {
  it('3 сферы = 5 выносливости', () => {
    expect(staminaFromPills(3)).toBeCloseTo(5)
  })

  it('некорректные значения дают 0', () => {
    expect(staminaFromPills('')).toBe(0)
    expect(staminaFromPills(undefined)).toBe(0)
    expect(staminaFromPills('abc')).toBe(0)
  })
})

describe('calcHunted', () => {
  it('без выносливости 0, даже со средствами', () => {
    expect(calcHunted(0, { huntingNet: 10, rope: 10 })).toBe(0)
  })

  it('без средств всё идёт руками', () => {
    // 15*210*0.005 + 35*150*0.2 + 50*90*0.3
    expect(calcHunted(100)).toBeCloseTo(2415.75)
  })

  it('сеть сначала уходит на оранжевых', () => {
    // оранжевые: 15*210*0.8, остальное руками
    expect(calcHunted(100, { huntingNet: 15 })).toBeCloseTo(4920)
  })

  it('излишек сетей переходит на фиолетовых', () => {
    // 15 на оранжевых, 5 на фиолетовых (rate 1), 30 фиолетовых руками
    expect(calcHunted(100, { huntingNet: 20 })).toBeCloseTo(5520)
  })

  it('без сетей и сака верёвка тратится на оранжевых', () => {
    // фиксирует текущее поведение: верёвка идёт в оранжевых с шансом 0.1
    expect(calcHunted(100, { rope: 10 })).toBeCloseTo(2615.25)
  })

  it('не мутирует переданные средства', () => {
    const tools = { huntingNet: 5, fishingNet: 5, rope: 5 }
    calcHunted(100, tools)
    expect(tools).toEqual({ huntingNet: 5, fishingNet: 5, rope: 5 })
  })

  it('результат не убывает при добавлении средств', () => {
    const base = calcHunted(100, { fishingNet: 5 })
    expect(calcHunted(100, { fishingNet: 10 })).toBeGreaterThanOrEqual(base)
  })

  it('green с долей 0 ничего не добавляет', () => {
    expect(calcHunted(100, {})).toBe(calcHunted(100, {}, {
      ...cfgWithoutGreen(),
    }))
  })
})

// собираем конфиг без green для сравнения
import * as cfg from '@/config/pet-type-boon.js'
function cfgWithoutGreen() {
  const drop = o => Object.fromEntries(Object.entries(o).filter(([k]) => k !== 'green'))
  return {
    SHARE: drop(cfg.SHARE),
    POINTS: drop(cfg.POINTS),
    CLASS_ORDER: cfg.CLASS_ORDER.filter(c => c !== 'green'),
    TOOL_ORDER: cfg.TOOL_ORDER,
    RATE: Object.fromEntries(Object.entries(cfg.RATE).map(([t, r]) => [t, drop(r)])),
  }
}
