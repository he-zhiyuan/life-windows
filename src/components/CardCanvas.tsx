import { AnimatePresence, motion } from 'framer-motion'
import type { DissolvePhase } from '../hooks/useDissolveSequence'
import type { Opportunity, WindowStatus } from '../types'
import { CompactCard } from './CompactCard'
import {
  DEFAULT_DISSOLVE_DURATION,
  FIRST_DISSOLVE_DURATION,
  SoulDissolveWrapper,
} from './SoulDissolveWrapper'

export type CardItem = Opportunity & { status: WindowStatus }

type Props = {
  items: CardItem[]
  selectedId: string | null
  activeDissolveId: string | null
  vanishedIds: Set<string>
  pendingDissolveIds: Set<string>
  previewClosingIds?: Set<string>
  /** 已完成隐藏数量（0-based），0 = 队列首张 */
  dissolveDoneCount?: number
  dissolvePhase?: DissolvePhase
  upcomingDissolveId?: string | null
  layoutFrozen: boolean
  layoutAnimating: boolean
  isAgeDragging?: boolean
  phaseLabel?: string | null
  onSelect: (id: string) => void
  onDissolveComplete: (id: string) => void
}

export function CardCanvas({
  items = [],
  selectedId,
  activeDissolveId,
  vanishedIds,
  pendingDissolveIds,
  previewClosingIds = new Set(),
  dissolveDoneCount = 0,
  dissolvePhase = 'idle',
  upcomingDissolveId = null,
  layoutFrozen,
  layoutAnimating,
  isAgeDragging = false,
  phaseLabel,
  onSelect,
  onDissolveComplete,
}: Props) {
  const sorted = layoutFrozen
    ? items
    : [...items].sort((a, b) => {
        const order: WindowStatus[] = ['open', 'closing', 'upcoming', 'closed']
        return order.indexOf(a.status) - order.indexOf(b.status)
      })

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      {phaseLabel && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 shrink-0 rounded-lg border border-stone-200/90 bg-stone-50 px-3 py-2 text-center text-xs font-medium text-stone-700"
        >
          {phaseLabel}
        </motion.div>
      )}

      {sorted.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-white/40 p-8 text-center text-sm text-stone-500">
          当前筛选下没有匹配的窗口
        </div>
      ) : (
        <div
          className="grid flex-1 min-h-0 gap-1.5 overflow-y-auto p-0.5 content-start [scrollbar-width:thin]"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(${sorted.length > 28 ? '8.25rem' : '9.5rem'}, 1fr))`,
            gridAutoRows: sorted.length > 28 ? 'minmax(5rem, 1fr)' : 'minmax(5.5rem, 1fr)',
          }}
        >
          <AnimatePresence mode={layoutFrozen || isAgeDragging ? 'sync' : 'popLayout'}>
            {sorted.map((item) => {
              const isVanished = vanishedIds.has(item.id)
              const isActive = activeDissolveId === item.id
              const isWaiting =
                dissolvePhase === 'dissolving' &&
                pendingDissolveIds.has(item.id) &&
                !isVanished &&
                !isActive
              const isPausedNext =
                dissolvePhase === 'queued' && upcomingDissolveId === item.id

              if (isVanished) {
                return (
                  <div
                    key={item.id}
                    className="min-h-[5.5rem] w-full"
                    aria-hidden
                  />
                )
              }

              const card = (
                <CompactCard
                  opportunity={item}
                  status={item.status}
                  selected={selectedId === item.id}
                  onSelect={() => onSelect(item.id)}
                  dissolving={isActive}
                  waitingDissolve={isWaiting}
                  previewClosing={previewClosingIds.has(item.id)}
                  pausedNext={isPausedNext}
                  layoutEnabled={!layoutFrozen}
                  layoutAnimating={layoutAnimating && !isAgeDragging}
                  suppressMotion={isAgeDragging}
                />
              )

              if (isActive) {
                return (
                  <SoulDissolveWrapper
                    key={item.id}
                    seed={item.id}
                    duration={
                      dissolveDoneCount === 0
                        ? FIRST_DISSOLVE_DURATION
                        : DEFAULT_DISSOLVE_DURATION
                    }
                    onComplete={() => onDissolveComplete(item.id)}
                  >
                    {card}
                  </SoulDissolveWrapper>
                )
              }

              return (
                <motion.div
                  key={item.id}
                  layout={!layoutFrozen && layoutAnimating && !isAgeDragging}
                  className="h-full w-full"
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                >
                  {card}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
