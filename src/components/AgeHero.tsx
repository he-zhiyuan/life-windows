import { motion } from 'framer-motion'
type Props = {
  age: number
  rangeMode: boolean
  rangeStart: number
  rangeEnd: number
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

export function AgeHero({ age, rangeMode, rangeStart, rangeEnd }: Props) {
  const displayAge = rangeMode ? Math.round((rangeStart + rangeEnd) / 2) : age
  const percent = (displayAge / 80) * 100

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-800 to-stone-900 px-6 py-8 text-white shadow-xl shadow-stone-900/20">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(circle at 70% 20%, rgba(251,191,36,0.4), transparent 50%)',
        }}
      />

      <div className="relative flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-400">
            {rangeMode ? '探索区间' : '当前年龄'}
          </p>
          {rangeMode ? (
            <motion.p
              key={`${rangeStart}-${rangeEnd}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 font-serif text-4xl font-semibold tabular-nums sm:text-5xl"
            >
              {rangeStart}
              <span className="mx-2 text-stone-500">—</span>
              {rangeEnd}
              <span className="ml-2 text-2xl font-sans font-normal text-stone-400">
                岁
              </span>
            </motion.p>
          ) : (
            <motion.p
              key={age}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-1 font-serif text-5xl font-semibold tabular-nums sm:text-6xl"
            >
              {age}
              <span className="ml-2 text-2xl font-sans font-normal text-stone-400">
                岁
              </span>
            </motion.p>
          )}
          <p className="mt-2 text-sm text-stone-400">
            {rangeMode ? '区间内的人生窗口一览' : getPhase(age)}
          </p>
        </div>

        <div className="hidden text-right text-xs text-stone-500 sm:block">
          <div>0</div>
          <div className="mt-16">80</div>
        </div>
      </div>

      <div className="relative mt-6">
        <div className="h-1.5 overflow-hidden rounded-full bg-stone-700/80">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400"
            initial={false}
            animate={{ width: `${percent}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
        <motion.div
          className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white bg-amber-500 shadow-lg"
          initial={false}
          animate={{ left: `calc(${percent}% - 7px)` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
        <div className="mt-2 flex justify-between text-[10px] text-stone-500">
          <span>出生</span>
          <span>80 岁</span>
        </div>
      </div>
    </div>
  )
}
