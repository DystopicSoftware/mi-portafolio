import { useRef } from 'react';
import * as THREE from 'three';

export default function BioEmitterChip() {
  const groupRef = useRef<THREE.Group>(null!);
  return <group ref={groupRef} />;
}
