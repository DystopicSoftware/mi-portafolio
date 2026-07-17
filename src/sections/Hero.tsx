import { motion } from 'framer-motion'
import { Brain, CircuitBoard, Cpu, GitBranch, User, MessageCircle, MapPin } from 'lucide-react'
import { usePortfolioStore } from '../store/usePortfolioStore'

const techIcons = [
  { Icon: Cpu,          label: 'Edge Computing', id: 'edge-computing' },
  { Icon: CircuitBoard, label: 'Hardware Design', id: 'hardware'       },
  { Icon: Brain,        label: 'Edge AI',         id: 'edge-ai'        },
]

export function Hero() {
  const activeCategory    = usePortfolioStore((s) => s.activeCategory);
  const setActiveCategory = usePortfolioStore((s) => s.setActiveCategory);

  // Cuando hay un proyecto activo, toda la tarjeta (incluyendo contactos) se desvanece
  const isHidden = activeCategory !== null;

  return (
    <section className="flex flex-1 items-center justify-center px-6 py-20 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: isHidden ? 0 : 1,
          y:       isHidden ? -50 : 0,
          scale:   isHidden ? 0.92 : 1,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ pointerEvents: isHidden ? 'none' : 'auto' }}
        // Glassmorphism profundo: fondo más transparente, blur máximo
        className="bg-black/30 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-[2rem] px-10 py-12 max-w-2xl w-full text-center"
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

        {/* ── Botones de categoría ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex items-center justify-center gap-6"
        >
          {techIcons.map(({ Icon, label, id }) => {
            const isActive = activeCategory === id;
            return (
              <button
                key={label}
                onClick={() => setActiveCategory(isActive ? null : id)}
                className="flex flex-col items-center gap-2 group cursor-pointer z-50 relative pointer-events-auto"
                title={label}
              >
                <div className={`p-4 rounded-2xl transition-all duration-300 border ${isActive ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(0,255,204,0.4)]' : 'bg-white/5 border-white/5 group-hover:border-cyan-500/50'}`}>
                  <Icon className={`h-6 w-6 ${isActive ? 'text-cyan-300' : 'text-cyan-500'}`} />
                </div>
                <span className={`text-xs font-mono transition-colors hidden sm:block ${isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-400'}`}>
                  {label}
                </span>
              </button>
            )
          })}
        </motion.div>

        {/* ── BARRA DE CONTACTO — motion.div espeja la animación del padre para bloquear clics ── */}
        <motion.div
          animate={{ opacity: isHidden ? 0 : 1 }}
          transition={{ duration: 0.4 }}
          className={`flex flex-wrap justify-center gap-4 mt-10 border-t border-white/10 pt-6 ${
            isHidden ? 'pointer-events-none select-none' : 'pointer-events-auto'
          }`}
          inert={isHidden ? true : undefined}
        >
          <a
            href="https://www.linkedin.com/in/juan-villada-sierra/"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all text-sm text-slate-300 backdrop-blur-md cursor-pointer pointer-events-auto"
          >
            <User size={16} /> <span>LinkedIn</span>
          </a>

          <a
            href="https://github.com/DystopicSoftware"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all text-sm text-slate-300 backdrop-blur-md cursor-pointer pointer-events-auto"
          >
            <GitBranch size={16} /> <span>GitHub</span>
          </a>

          <a
            href="https://wa.me/573332413337"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all text-sm text-slate-300 backdrop-blur-md cursor-pointer pointer-events-auto"
          >
            <MessageCircle size={16} /> <span>+57 333 241 33 37</span>
          </a>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-400 backdrop-blur-md">
            <MapPin size={16} /> <span>Manizales, Caldas</span>
          </div>
        </motion.div>

      </motion.div>
    </section>
  )
}
