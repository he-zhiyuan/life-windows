import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Opportunity, WindowStatus } from '../types'
import { OpportunityDetail } from './OpportunityDetail'

type Props = {
  opportunity: Opportunity | null
  status: WindowStatus | null
  onClose: () => void
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return isDesktop
}

export function DetailOverlay({ opportunity, status, onClose }: Props) {
  const open = opportunity != null && status != null
  const isDesktop = useIsDesktop()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const panelMotion = isDesktop
    ? { initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 24 } }
    : { initial: { opacity: 0, y: '100%' }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: '100%' } }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 cursor-pointer bg-stone-900/30 backdrop-blur-[2px] lg:bg-stone-900/15"
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            {...panelMotion}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[min(92dvh,100%)] w-full flex-col rounded-t-2xl border-t border-stone-200/80 bg-white shadow-2xl pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:bottom-auto lg:max-h-full lg:max-w-md lg:rounded-none lg:border-l lg:border-t-0 lg:pb-0"
            role="dialog"
            aria-modal="true"
            aria-label="窗口详情"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-stone-100 px-4 py-3 sm:px-5 sm:py-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                详情
              </span>
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-lg p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800"
                aria-label="关闭"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5">
              <OpportunityDetail opportunity={opportunity} status={status} />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
