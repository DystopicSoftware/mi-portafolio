import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { projectsData } from '../../data/projects';
import ProjectHologram from '../ui/ProjectHologram';

// 4D math constants for a Hypercube (Tesseract)
const vertices4D: number[][] = [];
for (let i = 0; i < 16; i++) {
  vertices4D.push([
    (i & 1) ? 1 : -1,
    (i & 2) ? 1 : -1,
    (i & 4) ? 1 : -1,
    (i & 8) ? 1 : -1
  ]);
}

const edges: number[] = [];
for (let i = 0; i < 16; i++) {
  for (let j = 0; j < 4; j++) {
    const bit = 1 << j;
    if ((i & bit) === 0) {
      edges.push(i, i | bit);
    }
  }
}

function SingleTesseract({ basePos, color, scale, category }: { basePos: THREE.Vector3, color: string, scale: number, category: string | null }) {
  const groupRef = useRef<THREE.Group>(null!);
  const geoRef = useRef<THREE.BufferGeometry>(null!);
  const matRef = useRef<THREE.LineBasicMaterial>(null!);
  const htmlRef = useRef<HTMLDivElement>(null!);
  const activeCategory = usePortfolioStore((state) => state.activeCategory);

  // Local angles for 4D rotations
  const angleRef = useRef({ xw: Math.random() * Math.PI, zw: Math.random() * Math.PI });

  const lineIndices = useMemo(() => new Uint16Array(edges), []);
  const positions3D = useMemo(() => new Float32Array(16 * 3), []);

  useFrame((_, delta) => {
    if (!groupRef.current || !geoRef.current) return;
    const isIntercepted = activeCategory === category && category !== null;

    // Movement & Placement
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

    // Tesseract 4D Rotation Logic (Mutating geometry buffer directly - 0 Re-renders)
    angleRef.current.xw += delta * (isIntercepted ? 0.3 : 0.6);
    angleRef.current.zw += delta * (isIntercepted ? 0.2 : 0.4);
    
    const cxw = Math.cos(angleRef.current.xw);
    const sxw = Math.sin(angleRef.current.xw);
    const czw = Math.cos(angleRef.current.zw);
    const szw = Math.sin(angleRef.current.zw);

    const pos = geoRef.current.attributes.position.array as Float32Array;
    
    for (let i = 0; i < 16; i++) {
      let x = vertices4D[i][0];
      let y = vertices4D[i][1];
      let z = vertices4D[i][2];
      let w = vertices4D[i][3];

      // Rotate in XW plane
      let nx = x * cxw - w * sxw;
      let nw = x * sxw + w * cxw;
      x = nx;
      w = nw;

      // Rotate in ZW plane
      let nz = z * czw - w * szw;
      nw = z * szw + w * czw;
      z = nz;
      w = nw;

      // 4D to 3D Stereographic Projection
      const distance = 2.5;
      const wProj = 1 / (distance - w);
      
      pos[i * 3] = x * wProj;
      pos[i * 3 + 1] = y * wProj;
      pos[i * 3 + 2] = z * wProj;
    }
    
    geoRef.current.attributes.position.needsUpdate = true;

    // UI Updates
    if (htmlRef.current) {
      const targetOp = isIntercepted ? 1 : 0;
      htmlRef.current.style.opacity = THREE.MathUtils.lerp(parseFloat(htmlRef.current.style.opacity) || 0, targetOp, delta * 4).toString();
      htmlRef.current.style.pointerEvents = isIntercepted ? 'auto' : 'none';
    }

    if (matRef.current) {
      matRef.current.opacity = isIntercepted ? 0.3 : 0.6;
    }
  });

  return (
    <group ref={groupRef}>
      <group scale={scale}>
        <lineSegments>
          <bufferGeometry ref={geoRef}>
            <bufferAttribute
              attach="attributes-position"
              args={[positions3D, 3]}
            />
            <bufferAttribute
              attach="index"
              args={[lineIndices, 1]}
            />
          </bufferGeometry>
          <lineBasicMaterial ref={matRef} color={color} transparent depthWrite={false} toneMapped={false} />
        </lineSegments>
      </group>

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
                onClose={() => usePortfolioStore.getState().setActiveCategory(null)}
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
