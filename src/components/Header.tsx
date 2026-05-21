import { motion } from 'framer-motion'
import { Hourglass } from 'lucide-react'

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="text-center"
    >
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-stone-200/90 bg-stone-50">
        <Hourglass className="h-7 w-7 text-stone-700" strokeWidth={1.5} />
      </div>
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
        时光窗口
      </h1>
      <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-stone-500">
        人生许多选择，窗口只开一次。
        <br className="hidden sm:block" />
        拖动年龄，看清开放、将关与已过的路径。
      </p>
    </motion.header>
  )
}
