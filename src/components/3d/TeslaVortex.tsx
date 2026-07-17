import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

export default function TeslaVortex({ isActive }: { isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const lineRef = useRef<any>(null!);

  // Caché de Geometría: Pares de segmentos aislados (Sin vértices parásitos entre capas)
  const mandalaPoints = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const N = 9;
    const layers = 8;

    const getPoint = (layerIdx: number, step: number, index: number) => {
      const radius = 4.5 - layerIdx * 0.45;
      const zOffset = layerIdx * -0.15;
      const angle = ((index * step) * 2 * Math.PI) / N - Math.PI / 2;
      return new THREE.Vector3(radius * Math.cos(angle), radius * Math.sin(angle), zOffset);
    };

    for (let layer = 0; layer < layers; layer++) {
      for (let i = 0; i < N; i++) {
        pts.push(getPoint(layer, 1, i)); pts.push(getPoint(layer, 1, i + 1));
      }
      for (let i = 0; i < N; i++) {
        pts.push(getPoint(layer, 2, i)); pts.push(getPoint(layer, 2, i + 1));
      }
      for (let i = 0; i < N; i++) {
        pts.push(getPoint(layer, 4, i)); pts.push(getPoint(layer, 4, i + 1));
      }
    }
    return pts;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !lineRef.current?.material) return;
    const t = state.clock.elapsedTime;

    // 1. Rotación hipnótica y sutil del Grupo Central
    groupRef.current.rotation.z -= delta * 0.12;
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    groupRef.current.rotation.y = Math.cos(t * 0.2) * 0.15;

    // 2. Transición y Pulso Cyberpunk (Preparado para desmontajes futuros)
    const targetBaseOpacity = isActive ? 0.7 : 0.0;
    const pulse = isActive ? 0.2 * Math.sin(t * 2.5) : 0;
    
    lineRef.current.material.opacity = THREE.MathUtils.lerp(
      lineRef.current.material.opacity,
      targetBaseOpacity + pulse,
      delta * 3
    );
  });

  return (
    <group ref={groupRef}>
      <Line
        ref={lineRef}
        points={mandalaPoints}
        segments={true} // Pares aislados: sin líneas parásitas entre capas
        color="#00ffcc" // Cian Neón
        lineWidth={1.5}
        transparent
        depthWrite={false}
        toneMapped={false} // Simula efecto Emissive/Glow
      />
    </group>
  );
}
