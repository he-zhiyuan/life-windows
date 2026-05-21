type Props = {
  min: number
  max: number
  start: number
  end: number
  onStartChange: (v: number) => void
  onEndChange: (v: number) => void
  onCommit?: () => void
}

export function DualRangeSlider({
  min,
  max,
  start,
  end,
  onStartChange,
  onEndChange,
  onCommit,
}: Props) {
  const handlePointerUp = () => onCommit?.()
  const lo = Math.min(start, end)
  const hi = Math.max(start, end)
  const span = max - min || 1
  const leftPct = ((lo - min) / span) * 100
  const widthPct = ((hi - lo) / span) * 100

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-serif text-2xl font-semibold tabular-nums text-stone-900">
          {lo}
          <span className="mx-1.5 font-sans text-stone-400">—</span>
          {hi}
          <span className="ml-1 font-sans text-base font-normal text-stone-400">岁</span>
        </span>
      </div>

      <div className="relative h-8">
        <div className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-stone-200/80" />
        <div
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={start}
          onChange={(e) => {
            const v = Number(e.target.value)
            onStartChange(v)
            if (v > end) onEndChange(v)
          }}
          className="dual-thumb absolute inset-0 z-10 w-full"
          aria-label="区间起始年龄"
          onPointerUp={handlePointerUp}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={end}
          onChange={(e) => {
            const v = Number(e.target.value)
            onEndChange(v)
            if (v < start) onStartChange(v)
          }}
          className="dual-thumb absolute inset-0 z-20 w-full"
          aria-label="区间结束年龄"
          onPointerUp={handlePointerUp}
        />
      </div>

      <div className="flex justify-between text-[10px] text-stone-400">
        <span>{min} 岁</span>
        <span>{max} 岁</span>
      </div>
    </div>
  )
}
