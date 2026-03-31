import { useRef } from 'react';
import { Group, Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

interface OrbitRingsProps {
  state: 'buried' | 'detected' | 'awakened';
}

/**
 * Orbit 77 - Orbital rings representing voices circling humanity
 * Multiple rings at different angles = global communication
 * Subtle deep blue emissive = cosmic connectivity
 */
export function OrbitRings({ state }: OrbitRingsProps) {
  const groupRef = useRef<Group>(null);
  const ring1Ref = useRef<Mesh>(null);
  const ring2Ref = useRef<Mesh>(null);
  const ring3Ref = useRef<Mesh>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    timeRef.current += delta;

    // Slow counter-rotating rings
    if (ring1Ref.current) ring1Ref.current.rotation.y += delta * 0.15;
    if (ring2Ref.current) ring2Ref.current.rotation.y -= delta * 0.12;
    if (ring3Ref.current) ring3Ref.current.rotation.y += delta * 0.18;

    // Subtle pulse based on state
    const pulse = Math.sin(timeRef.current * 0.6) * 0.5 + 0.5;

    [ring1Ref, ring2Ref, ring3Ref].forEach((ref) => {
      if (ref.current) {
        const material = ref.current.material as any;

        if (state === 'buried') {
          // Very subtle at rest
          material.emissiveIntensity = 0.15 + pulse * 0.05;
          material.opacity = 0.3 + pulse * 0.1;
        } else if (state === 'detected') {
          // Awakening
          material.emissiveIntensity = 0.3 + pulse * 0.1;
          material.opacity = 0.5 + pulse * 0.15;
        } else if (state === 'awakened') {
          // Activated but still subtle
          material.emissiveIntensity = 0.5 + pulse * 0.15;
          material.opacity = 0.7 + pulse * 0.2;
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Ring 1 - Equatorial */}
      <mesh ref={ring1Ref} rotation={[0, 0, 0]}>
        <torusGeometry args={[2.2, 0.08, 16, 64]} />
        <meshStandardMaterial
          color="#0a0a0f"
          emissive="#1a3a5a"
          emissiveIntensity={0.15}
          transparent
          opacity={0.3}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Ring 2 - Tilted orbit */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.0, 0.08, 16, 64]} />
        <meshStandardMaterial
          color="#0a0a0f"
          emissive="#2a4a6a"
          emissiveIntensity={0.15}
          transparent
          opacity={0.3}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Ring 3 - Perpendicular orbit */}
      <mesh ref={ring3Ref} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
        <torusGeometry args={[1.8, 0.08, 16, 64]} />
        <meshStandardMaterial
          color="#0a0a0f"
          emissive="#3a5a7a"
          emissiveIntensity={0.15}
          transparent
          opacity={0.3}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Core sphere - small, subtle */}
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color="#0a0a0f"
          emissive="#4a6a8a"
          emissiveIntensity={0.2}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Subtle point light */}
      <pointLight position={[0, 0, 0]} intensity={3} distance={12} color="#2a4a6a" />
    </group>
  );
}
