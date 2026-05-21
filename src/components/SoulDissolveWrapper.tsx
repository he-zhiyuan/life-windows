import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type Particle = {
  id: number
  x: number
  y: number
  delay: number
  size: number
  drift: number
}

function createParticles(seed: string, count = 18): Particle[] {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash << 5) - hash + seed.charCodeAt(i)
  const rnd = () => {
    hash = (hash * 16807) % 2147483647
    return (hash & 0x7fffffff) / 0x7fffffff
  }
  return Array.from({ length: count }, (_, id) => ({
    id,
    x: (rnd() - 0.5) * 90,
    y: -50 - rnd() * 110,
    delay: rnd() * 0.2,
    size: 2 + rnd() * 5,
    drift: (rnd() - 0.5) * 30,
  }))
}

type Props = {
  children: ReactNode
  seed: string
  delay?: number
  onComplete: () => void
}

export function SoulDissolveWrapper({ children, seed, delay = 0, onComplete }: Props) {
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

  if (!started) {
    return <div className="relative h-full w-full">{children}</div>
  }

  return (
    <motion.div
      className="relative h-full w-full overflow-visible"
      initial={false}
      animate={
        reducedMotion
          ? { opacity: 0, scale: 0.9 }
          : {
              scale: [1, 1.03, 1.08, 0.12],
              opacity: [1, 0.9, 0.7, 0],
              y: [0, -4, -10, -42],
              rotate: [0, -2, 4, 8],
              filter: ['blur(0px)', 'blur(0px)', 'blur(4px)', 'blur(12px)'],
            }
      }
      transition={{ duration: reducedMotion ? 0.35 : 1.35, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={handleComplete}
    >
      {!reducedMotion &&
        particles.map((p) => (
        <motion.span
          key={p.id}
          className="pointer-events-none absolute left-1/2 top-1/2 rounded-full bg-gradient-to-b from-white via-stone-200/90 to-stone-400/40 shadow-[0_0_6px_rgba(255,255,255,0.8)]"
          style={{ width: p.size, height: p.size }}
          initial={{ x: '-50%', y: '-50%', opacity: 0.95, scale: 1 }}
          animate={{
            x: `calc(-50% + ${p.x}px)`,
            y: `calc(-50% + ${p.y}px)`,
            opacity: [0.95, 0.7, 0],
            scale: [1, 0.6, 0],
          }}
          transition={{
            duration: 1.1 + p.delay,
            delay: p.delay * 0.35,
            ease: 'easeOut',
          }}
        />
        ))}

      {!reducedMotion && (
        <motion.span
          className="pointer-events-none absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50 blur-md"
          initial={{ opacity: 0, scale: 0.5, y: 0 }}
          animate={{ opacity: [0, 0.85, 0], scale: [0.5, 1.8, 2.4], y: -70 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      )}

      <div className="relative h-full w-full">{children}</div>
    </motion.div>
  )
}
