import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

export default function Tesseract({ isActive }: { isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const lineRef = useRef<any>(null!);

  // Caché de Topología 4D (Calculado 1 sola vez)
  const { vertices4D, edges } = useMemo(() => {
    const v4D = [];
    // 16 vértices del hipercubo: (+-1, +-1, +-1, +-1)
    for (let i = 0; i < 16; i++) {
      v4D.push([
        (i & 1) ? 1 : -1,
        (i & 2) ? 1 : -1,
        (i & 4) ? 1 : -1,
        (i & 8) ? 1 : -1,
      ]);
    }
    const edgeList = [];
    // 32 aristas: se conectan si difieren en exactamente 1 bit
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        const diff = i ^ j;
        if (diff === 1 || diff === 2 || diff === 4 || diff === 8) {
          edgeList.push([i, j]);
        }
      }
    }
    return { vertices4D: v4D, edges: edgeList };
  }, []);

  // Puntos iniciales: instancias independientes (Array.fill copia la misma referencia)
  const initialPoints = useMemo(() => {
    return Array.from({ length: 64 }, () => new THREE.Vector3());
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !lineRef.current?.geometry) return;
    const t = state.clock.elapsedTime;

    // 1. Animación de Opacidad Fade In/Out
    const targetOpacity = isActive ? 0.8 : 0.0;
    const pulse = isActive ? 0.2 * Math.sin(t * 3) : 0;
    lineRef.current.material.opacity = THREE.MathUtils.lerp(
      lineRef.current.material.opacity,
      targetOpacity + pulse,
      delta * 3
    );

    // Si está invisible, saltamos la matemática 4D pesada para ahorrar CPU
    if (lineRef.current.material.opacity < 0.01) return;

    // 2. Rotación Orgánica del Grupo 3D
    groupRef.current.rotation.y = t * 0.15;
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;

    // 3. Matemática de Rotación 4D y Proyección Estereográfica
    const angleXW = t * 0.5;
    const angleZW = t * 0.3;
    const positions = new Float32Array(edges.length * 2 * 3); // 32 aristas * 2 puntos * 3 ejes
    let idx = 0;

    for (let i = 0; i < edges.length; i++) {
      const [v1, v2] = edges[i];
      for (const v of [v1, v2]) {
        let [x, y, z, w] = vertices4D[v];

        // Rotación en el plano XW (Causa la expansión/contracción del hipercubo)
        const nx = x * Math.cos(angleXW) - w * Math.sin(angleXW);
        let nw = x * Math.sin(angleXW) + w * Math.cos(angleXW);
        x = nx;
        w = nw;

        // Rotación en el plano ZW
        const nz = z * Math.cos(angleZW) - w * Math.sin(angleZW);
        nw = z * Math.sin(angleZW) + w * Math.cos(angleZW);
        z = nz;
        w = nw;

        // Proyección 4D a 3D
        const distance = 2.5;
        const w_proj = 1 / (distance - w);
        const scale = 2.8; // Tamaño general

        positions[idx++] = x * w_proj * scale;
        positions[idx++] = y * w_proj * scale;
        positions[idx++] = z * w_proj * scale;
      }
    }

    // Inyección directa a la GPU sin re-renderizar React
    lineRef.current.geometry.setPositions(positions);
  });

  return (
    <group ref={groupRef}>
      <Line
        ref={lineRef}
        points={initialPoints}
        segments={true} // Obligatorio para trazar aristas separadas
        color="#00ffcc"
        lineWidth={1.8}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </group>
  );
}
