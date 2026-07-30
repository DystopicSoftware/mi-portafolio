import { motion } from 'framer-motion';
import {
  X, MapPin, GraduationCap, Cpu, GitBranch,
  User, Download, Zap, Layers, Brain,
} from 'lucide-react';
import { usePortfolioStore } from '../../store/usePortfolioStore';

// ── Marca de calibración en esquina ──────────────────────────────────────────
function CornerMark({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const base = 'absolute w-3 h-3 pointer-events-none';
  const positions = {
    tl: 'top-3 left-3 border-t-2 border-l-2',
    tr: 'top-3 right-3 border-t-2 border-r-2',
    bl: 'bottom-3 left-3 border-b-2 border-l-2',
    br: 'bottom-3 right-3 border-b-2 border-r-2',
  };
  return <div className={`${base} ${positions[pos]} border-cyan-500/40`} />;
}

const SKILLS = [
  {
    Icon: Cpu,
    label: 'Low-Level & Embedded',
    items: ['C / C++', 'Verilog / SystemVerilog', 'FreeRTOS', 'Embedded Linux', 'POSIX / Systemd'],
  },
  {
    Icon: Zap,
    label: 'Audio & DSP',
    items: ['Faust DSP', 'JUCE', 'FluidSynth / RtMidi', 'Lock-free Audio', 'Waveguide Synthesis'],
  },
  {
    Icon: Brain,
    label: 'Edge AI',
    items: ['Ollama / Llama 3', 'LangChain', 'NVIDIA Jetson', 'TensorRT', 'RAG / Tool Calling'],
  },
  {
    Icon: Layers,
    label: 'Frontend & Cloud',
    items: ['React 19 / TypeScript', 'Three.js / WebGL', 'FastAPI / Python', 'Vercel Serverless', 'Zustand / Framer Motion'],
  },
];

export default function AboutModal() {
  const setShowAbout = usePortfolioStore((s) => s.setShowAbout);

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-auto flex items-center justify-center bg-black/40 backdrop-blur-xl"
      onClick={() => setShowAbout(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className={[
          'relative overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/30',
          'w-[90vw] max-w-4xl max-h-[90vh]',
          'flex flex-col',
          'bg-black/40 backdrop-blur-xl',
          'border-[0.5px] border-cyan-500/20 rounded-2xl',
          'shadow-[0_0_80px_rgba(0,0,0,0.9),0_0_40px_rgba(0,229,255,0.06),inset_0_1px_0_rgba(255,255,255,0.05)]',
        ].join(' ')}
      >
        <CornerMark pos="tl" />
        <CornerMark pos="tr" />
        <CornerMark pos="bl" />
        <CornerMark pos="br" />

        {/* Línea superior de escaneo */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

        {/* ── HEADER ── */}
        <div className="flex justify-between items-start px-10 pt-8 pb-6 border-b border-cyan-500/10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00e5ff]" />
              <span className="text-[9px] font-mono text-cyan-500/60 tracking-[0.3em] uppercase">
                SYSTEM :: IDENTITY_MODULE
              </span>
            </div>
            <h2 className="text-5xl font-black tracking-widest uppercase text-cyan-400 leading-none">
              Juan Villada
            </h2>
            <p className="text-slate-400 font-mono text-sm tracking-wider mt-1">
              Edge AI & Embedded Audio Engineer · Manizales, Colombia
            </p>
          </div>
          <button
            onClick={() => setShowAbout(false)}
            className="text-slate-500/60 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all cursor-pointer ml-6 mt-1 p-2 rounded-lg border border-transparent hover:border-cyan-500/20"
            aria-label="Close about"
          >
            <X className="w-6 h-6 stroke-[1.5]" />
          </button>
        </div>

        {/* ── BODY ── */}
        <div className="px-10 py-7 flex flex-col gap-8">

          {/* Bio */}
          <div className="flex flex-col gap-3">
            <span className="text-[9px] font-mono text-cyan-500/40 tracking-[0.25em] uppercase flex items-center gap-2">
              <span className="h-px flex-1 bg-cyan-500/10" /> PROFILE_SUMMARY <span className="h-px flex-1 bg-cyan-500/10" />
            </span>
            <p className="text-xl text-slate-300 font-light leading-relaxed">
              I specialize in the intersection of <span className="text-cyan-400 font-medium">hardware architecture</span>,{' '}
              <span className="text-cyan-400 font-medium">real-time DSP</span>, and{' '}
              <span className="text-cyan-400 font-medium">high-performance web applications</span>.
              I translate complex mathematical algorithms into zero-latency physical and digital realities —
              from Q15 fixed-point waveguide synthesis running on FPGA gates,
              to lock-free C++ audio engines on embedded Linux, to offline LLM agents with no API costs.
            </p>
            <p className="text-xl text-slate-300 font-light leading-relaxed">
              Currently completing my final semester in Electronic Engineering at Universidad Autónoma de Manizales.
              Open to <span className="text-cyan-400 font-medium">remote</span> and{' '}
              <span className="text-cyan-400 font-medium">hybrid roles</span> in Deep Tech,
              AudioTech, and Edge AI — where microseconds and memory bytes actually matter.
            </p>
          </div>

          {/* Skills Grid */}
          <div className="flex flex-col gap-3">
            <span className="text-[9px] font-mono text-cyan-500/40 tracking-[0.25em] uppercase flex items-center gap-2">
              <span className="h-px flex-1 bg-cyan-500/10" /> TECHNICAL_ARSENAL <span className="h-px flex-1 bg-cyan-500/10" />
            </span>
            <div className="grid grid-cols-2 gap-4">
              {SKILLS.map(({ Icon, label, items }) => (
                <div
                  key={label}
                  className="border border-cyan-500/15 bg-black/30 rounded-xl p-5 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-mono text-cyan-400/70 tracking-[0.2em] uppercase">{label}</span>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <li
                        key={item}
                        className="text-xs font-mono text-slate-300 bg-cyan-500/5 border border-cyan-500/15 px-2.5 py-1 rounded-md"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Status */}
          <div className="flex gap-4">
            <div className="flex-1 border border-cyan-500/15 bg-black/30 rounded-xl p-5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-mono text-cyan-400/70 tracking-[0.2em] uppercase">Education</span>
              </div>
              <p className="text-slate-200 text-sm font-medium">B.Sc. Electronic Engineering</p>
              <p className="text-slate-400 text-xs font-mono">Universidad Autónoma de Manizales</p>
              <p className="text-cyan-400/70 text-xs font-mono mt-1">Final semester · 2025</p>
            </div>
            <div className="flex-1 border border-cyan-500/15 bg-black/30 rounded-xl p-5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-mono text-cyan-400/70 tracking-[0.2em] uppercase">Availability</span>
              </div>
              <p className="text-slate-200 text-sm font-medium">Remote-First · Hybrid</p>
              <p className="text-slate-400 text-xs font-mono">Manizales · Medellín · Bogotá · Global</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400" />
                </span>
                <span className="text-[10px] font-mono text-cyan-400/70 tracking-[0.15em] uppercase">Open to opportunities</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER: Links + CV ── */}
        <div className="px-10 pb-8 pt-5 border-t border-cyan-500/10 flex gap-4">
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/juan-villada-sierra/"
            target="_blank"
            rel="noopener noreferrer"
            className={[
              'flex-1 flex items-center justify-center gap-3',
              'bg-cyan-500/5 hover:bg-cyan-500/10',
              'border border-cyan-500/20 hover:border-cyan-500/50',
              'text-cyan-400 hover:text-cyan-300',
              'font-mono text-sm font-bold tracking-wide uppercase',
              'py-4 rounded-xl transition-all duration-300 cursor-pointer relative overflow-hidden group',
            ].join(' ')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <User className="w-5 h-5 stroke-[2] relative z-10" />
            <span className="relative z-10">LINKEDIN</span>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/DystopicSoftware"
            target="_blank"
            rel="noopener noreferrer"
            className={[
              'flex-1 flex items-center justify-center gap-3',
              'bg-cyan-500/5 hover:bg-cyan-500/10',
              'border border-cyan-500/20 hover:border-cyan-500/50',
              'text-cyan-400 hover:text-cyan-300',
              'font-mono text-sm font-bold tracking-wide uppercase',
              'py-4 rounded-xl transition-all duration-300 cursor-pointer relative overflow-hidden group',
            ].join(' ')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <GitBranch className="w-5 h-5 stroke-[2] relative z-10" />
            <span className="relative z-10">GITHUB</span>
          </a>

          {/* CV Download */}
          <a
            href="/assets/cv/Juan_Villada_CV.pdf"
            download="Juan_Villada_Sierra_CV.pdf"
            className={[
              'flex-1 flex items-center justify-center gap-3',
              'bg-cyan-400/10 hover:bg-cyan-400/20',
              'border border-cyan-400/40 hover:border-cyan-400/80',
              'text-cyan-300 hover:text-white',
              'font-mono text-sm font-bold tracking-wide uppercase',
              'py-4 rounded-xl transition-all duration-300 cursor-pointer relative overflow-hidden group',
              'shadow-[0_0_20px_rgba(0,229,255,0.1)] hover:shadow-[0_0_30px_rgba(0,229,255,0.25)]',
            ].join(' ')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Download className="w-5 h-5 stroke-[2] relative z-10" />
            <span className="relative z-10">DOWNLOAD CV</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
