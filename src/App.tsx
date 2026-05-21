import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { opportunities } from './data/opportunities'
import type { Category } from './types'
import { AgeHero } from './components/AgeHero'
import { CardCanvas } from './components/CardCanvas'
import { Controls } from './components/Controls'
import { DetailOverlay } from './components/DetailOverlay'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Section } from './components/Section'
import { SummaryStrip, type SummaryItem } from './components/SummaryStrip'
import { useDissolveSequence } from './hooks/useDissolveSequence'

const STORAGE_KEY = 'life-windows-age'
const SECTION_IDS = {
  open: 'section-open',
  closing: 'section-closing',
  upcoming: 'section-upcoming',
  closed: 'section-closed',
} as const

function loadAge(): number {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v) {
      const n = Number(v)
      if (!Number.isNaN(n) && n >= 0 && n <= 80) return n
    }
  } catch {
    /* ignore */
  }
  return 25
}

function phaseLabel(
  phase: string,
  progress: {
    step: number
    total: number
    fromAge: number
    toAge: number
  } | null,
): string | null {
  if (phase === 'queued') return null
  if (phase === 'dissolving' && progress && progress.step > 0) {
    return `相较 ${progress.fromAge}→${progress.toAge} 岁，${progress.total} 个机会窗口关闭（${progress.step}/${progress.total}）`
  }
  if (phase === 'dissolving') return null
  if (phase === 'rearranging') return null
  return null
}

