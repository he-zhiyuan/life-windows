import { motion } from 'framer-motion'
import type { Opportunity, WindowStatus } from '../types'
import {
  CATEGORY_ICONS,
  CLOSED_CARD_OVERLAY,
  STATUS_CARD_STYLES,
} from '../lib/category-style'
import { cn } from '../lib/cn'

type Props = {
  opportunity: Opportunity
  status: WindowStatus
  selected?: boolean
  dissolving?: boolean
  waitingDissolve?: boolean
  previewClosing?: boolean
  pausedNext?: boolean
  layoutEnabled?: boolean
  layoutAnimating?: boolean
  suppressMotion?: boolean
  onSelect: () => void
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
  suppressMotion = false,
  onSelect,
}: Props) {
  const motionOn = layoutEnabled && !suppressMotion
  const { title, description, category } = opportunity
  const Icon = CATEGORY_ICONS[category]
  const card = STATUS_CARD_STYLES[status]
  const closed = status === 'closed' && !dissolving

  return (
    <motion.button
      type="button"
      layout={motionOn && !dissolving}
      transition={
        layoutAnimating && !suppressMotion
          ? { type: 'spring', stiffness: 320, damping: 28 }
          : { duration: 0.22 }
      }
      onClick={dissolving || waitingDissolve ? undefined : onSelect}
      disabled={dissolving || waitingDissolve}
      initial={false}
      animate={{ opacity: 1, scale: 1 }}
      exit={motionOn ? { opacity: 0, scale: 0.96 } : undefined}
      className={cn(
        'flex h-full min-h-[5.5rem] w-full flex-col rounded-lg border border-stone-200/90 border-l-[3px] p-2.5 text-left shadow-[0_1px_2px_rgba(15,15,15,0.04)] transition-shadow',
        card.border,
        card.bg,
        closed && CLOSED_CARD_OVERLAY,
        selected && cn('ring-2 ring-offset-1', card.ring),
        waitingDissolve && 'opacity-60',
        previewClosing && 'ring-2 ring-orange-400/50 ring-offset-1',
        pausedNext && 'ring-2 ring-stone-800/40 ring-offset-1',
        (dissolving || waitingDissolve) && 'pointer-events-none cursor-not-allowed',
        !dissolving &&
          !waitingDissolve &&
          'cursor-pointer hover:shadow-[0_2px_8px_rgba(15,15,15,0.08)]',
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <div
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-md',
            card.iconBg,
          )}
          title={category}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={2} />
        </div>
        <span
          className={cn(
            'flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-medium leading-none',
            card.badge,
          )}
        >
          <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', card.dot)} />
          {card.label.slice(0, 4)}
        </span>
      </div>

      <h3 className={cn('mt-1.5 line-clamp-2 text-xs font-semibold leading-tight', card.title)}>
        {title}
      </h3>
      <p className={cn('mt-1 line-clamp-2 flex-1 text-[10px] leading-snug', card.body)}>
        {brief(description)}
      </p>
    </motion.button>
  )
}
