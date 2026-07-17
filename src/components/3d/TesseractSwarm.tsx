import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { projectsData } from '../../data/projects';
import ProjectHologram from '../ui/ProjectHologram';

function SingleTesseract({ basePos, color, scale, category }: { basePos: THREE.Vector3, color: string, scale: number, category: string | null }) {
  const groupRef = useRef<THREE.Group>(null!);
  const lineRef = useRef<any>(null!);
  const htmlRef = useRef<HTMLDivElement>(null!);
  const activeCategory = usePortfolioStore((state) => state.activeCategory);

  const tesseractPoints = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 16; i++) {
      pts.push(new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2));
    }
    return pts;
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current || !lineRef.current?.material) return;
    const isIntercepted = activeCategory === category && category !== null;

    const fallSpeed = isIntercepted ? 0 : 0.5;
    basePos.y -= delta * fallSpeed;
    if (basePos.y < -10 && !isIntercepted) basePos.y = 10;

    const targetPos = isIntercepted ? new THREE.Vector3(0, 0, 4) : basePos;
    groupRef.current.position.lerp(targetPos, delta * 4);

    if (isIntercepted) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, delta * 4);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, delta * 4);
    } else {
      groupRef.current.rotation.x += delta * 0.2;
      groupRef.current.rotation.y += delta * 0.3;
    }

    if (htmlRef.current) {
      const targetOp = isIntercepted ? 1 : 0;
      htmlRef.current.style.opacity = THREE.MathUtils.lerp(parseFloat(htmlRef.current.style.opacity) || 0, targetOp, delta * 4).toString();
      htmlRef.current.style.pointerEvents = isIntercepted ? 'auto' : 'none';
    }

    lineRef.current.material.opacity = isIntercepted ? 0.3 : 0.6;
  });

  return (
    <group ref={groupRef} scale={scale}>
      <Line ref={lineRef} points={tesseractPoints} color={color} lineWidth={1.5} transparent depthWrite={false} />
      {category && (
        <Html 
          transform 
          center 
          distanceFactor={2.2} 
          occlude={false} 
          zIndexRange={[100, 0]}
        >
          <div 
            ref={htmlRef} 
            style={{ 
              opacity: 0, 
              pointerEvents: 'none', 
              transition: 'none',
              WebkitFontSmoothing: 'antialiased', 
              transformStyle: 'preserve-3d', 
              backfaceVisibility: 'hidden'
            }}
          >
            {projectsData[category] ? (
              <ProjectHologram 
                title={projectsData[category].title}
                description={projectsData[category].description}
                techStack={projectsData[category].techStack}
                githubUrl={projectsData[category].githubUrl}
                liveUrl={projectsData[category].liveUrl}
              />
            ) : (
              <div className="w-64 p-4 text-cyan-400 font-mono text-sm border border-cyan-500 bg-black/80 rounded">
                No data for {category}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function TesseractSwarm() {
  const swarmData = useMemo(() => {
    const arr = [];
    const categories = ['edge-computing', 'hardware', 'edge-ai'];
    for (let i = 0; i < 15; i++) {
      arr.push({
        basePos: new THREE.Vector3((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10 - 5),
        color: i % 2 === 0 ? '#00ffcc' : '#00bfff',
        scale: Math.random() * 0.5 + 0.3,
        category: i < 3 ? categories[i] : null
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {swarmData.map((data, i) => (
        <SingleTesseract key={i} {...data} />
      ))}
    </group>
  );
}
