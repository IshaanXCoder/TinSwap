import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion'
import { useState } from 'react'

export function SwipeCard({
  children,
  onSwipe,
}: {
  children: React.ReactNode
  onSwipe?: (dir: 'left' | 'right') => void
}) {
  const controls = useAnimation()
  const [exited, setExited] = useState(false)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-300, 0, 300], [-12, 0, 12])
  const rightOpacity = useTransform(x, [80, 160], [0, 1])
  const leftOpacity = useTransform(x, [-80, -160], [0, 1])

  if (exited) return null

  return (
    <div className="absolute inset-0">
      <motion.div
        drag="x"
        style={{ x, rotate }}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_, info) => {
          const threshold = Math.min(window.innerWidth * 0.25, 180)
          if (info.offset.x > threshold) {
            onSwipe?.('right')
            setExited(true)
            controls.start({ x: 800, opacity: 0, rotate: 14 })
          } else if (info.offset.x < -threshold) {
            onSwipe?.('left')
            setExited(true)
            controls.start({ x: -800, opacity: 0, rotate: -14 })
          } else {
            controls.start({ x: 0, rotate: 0 })
          }
        }}
        animate={controls}
        className="h-full w-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.04] p-6 shadow-2xl backdrop-blur-sm"
      >
        {/* Affirm/Reject badges */}
        <motion.div style={{ opacity: rightOpacity }} className="pointer-events-none absolute right-6 top-6 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          Swap →
        </motion.div>
        <motion.div style={{ opacity: leftOpacity }} className="pointer-events-none absolute left-6 top-6 rounded-md border border-pink-400/30 bg-pink-400/10 px-3 py-1 text-xs font-semibold text-pink-300">
          ← Reject
        </motion.div>
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-auto">
            {children}
          </div>
          <div className="mt-6 text-center text-xs text-neutral-400">Swipe right to proceed to swap, left to skip</div>
        </div>
      </motion.div>
    </div>
  )
}


