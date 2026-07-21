import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import AmbientDust from './components/3d/AmbientDust'
import TesseractSwarm from './components/3d/TesseractSwarm'
import OverlayUI from './components/ui/OverlayUI'

function App() {
  // ❌ Cero suscripciones a Zustand aquí. Este componente se renderiza UNA vez.
  
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

      {/* ── Capa 1: UI 2D Reactiva ── */}
      <OverlayUI />
    </>
  )
}

export default App
