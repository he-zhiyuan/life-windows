import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type Particle = {
  id: number
  ox: number
  oy: number
  x: number
  y: number
  delay: number
  size: number
  rotate: number
  shape: 'dot' | 'shard'
  tone: number
}

const TONES = [
  'from-stone-100 via-stone-200 to-stone-400',
  'from-amber-50 via-amber-200/90 to-stone-300',
  'from-white via-stone-100 to-stone-300/80',
  'from-stone-200 via-stone-300 to-stone-500/60',
] as const

function createParticles(seed: string, count = 52): Particle[] {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash << 5) - hash + seed.charCodeAt(i)
  const rnd = () => {
    hash = (hash * 16807) % 2147483647
    return (hash & 0x7fffffff) / 0x7fffffff
  }

  const cols = 8
  const rows = Math.ceil(count / cols)

  return Array.from({ length: count }, (_, id) => {
    const col = id % cols
    const row = Math.floor(id / cols)
    const ox = (col / (cols - 1 || 1) - 0.5) * 88
    const oy = (row / (rows - 1 || 1) - 0.5) * 72
    const angle = rnd() * Math.PI * 2
    const speed = 95 + rnd() * 185
    return {
      id,
      ox,
      oy,
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed - 40 - rnd() * 80,
      delay: rnd() * 0.06,
      size: 2 + rnd() * 6,
      rotate: (rnd() - 0.5) * 520,
      shape: rnd() > 0.35 ? 'shard' : 'dot',
      tone: Math.floor(rnd() * TONES.length),
    }
  })
}

type Props = {
  children: ReactNode
  seed: string
  delay?: number
  /** 动画时长（秒），默认 0.58 */
  duration?: number
  onComplete: () => void
}

export const DEFAULT_DISSOLVE_DURATION = 0.58
export const FIRST_DISSOLVE_DURATION = 1.5

export function SoulDissolveWrapper({
  children,
  seed,
  delay = 0,
  duration = DEFAULT_DISSOLVE_DURATION,
  onComplete,
}: Props) {
  const particles = useMemo(() => createParticles(seed), [seed])
  const reducedMotion = useReducedMotion()
  const doneRef = useRef(false)
  const [started, setStarted] = useState(delay <= 0)

  useEffect(() => {
    if (delay <= 0) {
      setStarted(true)
      return
    }
    doneRef.current = false
    setStarted(false)
    const t = window.setTimeout(() => setStarted(true), delay * 1000)
    return () => window.clearTimeout(t)
  }, [delay, seed])

  const handleComplete = () => {
    if (doneRef.current) return
    doneRef.current = true
    onComplete()
  }

  useEffect(() => {
    if (!started || reducedMotion) return
    doneRef.current = false
    const t = window.setTimeout(handleComplete, duration * 1000 + 40)
    return () => window.clearTimeout(t)
  }, [started, reducedMotion, seed, duration])

  if (!started) {
    return <div className="relative h-full w-full">{children}</div>
  }

  if (reducedMotion) {
    return (
      <motion.div
        className="relative h-full w-full"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, scale: 0.88 }}
        transition={{ duration: 0.28 }}
        onAnimationComplete={handleComplete}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div className="relative h-full w-full overflow-visible" initial={false}>
      {/* 碎裂闪光 */}
      <motion.span
        className="pointer-events-none absolute inset-0 z-20 rounded-xl bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.85, 0.35, 0] }}
        transition={{ duration: duration * 0.35, ease: 'easeOut' }}
      />

      {/* 裂纹层 */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.5] }}
        transition={{ duration: 0.14 }}
      >
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 h-[140%] w-px origin-center bg-white/70"
            style={{ transform: `translate(-50%, -50%) rotate(${22 + i * 38}deg)` }}
          />
        ))}
      </motion.div>

      {/* 粒子爆散 */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className={`pointer-events-none absolute left-1/2 top-1/2 z-30 bg-gradient-to-br shadow-[0_0_8px_rgba(255,255,255,0.9)] ${TONES[p.tone]} ${
            p.shape === 'shard' ? 'rounded-[1px]' : 'rounded-full'
          }`}
          style={{ width: p.size, height: p.shape === 'shard' ? p.size * 1.8 : p.size }}
          initial={{
            x: `calc(-50% + ${p.ox}px)`,
            y: `calc(-50% + ${p.oy}px)`,
            opacity: 1,
            scale: 1,
            rotate: 0,
          }}
          animate={{
            x: `calc(-50% + ${p.ox + p.x}px)`,
            y: `calc(-50% + ${p.oy + p.y}px)`,
            opacity: [1, 0.85, 0],
            scale: [1, 1.1, 0.15],
            rotate: p.rotate,
          }}
          transition={{
            duration,
            delay: p.delay,
            ease: [0.12, 0.72, 0.18, 1],
          }}
        />
      ))}

      {/* 卡片本体：先胀后碎 */}
      <motion.div
        className="relative h-full w-full"
        initial={false}
        animate={{
          scale: [1, 1.04, 1.07, 0.2],
          opacity: [1, 1, 0.75, 0],
          rotate: [0, -1.5, 2, 6],
          filter: ['blur(0px)', 'blur(0px)', 'blur(2px)', 'blur(10px)'],
        }}
        transition={{ duration, ease: [0.22, 1, 0.32, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
