import { motion } from 'framer-motion'
import { Brain, CircuitBoard, Cpu } from 'lucide-react'

const techIcons = [
  { Icon: Cpu, label: 'Edge Computing' },
  { Icon: CircuitBoard, label: 'Hardware Design' },
  { Icon: Brain, label: 'Edge AI' },
]

export function Hero() {
  return (
    <section className="flex flex-1 items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl px-10 py-12 max-w-2xl w-full text-center"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-cyan-400 text-sm font-mono tracking-widest uppercase mb-4"
        >
          Portfolio
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3"
        >
          Juan Villada
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-lg md:text-xl text-slate-400 mb-8"
        >
          Electronic Eng. &amp; Edge AI Fullstack Dev
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex items-center justify-center gap-6"
        >
          {techIcons.map(({ Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 group"
              title={label}
            >
              <div className="p-3 rounded-xl bg-cyan-400/10 border border-cyan-400/20 group-hover:border-cyan-400/50 transition-colors">
                <Icon className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-xs text-slate-500 hidden sm:block">
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
