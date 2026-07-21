import { useEffect, useRef } from 'react'
import { Hero } from '../../sections/Hero'
import ProjectHologram from './ProjectHologram'
import { AiTerminal } from './AiTerminal'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import { projectsData } from '../../data/projects'

export default function OverlayUI() {
  const activeCategory = usePortfolioStore((state) => state.activeCategory);
  const setActiveCategory = usePortfolioStore((state) => state.setActiveCategory);

  const activeProject = activeCategory ? projectsData[activeCategory] : null;

  const uiContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (uiContainerRef.current) {

    }
  }, [activeCategory]);

  return (
    <>
      {/* ── Capa 1: Hero / UI 2D ── */}
      {/* inert bloquea el 100% de la interacción cuando el modal está abierto (via useEffect) */}
      <div
        ref={uiContainerRef}
        className="relative z-10 flex flex-col min-h-screen text-slate-300"
      >
        <Hero />
      </div>

      {/* ── Capa 2: Modal 2D de proyecto — z-[9999], completamente sobre todo ── */}
      {/* AnimatePresence permitiría exit animation si se envuelve aquí en el futuro */}
      {activeProject && (
        <ProjectHologram
          title={activeProject.title}
          description={activeProject.description}
          techStack={activeProject.techStack}
          githubUrl={activeProject.githubUrl}
          liveUrl={activeProject.liveUrl}
          videoSrc={activeProject.videoSrc}
          telemetry={activeProject.telemetry}
          onClose={() => setActiveCategory(null)}
        />
      )}

      {/* ── Terminal IA Flotante ── */}
      <AiTerminal />
    </>
  );
}
