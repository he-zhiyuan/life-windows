import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import type { Opportunity, WindowStatus } from '../types'
import { OpportunityDetail } from './OpportunityDetail'

type Props = {
  opportunity: Opportunity | null
  status: WindowStatus | null
  onClose: () => void
}

export function DetailOverlay({ opportunity, status, onClose }: Props) {
  const open = opportunity != null && status != null

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-stone-900/25 backdrop-blur-[2px] lg:bg-stone-900/15"
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-stone-200/80 bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="窗口详情"
          >
            <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                详情
              </span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800"
                aria-label="关闭"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <OpportunityDetail opportunity={opportunity} status={status} />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
