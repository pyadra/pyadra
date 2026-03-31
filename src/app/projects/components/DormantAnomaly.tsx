import { useRef, useState } from 'react';
import { PointLight, Vector3 } from 'three';
import { useFrame, useThree } from '@react-three/fiber';

/**
 * DORMANT ANOMALY
 * Subtle hint of future buried artifact
 * Reacts to lantern proximity without revealing full form
 */

interface DormantAnomalyProps {
  position: [number, number, number];
  color?: string;
}

export function DormantAnomaly({
  position,
  color = '#4a3a28'
}: DormantAnomalyProps) {
  const lightRef = useRef<PointLight>(null);
  const timeRef = useRef(0);
  const { camera } = useThree();
  const [lanternDistance, setLanternDistance] = useState(100);

  useFrame((state, delta) => {
    if (!lightRef.current) return;

    timeRef.current += delta;

    // Calculate distance to camera (lantern follows camera view)
    const pos = new Vector3(...position);
    const dist = camera.position.distanceTo(pos);
    setLanternDistance(dist);

    // Very subtle pulse - almost imperceptible when far
    const basePulse = Math.sin(timeRef.current * 0.3) * 0.5 + 0.5;

    // React to lantern proximity
    let intensity = 0;
    if (dist < 20) {
      // Closer the lantern, brighter the underground response
      const proximityFactor = 1 - (dist / 20);
      intensity = proximityFactor * 0.15 + basePulse * 0.05;
    } else {
      // Very faint baseline pulse when far
      intensity = basePulse * 0.02;
    }

    lightRef.current.intensity = intensity;
  });

  return (
    <>
      {/* Buried light source - hints at presence */}
      <pointLight
        ref={lightRef}
        position={position}
        color={color}
        intensity={0.02}
        distance={4}
        decay={2}
      />

      {/* Very subtle buried geometry hint - only visible up close */}
      {lanternDistance < 12 && (
        <mesh position={position}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial
            color="#2a2018"
            emissive={color}
            emissiveIntensity={0.08}
            roughness={0.95}
            metalness={0.1}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
    </>
  );
}
