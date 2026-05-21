import { AnimatePresence } from 'framer-motion'
import { CircleDot } from 'lucide-react'
import type { Opportunity, WindowStatus } from '../types'
import { SECTION_STYLES } from '../lib/category-style'
import { cn } from '../lib/cn'
import { OpportunityCard } from './OpportunityCard'
import { SoulDissolveWrapper } from './SoulDissolveWrapper'

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
}: Props) {
  const styles = SECTION_STYLES[tone]

  if (items.length === 0 && !emptyText) return null

  return (
    <section id={id} className="scroll-mt-28">
      <div className="mb-3 flex items-start gap-3">
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
            styles.iconBg,
          )}
        >
          <CircleDot className="h-4 w-4" strokeWidth={2.5} />
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
              const isVanished = vanishedIds.has(item.id)
              const isActive = activeDissolveId === item.id
              const isWaiting =
                pendingDissolveIds.has(item.id) && !isVanished && !isActive

              if (isVanished) return null

              const card = (
                <OpportunityCard
                  opportunity={item}
                  status={item.status}
                  index={i}
                  dissolving={isActive}
                />
              )

              if (isActive && onDissolveComplete) {
                return (
                  <SoulDissolveWrapper
                    key={item.id}
                    seed={item.id}
                    onComplete={() => onDissolveComplete(item.id)}
                  >
                    {card}
                  </SoulDissolveWrapper>
                )
              }

              return (
                <div
                  key={item.id}
                  className={cn(isWaiting && 'opacity-75')}
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
