import { Info } from 'lucide-react'
import type { Opportunity, WindowStatus } from '../types'
import { CATEGORY_LABELS, IMPORTANCE_LABELS } from '../types'
import { CATEGORY_ICONS, STATUS_STYLES } from '../lib/category-style'
import { cn } from '../lib/cn'
import { formatAgeRange } from '../utils/status'

const IMPORTANCE_TAG: Record<string, string> = {
  critical: 'bg-rose-50 text-rose-700 ring-rose-100',
  high: 'bg-amber-50 text-amber-800 ring-amber-100',
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
  const styles = STATUS_STYLES[status]
  const altLabel = status === 'closed' ? '补救与替代' : '若错过，仍可'

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
            status === 'open' && 'bg-emerald-50 text-emerald-600',
            status === 'closing' && 'bg-amber-50 text-amber-600',
            status === 'closed' && 'bg-stone-100 text-stone-500',
            status === 'upcoming' && 'bg-sky-50 text-sky-600',
          )}
        >
          <Icon className="h-6 w-6" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-serif text-xl font-semibold leading-snug text-stone-900">
            {title}
          </h2>
          <span
            className={cn(
              'mt-2 inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold',
              styles.badge,
            )}
          >
            {styles.label}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-md bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
          {CATEGORY_LABELS[category]}
        </span>
        <span
          className={cn(
            'rounded-md px-2 py-0.5 text-xs font-medium ring-1',
            IMPORTANCE_TAG[importance],
          )}
        >
          {IMPORTANCE_LABELS[importance]}
        </span>
        <span className="rounded-md bg-stone-50 px-2 py-0.5 text-xs text-stone-500 ring-1 ring-stone-100">
          最佳 {formatAgeRange(window.best)} · 仍可期至 {window.still[1]} 岁
        </span>
      </div>

      <p className="text-sm leading-relaxed text-stone-600">{description}</p>

      {note && (
        <div className="flex gap-2 rounded-xl bg-amber-50/90 px-3 py-2.5 text-sm text-amber-900/90 ring-1 ring-amber-100">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
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
                className="text-sm leading-relaxed text-stone-600 before:mr-2 before:font-bold before:text-amber-500 before:content-['·']"
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
