import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

/**
 * Subtle camera breathing/drift motion
 * Almost imperceptible - creates feeling of life
 */
export function CameraBreathing() {
  const { camera } = useThree();
  const timeRef = useRef(0);
  const basePosition = useRef({ x: 0, y: 8, z: 12 });

  useFrame((state, delta) => {
    timeRef.current += delta;

    // More noticeable breathing motion - alive feeling
    const breathX = Math.sin(timeRef.current * 0.2) * 0.08;
    const breathY = Math.sin(timeRef.current * 0.3) * 0.06;
    const breathZ = Math.cos(timeRef.current * 0.15) * 0.07;

    // Slow atmospheric drift
    const driftX = Math.sin(timeRef.current * 0.08) * 0.3;
    const driftZ = Math.cos(timeRef.current * 0.1) * 0.25;

    // Apply to camera
    camera.position.x = basePosition.current.x + driftX + breathX;
    camera.position.y = basePosition.current.y + breathY;
    camera.position.z = basePosition.current.z + driftZ + breathZ;

    // More noticeable rotation - scanning feeling
    camera.rotation.y = Math.sin(timeRef.current * 0.06) * 0.02;
    camera.rotation.x = Math.sin(timeRef.current * 0.09) * 0.01;

    camera.updateProjectionMatrix();
  });

  return null;
}
