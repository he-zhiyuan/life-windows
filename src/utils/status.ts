import type { AgeWindow, Opportunity, WindowStatus } from '../types'

export function getWindowStatus(age: number, window: AgeWindow): WindowStatus {
  if (age < window.best[0]) return 'upcoming'
  if (age <= window.best[1]) return 'open'
  if (age <= window.still[1]) return 'closing'
  return 'closed'
}

export function overlapsRange(
  window: AgeWindow,
  rangeStart: number,
  rangeEnd: number,
): boolean {
  const windowStart = window.best[0]
  const windowEnd = window.still[1]
  return windowStart <= rangeEnd && windowEnd >= rangeStart
}

export function withStatus(opp: Opportunity, age: number) {
  return { ...opp, status: getWindowStatus(age, opp.window) }
}

export function formatAgeRange([a, b]: [number, number]) {
  return a === b ? `${a} 岁` : `${a}–${b} 岁`
}
