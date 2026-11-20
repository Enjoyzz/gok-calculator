// tests/unit/config/pet-type-boon.spec.js
import { describe, it, expect } from 'vitest'
import { SHARE, POINTS, CLASS_ORDER, TOOL_ORDER, RATE } from '@/config/pet-type-boon.js'

const classes = Object.keys(POINTS)

describe('Pet type boon config', () => {
  it('SHARE в сумме даёт 1', () => {
    expect(Object.values(SHARE).reduce((a, b) => a + b, 0)).toBeCloseTo(1)
  })

  it('все классы описаны во всех таблицах', () => {
    expect(Object.keys(SHARE).sort()).toEqual([...classes].sort())
    expect([...CLASS_ORDER].sort()).toEqual([...classes].sort())
    for (const row of Object.values(RATE)) {
      expect(Object.keys(row).sort()).toEqual([...classes].sort())
    }
  })

  it('все средства из TOOL_ORDER есть в RATE', () => {
    for (const t of TOOL_ORDER) expect(RATE).toHaveProperty(t)
    expect(RATE).toHaveProperty('hands')
  })

  it('шансы в диапазоне 0..1', () => {
    for (const row of Object.values(RATE)) {
      for (const v of Object.values(row)) {
        expect(v).toBeGreaterThanOrEqual(0)
        expect(v).toBeLessThanOrEqual(1)
      }
    }
  })

  it('CLASS_ORDER идёт по убыванию очков', () => {
    const pts = CLASS_ORDER.map(c => POINTS[c])
    expect(pts).toEqual([...pts].sort((a, b) => b - a))
  })

  it('любое средство не хуже рук на каждом классе', () => {
    for (const t of TOOL_ORDER) {
      for (const c of classes) expect(RATE[t][c]).toBeGreaterThanOrEqual(RATE.hands[c])
    }
  })

  it('средства из TOOL_ORDER не хуже друг друга на каждом классе', () => {
    for (const c of classes) {
      const rates = TOOL_ORDER.map(t => RATE[t][c])
      expect(rates).toEqual([...rates].sort((a, b) => b - a))
    }
  })

  it('чем выше класс, тем ниже шанс каждым средством', () => {
    for (const row of Object.values(RATE)) {
      const rates = CLASS_ORDER.map(c => row[c])
      expect(rates).toEqual([...rates].sort((a, b) => a - b))
    }
  })
})
