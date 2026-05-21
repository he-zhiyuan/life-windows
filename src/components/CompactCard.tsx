import { motion } from 'framer-motion'
import type { Opportunity, WindowStatus } from '../types'
import { CATEGORY_ICONS, STATUS_STYLES } from '../lib/category-style'
import { cn } from '../lib/cn'

type Props = {
  opportunity: Opportunity
  status: WindowStatus
  selected?: boolean
  dissolving?: boolean
  waitingDissolve?: boolean
  previewClosing?: boolean
  /** 松手后等待期内，下一张即将隐藏的卡片 */
  pausedNext?: boolean
  layoutEnabled?: boolean
  layoutAnimating?: boolean
  onSelect: () => void
}

const STATUS_BORDER: Record<WindowStatus, string> = {
  open: 'border-t-emerald-500',
  closing: 'border-t-amber-500',
  closed: 'border-t-stone-400',
  upcoming: 'border-t-sky-500',
}

function brief(text: string, max = 36) {
  return text.length <= max ? text : `${text.slice(0, max)}…`
}

export function CompactCard({
  opportunity,
  status,
  selected,
  dissolving,
  waitingDissolve,
  previewClosing,
  pausedNext,
  layoutEnabled = true,
  layoutAnimating = false,
  onSelect,
}: Props) {
  const { title, description, category } = opportunity
  const Icon = CATEGORY_ICONS[category]
  const styles = STATUS_STYLES[status]

  return (
    <motion.button
      type="button"
      layout={layoutEnabled && !dissolving}
      transition={
        layoutAnimating
          ? { type: 'spring', stiffness: 320, damping: 28 }
          : { duration: 0.22 }
      }
      onClick={dissolving || waitingDissolve ? undefined : onSelect}
      disabled={dissolving || waitingDissolve}
      initial={layoutEnabled ? { opacity: 0, scale: 0.92 } : false}
      animate={{ opacity: 1, scale: 1 }}
      exit={layoutEnabled ? { opacity: 0, scale: 0.88 } : undefined}
      className={cn(
        'flex h-full min-h-[5.5rem] w-full flex-col rounded-xl border border-stone-200/80 border-t-[3px] bg-white p-2.5 text-left shadow-sm transition-shadow',
        STATUS_BORDER[status],
        selected && 'ring-2 ring-amber-500/60 ring-offset-1',
        status === 'closed' && !dissolving && 'opacity-80',
        waitingDissolve && 'opacity-70 ring-1 ring-stone-300/50',
        previewClosing &&
          'ring-2 ring-amber-400/70 ring-offset-1 shadow-[0_0_12px_rgba(251,191,36,0.35)]',
        pausedNext &&
          'ring-2 ring-amber-500/80 ring-offset-2 shadow-[0_0_16px_rgba(245,158,11,0.45)]',
        (dissolving || waitingDissolve) && 'pointer-events-none cursor-not-allowed',
        !dissolving &&
          !waitingDissolve &&
          'cursor-pointer hover:shadow-md hover:shadow-stone-900/8',
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <div
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
            status === 'open' && 'bg-emerald-50 text-emerald-600',
            status === 'closing' && 'bg-amber-50 text-amber-600',
            status === 'closed' && 'bg-stone-100 text-stone-500',
            status === 'upcoming' && 'bg-sky-50 text-sky-600',
          )}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={2} />
        </div>
        <span
          className={cn(
            'rounded px-1.5 py-0.5 text-[9px] font-semibold leading-none',
            styles.badge,
          )}
        >
          {styles.label.slice(0, 4)}
        </span>
      </div>

      <h3 className="mt-1.5 line-clamp-2 text-xs font-semibold leading-tight text-stone-900">
        {title}
      </h3>
      <p className="mt-1 line-clamp-2 flex-1 text-[10px] leading-snug text-stone-500">
        {brief(description)}
      </p>
    </motion.button>
  )
}
