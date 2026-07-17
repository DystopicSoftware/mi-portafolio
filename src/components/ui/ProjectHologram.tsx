import { ExternalLink, GitBranch, X, Terminal } from 'lucide-react';

export interface ProjectHologramProps {
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string | null;
}

export default function ProjectHologram({
  title,
  description,
  techStack,
  githubUrl,
  liveUrl
}: ProjectHologramProps) {

  return (
    <div className="relative w-[1000px] min-h-[600px] rounded-2xl pointer-events-auto shadow-[0_0_60px_rgba(0,255,204,0.15)] group">
      {/* Capa Base: Blur y Bordes independientes */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl border-2 border-cyan-500/30 rounded-2xl z-0 pointer-events-none" />

      {/* Capa de Contenido Elevada: z-10 y antialiased */}
      <div className="relative z-10 flex flex-col w-full h-full p-10 antialiased text-slate-200">
        
        {/* HEADER FLEX STRICT */}
        <div className="flex justify-between items-start w-full mb-6 relative z-50 border-b border-cyan-500/30 pb-5">
          {/* Grupo de Texto */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Terminal className="w-8 h-8 text-cyan-400" />
              <h2 className="text-4xl font-bold font-mono text-cyan-50 tracking-wider uppercase drop-shadow-md">
                {title}
              </h2>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39ff14] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#39ff14]"></span>
              </span>
              <span className="text-sm font-mono text-[#39ff14] tracking-widest uppercase">
                STATUS: ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* CUERPO */}
        <div className="grid grid-cols-2 gap-10 flex-1 min-h-0 py-8">
          {/* Placeholder Video */}
          <div className="w-full h-full bg-slate-800/50 border-2 border-slate-600 rounded-xl flex items-center justify-center animate-pulse shadow-inner relative overflow-hidden group-hover:border-cyan-500/40 transition-colors">
            <span className="font-mono text-slate-400 text-lg tracking-widest relative z-10">
              [ VIDEO PLACEHOLDER ]
            </span>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,204,0.05)_2px,transparent_2px)] bg-[size:100%_8px] pointer-events-none z-10" />
          </div>

          {/* Info y Badges */}
          <div className="flex flex-col gap-6 overflow-y-auto pr-4">
            <p className="text-xl text-slate-300 leading-relaxed font-sans text-justify">
              {description}
            </p>
            <div className="mt-2">
              <h4 className="text-sm text-cyan-500/70 font-mono tracking-widest mb-4 uppercase">STACK:</h4>
              <div className="flex flex-wrap gap-3">
                {techStack.map((tech, i) => (
                  <span key={i} className="bg-cyan-900/40 border border-cyan-800/60 text-cyan-300 text-sm font-mono px-4 py-2 rounded-md shadow-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER (Enlaces Dinámicos) */}
        <div className="mt-auto pt-6 border-t border-cyan-500/20">
          {liveUrl ? (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/50 text-cyan-400 font-mono text-base tracking-widest py-4 rounded-lg transition-colors cursor-pointer shadow-sm hover:shadow-cyan-500/20"
            >
              <ExternalLink className="w-5 h-5" />
              &gt;&gt; INICIALIZAR ENTORNO EN VIVO &lt;&lt;
            </a>
          ) : (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 bg-slate-900/40 hover:bg-slate-800/60 border border-slate-500/50 text-slate-300 font-mono text-base tracking-widest py-4 rounded-lg transition-colors cursor-pointer shadow-sm hover:shadow-slate-500/20"
            >
              <GitBranch className="w-5 h-5" />
              &gt;&gt; ACCEDER A REPOSITORIO &lt;&lt;
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
