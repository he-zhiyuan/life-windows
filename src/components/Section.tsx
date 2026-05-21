import { AnimatePresence } from 'framer-motion'
import { CircleDot } from 'lucide-react'
import type { Opportunity, WindowStatus } from '../types'
import { SECTION_STYLES } from '../lib/category-style'
import { cn } from '../lib/cn'
import { OpportunityCard } from './OpportunityCard'

type Item = Opportunity & { status: WindowStatus }

type Props = {
  title: string
  hint: string
  items: Item[]
  tone: WindowStatus
  emptyText?: string
}

export function Section({ title, hint, items, tone, emptyText }: Props) {
  const styles = SECTION_STYLES[tone]

  if (items.length === 0 && !emptyText) return null

  return (
    <section>
      <div className="mb-4 flex items-start gap-3">
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
            styles.iconBg,
          )}
        >
          <CircleDot className="h-4 w-4" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className={cn('font-serif text-xl font-semibold', styles.accent)}>
            {title}
            {items.length > 0 && (
              <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-2 text-sm font-sans font-medium text-stone-500 ring-1 ring-stone-200/80">
                {items.length}
              </span>
            )}
          </h2>
          <p className="mt-0.5 text-sm text-stone-500">{hint}</p>
        </div>
      </div>

      {items.length === 0 && emptyText ? (
        <p className="rounded-xl bg-stone-100/60 px-4 py-6 text-center text-sm text-stone-500">
          {emptyText}
        </p>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="flex flex-col gap-3">
            {items.map((item, i) => (
              <OpportunityCard
                key={item.id}
                opportunity={item}
                status={item.status}
                index={i}
              />
            ))}
          </div>
        </AnimatePresence>
      )}
    </section>
  )
}
