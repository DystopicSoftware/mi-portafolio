import { useRef, useMemo } from 'react';
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
  -1, 1, 1, -0.5, 0.5, 0.5,
  1, 1, 1, 0.5, 0.5, 0.5,
  -1, 1, -1, -0.5, 0.5, -0.5,
  1, 1, -1, 0.5, 0.5, -0.5,
  -1, -1, 1, -0.5, -0.5, 0.5,
  1, -1, 1, 0.5, -0.5, 0.5,
  -1, -1, -1, -0.5, -0.5, -0.5,
  1, -1, -1, 0.5, -0.5, -0.5,
]);
connectorGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

const PRIMARY_COLOR = new THREE.Color('#00f3ff');
const INTERCEPT_COLOR = new THREE.Color('#a0ffff');

function AnimatedTesseract({ id, baseX, offsetTime = 0 }: { id: string, baseX: number, offsetTime?: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const innerRef = useRef<THREE.Group>(null!);

  const activeCategory = usePortfolioStore((state) => state.activeCategory);

  // 1. SOLUCIÓN MAGISTRAL: Creamos el material ANTES del primer render
  // Usamos .clone() para que cada teseracto tenga su propio color de forma independiente
  const tesseractMaterial = useMemo(() => new THREE.LineBasicMaterial({
    color: PRIMARY_COLOR.clone(),
    opacity: 0.5,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    linewidth: 1
  }), []);

  useFrame((state, delta) => {
    if (!groupRef.current || !innerRef.current) return;
    const time = state.clock.getElapsedTime() + offsetTime;

    // Identificar si este teseracto es el que el usuario seleccionó
    const isActive = activeCategory === id;

    // ── Lógica de Animación Espacial ──
    const targetX = isActive ? 0 : baseX;
    const targetZ = isActive ? 3 : -5;
    const targetY = isActive ? 0 : Math.sin(time * 0.5) * 0.5;

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 3);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 3);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, delta * 3);

    groupRef.current.rotation.x += delta * 0.15;
    groupRef.current.rotation.y += delta * 0.2;

    innerRef.current.rotation.x = Math.sin(time) * 0.5;
    innerRef.current.rotation.y = Math.cos(time) * 0.5;

    // 2. Colores: Actualizamos el material que está en memoria
    if (isActive) {
      tesseractMaterial.color.lerp(INTERCEPT_COLOR, 0.1);
    } else {
      tesseractMaterial.color.lerp(PRIMARY_COLOR, 0.05);
    }
  });

  return (
    // Escala grande impuesta para que ocupen buena parte de la pantalla (scale=2)
    <group ref={groupRef} position={[baseX, 0, -5]} scale={2}>

      {/* Cubo Exterior (Escala relativa 1) */}
      <lineSegments geometry={boxGeo} material={tesseractMaterial} />

      {/* Cubo Interior (Escala relativa 0.5 para la proyección 4D) */}
      <group ref={innerRef} scale={0.5}>
        <lineSegments geometry={boxGeo} material={tesseractMaterial} />
      </group>

      {/* Vértices Conectores para completar la geometría Teseráctica */}
      <lineSegments geometry={connectorGeo} material={tesseractMaterial} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT COMPONENT: 3 TESERACTOS EN PANTALLA
// ─────────────────────────────────────────────────────────────────────────────

export default function TesseractSwarm() {
  // Las categorías estables del store global (Zustand)
  const nodes = [
    { id: 'edge-computing', baseX: -4 },
    { id: 'hardware', baseX: 0 },
    { id: 'edge-ai', baseX: 4 }
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
