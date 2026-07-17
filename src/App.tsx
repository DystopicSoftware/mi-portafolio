import { Canvas } from '@react-three/fiber'
import SceneManager from './components/3d/SceneManager'
import { Hero } from './sections/Hero'

function App() {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-full bg-[#050505]">
        <Canvas camera={{ position: [0, 0, 9], fov: 60 }}>
          <SceneManager />
        </Canvas>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen text-slate-300">
        <Hero />
      </div>
    </>
  )
}

export default App
