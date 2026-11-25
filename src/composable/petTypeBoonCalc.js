import { SHARE, POINTS, CLASS_ORDER, TOOL_ORDER, RATE } from '@/config/pet-type-boon.js'

const defaults = { SHARE, POINTS, CLASS_ORDER, TOOL_ORDER, RATE }

export const staminaFromPills = pills => ((Number(pills) || 0) * 5) / 3

export function calcHunted(stamina, tools = {}, cfg = defaults) {
  const stock = Object.fromEntries(cfg.TOOL_ORDER.map(t => [t, Number(tools[t]) || 0]))
  let points = 0

  for (const cls of cfg.CLASS_ORDER) {
    let left = stamina * cfg.SHARE[cls]

    for (const tool of cfg.TOOL_ORDER) {
      const used = Math.min(stock[tool], left)
      points += used * cfg.POINTS[cls] * cfg.RATE[tool][cls]
      stock[tool] -= used
      left -= used
    }

    points += left * cfg.POINTS[cls] * cfg.RATE.hands[cls]
  }
  return points
}
