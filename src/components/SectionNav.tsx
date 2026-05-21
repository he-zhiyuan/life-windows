import type { SummaryItem } from './SummaryStrip'
import { cn } from '../lib/cn'

const TONE_DOT: Record<SummaryItem['tone'], string> = {
  open: 'bg-emerald-500',
  closing: 'bg-orange-500',
  closed: 'bg-stone-400',
  upcoming: 'bg-blue-500',
  neutral: 'bg-stone-400',
}

type Props = {
  items: SummaryItem[]
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function SectionNav({ items }: Props) {
  const visible = items.filter((i) => i.value > 0 || i.tone !== 'neutral')

  if (visible.length === 0) return null

  return (
    <nav
      className="mb-8 hidden rounded-xl border border-stone-200/60 bg-white/60 p-2 lg:block"
      aria-label="页面目录"
    >
      <ul className="flex flex-col gap-0.5">
        {visible.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => scrollTo(item.id)}
              disabled={item.value === 0}
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors',
                item.value > 0
                  ? 'cursor-pointer text-stone-700 hover:bg-stone-100/80'
                  : 'cursor-default text-stone-400',
              )}
            >
              <span className="flex items-center gap-2">
                <span className={cn('h-2 w-2 rounded-full', TONE_DOT[item.tone])} />
                {item.label}
              </span>
              <span className="tabular-nums text-stone-500">{item.value}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