export default function App() {
  const [committedAge, setCommittedAge] = useState(loadAge)
  const [previewAge, setPreviewAge] = useState(loadAge)
  const [rangeMode, setRangeMode] = useState(false)
  const [rangeStart, setRangeStart] = useState(18)
  const [rangeEnd, setRangeEnd] = useState(22)
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [hideClosed, setHideClosed] = useState(false)
  const [dissolveClosed, setDissolveClosed] = useState(false)
  const [isAgeDragging, setIsAgeDragging] = useState(false)
  const isAgeDraggingRef = useRef(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const {
    phase,
    canvasItems,
    activeDissolveId,
    upcomingDissolveId,
    vanishedIds,
    pendingDissolveIds,
    dissolveProgress,
    tryCommitAge,
    completeDissolve,
    cancelSequence,
    previewClosingIds,
    registerAgeApplied,
    layoutFrozen,
    layoutAnimating,
    isBusy,
  } = useDissolveSequence({
    opportunities,
    committedAge,
    previewAge,
    rangeMode,
    rangeStart,
    rangeEnd,
    category,
    hideClosed,
    dissolveClosed,
    isAgeDragging,
  })

  const applyCommittedAge = useCallback((age: number) => {
    setCommittedAge(age)
    setPreviewAge(age)
    try {
      localStorage.setItem(STORAGE_KEY, String(age))
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    registerAgeApplied(applyCommittedAge)
  }, [registerAgeApplied, applyCommittedAge])

  const handleAgePreview = (age: number) => {
    setPreviewAge(age)
  }

  const handleAgeDragStart = () => {
    isAgeDraggingRef.current = true
    setIsAgeDragging(true)
    if (phase === 'queued') {
      cancelSequence()
    }
  }

  const handleAgeDragEnd = () => {
    isAgeDraggingRef.current = false
    setIsAgeDragging(false)
  }

  const handleAgeCommit = (age: number) => {
    isAgeDraggingRef.current = false
    setIsAgeDragging(false)
    setPreviewAge(age)
    if (tryCommitAge(age)) {
      applyCommittedAge(age)
    }
  }

  const handleRangeCommit = () => {
    applyCommittedAge(previewAge)
  }

  const groups = useMemo(() => {
    const open = canvasItems.filter((o) => o.status === 'open')
    const closing = canvasItems.filter((o) => o.status === 'closing')
    const closed = canvasItems.filter((o) => o.status === 'closed')
    const upcoming = canvasItems.filter((o) => o.status === 'upcoming')
    return { open, closing, closed, upcoming }
  }, [canvasItems])

  const mobileClosedItems = useMemo(() => {
    if (phase === 'queued' || phase === 'dissolving') {
      return canvasItems.filter((o) => pendingDissolveIds.has(o.id))
    }
    return groups.closed
  }, [phase, canvasItems, pendingDissolveIds, groups.closed])

  const actionable = groups.open.length + groups.closing.length

  const summary =
    phase === 'queued' && dissolveProgress
      ? `相较 ${dissolveProgress.fromAge}→${dissolveProgress.toAge} 岁，${dissolveProgress.total} 个机会窗口关闭`
      : phase === 'dissolving' && dissolveProgress && dissolveProgress.step > 0
      ? `相较 ${dissolveProgress.fromAge}→${dissolveProgress.toAge} 岁，${dissolveProgress.total} 个机会窗口关闭（${dissolveProgress.step}/${dissolveProgress.total}）`
      : rangeMode
          ? `${rangeStart}–${rangeEnd} 岁 · ${canvasItems.length} 个窗口`
          : `${committedAge} 岁 · ${actionable} 个可把握 · 共 ${canvasItems.length} 张卡片`

  const navItems: SummaryItem[] = [
    { id: SECTION_IDS.open, label: '开放', value: groups.open.length, tone: 'open' },
    { id: SECTION_IDS.closing, label: '将关', value: groups.closing.length, tone: 'closing' },
    { id: SECTION_IDS.upcoming, label: '未来', value: groups.upcoming.length, tone: 'upcoming' },
    ...(mobileClosedItems.length > 0
      ? [
          {
            id: SECTION_IDS.closed,
            label: '已关',
            value: mobileClosedItems.length,
            tone: 'closed' as const,
          },
        ]
      : []),
  ]

  const selectedItem = canvasItems.find((o) => o.id === selectedId) ?? null

  useEffect(() => {
    if (selectedId && !canvasItems.some((o) => o.id === selectedId)) {
      setSelectedId(null)
    }
  }, [selectedId, canvasItems])

  const controlProps = {
    age: previewAge,
    onAgePreview: handleAgePreview,
    onAgeCommit: handleAgeCommit,
    onAgeDragStart: handleAgeDragStart,
    onAgeDragEnd: handleAgeDragEnd,
    rangeMode,
    onRangeModeChange: setRangeMode,
    rangeStart,
    rangeEnd,
    onRangeStartChange: setRangeStart,
    onRangeEndChange: setRangeEnd,
    onRangeCommit: handleRangeCommit,
    category,
    onCategoryChange: setCategory,
    hideClosed,
    onHideClosedChange: setHideClosed,
    dissolveClosed,
    onDissolveClosedChange: setDissolveClosed,
    disabled: isBusy,
  }

  return (
    <div className="min-h-screen lg:flex lg:h-screen lg:flex-col lg:overflow-hidden">
      <div className="hidden lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
        <header className="shrink-0 border-b border-stone-200/60 bg-white/50 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center justify-between gap-6">
            <div className="min-w-0">
              <h1 className="font-serif text-2xl font-semibold tracking-tight text-stone-900">
                时光窗口
              </h1>
              <p className="mt-0.5 text-xs text-stone-500">{summary}</p>
            </div>
            <div className="w-full max-w-md">
              <Controls compact {...controlProps} />
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 gap-4 px-6 py-4">
          <aside className="flex w-52 shrink-0 flex-col gap-3 xl:w-56">
            <AgeHero
              compact
              age={previewAge}
              rangeMode={rangeMode}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
            />
            <SummaryStrip items={navItems} summary="开启后松手将隐藏新关闭的窗口 · 点击查看详情" />
          </aside>

          <main className="min-h-0 min-w-0 flex-1">
            <CardCanvas
              items={canvasItems}
              selectedId={selectedId}
              activeDissolveId={activeDissolveId}
              vanishedIds={vanishedIds}
              pendingDissolveIds={pendingDissolveIds}
              previewClosingIds={previewClosingIds}
              dissolveDoneCount={dissolveProgress?.done ?? 0}
              dissolvePhase={phase}
              upcomingDissolveId={upcomingDissolveId}
              layoutFrozen={layoutFrozen}
              layoutAnimating={layoutAnimating}
              phaseLabel={phaseLabel(phase, dissolveProgress)}
              onSelect={setSelectedId}
              onDissolveComplete={completeDissolve}
            />
          </main>
        </div>
      </div>

      <DetailOverlay
        opportunity={selectedItem}
        status={selectedItem?.status ?? null}
        onClose={() => setSelectedId(null)}
      />

      <div className="lg:hidden">
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-8 sm:px-6">
          <Header />

          <div className="mt-8 space-y-4">
            <AgeHero
              age={previewAge}
              rangeMode={rangeMode}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
            />
            <Controls {...controlProps} />
            {phaseLabel(phase, dissolveProgress) && (
              <p className="rounded-lg bg-stone-800 px-3 py-2 text-center text-sm text-amber-100">
                {phaseLabel(phase, dissolveProgress)}
              </p>
            )}
            <SummaryStrip items={navItems} summary={summary} />
          </div>

          <main className="mt-10 flex flex-col gap-10">
            <Section
              id={SECTION_IDS.open}
              title="当前开放"
              hint="处于最佳窗口"
              items={groups.open}
              tone="open"
              emptyText="当前没有处于最佳期的窗口"
            />
            <Section
              id={SECTION_IDS.closing}
              title="即将关闭"
              hint="仍有机会"
              items={groups.closing}
              tone="closing"
            />
            <Section
              id={SECTION_IDS.upcoming}
              title="即将到来"
              hint="提前了解"
              items={groups.upcoming}
              tone="upcoming"
            />
            {!rangeMode &&
              (mobileClosedItems.length > 0 || phase === 'queued' || phase === 'dissolving') && (
              <Section
                id={SECTION_IDS.closed}
                title="已基本关闭"
                hint={dissolveClosed ? '松手后隐藏新关闭的窗口' : '可展开查看补救'}
                items={mobileClosedItems}
                tone="closed"
                activeDissolveId={activeDissolveId}
                vanishedIds={vanishedIds}
                pendingDissolveIds={pendingDissolveIds}
                dissolveDoneCount={dissolveProgress?.done ?? 0}
                dissolvePhase={phase}
                upcomingDissolveId={upcomingDissolveId}
                onDissolveComplete={completeDissolve}
              />
            )}
          </main>

          <Footer />
        </div>
      </div>
    </div>
  )
}
