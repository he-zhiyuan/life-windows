import type { DissolvePhase } from '../hooks/useDissolveSequence'

export type DissolveItemState = {
  isVanished: boolean
  isActive: boolean
  isWaiting: boolean
  isPausedNext: boolean
}

export function getDissolveItemState(
  itemId: string,
  dissolvePhase: DissolvePhase,
  activeDissolveId: string | null,
  vanishedIds: Set<string>,
  pendingDissolveIds: Set<string>,
  upcomingDissolveId: string | null,
): DissolveItemState {
  const isVanished = vanishedIds.has(itemId)
  const isActive = activeDissolveId === itemId
  const isWaiting =
    dissolvePhase === 'dissolving' &&
    pendingDissolveIds.has(itemId) &&
    !isVanished &&
    !isActive
  const isPausedNext =
    dissolvePhase === 'queued' && upcomingDissolveId === itemId

  return { isVanished, isActive, isWaiting, isPausedNext }
}
