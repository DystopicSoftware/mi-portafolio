import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

export default function TeslaVortex() {
  const groupRef = useRef<THREE.Group>(null!);
  const lineRef = useRef<any>(null!);

  // Caché de Geometría: Generamos un mandala denso continuo (Sin re-renders)
  const mandalaPoints = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const N = 9; // Base de Tesla 3-6-9
    const layers = 8; // Capas concéntricas para alta densidad

    for (let layer = 0; layer < layers; layer++) {
      const radius = 4.5 - layer * 0.45; 
      const zOffset = layer * -0.15; // Ligera profundidad 3D
      
      // 1. Trazado del Eneágono (salto de 1)
      for (let i = 0; i <= N; i++) {
        const a = (i * 2 * Math.PI) / N;
        pts.push(new THREE.Vector3(radius * Math.cos(a), radius * Math.sin(a), zOffset));
      }
      // 2. Trazado de Estrella (salto de 2)
      for (let i = 0; i <= N; i++) {
        const a = ((i * 2) * 2 * Math.PI) / N;
        pts.push(new THREE.Vector3(radius * Math.cos(a), radius * Math.sin(a), zOffset));
      }
      // 3. Trazado de Estrella Aguda (salto de 4)
      for (let i = 0; i <= N; i++) {
        const a = ((i * 4) * 2 * Math.PI) / N;
        pts.push(new THREE.Vector3(radius * Math.cos(a), radius * Math.sin(a), zOffset));
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
    const targetBaseOpacity = 0.7; // Modificar a 0 en el futuro para un "Fade Out"
    const pulse = 0.2 * Math.sin(t * 2.5); // Latido de neón
    
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
        color="#00ffcc" // Cian Neón
        lineWidth={1.5}
        transparent
        depthWrite={false}
        toneMapped={false} // Simula efecto Emissive/Glow
      />
    </group>
  );
}
