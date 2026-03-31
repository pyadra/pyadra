import { useRef, useMemo } from 'react';
import { Group, Mesh, BufferGeometry, Float32BufferAttribute } from 'three';
import { useFrame } from '@react-three/fiber';

interface CapsuleMonolithProps {
  state: 'buried' | 'detected' | 'awakened';
}

/**
 * EtherniCapsule - Crystalline monolith preserving time
 * Hexagonal prism = sacred geometry
 * Subtle gold emissive = timeless preservation
 * Vertical structure = monument to memory
 */
export function CapsuleMonolith({ state }: CapsuleMonolithProps) {
  const groupRef = useRef<Group>(null);
  const monolithRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const timeRef = useRef(0);

  // Create hexagonal prism geometry
  const hexGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];
    const sides = 6;
    const radius = 0.6;
    const height = 4.5;

    // Bottom vertices
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      vertices.push(
        Math.cos(angle) * radius,
        -height / 2,
        Math.sin(angle) * radius
      );
    }

    // Top vertices
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      vertices.push(
        Math.cos(angle) * radius * 0.9, // Slight taper
        height / 2,
        Math.sin(angle) * radius * 0.9
      );
    }

    // Bottom cap center
    vertices.push(0, -height / 2, 0);
    // Top cap center
    vertices.push(0, height / 2, 0);

    const bottomCenter = sides * 2;
    const topCenter = sides * 2 + 1;

    // Side faces
    for (let i = 0; i < sides; i++) {
      const next = (i + 1) % sides;
      // Triangle 1
      indices.push(i, next, i + sides);
      // Triangle 2
      indices.push(next, next + sides, i + sides);
    }

    // Bottom cap
    for (let i = 0; i < sides; i++) {
      const next = (i + 1) % sides;
      indices.push(bottomCenter, next, i);
    }

    // Top cap
    for (let i = 0; i < sides; i++) {
      const next = (i + 1) % sides;
      indices.push(topCenter, i + sides, next + sides);
    }

    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current || !monolithRef.current || !glowRef.current) return;

    timeRef.current += delta;

    // Very subtle rotation
    groupRef.current.rotation.y += delta * 0.05;

    const pulse = Math.sin(timeRef.current * 0.4) * 0.5 + 0.5;

    const material = monolithRef.current.material as any;
    const glowMaterial = glowRef.current.material as any;

    if (state === 'buried') {
      // Extremely subtle at rest
      material.emissiveIntensity = 0.12 + pulse * 0.03;
      glowMaterial.opacity = 0.08 + pulse * 0.02;
    } else if (state === 'detected') {
      // Gentle awakening
      material.emissiveIntensity = 0.25 + pulse * 0.08;
      glowMaterial.opacity = 0.15 + pulse * 0.05;
    } else if (state === 'awakened') {
      // Still subtle but present
      material.emissiveIntensity = 0.4 + pulse * 0.12;
      glowMaterial.opacity = 0.25 + pulse * 0.1;
      // Slight levitation
      groupRef.current.position.y = Math.sin(timeRef.current * 0.3) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main monolith */}
      <mesh ref={monolithRef} geometry={hexGeometry}>
        <meshStandardMaterial
          color="#0f0f0f"
          emissive="#6a5a3a"
          emissiveIntensity={0.12}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Inner glow - slightly smaller hex */}
      <mesh ref={glowRef} geometry={hexGeometry} scale={[0.95, 0.98, 0.95]}>
        <meshBasicMaterial
          color="#d4a574"
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Subtle golden light from within */}
      <pointLight position={[0, 0, 0]} intensity={2.5} distance={10} color="#6a5a3a" />
      <pointLight position={[0, 1.5, 0]} intensity={1.5} distance={8} color="#8a7a5a" />
    </group>
  );
}
