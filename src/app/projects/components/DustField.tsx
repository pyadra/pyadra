import { useRef, useMemo } from 'react';
import { Points, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';

/**
 * Minimal floating dust particles
 * Slow, subtle movement for atmosphere
 */
export function DustField() {
  const pointsRef = useRef<Points>(null);

  const particles = useMemo(() => {
    const count = 180; // Optimized
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities: Vector3[] = [];

    for (let i = 0; i < count; i++) {
      // Spread around camera view
      positions[i * 3] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 1] = Math.random() * 6 + 0.8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 35;

      // Varying sizes for depth
      sizes[i] = Math.random() * 0.04 + 0.015;

      // Slow drift
      velocities.push(
        new Vector3(
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.008
        )
      );
    }

    return { positions, sizes, velocities, count };
  }, []);

  // Animate particles
  useFrame(() => {
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < particles.count; i++) {
        const vel = particles.velocities[i];

        pos[i * 3] += vel.x;
        pos[i * 3 + 1] += vel.y;
        pos[i * 3 + 2] += vel.z;

        // Wrap boundaries
        if (Math.abs(pos[i * 3]) > 18) pos[i * 3] *= -0.8;
        if (pos[i * 3 + 1] > 6.8) pos[i * 3 + 1] = 0.8;
        if (pos[i * 3 + 1] < 0.8) pos[i * 3 + 1] = 6.8;
        if (Math.abs(pos[i * 3 + 2]) > 18) pos[i * 3 + 2] *= -0.8;
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
          count={particles.count}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[particles.sizes, 1]}
          count={particles.count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#8a7a6a"
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
        blending={2}
      />
    </points>
  );
}
