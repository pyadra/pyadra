import { useRef, useMemo } from 'react';
import { Points, PointsMaterial } from 'three';
import { useFrame } from '@react-three/fiber';

interface EnergyParticlesProps {
  position: [number, number, number];
  count?: number;
  radius?: number;
  color?: string;
  active?: boolean;
}

/**
 * Energy particles that orbit around artifacts
 * More visible when artifact is active
 */
export function EnergyParticles({
  position,
  count = 40,
  radius = 3,
  color = '#d4a574',
  active = false,
}: EnergyParticlesProps) {
  const pointsRef = useRef<Points>(null);
  const timeRef = useRef(0);

  // Generate particle positions in orbit pattern
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const verticalOffset = (Math.random() - 0.5) * 4;
      const radialOffset = Math.random() * radius;

      positions[i * 3] = Math.cos(angle) * radialOffset;
      positions[i * 3 + 1] = verticalOffset;
      positions[i * 3 + 2] = Math.sin(angle) * radialOffset;
    }

    return positions;
  }, [count, radius]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    timeRef.current += delta;

    // Gentle rotation
    pointsRef.current.rotation.y += delta * 0.1;

    // Pulse when active
    const material = pointsRef.current.material as PointsMaterial;
    if (active) {
      const pulse = Math.sin(timeRef.current * 2) * 0.5 + 0.5;
      material.opacity = 0.6 + pulse * 0.4;
      material.size = 0.08 + pulse * 0.04;
    } else {
      material.opacity = 0.15;
      material.size = 0.05;
    }
  });

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
          count={particles.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={color}
        transparent
        opacity={0.15}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
