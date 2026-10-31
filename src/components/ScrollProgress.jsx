import { motion, useScroll, useSpring } from 'framer-motion'

/** Thin Pepsi-blue progress bar pinned to the top of the viewport. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const width = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: width }}
      className="fixed inset-x-0 top-0 z-[90] h-[3px] origin-left bg-blue-grad shadow-[0_0_14px_rgba(45,156,255,0.75)]"
    />
  )
}
