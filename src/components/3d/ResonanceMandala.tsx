import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { usePortfolioStore } from '../../store/usePortfolioStore';

export default function ResonanceMandala() {
  const groupRef = useRef<THREE.Group>(null!);
  const lineRefs = useRef<any[]>([]);
  // Caché de Geometría: 12 Elipses rotadas formando un mandala 3D
  const curves = useMemo(() => {
    const arr = [];
    const numCurves = 12;
    for (let i = 0; i < numCurves; i++) {
      const curve = new THREE.EllipseCurve(0, 0, 4.5, 1.5, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(64).map(p => new THREE.Vector3(p.x, p.y, 0));
      arr.push({ points, rotationZ: (i * Math.PI) / (numCurves / 2) });
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Leer del store sin disparar re-render
    const activeCategory = usePortfolioStore.getState().activeCategory;
    const isActive = activeCategory !== null;

    // Rotación suave del mandala completo
    groupRef.current.rotation.z = t * 0.05;
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    groupRef.current.rotation.y = Math.cos(t * 0.15) * 0.1;

    // Fade In/Out cuando se abre un menú
    const targetOpacity = isActive ? 0.6 : 0.0;
    const targetScale = isActive ? 1.0 : 0.5;
    
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 3);

    lineRefs.current.forEach((line, i) => {
      if (!line?.material) return;
      const pulse = Math.sin(t * 2 + i) * 0.2;
      line.material.opacity = THREE.MathUtils.lerp(line.material.opacity, targetOpacity + (isActive ? pulse : 0), delta * 4);
    });

    groupRef.current.visible = lineRefs.current[0]?.material.opacity > 0.01;
  });

  return (
    <group ref={groupRef} position={[0, 0, 2]}>
      {curves.map((curve, idx) => (
        <group key={idx} rotation={[0, 0, curve.rotationZ]}>
          <Line
            ref={(el) => { lineRefs.current[idx] = el; }}
            points={curve.points}
            color={idx % 2 === 0 ? "#00ffcc" : "#ffb955"} // Alterna Cian Neón y Ámbar
            lineWidth={1.2}
            transparent
            depthWrite={false}
            toneMapped={false}
          />
        </group>
      ))}
    </group>
  );
}
