import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, GitBranch, X, Cpu } from 'lucide-react';
import type { TechItem, TelemetryMetric, I18nString } from '../../data/projects';
import { t } from '../../data/projects';
import { InteractiveSequencer } from './InteractiveSequencer';
import { SystemDiagnostic } from './SystemDiagnostic';
import { preWarmAudioContext } from '../../audio/BassSynthNode';
import { usePortfolioStore } from '../../store/usePortfolioStore';

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
export interface ProjectHologramProps {
  title: I18nString;
  description: I18nString;
  techStack: TechItem[];
  githubUrl: string;
  liveUrl: string | null;
  videoSrc?: string;
  telemetry: TelemetryMetric[];
  onClose: () => void;
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
    <div className="flex flex-wrap gap-3 md:gap-5 border border-cyan-500/20 bg-black/40 px-3 md:px-5 py-2 md:py-3 rounded-md mt-3">
      {metrics.map((t) => (
        <div key={t.label} className="flex flex-col gap-0.5">
          <span className="text-[9px] md:text-[10px] font-mono text-cyan-500/60 tracking-[0.2em] uppercase">
            {t.label}
          </span>
          <span className="text-lg md:text-2xl font-bold text-white leading-none font-mono">
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
  videoSrc,
  telemetry,
  onClose,
}: ProjectHologramProps) {
  const [activeTech, setActiveTech] = useState<string | null>(null);
  const [sequencerOpen, setSequencerOpen] = useState(false);
  const { language } = usePortfolioStore();

  // Resolve bilingual fields for the active language
  const resolvedTitle       = t(title, language);
  const resolvedDescription = t(description, language);
  const isDspProject = resolvedTitle === 'DSP Bass Synth' || resolvedTitle === 'Sintetizador de Bajo DSP';

  return (
    <>
    {/* ── Fullscreen Sequencer Overlay ── */}
    <AnimatePresence>
      {sequencerOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl flex flex-col"
          translate="no"
        >
          {/* Fullscreen header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-black/60 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00e5ff]" />
              <span className="text-[10px] font-mono text-cyan-500/60 tracking-[0.3em] uppercase">SYSTEM :: WASM_DSP_MODULE</span>
            </div>
            <h2 className="hidden sm:block text-base md:text-xl font-black tracking-widest uppercase text-cyan-400 font-mono">DSP BASS SYNTH — INTERACTIVE</h2>
            <button
              onClick={() => setSequencerOpen(false)}
              className="text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all p-2 rounded-lg border border-transparent hover:border-cyan-500/20"
              aria-label="Close sequencer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Sequencer fills the rest — wrapped in hardware feature gate */}
          <div className="flex-1 overflow-hidden p-4 md:p-6">
            <SystemDiagnostic>
              <InteractiveSequencer onClose={() => setSequencerOpen(false)} />
            </SystemDiagnostic>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    {
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
          'w-[95vw] md:w-[90vw] max-w-4xl max-h-[92dvh] min-h-[70dvh]',
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
        <div className="flex justify-between items-start px-4 md:px-10 pt-5 md:pt-8 pb-4 md:pb-6 border-b border-cyan-500/10">
          <div className="flex flex-col gap-3 flex-1 min-w-0">

            {/* Etiqueta de sistema */}
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00e5ff]" />
              <span className="text-[9px] font-mono text-cyan-500/60 tracking-[0.3em] uppercase">
                SYSTEM :: PROJECT_MODULE
              </span>
            </div>

            {/* Título */}
            <h2 className="text-3xl md:text-5xl font-black tracking-widest uppercase text-cyan-400 font-sans leading-none">
              <span>{resolvedTitle}</span>
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
                {/* PASO 2: status labels are fixed strings but we still wrap them
                    defensively — the notranslate boundary is the outer flex div */}
                <span className="text-[9px] font-mono text-cyan-400/70 tracking-[0.2em] uppercase"><span>LIVE</span></span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 flex-1 min-h-0 px-4 md:px-10 py-4 md:py-7">

          {/* Columna Izquierda: Reproductor Holográfico o Standby */}
        <div className="relative w-full h-full min-h-[180px] bg-[#020508]/80 border border-cyan-500/20 rounded-xl overflow-hidden flex items-center justify-center group shadow-inner">
          {isDspProject ? (
            /* DSP project: launch button opens fullscreen sequencer */
            <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full border border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center animate-pulse">
                  <Cpu className="w-8 h-8 text-cyan-400" />
                </div>
                <p className="text-slate-400 font-mono text-sm max-w-[200px] leading-relaxed">
                  Karplus-Strong engine compiled to WebAssembly
                </p>
              </div>
              <button
                id="launch-sequencer-btn"
                onTouchStart={() => preWarmAudioContext()}
                onClick={() => { preWarmAudioContext(); setSequencerOpen(true); }}
                className="group relative flex items-center gap-3 px-6 py-4 font-mono font-bold tracking-widest uppercase text-sm
                  bg-cyan-500/10 hover:bg-cyan-500/20 border-2 border-cyan-400/70 hover:border-cyan-400
                  text-cyan-300 hover:text-cyan-200 rounded-xl transition-all duration-300
                  shadow-[0_0_20px_rgba(0,229,255,0.15)] hover:shadow-[0_0_35px_rgba(0,229,255,0.3)]"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span className="relative z-10">LAUNCH SEQUENCER</span>
              </button>
              <p className="text-slate-600 font-mono text-[10px] tracking-wider">Full-screen · WebAssembly · Web Audio API</p>
            </div>
          ) : videoSrc ? (
            <>
              {/* playsInline y muted son críticos para que el Autoplay funcione en todos los navegadores sin bloquear la UI */}
              <video 
                src={videoSrc} 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen group-hover:opacity-100 transition-opacity duration-500"
              />
              {/* Filtro Scanline Holográfico para integrar el video al estilo Cyberpunk */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,204,0.05)_1px,transparent_1px)] bg-[size:100%_4px] z-10 mix-blend-overlay shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]" />
            </>
          ) : (
            <>
              {/* Diseño Fallback (STANDBY) si no hay video */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,204,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,204,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 border border-cyan-500/30 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-cyan-500/50" />
                </div>
              </div>
              <span className="font-mono text-[10px] text-cyan-500/50 tracking-widest uppercase relative z-10 bg-[#020508] px-3 py-1 border border-cyan-500/20">
                VIDEO_FEED :: STANDBY
              </span>
            </>
          )}
        </div>

          {/* Panel derecho — descripción y stack interactivo */}
          <div className="flex flex-col gap-6 overflow-y-auto pr-1">

            {/* Descripción */}
            <p className="text-base md:text-2xl text-slate-300 font-light leading-relaxed">
              <span>{resolvedDescription}</span>
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
                        'text-sm md:text-lg font-mono px-3 md:px-4 py-1.5 md:py-2 rounded-md tracking-wider transition-all duration-200 cursor-pointer',
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
                        <span>{activeTech}:</span>
                      </span>
                      <span className="text-slate-300 text-sm leading-relaxed">
                        <span>{techStack.find((t) => t.name === activeTech) ? t(techStack.find((tech) => tech.name === activeTech)!.detail, language) : ''}</span>
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
        <div className="px-4 md:px-10 pb-4 md:pb-8 pt-4 md:pt-5 border-t border-cyan-500/10">
          <a
            href={liveUrl || githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={[
              'w-full flex items-center justify-center gap-3',
              'bg-cyan-500/5 hover:bg-cyan-500/10',
              'border border-cyan-500/20 hover:border-cyan-500/50',
              'text-cyan-400 hover:text-cyan-300',
              'font-mono text-sm md:text-xl font-bold tracking-wide uppercase',
              'py-4 md:py-5 rounded-xl',
              'transition-all duration-300 cursor-pointer',
              'relative overflow-hidden group',
            ].join(' ')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            {liveUrl
              ? <ExternalLink className="w-6 h-6 stroke-[2] relative z-10" />
              : <GitBranch className="w-6 h-6 stroke-[2] relative z-10" />}
            {/* PASO 2: ternary produces two different strings in two different
                branches. Without span, each branch is a bare text node that
                Google Translate will wrap in <font>, desyncing React's vDOM. */}
            <span className="relative z-10">
              {liveUrl ? <span>INIT :: LIVE_ENVIRONMENT</span> : <span>ACCESS :: REPOSITORY</span>}
            </span>
          </a>
        </div>
      </motion.div>
    </div>
    }
    </>
  );
}
