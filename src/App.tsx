import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import AmbientDust from './components/3d/AmbientDust'
import TesseractSwarm from './components/3d/TesseractSwarm'
import { Hero } from './sections/Hero'
import ProjectHologram from './components/ui/ProjectHologram'
import { usePortfolioStore } from './store/usePortfolioStore'
import { projectsData } from './data/projects'

function App() {
  const activeCategory    = usePortfolioStore((state) => state.activeCategory);
  const setActiveCategory = usePortfolioStore((state) => state.setActiveCategory);

  const activeProject = activeCategory ? projectsData[activeCategory] : null;

  return (
    <>
      {/* ── Capa 0: Canvas 3D (fondo, pointer-events bloqueados al nivel del div) ── */}
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-full bg-[#030406]">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ powerPreference: 'high-performance', antialias: false, alpha: true }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={2.0} color="#ffffff" />

          <Suspense fallback={null}>
            <AmbientDust />
            <TesseractSwarm />
          </Suspense>

          <EffectComposer>
            <Bloom
              luminanceThreshold={0.2}
              mipmapBlur
              intensity={1.8}
              radius={0.8}
            />
          </EffectComposer>
        </Canvas>
      </div>

      {/* ── Capa 1: Hero / UI 2D ── */}
      {/* inert bloquea el 100% de la interacción cuando el modal está abierto */}
      <div
        {...(activeCategory ? { inert: '' } : {})}
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
          telemetry={activeProject.telemetry}
          onClose={() => setActiveCategory(null)}
        />
      )}
    </>
  )
}

export default App
