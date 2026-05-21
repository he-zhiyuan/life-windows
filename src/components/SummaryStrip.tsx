import type { WindowStatus } from '../types'
import { cn } from '../lib/cn'

export type SummaryItem = {
  id: string
  label: string
  value: number
  tone: WindowStatus | 'neutral'
}

const TONE_STYLES: Record<SummaryItem['tone'], string> = {
  open: 'bg-emerald-50 text-emerald-800 ring-emerald-200/80 hover:bg-emerald-100',
  closing: 'bg-amber-50 text-amber-900 ring-amber-200/80 hover:bg-amber-100',
  closed: 'bg-stone-100 text-stone-600 ring-stone-200/80 hover:bg-stone-200/60',
  upcoming: 'bg-sky-50 text-sky-800 ring-sky-200/80 hover:bg-sky-100',
  neutral: 'bg-stone-50 text-stone-700 ring-stone-200/80 hover:bg-stone-100',
}

const TONE_STYLES_STATIC: Record<SummaryItem['tone'], string> = {
  open: 'bg-emerald-50 text-emerald-800 ring-emerald-200/80',
  closing: 'bg-amber-50 text-amber-900 ring-amber-200/80',
  closed: 'bg-stone-100 text-stone-600 ring-stone-200/80',
  upcoming: 'bg-sky-50 text-sky-800 ring-sky-200/80',
  neutral: 'bg-stone-50 text-stone-700 ring-stone-200/80',
}

type Props = {
  items: SummaryItem[]
  summary: string
  /** 为 false 时仅展示统计，不可点击（桌面侧栏） */
  interactive?: boolean
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function SummaryStrip({ items, summary, interactive = true }: Props) {
  return (
    <div className="space-y-2" role="status">
      <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const pillClass = cn(
            'flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition-colors',
            interactive ? TONE_STYLES[item.tone] : TONE_STYLES_STATIC[item.tone],
            interactive && item.value > 0 && 'cursor-pointer',
            (!interactive || item.value === 0) && 'cursor-default',
            item.value === 0 && 'opacity-50',
          )
          const content = (
            <>
              <span className="text-lg font-semibold tabular-nums leading-none">{item.value}</span>
              <span className="text-xs">{item.label}</span>
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
      <p className="text-xs leading-relaxed text-stone-500">{summary}</p>
    </div>
  )
}
