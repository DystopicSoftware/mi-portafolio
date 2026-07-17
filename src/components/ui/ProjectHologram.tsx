import { ExternalLink, GitBranch, X } from 'lucide-react';

export interface ProjectHologramProps {
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string | null;
  onClose?: () => void;
}

export default function ProjectHologram({
  title,
  description,
  techStack,
  githubUrl,
  liveUrl,
  onClose
}: ProjectHologramProps) {

  return (
    <div className="bg-[#03070a]/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 w-[650px] h-[450px] flex flex-col text-slate-200 pointer-events-auto shadow-[0_0_60px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(255,255,255,0.05)] relative overflow-hidden transition-all">
      
      {/* HEADER ELEGANTE */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
        <div>
          <h2 className="text-3xl font-light tracking-tight text-white/90 font-sans">
            {title}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="text-[9px] font-mono text-cyan-400/80 tracking-[0.2em] uppercase">
              STATUS: CONNECTED
            </span>
          </div>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white transition-colors cursor-pointer pointer-events-auto">
          <X className="w-6 h-6 stroke-[1.5]" />
        </button>
      </div>

      {/* CUERPO ELEGANTE */}
      <div className="grid grid-cols-2 gap-8 flex-1 min-h-0">
        <div className="w-full h-full bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden relative group">
          <span className="font-mono text-white/20 text-xs tracking-widest">[ VIDEO_FEED ]</span>
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <p className="text-sm text-white/60 leading-relaxed font-light text-justify">
            {description}
          </p>
          <div className="mt-2">
            <h4 className="text-[9px] text-white/40 font-mono tracking-[0.15em] mb-3 uppercase border-b border-white/5 pb-1">
              Architecture / Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, i) => (
                <span key={i} className="bg-white/5 border border-white/10 text-white/70 text-[10px] font-sans px-3 py-1.5 rounded-full font-light">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER ELEGANTE */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <a href={liveUrl || githubUrl} target="_blank" rel="noopener noreferrer"
           className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 font-sans text-sm font-light py-3 rounded-xl transition-all cursor-pointer pointer-events-auto">
          {liveUrl ? <ExternalLink className="w-4 h-4 stroke-[1.5]" /> : <GitBranch className="w-4 h-4 stroke-[1.5]" />}
          {liveUrl ? "Inicializar Entorno en Vivo" : "Acceder a Repositorio"}
        </a>
      </div>
    </div>
  );
}
