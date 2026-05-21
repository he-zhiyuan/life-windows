import { Info } from 'lucide-react'
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

const IMPORTANCE_TAG: Record<string, string> = {
  critical: 'bg-red-50 text-red-700 ring-red-100',
  high: 'bg-orange-50 text-orange-800 ring-orange-100',
  medium: 'bg-stone-50 text-stone-600 ring-stone-100',
}

type Props = {
  opportunity: Opportunity
  status: WindowStatus
}

export function OpportunityDetail({ opportunity, status }: Props) {
  const { window, title, description, alternatives, note, category, importance } =
    opportunity
  const Icon = CATEGORY_ICONS[category]
  const card = STATUS_CARD_STYLES[status]
  const altLabel = status === 'closed' ? '补救与替代' : '若错过，仍可'
  const closed = status === 'closed'

  return (
    <div
      className={cn(
        'space-y-4 rounded-xl border border-stone-200/80 border-l-[3px] p-4',
        card.border,
        card.bg,
        closed && CLOSED_CARD_OVERLAY,
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg',
            card.iconBg,
          )}
        >
          <Icon className="h-6 w-6" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className={cn('font-serif text-xl font-semibold leading-snug', card.title)}>
            {title}
          </h2>
          <span
            className={cn(
              'mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
              card.badge,
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', card.dot)} />
            {card.label}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className={cn(CATEGORY_TAG_CLASS, 'text-xs', closed && 'bg-stone-100')}>
          <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" strokeWidth={2} />
          {CATEGORY_LABELS[category]}
        </span>
        <span
          className={cn(
            'rounded-md px-2 py-0.5 text-xs font-medium ring-1',
            closed ? 'bg-stone-100 text-stone-500 ring-stone-200/80' : IMPORTANCE_TAG[importance],
          )}
        >
          {IMPORTANCE_LABELS[importance]}
        </span>
        <span className="rounded-md bg-white/70 px-2 py-0.5 text-xs text-stone-500 ring-1 ring-stone-200/80">
          最佳 {formatAgeRange(window.best)} · 仍可期至 {window.still[1]} 岁
        </span>
      </div>

      <p className={cn('text-sm leading-relaxed', card.body)}>{description}</p>

      {note && (
        <div className="flex gap-2 rounded-lg bg-white/80 px-3 py-2.5 text-sm text-stone-700 ring-1 ring-stone-200/80">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-stone-500" />
          <p>{note}</p>
        </div>
      )}

      {alternatives.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
            {altLabel}
          </p>
          <ul className="space-y-2">
            {alternatives.map((a, i) => (
              <li
                key={i}
                className="text-sm leading-relaxed text-stone-600 before:mr-2 before:font-bold before:text-stone-400 before:content-['·']"
              >
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
