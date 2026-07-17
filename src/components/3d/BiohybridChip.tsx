import { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

// --- GLSL Shaders ---
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  float random(in vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }
  float noise(in vec2 st) {
      vec2 i = floor(st); vec2 f = fract(st);
      float a = random(i); float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
      vec2 uv = vUv * 4.0; 
      float n = 0.0; float amp = 0.5; vec2 p = uv + uTime * 0.15;
      for (int i = 0; i < 4; i++) {
          n += amp * abs(noise(p) * 2.0 - 1.0);
          p *= 2.0; amp *= 0.5;
      }
      n = 1.0 - n; n = pow(n, 3.5); 

      vec3 bioColor = vec3(0.0, 1.0, 0.4); 
      float pulse = (sin(uTime * 4.0 - uv.y * 10.0) * 0.5 + 0.5) * 0.6 + 0.4;
      vec3 finalColor = bioColor * n * pulse;
      
      // Alpha clamp para evitar cuadros oscuros
      float alpha = clamp(n * 2.5, 0.0, 1.0);
      gl_FragColor = vec4(finalColor, alpha);
  }
`;

export default function BiohybridChip({ isActive }: { isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const pinsMeshRef = useRef<THREE.InstancedMesh>(null!);
  const lineRefs = useRef<any[]>([]);

  // 1. Material Biohíbrido (Regla Estricta: AdditiveBlending + depthWrite false)
  const bioMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }), []);

  // 2. Caché de Trazados Ortogonales (Plano XZ, Y=0.11)
  const pcbTraces = useMemo(() => [
    [new THREE.Vector3(-1.2, 0.11, 0.5), new THREE.Vector3(-0.6, 0.11, 0.5), new THREE.Vector3(-0.2, 0.11, 0.1), new THREE.Vector3(-0.2, 0.11, -0.6)],
    [new THREE.Vector3(1.2, 0.11, -0.5), new THREE.Vector3(0.6, 0.11, -0.5), new THREE.Vector3(0.2, 0.11, -0.1), new THREE.Vector3(0.2, 0.11, 0.6)],
    [new THREE.Vector3(-0.5, 0.11, -1.2), new THREE.Vector3(-0.5, 0.11, -0.8), new THREE.Vector3(0.8, 0.11, -0.8)],
  ], []);

  // 3. Caché de Pines Realistas y Densos (128 pines, 32 por lado)
  const PIN_COUNT = 128;
  const pinMatrices = useMemo(() => {
    const matrices = [];
    const dummy = new THREE.Object3D();
    const PINS_PER_SIDE = 32;
    const spacing = 2.8 / PINS_PER_SIDE;
    const startOffset = -1.4 + spacing / 2;

    for (let i = 0; i < PINS_PER_SIDE; i++) {
      const pos = startOffset + i * spacing;
      // Lado Izquierdo (X = -1.55)
      dummy.position.set(-1.55, 0, pos); dummy.rotation.set(0, 0, 0); dummy.updateMatrix(); matrices.push(dummy.matrix.clone());
      // Lado Derecho (X = 1.55)
      dummy.position.set(1.55, 0, pos); dummy.rotation.set(0, 0, 0); dummy.updateMatrix(); matrices.push(dummy.matrix.clone());
      // Lado Superior (Z = -1.55)
      dummy.position.set(pos, 0, -1.55); dummy.rotation.set(0, Math.PI / 2, 0); dummy.updateMatrix(); matrices.push(dummy.matrix.clone());
      // Lado Inferior (Z = 1.55)
      dummy.position.set(pos, 0, 1.55); dummy.rotation.set(0, Math.PI / 2, 0); dummy.updateMatrix(); matrices.push(dummy.matrix.clone());
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
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // A. Transición por Escala (Debido a que el cuerpo es sólido/sin transparencia)
    const targetScale = isActive ? 1.0 : 0.001;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 4);

    // Evitar cálculos si está invisible
    if (groupRef.current.scale.x < 0.01) return;

    // B. Rotación del Componente (Inclinado para ver la superficie XZ)
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.15 + 0.8; // 0.8 rads para volcarlo hacia la cámara
    groupRef.current.rotation.y = Math.cos(t * 0.15) * 0.2;
    groupRef.current.rotation.z = Math.sin(t * 0.1) * 0.1;

    // C. Animación del Shader Orgánico
    bioMaterial.uniforms.uTime.value = t;

    // D. Flujo Eléctrico en Trazados (Opacidad controlada manual)
    const elecPulse = Math.abs(Math.cos(t * 2.5));
    lineRefs.current.forEach((line) => {
      if (line?.material) {
        line.material.dashOffset -= delta * 1.5;
        line.material.opacity = THREE.MathUtils.lerp(
          line.material.opacity,
          isActive ? 0.2 + (elecPulse * 0.8) : 0,
          delta * 4
        );
      }
    });
  });

  return (
    <group ref={groupRef} scale={[0.001, 0.001, 0.001]}>
      {/* Iluminación propia del BiohybridChip */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 5, 3]} intensity={6} color="#ffffff" />
      <pointLight position={[3, 3, 0]} intensity={4} color="#00ff66" />
      <pointLight position={[-3, 2, 0]} intensity={3} color="#0066ff" />

      {/* Base de Hardware (Opaca, Carbón Sólido) */}
      <mesh>
        <boxGeometry args={[3, 0.2, 3]} />
        <meshStandardMaterial color="#111214" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Núcleo Central (Procesador) */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[1, 0.05, 1]} />
        <meshStandardMaterial color="#050505" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Capa de Tejido Vivo (Plano superpuesto, rotado a XZ) */}
      <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.8, 2.8, 32, 32]} />
        <primitive object={bioMaterial} attach="material" />
      </mesh>

      {/* Pines de Conexión Ultradelgados (Metálicos) */}
      <instancedMesh ref={pinsMeshRef} args={[undefined, undefined, PIN_COUNT]}>
        <boxGeometry args={[0.06, 0.15, 0.2]} />
        <meshStandardMaterial color="#a0a5aa" roughness={0.4} metalness={0.9} />
      </instancedMesh>

      {/* Pistas Ortogonales */}
      {pcbTraces.map((points, idx) => (
        <Line
          key={idx}
          ref={(el) => (lineRefs.current[idx] = el)}
          points={points}
          color="#00ffcc"
          lineWidth={2}
          dashed={true}
          dashSize={0.2}
          dashScale={1}
          dashOffset={0}
          gapSize={0.5}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      ))}
    </group>
  );
}
