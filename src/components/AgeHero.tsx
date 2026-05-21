import { motion } from 'framer-motion'
import { cn } from '../lib/cn'

type Props = {
  age: number
  rangeMode: boolean
  rangeStart: number
  rangeEnd: number
  compact?: boolean
}

const LIFE_PHASES = [
  { until: 6, label: '婴幼儿' },
  { until: 12, label: '童年' },
  { until: 18, label: '少年' },
  { until: 30, label: '青年' },
  { until: 50, label: '中年' },
  { until: 80, label: '中老年' },
]

function getPhase(age: number) {
  return LIFE_PHASES.find((p) => age <= p.until)?.label ?? '人生'
}

export function AgeHero({ age, rangeMode, rangeStart, rangeEnd, compact }: Props) {
  const displayAge = rangeMode ? Math.round((rangeStart + rangeEnd) / 2) : age
  const percent = (displayAge / 80) * 100

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-800 to-stone-900 text-white shadow-xl shadow-stone-900/20',
        compact ? 'px-4 py-4' : 'px-6 py-8',
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(circle at 70% 20%, rgba(251,191,36,0.4), transparent 50%)',
        }}
      />

      <div className="relative">
        <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-stone-400">
          {rangeMode ? '探索区间' : '当前年龄'}
        </p>
        {rangeMode ? (
          <motion.p
            key={`${rangeStart}-${rangeEnd}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'mt-0.5 font-serif font-semibold tabular-nums',
              compact ? 'text-2xl' : 'text-4xl sm:text-5xl',
            )}
          >
            {rangeStart}—{rangeEnd}
            <span className="ml-1 font-sans text-base font-normal text-stone-400">
              岁
            </span>
          </motion.p>
        ) : (
          <motion.p
            key={age}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'mt-0.5 font-serif font-semibold tabular-nums',
              compact ? 'text-3xl' : 'text-5xl sm:text-6xl',
            )}
          >
            {age}
            <span className="ml-1 font-sans text-base font-normal text-stone-400">
              岁
            </span>
          </motion.p>
        )}
        <p className={cn('text-stone-400', compact ? 'mt-1 text-xs' : 'mt-2 text-sm')}>
          {rangeMode ? '区间一览' : getPhase(age)}
        </p>
      </div>

      <div className={cn('relative', compact ? 'mt-3' : 'mt-6')}>
        <div className="h-1 overflow-hidden rounded-full bg-stone-700/80">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400"
            initial={false}
            animate={{ width: `${percent}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
        <motion.div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-amber-500 shadow-lg',
            compact ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5',
          )}
          initial={false}
          animate={{ left: `calc(${percent}% - ${compact ? 5 : 7}px)` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  )
}
