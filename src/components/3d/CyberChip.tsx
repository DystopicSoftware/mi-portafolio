import { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

export default function CyberChip({ isActive }: { isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const bodyMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const coreMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const pinsMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const pinsMeshRef = useRef<THREE.InstancedMesh>(null!);
  const lineRefs = useRef<any[]>([]);

  // 1. Caché de Trazados (Pistas Ortogonales a 90° y 45°)
  const pcbTraces = useMemo(() => [
    // Pista 1 (Izquierda a Centro)
    [new THREE.Vector3(-1.2, -0.8, 0.11), new THREE.Vector3(-0.8, -0.8, 0.11), new THREE.Vector3(-0.4, -0.4, 0.11), new THREE.Vector3(-0.4, 0.5, 0.11), new THREE.Vector3(-0.2, 0.7, 0.11)],
    // Pista 2 (Derecha a Centro)
    [new THREE.Vector3(1.2, 0.6, 0.11), new THREE.Vector3(0.6, 0.6, 0.11), new THREE.Vector3(0.2, 0.2, 0.11), new THREE.Vector3(0.2, -0.4, 0.11)],
    // Pista 3 (Arriba a Izquierda)
    [new THREE.Vector3(0.5, 1.2, 0.11), new THREE.Vector3(0.5, 0.8, 0.11), new THREE.Vector3(0.8, 0.5, 0.11), new THREE.Vector3(0.8, -0.5, 0.11)],
    // Pista 4 (CPU Core Cuadrado central)
    [new THREE.Vector3(-0.2, -0.2, 0.11), new THREE.Vector3(-0.2, 0.2, 0.11), new THREE.Vector3(0.2, 0.2, 0.11), new THREE.Vector3(0.2, -0.2, 0.11), new THREE.Vector3(-0.2, -0.2, 0.11)],
  ], []);

  // 2. Caché y Posicionamiento de Pines (InstancedMesh)
  const PIN_COUNT = 64; // 16 por lado
  const pinMatrices = useMemo(() => {
    const matrices = [];
    const dummy = new THREE.Object3D();
    const spacing = 2.4 / 16;
    const offset = -1.2 + spacing / 2;

    for (let i = 0; i < 16; i++) {
      // Izquierda
      dummy.position.set(-1.6, offset + i * spacing, 0); dummy.rotation.set(0, 0, 0); dummy.updateMatrix(); matrices.push(dummy.matrix.clone());
      // Derecha
      dummy.position.set(1.6, offset + i * spacing, 0); dummy.rotation.set(0, 0, 0); dummy.updateMatrix(); matrices.push(dummy.matrix.clone());
      // Arriba
      dummy.position.set(offset + i * spacing, 1.6, 0); dummy.rotation.set(0, 0, Math.PI / 2); dummy.updateMatrix(); matrices.push(dummy.matrix.clone());
      // Abajo
      dummy.position.set(offset + i * spacing, -1.6, 0); dummy.rotation.set(0, 0, Math.PI / 2); dummy.updateMatrix(); matrices.push(dummy.matrix.clone());
    }
    return matrices;
  }, []);

  useLayoutEffect(() => {
    if (pinsMeshRef.current) {
      pinMatrices.forEach((matrix, i) => pinsMeshRef.current.setMatrixAt(i, matrix));
      pinsMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [pinMatrices]);

  useFrame((state, delta) => {
    if (!groupRef.current || !bodyMatRef.current || !pinsMatRef.current) return;
    const t = state.clock.elapsedTime;

    // A. Animación de Opacidad (Fade In/Out sin desmontar)
    const targetOpacity = isActive ? 0.9 : 0.0;
    const newBodyOpacity = THREE.MathUtils.lerp(bodyMatRef.current.opacity, targetOpacity * 0.85, delta * 3);
    bodyMatRef.current.opacity = newBodyOpacity;
    if (coreMatRef.current) coreMatRef.current.opacity = newBodyOpacity;
    pinsMatRef.current.opacity = THREE.MathUtils.lerp(pinsMatRef.current.opacity, targetOpacity, delta * 3);

    // B. Rotación del Chip
    groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.4;
    groupRef.current.rotation.x = Math.cos(t * 0.2) * 0.3 + 0.6; // Ligera inclinación para ver la superficie
    groupRef.current.rotation.z = Math.sin(t * 0.15) * 0.1;

    // C. Flujo de Datos en PCB (Animación Cyberpunk)
    // Saltamos matemática pesada si el chip está invisible
    if (bodyMatRef.current.opacity > 0.01) {
      const pulse = Math.abs(Math.sin(t * 2));
      lineRefs.current.forEach((line) => {
        if (line?.material) {
          line.material.dashOffset -= delta * 1.5; // La luz corre por las pistas
          line.material.opacity = THREE.MathUtils.lerp(
            line.material.opacity,
            isActive ? 0.4 + (pulse * 0.6) : 0,
            delta * 4
          );
        }
      });
    }
  });

  return (
    <group ref={groupRef} scale={[2.8, 2.8, 2.8]}>
      {/* Iluminación propia del chip — meshStandardMaterial lo requiere */}
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 5]} intensity={6} color="#00ffcc" />
      <pointLight position={[-3, -3, 4]} intensity={3} color="#7b2fff" />

      {/* Cuerpo del SoC — color verde oscuro PCB para que sea visible */}
      <mesh>
        <boxGeometry args={[3, 3, 0.2]} />
        <meshStandardMaterial
          ref={bodyMatRef}
          color="#0a1f0a"
          transparent
          opacity={0}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* Núcleo CPU elevado — ref propio para mutación en useFrame */}
      <mesh position={[0, 0, 0.12]}>
        <boxGeometry args={[1, 1, 0.06]} />
        <meshStandardMaterial
          ref={coreMatRef}
          color="#111"
          transparent
          opacity={0}
          roughness={0.1}
          metalness={0.95}
          emissive="#00ffcc"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Pines usando InstancedMesh (1 Draw Call) */}
      <instancedMesh ref={pinsMeshRef} args={[undefined, undefined, PIN_COUNT]}>
        <boxGeometry args={[0.3, 0.08, 0.05]} />
        <meshStandardMaterial
          ref={pinsMatRef}
          color="#aaaaaa"
          transparent
          opacity={0}
          roughness={0.3}
          metalness={1}
          emissive="#00ffcc"
          emissiveIntensity={0.1}
        />
      </instancedMesh>

      {/* Trazados Ortogonales del PCB */}
      {pcbTraces.map((points, idx) => (
        <Line
          key={idx}
          ref={(el) => (lineRefs.current[idx] = el)}
          points={points}
          color="#00ffcc"
          lineWidth={2}
          dashed={true}
          dashSize={0.4}
          dashScale={1}
          dashOffset={0}
          gapSize={0.8}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      ))}
    </group>
  );
}
