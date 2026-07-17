import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import AmbientDust from './components/3d/AmbientDust'
import BioEmitterChip from './components/3d/BioEmitterChip'
import TesseractSwarm from './components/3d/TesseractSwarm'
import ResonanceMandala from './components/3d/ResonanceMandala'
import { Hero } from './sections/Hero'
import { usePortfolioStore } from './store/usePortfolioStore'

function App() {
  const activeCategory = usePortfolioStore((state) => state.activeCategory);
  const setActiveCategory = usePortfolioStore((state) => state.setActiveCategory);

  return (
    <>
      {activeCategory && (
        <button 
          className="fixed top-8 right-8 z-[9999] w-14 h-14 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-cyan-500/50 text-slate-300 hover:text-cyan-300 hover:bg-white/10 hover:scale-110 transition-all cursor-pointer pointer-events-auto shadow-[0_0_15px_rgba(0,255,204,0.3)]"
          onClick={() => setActiveCategory(null)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      )}
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
            <BioEmitterChip />
            <TesseractSwarm />
            <ResonanceMandala />
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

      <div className="relative z-10 flex flex-col min-h-screen text-slate-300">
        <Hero />
      </div>
    </>
  )
}

export default App
