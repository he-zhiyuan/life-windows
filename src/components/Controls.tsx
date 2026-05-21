import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Filter, Layers, Sparkles } from 'lucide-react'
import type { Category } from '../types'
import { CATEGORY_LABELS } from '../types'
import { cn } from '../lib/cn'

type Props = {
  age: number
  onAgeChange: (age: number) => void
  rangeMode: boolean
  onRangeModeChange: (v: boolean) => void
  rangeStart: number
  rangeEnd: number
  onRangeStartChange: (v: number) => void
  onRangeEndChange: (v: number) => void
  category: Category | 'all'
  onCategoryChange: (c: Category | 'all') => void
  hideClosed: boolean
  onHideClosedChange: (v: boolean) => void
}

const categories = Object.entries(CATEGORY_LABELS) as [Category, string][]

function Toggle({
  checked,
  onChange,
  label,
  icon: Icon,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  icon: typeof Layers
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all',
        checked
          ? 'bg-stone-900 text-white shadow-md'
          : 'bg-stone-100/80 text-stone-600 hover:bg-stone-200/80',
      )}
    >
      <Icon className="h-4 w-4 shrink-0 opacity-80" strokeWidth={2} />
      {label}
    </button>
  )
}

export function Controls({
  age,
  onAgeChange,
  rangeMode,
  onRangeModeChange,
  rangeStart,
  rangeEnd,
  onRangeStartChange,
  onRangeEndChange,
  category,
  onCategoryChange,
  hideClosed,
  onHideClosedChange,
}: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.45 }}
      className="glass-panel space-y-5 p-5 sm:p-6"
      aria-label="筛选与控制"
    >
      <div>
        <label
          htmlFor="age-slider"
          className="mb-3 block text-xs font-semibold uppercase tracking-wider text-stone-400"
        >
          {rangeMode ? '探索年龄区间' : '拖动调整年龄'}
        </label>

        {!rangeMode ? (
          <div className="flex items-center gap-4">
            <input
              id="age-slider"
              type="range"
              min={0}
              max={80}
              value={age}
              onChange={(e) => onAgeChange(Number(e.target.value))}
              className="slider-track flex-1"
            />
            <div className="flex items-baseline gap-1 rounded-xl bg-stone-100/90 px-3 py-2 ring-1 ring-stone-200/60">
              <input
                type="number"
                min={0}
                max={80}
                value={age}
                onChange={(e) => {
                  const v = Math.min(80, Math.max(0, Number(e.target.value) || 0))
                  onAgeChange(v)
                }}
                className="w-10 bg-transparent text-center font-serif text-xl font-semibold text-stone-900 outline-none"
                aria-label="年龄数字输入"
              />
              <span className="text-sm text-stone-400">岁</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <span className="mb-1.5 block text-xs text-stone-500">起始年龄</span>
              <input
                type="range"
                min={0}
                max={80}
                value={rangeStart}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  onRangeStartChange(v)
                  if (v > rangeEnd) onRangeEndChange(v)
                }}
                className="slider-track w-full"
              />
            </div>
            <div>
              <span className="mb-1.5 block text-xs text-stone-500">结束年龄</span>
              <input
                type="range"
                min={0}
                max={80}
                value={rangeEnd}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  onRangeEndChange(v)
                  if (v < rangeStart) onRangeStartChange(v)
                }}
                className="slider-track w-full"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-stone-200/60 pt-4">
        <Toggle
          checked={rangeMode}
          onChange={onRangeModeChange}
          label="区间探索"
          icon={Layers}
        />
        <Toggle
          checked={hideClosed}
          onChange={onHideClosedChange}
          label="仅看仍可做"
          icon={Sparkles}
        />
      </div>

      <div className="border-t border-stone-200/60 pt-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
          <Filter className="h-3.5 w-3.5" />
          类别筛选
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip active={category === 'all'} onClick={() => onCategoryChange('all')}>
            全部
          </Chip>
          {categories.map(([key, label]) => (
            <Chip
              key={key}
              active={category === key}
              onClick={() => onCategoryChange(key)}
            >
              {label}
            </Chip>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full px-3.5 py-1.5 text-sm transition-all duration-200',
        active
          ? 'bg-amber-700 text-white shadow-sm shadow-amber-900/20'
          : 'bg-stone-100/90 text-stone-600 ring-1 ring-stone-200/50 hover:bg-stone-200/80',
      )}
    >
      {children}
    </button>
  )
}
