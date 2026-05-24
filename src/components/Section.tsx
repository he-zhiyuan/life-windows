import { AnimatePresence } from 'framer-motion'
import { CircleDot } from 'lucide-react'
import type { DissolvePhase } from '../hooks/useDissolveSequence'
import type { Opportunity, WindowStatus } from '../types'
import { getDissolveItemState } from '../utils/dissolve-state'
import { SECTION_STYLES } from '../lib/category-style'
import { cn } from '../lib/cn'
import { OpportunityCard } from './OpportunityCard'
import {
  DEFAULT_DISSOLVE_DURATION,
  FIRST_DISSOLVE_DURATION,
  SoulDissolveWrapper,
} from './SoulDissolveWrapper'

type Item = Opportunity & { status: WindowStatus }

type Props = {
  id: string
  title: string
  hint: string
  items: Item[]
  tone: WindowStatus
  emptyText?: string
  activeDissolveId?: string | null
  vanishedIds?: Set<string>
  pendingDissolveIds?: Set<string>
  onDissolveComplete?: (id: string) => void
  dissolveDoneCount?: number
  dissolvePhase?: DissolvePhase
  upcomingDissolveId?: string | null
  onSelectItem?: (id: string) => void
}

export function Section({
  id,
  title,
  hint,
  items,
  tone,
  emptyText,
  activeDissolveId = null,
  vanishedIds = new Set(),
  pendingDissolveIds = new Set(),
  onDissolveComplete,
  dissolveDoneCount = 0,
  dissolvePhase = 'idle',
  upcomingDissolveId = null,
  onSelectItem,
}: Props) {
  const styles = SECTION_STYLES[tone]

  if (items.length === 0 && !emptyText) return null

  return (
    <section id={id} className="scroll-mt-28">
      <div className="mb-3 flex items-start gap-3">
        <div
          className={cn(
            'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
            styles.iconBg,
          )}
        >
          <CircleDot className="h-4 w-4" strokeWidth={2.5} />
          <span
            className={cn(
              'absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white',
              styles.dot,
            )}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className={cn('font-serif text-lg font-semibold sm:text-xl', styles.accent)}>
            {title}
            {items.length > 0 && (
              <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-2 text-sm font-sans font-medium text-stone-500 ring-1 ring-stone-200/80">
                {items.length}
              </span>
            )}
          </h2>
          <p className="mt-0.5 text-xs text-stone-500 sm:text-sm">{hint}</p>
        </div>
      </div>

      {items.length === 0 && emptyText ? (
        <p className="rounded-xl bg-stone-100/50 px-4 py-5 text-center text-sm text-stone-500">
          {emptyText}
        </p>
      ) : (
        <AnimatePresence mode="sync">
          <div className="flex flex-col gap-2.5">
            {items.map((item, i) => {
              const { isVanished, isActive, isWaiting, isPausedNext } =
                getDissolveItemState(
                  item.id,
                  dissolvePhase,
                  activeDissolveId,
                  vanishedIds,
                  pendingDissolveIds,
                  upcomingDissolveId,
                )

              if (isVanished) return null

              const card = (
                <OpportunityCard
                  opportunity={item}
                  status={item.status}
                  index={i}
                  dissolving={isActive}
                  onSelect={
                    onSelectItem && !isActive && !isWaiting
                      ? () => onSelectItem(item.id)
                      : undefined
                  }
                />
              )

              if (isActive && onDissolveComplete) {
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
                <div
                  key={item.id}
                  className={cn(
                    isWaiting && 'opacity-75',
                    isPausedNext &&
                      'rounded-xl ring-2 ring-stone-400/80 ring-offset-2',
                  )}
                >
                  {card}
                </div>
              )
            })}
          </div>
        </AnimatePresence>
      )}
    </section>
  )
}
