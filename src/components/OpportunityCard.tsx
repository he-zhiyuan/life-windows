import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Info } from 'lucide-react'
import { useState } from 'react'
import type { Opportunity, WindowStatus } from '../types'
import { CATEGORY_LABELS, IMPORTANCE_LABELS } from '../types'
import { CATEGORY_ICONS, STATUS_STYLES } from '../lib/category-style'
import { cn } from '../lib/cn'
import { formatAgeRange } from '../utils/status'

type Props = {
  opportunity: Opportunity
  status: WindowStatus
  index?: number
  dissolving?: boolean
}

const IMPORTANCE_TAG: Record<string, string> = {
  critical: 'bg-rose-50 text-rose-700 ring-rose-100',
  high: 'bg-amber-50 text-amber-800 ring-amber-100',
  medium: 'bg-stone-50 text-stone-600 ring-stone-100',
}

export function OpportunityCard({ opportunity, status, index = 0, dissolving }: Props) {
  const { window, title, description, alternatives, note, category, importance } =
    opportunity
  const Icon = CATEGORY_ICONS[category]
  const styles = STATUS_STYLES[status]
  const [descExpanded, setDescExpanded] = useState(false)
  const [altExpanded, setAltExpanded] = useState(false)

  const hasLongDesc = description.length > 72
  const altLabel = status === 'closed' ? '补救与替代' : '若错过，仍可'

  return (
    <motion.article
      layout={!dissolving}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.3 }}
      className={cn(
        'rounded-2xl bg-white p-4 ring-1 transition-shadow sm:p-5',
        styles.ring,
        status === 'closed' && !dissolving && 'opacity-92',
        !dissolving && 'hover:shadow-md hover:shadow-stone-900/5',
        dissolving && 'pointer-events-none',
      )}
    >
      <div className="flex gap-3 sm:gap-4">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11',
            status === 'open' && 'bg-emerald-50 text-emerald-600',
            status === 'closing' && 'bg-amber-50 text-amber-600',
            status === 'closed' && 'bg-stone-100 text-stone-500',
            status === 'upcoming' && 'bg-sky-50 text-sky-600',
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
            <h3 className="font-medium leading-snug text-stone-900">{title}</h3>
            <span
              className={cn(
                'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:text-[11px]',
                styles.badge,
              )}
            >
              {styles.label}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600">
              {CATEGORY_LABELS[category]}
            </span>
            <span
              className={cn(
                'rounded-md px-2 py-0.5 text-[11px] font-medium ring-1',
                IMPORTANCE_TAG[importance],
              )}
            >
              {IMPORTANCE_LABELS[importance]}
            </span>
            <span className="rounded-md bg-stone-50 px-2 py-0.5 text-[11px] text-stone-500 ring-1 ring-stone-100">
              {formatAgeRange(window.best)} · 至 {window.still[1]} 岁
            </span>
          </div>

          <p
            className={cn(
              'mt-2.5 text-sm leading-relaxed text-stone-600',
              !descExpanded && hasLongDesc && 'line-clamp-2',
            )}
          >
            {description}
          </p>
          {hasLongDesc && (
            <button
              type="button"
              onClick={() => setDescExpanded((v) => !v)}
              className="mt-1 text-xs font-medium text-amber-700 hover:text-amber-800"
            >
              {descExpanded ? '收起说明' : '展开说明'}
            </button>
          )}

          {note && (
            <div className="mt-2.5 flex gap-2 rounded-lg bg-amber-50/90 px-2.5 py-2 text-xs text-amber-900/90 ring-1 ring-amber-100 sm:text-sm">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
              <p>{note}</p>
            </div>
          )}

          {alternatives.length > 0 && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setAltExpanded((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg bg-stone-50 px-3 py-2 text-left text-xs font-medium text-stone-600 ring-1 ring-stone-100 transition-colors hover:bg-stone-100/80"
              >
                <span>{altLabel}</span>
                <span className="flex items-center gap-1 text-stone-400">
                  {alternatives.length} 条
                  <ChevronDown
                    className={cn('h-4 w-4 transition-transform', altExpanded && 'rotate-180')}
                  />
                </span>
              </button>
              <AnimatePresence>
                {altExpanded && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-1.5 border-x border-b border-stone-100 rounded-b-lg px-3 py-2.5">
                      {alternatives.map((a, i) => (
                        <li
                          key={i}
                          className="text-sm leading-relaxed text-stone-600 before:mr-2 before:text-amber-500 before:content-['·']"
                        >
                          {a}
                        </li>
                      ))}
                    </div>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  )
}
