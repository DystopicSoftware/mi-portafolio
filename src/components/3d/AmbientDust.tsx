import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function AmbientDust() {
  const pointsRef = useRef<THREE.Points>(null!);
  const particlesCount = 2000;

  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y -= delta * 0.05;
    pointsRef.current.rotation.x += delta * 0.02;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#00ffcc" size={0.05} sizeAttenuation={true} depthWrite={false} opacity={0.4} />
    </Points>
  );
}
