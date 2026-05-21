import { motion } from 'framer-motion'
import { ArrowRight, Info } from 'lucide-react'
import type { Opportunity, WindowStatus } from '../types'
import { CATEGORY_LABELS, IMPORTANCE_LABELS } from '../types'
import { CATEGORY_ICONS, STATUS_STYLES } from '../lib/category-style'
import { cn } from '../lib/cn'
import { formatAgeRange } from '../utils/status'

type Props = {
  opportunity: Opportunity
  status: WindowStatus
  index?: number
}

const IMPORTANCE_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high: 'bg-amber-500',
  medium: 'bg-stone-300',
}

export function OpportunityCard({ opportunity, status, index = 0 }: Props) {
  const { window, title, description, alternatives, note, category, importance } =
    opportunity
  const Icon = CATEGORY_ICONS[category]
  const styles = STATUS_STYLES[status]

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className={cn(
        'group rounded-2xl bg-white p-5 ring-1 transition-shadow duration-300 hover:shadow-lg hover:shadow-stone-900/5',
        styles.ring,
        status === 'closed' && 'opacity-90',
      )}
    >
      <div className="flex gap-4">
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
            status === 'open' && 'bg-emerald-50 text-emerald-600',
            status === 'closing' && 'bg-amber-50 text-amber-600',
            status === 'closed' && 'bg-stone-100 text-stone-500',
            status === 'upcoming' && 'bg-sky-50 text-sky-600',
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="font-medium leading-snug text-stone-900">{title}</h3>
            <span
              className={cn(
                'shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold',
                styles.badge,
              )}
            >
              {styles.label}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500">
            <span className="font-medium text-stone-600">
              {CATEGORY_LABELS[category]}
            </span>
            <span className="text-stone-300">·</span>
            <span className="inline-flex items-center gap-1">
              <span
                className={cn('h-1.5 w-1.5 rounded-full', IMPORTANCE_DOT[importance])}
              />
              {IMPORTANCE_LABELS[importance]}
            </span>
            <span className="text-stone-300">·</span>
            <span>
              最佳 {formatAgeRange(window.best)} → {window.still[1]} 岁
            </span>
          </div>

          <p className="mt-3 text-[15px] leading-relaxed text-stone-600">
            {description}
          </p>

          {note && (
            <div className="mt-3 flex gap-2 rounded-xl bg-amber-50/80 px-3 py-2.5 text-sm text-amber-900/90 ring-1 ring-amber-100">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <p>{note}</p>
            </div>
          )}

          {alternatives.length > 0 && (
            <div className="mt-4 border-t border-dashed border-stone-200 pt-4">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-stone-400">
                <ArrowRight className="h-3 w-3" />
                {status === 'closed' ? '补救与替代' : '若错过，仍可'}
              </p>
              <ul className="space-y-1.5">
                {alternatives.map((a, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm leading-relaxed text-stone-600 before:mt-2 before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-amber-400 before:content-['']"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  )
}
