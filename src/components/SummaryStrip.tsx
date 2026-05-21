import type { WindowStatus } from '../types'
import { cn } from '../lib/cn'

export type SummaryItem = {
  id: string
  label: string
  value: number
  tone: WindowStatus | 'neutral'
}

const TONE_DOT: Record<SummaryItem['tone'], string> = {
  open: 'bg-emerald-500',
  closing: 'bg-orange-500',
  closed: 'bg-stone-400',
  upcoming: 'bg-blue-500',
  neutral: 'bg-stone-400',
}

const PILL_BASE =
  'bg-white text-stone-700 ring-stone-200/90 hover:bg-stone-50'
const PILL_STATIC = 'bg-white text-stone-700 ring-stone-200/90'

type Props = {
  items: SummaryItem[]
  summary: string
  interactive?: boolean
  /** 侧栏等窄区域：纵向铺满，避免横向裁切 */
  layout?: 'row' | 'stack'
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function SummaryStrip({
  items,
  summary,
  interactive = true,
  layout = 'row',
}: Props) {
  const stacked = layout === 'stack'

  return (
    <div className="min-w-0 space-y-2" role="status">
      <div
        className={cn(
          stacked
            ? 'flex flex-col gap-1.5'
            : 'flex flex-wrap gap-2',
        )}
      >
        {items.map((item) => {
          const pillClass = cn(
            'flex items-center ring-1 transition-colors',
            stacked
              ? 'w-full justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium'
              : 'shrink-0 gap-2 rounded-full px-3 py-1.5 text-sm font-medium',
            interactive ? PILL_BASE : PILL_STATIC,
            interactive && item.value > 0 && 'cursor-pointer',
            (!interactive || item.value === 0) && 'cursor-default',
            item.value === 0 && 'opacity-50',
          )
          const content = stacked ? (
            <>
              <span className="flex min-w-0 items-center gap-2">
                <span className={cn('h-2 w-2 shrink-0 rounded-full', TONE_DOT[item.tone])} />
                <span className="truncate">{item.label}</span>
              </span>
              <span className="shrink-0 text-lg font-semibold tabular-nums leading-none">
                {item.value}
              </span>
            </>
          ) : (
            <>
              <span className={cn('h-2 w-2 shrink-0 rounded-full', TONE_DOT[item.tone])} />
              <span className="text-lg font-semibold tabular-nums leading-none">{item.value}</span>
              <span className="text-xs text-stone-500">{item.label}</span>
            </>
          )

          if (!interactive) {
            return (
              <div key={item.id} className={pillClass}>
                {content}
              </div>
            )
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => item.value > 0 && scrollToSection(item.id)}
              disabled={item.value === 0}
              className={pillClass}
            >
              {content}
            </button>
          )
        })}
      </div>
      <p className="text-xs leading-relaxed text-balance text-stone-500">{summary}</p>
    </div>
  )
}
