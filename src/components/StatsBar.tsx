import { motion } from 'framer-motion'
import { cn } from '../lib/cn'

type Stat = {
  label: string
  value: number
  tone: 'open' | 'closing' | 'closed' | 'upcoming' | 'neutral'
}

const TONE_CLASS: Record<Stat['tone'], string> = {
  open: 'from-emerald-50 to-white text-emerald-800 ring-emerald-100',
  closing: 'from-amber-50 to-white text-amber-900 ring-amber-100',
  closed: 'from-stone-100 to-white text-stone-600 ring-stone-200',
  upcoming: 'from-sky-50 to-white text-sky-800 ring-sky-100',
  neutral: 'from-white to-stone-50 text-stone-700 ring-stone-200/80',
}

type Props = {
  stats: Stat[]
  summary: string
}

export function StatsBar({ stats, summary }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-3"
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * i }}
            className={cn(
              'rounded-xl bg-gradient-to-b p-3 ring-1',
              TONE_CLASS[s.tone],
            )}
          >
            <p className="text-2xl font-semibold tabular-nums">{s.value}</p>
            <p className="mt-0.5 text-xs text-stone-500">{s.label}</p>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-sm text-stone-500" role="status">
        {summary}
      </p>
    </motion.div>
  )
}
