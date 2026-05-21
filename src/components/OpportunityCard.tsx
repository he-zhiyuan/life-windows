import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Info } from 'lucide-react'
import { useState } from 'react'
import type { Opportunity, WindowStatus } from '../types'
import { CATEGORY_LABELS, IMPORTANCE_LABELS } from '../types'
import {
  CATEGORY_ICONS,
  CATEGORY_TAG_CLASS,
  CLOSED_CARD_OVERLAY,
  STATUS_CARD_STYLES,
} from '../lib/category-style'
import { cn } from '../lib/cn'
import { formatAgeRange } from '../utils/status'

type Props = {
  opportunity: Opportunity
  status: WindowStatus
  index?: number
  dissolving?: boolean
}

const IMPORTANCE_TAG: Record<string, string> = {
  critical: 'bg-red-50 text-red-700 ring-red-100',
  high: 'bg-orange-50 text-orange-800 ring-orange-100',
  medium: 'bg-stone-50 text-stone-600 ring-stone-100',
}

export function OpportunityCard({ opportunity, status, index = 0, dissolving }: Props) {
  const { window, title, description, alternatives, note, category, importance } =
    opportunity
  const Icon = CATEGORY_ICONS[category]
  const card = STATUS_CARD_STYLES[status]
  const [descExpanded, setDescExpanded] = useState(false)
  const [altExpanded, setAltExpanded] = useState(false)

  const hasLongDesc = description.length > 72
  const altLabel = status === 'closed' ? '补救与替代' : '若错过，仍可'
  const closed = status === 'closed' && !dissolving

  return (
    <motion.article
      layout={!dissolving}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.3 }}
      className={cn(
        'rounded-xl border border-stone-200/90 border-l-[3px] p-4 transition-shadow sm:p-5',
        card.border,
        card.bg,
        closed && CLOSED_CARD_OVERLAY,
        !dissolving && 'hover:shadow-[0_2px_8px_rgba(15,15,15,0.06)]',
        dissolving && 'pointer-events-none',
      )}
    >
      <div className="flex gap-3 sm:gap-4">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg sm:h-11 sm:w-11',
            card.iconBg,
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
            <h3 className={cn('font-medium leading-snug', card.title)}>{title}</h3>
            <span
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium sm:text-[11px]',
                card.badge,
              )}
            >
              <span className={cn('h-1.5 w-1.5 rounded-full', card.dot)} />
              {card.label}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className={cn(CATEGORY_TAG_CLASS, 'text-[11px]', closed && 'bg-stone-100')}>
              <Icon className="h-3 w-3 shrink-0 opacity-80" strokeWidth={2} />
              {CATEGORY_LABELS[category]}
            </span>
            <span
              className={cn(
                'rounded-md px-2 py-0.5 text-[11px] font-medium ring-1',
                closed ? 'bg-stone-100 text-stone-500 ring-stone-200/80' : IMPORTANCE_TAG[importance],
              )}
            >
              {IMPORTANCE_LABELS[importance]}
            </span>
            <span className="rounded-md bg-white/70 px-2 py-0.5 text-[11px] text-stone-500 ring-1 ring-stone-200/80">
              {formatAgeRange(window.best)} · 至 {window.still[1]} 岁
            </span>
          </div>

          <p
            className={cn(
              'mt-2.5 text-sm leading-relaxed',
              card.body,
              !descExpanded && hasLongDesc && 'line-clamp-2',
            )}
          >
            {description}
          </p>
          {hasLongDesc && (
            <button
              type="button"
              onClick={() => setDescExpanded((v) => !v)}
              className="mt-1 cursor-pointer text-xs font-medium text-stone-600 underline-offset-2 hover:text-stone-900 hover:underline"
            >
              {descExpanded ? '收起说明' : '展开说明'}
            </button>
          )}

          {note && (
            <div className="mt-2.5 flex gap-2 rounded-lg bg-white/80 px-2.5 py-2 text-xs text-stone-700 ring-1 ring-stone-200/80 sm:text-sm">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-stone-500" />
              <p>{note}</p>
            </div>
          )}

          {alternatives.length > 0 && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setAltExpanded((v) => !v)}
                className="flex w-full cursor-pointer items-center justify-between rounded-lg bg-white/80 px-3 py-2 text-left text-xs font-medium text-stone-600 ring-1 ring-stone-200/80 transition-colors hover:bg-stone-50"
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
                    <div className="space-y-1.5 rounded-b-lg border-x border-b border-stone-200/80 bg-white/60 px-3 py-2.5">
                      {alternatives.map((a, i) => (
                        <li
                          key={i}
                          className={cn(
                            'text-sm leading-relaxed text-stone-600 before:mr-2 before:font-bold before:text-stone-400 before:content-["·"]',
                          )}
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
