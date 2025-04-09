import { motion, AnimatePresence } from "framer-motion"

interface AnimatedMascotProps {
  visible: boolean
}

export function AnimatedMascot({ visible }: AnimatedMascotProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 100, x: 32 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [100, 0, -200, -400],
            x: [32, 48, 32, 48]
          }}
          transition={{
            duration: 3,
            ease: "easeOut",
            times: [0, 0.2, 0.8, 1]
          }}
          className="fixed bottom-0 left-8 z-50"
        >
          <div className="w-48 h-48 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/20 shadow-lg">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-contain"
              style={{ transform: "scale(1)" }}
            >
              <source src="/videos/mascot.mp4" type="video/mp4" />
            </video>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
