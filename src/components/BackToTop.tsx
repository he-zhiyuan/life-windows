import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'

const SHOW_AFTER_PX = 360

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 10, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.92 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="回到顶部"
          className="fixed right-4 z-30 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-stone-200/90 bg-white text-stone-700 shadow-[0_4px_16px_rgba(15,15,15,0.12)] transition-[box-shadow,transform] hover:bg-stone-50 hover:shadow-[0_6px_20px_rgba(15,15,15,0.16)] active:scale-95 lg:hidden"
          style={{ bottom: 'max(1.25rem, env(safe-area-inset-bottom, 0px))' }}
        >
          <ArrowUp className="h-5 w-5" strokeWidth={2} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
