import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, GitBranch, X } from 'lucide-react';
import type { TechItem, TelemetryMetric } from '../../data/projects';

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
export interface ProjectHologramProps {
  title: string;
  description: string;
  techStack: TechItem[];
  githubUrl: string;
  liveUrl: string | null;
  telemetry: TelemetryMetric[];
  onClose?: () => void;
}

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

// ── Panel de telemetría con métricas reales ───────────────────────────────────
function TelemetryPanel({ metrics }: { metrics: TelemetryMetric[] }) {
  return (
    <div className="flex gap-5 border border-cyan-500/20 bg-black/40 px-5 py-3 rounded-md mt-3">
      {metrics.map((t) => (
        <div key={t.label} className="flex flex-col gap-0.5">
          <span className="text-[10px] font-mono text-cyan-500/60 tracking-[0.2em] uppercase">
            {t.label}
          </span>
          <span className="text-2xl font-bold text-white leading-none font-mono">
            {t.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Badge de estado en header ─────────────────────────────────────────────────
function StatusBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] font-mono text-cyan-500/50 tracking-[0.15em] uppercase">{label}</span>
      <span className="text-[9px] font-mono text-cyan-400 tracking-widest font-bold">{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal 2D — fixed overlay, eventos React nativos, sin fricción R3F
// ─────────────────────────────────────────────────────────────────────────────
export default function ProjectHologram({
  title,
  description,
  techStack,
  githubUrl,
  liveUrl,
  telemetry,
  onClose,
}: ProjectHologramProps) {
  const [activeTech, setActiveTech] = useState<string | null>(null);

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-auto flex items-center justify-center bg-black/40 backdrop-blur-xl"
      onClick={onClose}
    >
      {/* ── Panel interno — detiene la propagación para no cerrar al clicar dentro ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className={[
          'relative overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/30',
          'w-[90vw] max-w-4xl max-h-[90vh] min-h-[65vh]',
          'flex flex-col',
          'bg-black/40 backdrop-blur-xl',
          'border-[0.5px] border-cyan-500/20 rounded-2xl',
          'shadow-[0_0_80px_rgba(0,0,0,0.9),0_0_40px_rgba(0,229,255,0.06),inset_0_1px_0_rgba(255,255,255,0.05)]',
        ].join(' ')}
      >
        {/* ── Marcas de calibración ── */}
        <CornerMark pos="tl" />
        <CornerMark pos="tr" />
        <CornerMark pos="bl" />
        <CornerMark pos="br" />

        {/* ── Línea superior de escaneo ── */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

        {/* ── HEADER ─────────────────────────────────────────────────────────── */}
        <div className="flex justify-between items-start px-10 pt-8 pb-6 border-b border-cyan-500/10">
          <div className="flex flex-col gap-3 flex-1 min-w-0">

            {/* Etiqueta de sistema */}
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00e5ff]" />
              <span className="text-[9px] font-mono text-cyan-500/60 tracking-[0.3em] uppercase">
                SYSTEM :: PROJECT_MODULE
              </span>
            </div>

            {/* Título */}
            <h2 className="text-5xl font-black tracking-widest uppercase text-cyan-400 font-sans leading-none">
              {title}
            </h2>

            {/* Panel de telemetría */}
            <TelemetryPanel metrics={telemetry} />

            {/* Indicadores de estado */}
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400" />
                </span>
                <span className="text-[9px] font-mono text-cyan-400/70 tracking-[0.2em] uppercase">LIVE</span>
              </div>
              <StatusBadge label="SIGNAL" value="—92dB" />
              <StatusBadge label="UPLINK" value="OK" />
              <StatusBadge label="ENV" value="EDGE" />
            </div>
          </div>

          {/* Botón de cierre */}
          <button
            onClick={onClose}
            className="text-slate-500/60 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all cursor-pointer ml-6 mt-1 p-2 rounded-lg border border-transparent hover:border-cyan-500/20"
            aria-label="Cerrar proyecto"
          >
            <X className="w-6 h-6 stroke-[1.5]" />
          </button>
        </div>

        {/* ── BODY ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-8 flex-1 min-h-0 px-10 py-7">

          {/* Panel izquierdo — video feed placeholder */}
          <div className="relative w-full h-full bg-black/50 border border-cyan-500/10 rounded-xl flex items-center justify-center overflow-hidden group">
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,229,255,1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,229,255,1) 1px, transparent 1px)
                `,
                backgroundSize: '28px 28px',
              }}
            />
            <div className="relative flex items-center justify-center w-10 h-10">
              <div className="absolute w-full h-px bg-cyan-500/25" />
              <div className="absolute h-full w-px bg-cyan-500/25" />
              <div className="w-2 h-2 border border-cyan-500/40 rotate-45" />
            </div>
            <span className="absolute bottom-3 left-0 right-0 text-center font-mono text-cyan-500/25 text-[9px] tracking-widest uppercase">
              VIDEO_FEED :: STANDBY
            </span>
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Panel derecho — descripción y stack interactivo */}
          <div className="flex flex-col gap-6 overflow-y-auto pr-1">

            {/* Descripción */}
            <p className="text-2xl text-slate-300 font-light leading-relaxed">
              {description}
            </p>

            {/* ── Stack técnico INTERACTIVO ── */}
            <div>
              <h4 className="text-[9px] text-cyan-500/40 font-mono tracking-[0.2em] mb-3 uppercase flex items-center gap-2">
                <span className="h-px flex-1 bg-cyan-500/10" />
                ARCH / STACK — selecciona para ver detalles
                <span className="h-px flex-1 bg-cyan-500/10" />
              </h4>

              {/* Badges — eventos React puros, sin fricción R3F */}
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => {
                  const isActive = activeTech === tech.name;
                  return (
                    <button
                      key={tech.name}
                      onClick={() => setActiveTech(isActive ? null : tech.name)}
                      className={[
                        'text-lg font-mono px-4 py-2 rounded-md tracking-wider transition-all duration-200 cursor-pointer',
                        'border focus:outline-none',
                        isActive
                          ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                          : 'bg-cyan-500/5 border-cyan-500/20 text-cyan-300 hover:ring-1 hover:ring-cyan-500 hover:bg-cyan-500/10',
                      ].join(' ')}
                    >
                      {tech.name}
                    </button>
                  );
                })}
              </div>

              {/* Panel de detalle del badge activo */}
              <div className="min-h-[72px] mt-4">
                <AnimatePresence mode="wait">
                  {activeTech && (
                    <motion.div
                      key={activeTech}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 bg-cyan-950/40 border-l-2 border-cyan-500 rounded-r-md"
                    >
                      <span className="text-cyan-400 font-bold text-sm mr-2 font-mono tracking-wider">
                        {activeTech}:
                      </span>
                      <span className="text-slate-300 text-sm leading-relaxed">
                        {techStack.find((t) => t.name === activeTech)?.detail}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
        <div className="px-10 pb-8 pt-5 border-t border-cyan-500/10">
          <a
            href={liveUrl || githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={[
              'w-full flex items-center justify-center gap-3',
              'bg-cyan-500/5 hover:bg-cyan-500/10',
              'border border-cyan-500/20 hover:border-cyan-500/50',
              'text-cyan-400 hover:text-cyan-300',
              'font-mono text-xl font-bold tracking-wide uppercase',
              'py-5 rounded-xl',
              'transition-all duration-300 cursor-pointer',
              'relative overflow-hidden group',
            ].join(' ')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            {liveUrl
              ? <ExternalLink className="w-6 h-6 stroke-[2] relative z-10" />
              : <GitBranch className="w-6 h-6 stroke-[2] relative z-10" />}
            <span className="relative z-10">
              {liveUrl ? 'INIT :: LIVE_ENVIRONMENT' : 'ACCESS :: REPOSITORY'}
            </span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
