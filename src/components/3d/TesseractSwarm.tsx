import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortfolioStore } from '../../store/usePortfolioStore';

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED TESSERACT NODE — El hipercubo interactivo individual
// ─────────────────────────────────────────────────────────────────────────────

const boxGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 2, 2));

// Geometría para las líneas conectivas del hipercubo
const connectorGeo = new THREE.BufferGeometry();
// Conectamos los 8 vértices del cubo interior (escala 0.5) con el cubo exterior (escala 1.0)
const vertices = new Float32Array([
  -1,  1,  1,   -0.5,  0.5,  0.5,
   1,  1,  1,    0.5,  0.5,  0.5,
  -1,  1, -1,   -0.5,  0.5, -0.5,
   1,  1, -1,    0.5,  0.5, -0.5,
  -1, -1,  1,   -0.5, -0.5,  0.5,
   1, -1,  1,    0.5, -0.5,  0.5,
  -1, -1, -1,   -0.5, -0.5, -0.5,
   1, -1, -1,    0.5, -0.5, -0.5,
]);
connectorGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

const PRIMARY_COLOR = new THREE.Color('#00f3ff');
const INTERCEPT_COLOR = new THREE.Color('#a0ffff');

function AnimatedTesseract({ id, baseX, offsetTime = 0 }: { id: string, baseX: number, offsetTime?: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const innerRef = useRef<THREE.Group>(null!);
  const matRef = useRef<THREE.LineBasicMaterial>(null!);
  
  const activeCategory = usePortfolioStore((state) => state.activeCategory);

  useFrame((state, delta) => {
    if (!groupRef.current || !innerRef.current) return;
    const time = state.clock.getElapsedTime() + offsetTime;
    
    // Identificar si este teseracto es el que el usuario seleccionó
    const isActive = activeCategory === id;

    // ── Lógica de Animación Espacial (Lerp) ──
    // Si está activo: vuela al centro (x:0) y avanza (z: 3.5) para asomar detrás del modal.
    // Si no está activo: vuelve a su columna base (baseX) y se queda al fondo (z: -2).
    const targetX = isActive ? 0 : baseX;
    const targetZ = isActive ? 3.5 : -2;
    // Si no está activo, tiene un leve flote orgánico en Y. Si está activo se clava en Y:0.
    const targetY = isActive ? 0 : Math.sin(time * 0.5) * 0.5;

    // Interpolación de posición cinemática suave
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 3);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 3);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, delta * 3);

    // Rotación base constante para dar vida al teseracto
    groupRef.current.rotation.x += delta * 0.15;
    groupRef.current.rotation.y += delta * 0.2;

    // Ilusión de doblez 4D (Tesseract fold) - rotación desfasada del cubo interno
    innerRef.current.rotation.x = Math.sin(time) * 0.5;
    innerRef.current.rotation.y = Math.cos(time) * 0.5;

    // ── Colores y Opacidad ──
    if (matRef.current) {
      if (isActive) {
        // El activo pulsa brillantemente para indicar procesamiento
        const pulse = 0.5 + Math.sin(time * 4) * 0.5;
        matRef.current.color.lerp(INTERCEPT_COLOR, 0.1);
        matRef.current.opacity = THREE.MathUtils.lerp(matRef.current.opacity, 0.4 + (pulse * 0.3), 0.1);
      } else {
        // Los inactivos regresan al cian base
        matRef.current.color.lerp(PRIMARY_COLOR, 0.05);
        // Si algún OTRO está activo, estos bajan su opacidad mucho para no distraer (depth of field ilusorio)
        const targetOp = (activeCategory !== null && !isActive) ? 0.05 : 0.2;
        matRef.current.opacity = THREE.MathUtils.lerp(matRef.current.opacity, targetOp, 0.1);
      }
    }
  });

  return (
    // Escala grande impuesta para que ocupen buena parte de la pantalla (scale=2)
    <group ref={groupRef} position={[baseX, 0, -2]} scale={2}>
      <lineBasicMaterial 
        ref={matRef} 
        color={PRIMARY_COLOR} 
        opacity={0.2} 
        transparent 
        depthWrite={false} 
        toneMapped={false} 
        linewidth={1} 
      />
      
      {/* Cubo Exterior (Escala relativa 1) */}
      <lineSegments geometry={boxGeo} material={matRef.current} />
      
      {/* Cubo Interior (Escala relativa 0.5 para la proyección 4D) */}
      <group ref={innerRef} scale={0.5}>
        <lineSegments geometry={boxGeo} material={matRef.current} />
      </group>

      {/* Vértices Conectores para completar la geometría Teseráctica */}
      <lineSegments geometry={connectorGeo} material={matRef.current} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT COMPONENT: 3 TESERACTOS EN PANTALLA
// ─────────────────────────────────────────────────────────────────────────────

export default function TesseractSwarm() {
  // Las categorías estables del store global (Zustand)
  const nodes = [
    { id: 'edge-computing', baseX: -6 },
    { id: 'hardware', baseX: 0 },
    { id: 'edge-ai', baseX: 6 }
  ];

  return (
    <group>
      {nodes.map((node, i) => (
        <AnimatedTesseract 
          key={node.id} 
          id={node.id} 
          baseX={node.baseX} 
          // Desfase en el tiempo para que no roten idénticos
          offsetTime={i * (Math.PI / 2)} 
        />
      ))}
    </group>
  );
}
