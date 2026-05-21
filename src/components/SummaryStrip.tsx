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

type Props = {
  items: SummaryItem[]
  summary: string
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function SummaryStrip({ items, summary }: Props) {
  return (
    <div className="space-y-2" role="status">
      <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => item.value > 0 && scrollToSection(item.id)}
            disabled={item.value === 0}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition-colors',
              TONE_STYLES[item.tone],
              item.value === 0 && 'cursor-default opacity-50',
            )}
          >
            <span className="text-lg font-semibold tabular-nums leading-none">{item.value}</span>
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
      <p className="text-xs leading-relaxed text-stone-500">{summary}</p>
    </div>
  )
}
