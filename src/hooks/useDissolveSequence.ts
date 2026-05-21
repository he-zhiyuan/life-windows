import { useCallback, useMemo, useRef, useState } from 'react'
import type { Opportunity, WindowStatus } from '../types'
import { getWindowStatus, overlapsRange, withStatus } from '../utils/status'

export type CardItem = Opportunity & { status: WindowStatus }

export type DissolvePhase = 'idle' | 'dissolving' | 'rearranging'

const STATUS_ORDER = ['open', 'closing', 'upcoming', 'closed'] as const

type DissolveRun = {
  /** 按网格顺序排列、本次新关闭的待飘散 id */
  queue: string[]
  /** 已完成飘散的数量 */
  doneCount: number
  /** 对比基准：松手前的已提交年龄 */
  fromAge: number
  toAge: number
}

type Params = {
  opportunities: Opportunity[]
  committedAge: number
  rangeMode: boolean
  rangeStart: number
  rangeEnd: number
  category: Opportunity['category'] | 'all'
  hideClosed: boolean
  dissolveClosed: boolean
}

function computeItems(
  age: number,
  rangeMode: boolean,
  rangeStart: number,
  rangeEnd: number,
  category: Params['category'],
  opportunities: Opportunity[],
): CardItem[] {
  let list = opportunities
  if (category !== 'all') {
    list = list.filter((o) => o.category === category)
  }

  if (rangeMode) {
    list = list.filter((o) => overlapsRange(o.window, rangeStart, rangeEnd))
    return list.map((o) => {
      const statuses = Array.from(
        { length: rangeEnd - rangeStart + 1 },
        (_, i) => getWindowStatus(rangeStart + i, o.window),
      )
      const status = STATUS_ORDER.find((s) => statuses.includes(s)) ?? 'closed'
      return { ...o, status }
    })
  }

  return list.map((o) => withStatus(o, age))
}

function filterVisible(
  items: CardItem[],
  hideClosed: boolean,
  dissolveClosed: boolean,
): CardItem[] {
  return items.filter((o) => {
    if (hideClosed && o.status === 'closed') return false
    if (dissolveClosed && o.status === 'closed') return false
    return true
  })
}

export function useDissolveSequence(params: Params) {
  const {
    opportunities,
    committedAge,
    rangeMode,
    rangeStart,
    rangeEnd,
    category,
    hideClosed,
    dissolveClosed,
  } = params

  const [phase, setPhase] = useState<DissolvePhase>('idle')
  const [dissolveRun, setDissolveRun] = useState<DissolveRun | null>(null)
  const [frozenItems, setFrozenItems] = useState<CardItem[]>([])
  const pendingAgeRef = useRef<number | null>(null)
  const onAgeAppliedRef = useRef<(age: number) => void>(() => {})

  const registerAgeApplied = useCallback((fn: (age: number) => void) => {
    onAgeAppliedRef.current = fn
  }, [])

  const committedItems = useMemo(
    () =>
      computeItems(
        committedAge,
        rangeMode,
        rangeStart,
        rangeEnd,
        category,
        opportunities,
      ),
    [committedAge, rangeMode, rangeStart, rangeEnd, category, opportunities],
  )

  const dissolveQueue = dissolveRun?.queue ?? []
  const dissolveDoneCount = dissolveRun?.doneCount ?? 0

  const activeDissolveId =
    dissolveRun && dissolveDoneCount < dissolveQueue.length
      ? dissolveQueue[dissolveDoneCount]
      : null

  const vanishedIds = useMemo(
    () => new Set(dissolveQueue.slice(0, dissolveDoneCount)),
    [dissolveQueue, dissolveDoneCount],
  )

  const pendingDissolveIds = useMemo(
    () => new Set(dissolveQueue),
    [dissolveQueue],
  )

  const canvasItems = useMemo(() => {
    if (phase === 'dissolving') {
      return frozenItems
    }
    const visible = filterVisible(committedItems, hideClosed, dissolveClosed)
    return [...visible].sort(
      (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status),
    )
  }, [phase, frozenItems, committedItems, hideClosed, dissolveClosed])

  const finishSequence = useCallback(() => {
    const age = pendingAgeRef.current
    pendingAgeRef.current = null
    setDissolveRun(null)
    setPhase('rearranging')
    setFrozenItems([])

    if (age !== null) {
      onAgeAppliedRef.current(age)
    }

    window.setTimeout(() => setPhase('idle'), 520)
  }, [])

  const tryCommitAge = useCallback(
    (newAge: number): boolean => {
      if (rangeMode || !dissolveClosed || newAge === committedAge) {
        return true
      }

      const prevItems = computeItems(
        committedAge,
        rangeMode,
        rangeStart,
        rangeEnd,
        category,
        opportunities,
      )
      const nextItems = computeItems(
        newAge,
        rangeMode,
        rangeStart,
        rangeEnd,
        category,
        opportunities,
      )

      const prevStatus = new Map(prevItems.map((o) => [o.id, o.status]))
      // 仅「相对上次已提交年龄」新变为已关闭的窗口（不是相对 0 岁，也不是新年龄下全部已关）
      const newlyClosed = nextItems.filter((o) => {
        const was = prevStatus.get(o.id)
        return o.status === 'closed' && was !== undefined && was !== 'closed'
      })

      if (newlyClosed.length === 0) {
        return true
      }

      const closedIdSet = new Set(newlyClosed.map((o) => o.id))
      // 快照 = 松手前用户实际看到的卡片（已关飘散模式下原本就隐藏的已关卡片不再出现）
      const snapshot = filterVisible(prevItems, hideClosed, dissolveClosed)
      const snapshotWithClosed = snapshot.map((item) =>
        closedIdSet.has(item.id) ? { ...item, status: 'closed' as const } : item,
      )

      const queue = snapshotWithClosed
        .filter((item) => closedIdSet.has(item.id))
        .map((item) => item.id)

      pendingAgeRef.current = newAge
      setFrozenItems(snapshotWithClosed)
      setDissolveRun({ queue, doneCount: 0, fromAge: committedAge, toAge: newAge })
      setPhase('dissolving')

      return false
    },
    [
      committedAge,
      rangeMode,
      rangeStart,
      rangeEnd,
      category,
      opportunities,
      hideClosed,
      dissolveClosed,
    ],
  )

  const completeDissolve = useCallback(
    (id: string) => {
      setDissolveRun((prev) => {
        if (!prev) return null

        const expected = prev.queue[prev.doneCount]
        if (id !== expected) return prev

        const nextDone = prev.doneCount + 1
        if (nextDone >= prev.queue.length) {
          setTimeout(() => finishSequence(), 80)
          return { ...prev, doneCount: nextDone }
        }

        return { ...prev, doneCount: nextDone }
      })
    },
    [finishSequence],
  )

  const cancelSequence = useCallback(() => {
    pendingAgeRef.current = null
    setDissolveRun(null)
    setFrozenItems([])
    setPhase('idle')
  }, [])

  return {
    phase,
    canvasItems,
    dissolveRun,
    activeDissolveId,
    vanishedIds,
    pendingDissolveIds,
    dissolveProgress: dissolveRun
      ? {
          current: dissolveDoneCount,
          total: dissolveQueue.length,
          fromAge: dissolveRun.fromAge,
          toAge: dissolveRun.toAge,
        }
      : null,
    tryCommitAge,
    completeDissolve,
    cancelSequence,
    registerAgeApplied,
    layoutFrozen: phase === 'dissolving',
    layoutAnimating: phase === 'rearranging',
    isBusy: phase !== 'idle',
  }
}
