import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

/**
 * Sets initial camera rotation to look down at the scene
 */
export function CameraSetup() {
  const { camera } = useThree();

  useEffect(() => {
    // Tilt camera down to look at the artifacts
    camera.rotation.x = -0.3;
  }, [camera]);

  return null;
}
