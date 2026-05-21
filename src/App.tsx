import { useEffect, useMemo, useState } from 'react'
import { opportunities } from './data/opportunities'
import type { Category } from './types'
import { getWindowStatus, overlapsRange, withStatus } from './utils/status'
import { AgeHero } from './components/AgeHero'
import { Controls } from './components/Controls'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Section } from './components/Section'
import { StatsBar } from './components/StatsBar'

const STORAGE_KEY = 'life-windows-age'

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

export default function App() {
  const [age, setAge] = useState(loadAge)
  const [rangeMode, setRangeMode] = useState(false)
  const [rangeStart, setRangeStart] = useState(18)
  const [rangeEnd, setRangeEnd] = useState(22)
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [hideClosed, setHideClosed] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(age))
    } catch {
      /* ignore */
    }
  }, [age])

  const filtered = useMemo(() => {
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
        const priority = ['open', 'closing', 'upcoming', 'closed'] as const
        const status = priority.find((s) => statuses.includes(s)) ?? 'closed'
        return { ...o, status }
      })
    }

    return list.map((o) => withStatus(o, age))
  }, [age, category, rangeMode, rangeStart, rangeEnd])

  const groups = useMemo(() => {
    const open = filtered.filter((o) => o.status === 'open')
    const closing = filtered.filter((o) => o.status === 'closing')
    const closed = hideClosed ? [] : filtered.filter((o) => o.status === 'closed')
    const upcoming = filtered.filter((o) => o.status === 'upcoming')
    return { open, closing, closed, upcoming }
  }, [filtered, hideClosed])

  const actionable = groups.open.length + groups.closing.length

  const summary = rangeMode
    ? `${rangeStart}–${rangeEnd} 岁区间内，共 ${filtered.length} 个相关窗口`
    : `${age} 岁时，${actionable} 个窗口仍可把握${!hideClosed && groups.closed.length > 0 ? `，${groups.closed.length} 个已基本关闭` : ''}`

  const stats = rangeMode
    ? [
        { label: '相关窗口', value: filtered.length, tone: 'neutral' as const },
        { label: '最佳期', value: groups.open.length, tone: 'open' as const },
        { label: '仍可期', value: groups.closing.length, tone: 'closing' as const },
        { label: '将到来', value: groups.upcoming.length, tone: 'upcoming' as const },
      ]
    : [
        { label: '窗口开放', value: groups.open.length, tone: 'open' as const },
        { label: '即将关闭', value: groups.closing.length, tone: 'closing' as const },
        { label: '已基本关闭', value: groups.closed.length, tone: 'closed' as const },
        { label: '即将到来', value: groups.upcoming.length, tone: 'upcoming' as const },
      ]

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
      <Header />

      <div className="mt-10 space-y-5">
        <AgeHero
          age={age}
          rangeMode={rangeMode}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
        />

        <Controls
          age={age}
          onAgeChange={setAge}
          rangeMode={rangeMode}
          onRangeModeChange={setRangeMode}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          onRangeStartChange={setRangeStart}
          onRangeEndChange={setRangeEnd}
          category={category}
          onCategoryChange={setCategory}
          hideClosed={hideClosed}
          onHideClosedChange={setHideClosed}
        />

        <StatsBar stats={stats} summary={summary} />
      </div>

      <main className="mt-12 flex flex-col gap-14">
        <Section
          title="当前开放"
          hint="处于最佳窗口，值得优先关注"
          items={groups.open}
          tone="open"
          emptyText={
            rangeMode
              ? '该区间内没有处于最佳期的窗口'
              : '当前年龄没有处于最佳期的窗口'
          }
        />
        <Section
          title="即将关闭"
          hint="仍有机会，但成本与难度在上升"
          items={groups.closing}
          tone="closing"
        />
        {!rangeMode && (
          <Section
            title="已基本关闭"
            hint="原路径窗口已过，可查看补救方式"
            items={groups.closed}
            tone="closed"
            emptyText={
              hideClosed
                ? undefined
                : '没有已完全错过的窗口，或已被筛选隐藏'
            }
          />
        )}
        <Section
          title={rangeMode ? '区间内将到来' : '即将到来'}
          hint="提前了解，为未来保留选项"
          items={groups.upcoming}
          tone="upcoming"
        />
      </main>

      <Footer />
    </div>
  )
}
