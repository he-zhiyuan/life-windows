import { motion } from 'framer-motion'
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { Filter, Layers, Sparkles } from 'lucide-react'
import type { Category } from '../types'
import { CATEGORY_LABELS } from '../types'
import { FILTER_CHIP_CLASS } from '../lib/category-style'
import { setAgeSliderDragging } from '../lib/age-slider-cursor'
import { cn } from '../lib/cn'
import { DualRangeSlider } from './DualRangeSlider'

type Props = {
  age: number
  onAgePreview: (age: number) => void
  onAgeCommit: (age: number) => void
  onAgeDragStart?: () => void
  onAgeDragEnd?: () => void
  rangeMode: boolean
  onRangeModeChange: (v: boolean) => void
  rangeStart: number
  rangeEnd: number
  onRangeStartChange: (v: number) => void
  onRangeEndChange: (v: number) => void
  onRangeCommit?: () => void
  category: Category | 'all'
  onCategoryChange: (c: Category | 'all') => void
  onlyActionable: boolean
  onOnlyActionableChange: (v: boolean) => void
  disabled?: boolean
  compact?: boolean
}

const categories = Object.entries(CATEGORY_LABELS) as [Category, string][]

function Toggle({
  checked,
  onChange,
  label,
  icon: Icon,
  small,
  disabled,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  icon: typeof Layers
  small?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'flex items-center gap-1.5 rounded-lg font-medium transition-all',
        small ? 'px-2.5 py-1.5 text-xs' : 'gap-2 rounded-xl px-3 py-2 text-sm',
        checked
          ? 'bg-stone-900 text-white shadow-md'
          : 'bg-stone-100/80 text-stone-600 hover:bg-stone-200/80',
        !disabled && 'cursor-pointer',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <Icon className={cn('shrink-0 opacity-80', small ? 'h-3.5 w-3.5' : 'h-4 w-4')} strokeWidth={2} />
      {label}
    </button>
  )
}

function releaseSliderCapture(e: ReactPointerEvent<HTMLInputElement>) {
  if (e.currentTarget.hasPointerCapture(e.pointerId)) {
    e.currentTarget.releasePointerCapture(e.pointerId)
  }
}

function commitSlider(
  e: ReactPointerEvent<HTMLInputElement>,
  value: number,
  onCommit: (age: number) => void,
) {
  releaseSliderCapture(e)
  onCommit(value)
}

export function Controls({
  age,
  onAgePreview,
  onAgeCommit,
  onAgeDragStart,
  onAgeDragEnd,
  rangeMode,
  onRangeModeChange,
  rangeStart,
  rangeEnd,
  onRangeStartChange,
  onRangeEndChange,
  onRangeCommit,
  category,
  onCategoryChange,
  onlyActionable,
  onOnlyActionableChange,
  disabled,
  compact,
}: Props) {
  const toggles = (
    <div className="flex shrink-0 flex-wrap items-center gap-2">
      <Toggle
        checked={rangeMode}
        onChange={onRangeModeChange}
        label="区间"
        icon={Layers}
        small={compact}
        disabled={disabled}
      />
      <Toggle
        checked={onlyActionable}
        onChange={onOnlyActionableChange}
        label="仅可做"
        icon={Sparkles}
        small={compact}
        disabled={disabled}
      />
    </div>
  )

  const ageControl = rangeMode ? (
    <DualRangeSlider
      min={0}
      max={80}
      start={rangeStart}
      end={rangeEnd}
      onStartChange={onRangeStartChange}
      onEndChange={onRangeEndChange}
      onCommit={onRangeCommit}
    />
  ) : (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <input
        id={compact ? 'age-slider-desktop' : 'age-slider'}
        type="range"
        min={0}
        max={80}
        step={1}
        value={age}
        disabled={disabled}
        onChange={(e) => onAgePreview(Number(e.target.value))}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          setAgeSliderDragging(true)
          onAgeDragStart?.()
        }}
        onPointerUp={(e) => {
          const value = Number(e.currentTarget.value)
          setAgeSliderDragging(false)
          onAgeDragEnd?.()
          commitSlider(e, value, onAgeCommit)
        }}
        onPointerCancel={(e) => {
          releaseSliderCapture(e)
          setAgeSliderDragging(false)
          onAgeDragEnd?.()
        }}
        onKeyUp={(e) => {
          if (e.key === 'Enter') onAgeCommit(Number(e.currentTarget.value))
        }}
        className={cn('slider-track min-w-0 flex-1', compact && 'min-w-[10rem]')}
      />
      {!compact && (
        <div className="flex shrink-0 items-baseline gap-1 rounded-xl bg-stone-100/90 px-2.5 py-1.5 ring-1 ring-stone-200/60">
          <input
            type="number"
            min={0}
            max={80}
            step={1}
            value={age}
            disabled={disabled}
            onChange={(e) => {
              const v = Math.min(80, Math.max(0, Number(e.target.value) || 0))
              onAgePreview(v)
            }}
            onBlur={(e) => onAgeCommit(Number(e.target.value) || 0)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onAgeCommit(Number(e.currentTarget.value) || 0)
                e.currentTarget.blur()
              }
            }}
            className="w-9 bg-transparent text-center font-serif text-lg font-semibold text-stone-900 outline-none"
            aria-label="年龄数字输入"
          />
          <span className="text-xs text-stone-400">岁</span>
        </div>
      )}
      {compact && (
        <span className="shrink-0 font-serif text-lg font-semibold tabular-nums text-stone-800">
          {age} 岁
        </span>
      )}
    </div>
  )

  const controlRow = (
    <div className="w-full">
      {!compact && (
        <label
          htmlFor={rangeMode ? undefined : 'age-slider'}
          className="mb-2.5 block text-xs font-semibold uppercase tracking-wider text-stone-400"
        >
          {rangeMode ? '拖动选择区间' : '拖动调整年龄（松手后生效）'}
        </label>
      )}
      <div className="flex w-full min-w-0 flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">{ageControl}</div>
        {toggles}
      </div>
    </div>
  )

  const inner = (
    <>
      {controlRow}

      {!compact && (
        <div className="border-t border-stone-200/60 pt-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
            <Filter className="h-3.5 w-3.5" />
            类别
          </div>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Chip
              active={category === 'all'}
              onClick={() => onCategoryChange('all')}
              disabled={disabled}
            >
              全部
            </Chip>
            {categories.map(([key, label]) => (
              <Chip
                key={key}
                active={category === key}
                onClick={() => onCategoryChange(key)}
                disabled={disabled}
              >
                {label}
              </Chip>
            ))}
          </div>
        </div>
      )}
    </>
  )

  if (compact) {
    return (
      <div className="w-full space-y-3" aria-label="筛选与控制">
        {inner}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Chip
            active={category === 'all'}
            onClick={() => onCategoryChange('all')}
            small
            disabled={disabled}
          >
            全部
          </Chip>
          {categories.map(([key, label]) => (
            <Chip
              key={key}
              active={category === key}
              onClick={() => onCategoryChange(key)}
              small
              disabled={disabled}
            >
              {label}
            </Chip>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="glass-panel space-y-4 p-4 sm:p-5"
      aria-label="筛选与控制"
    >
      {inner}
    </motion.section>
  )
}

function Chip({
  children,
  active,
  onClick,
  small,
  disabled,
}: {
  children: ReactNode
  active: boolean
  onClick: () => void
  small?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'shrink-0 rounded-full ring-1 transition-all duration-200',
        small ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
        active ? FILTER_CHIP_CLASS.active : FILTER_CHIP_CLASS.inactive,
        !disabled && 'cursor-pointer',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      {children}
    </button>
  )
}
