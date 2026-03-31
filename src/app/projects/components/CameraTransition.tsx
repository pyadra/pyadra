import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import { useActivationState } from './useActivationState';

/**
 * Handles cinematic camera transitions during artifact activation
 */
export function CameraTransition() {
  const { camera } = useThree();
  const { activeArtifact, state } = useActivationState();
  const originalPosition = useRef({ x: 0, y: 8, z: 12 });
  const originalRotation = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    if (state === 'activating' && activeArtifact) {
      // Store original position
      originalPosition.current = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      };
      originalRotation.current = {
        x: camera.rotation.x,
        y: camera.rotation.y,
        z: camera.rotation.z,
      };

      if (activeArtifact === 'orbit') {
        // Orbit: Move closer and slightly down
        gsap.to(camera.position, {
          x: -4,
          y: 6,
          z: 0,
          duration: 1.8,
          ease: 'power3.inOut',
        });

        gsap.to(camera.rotation, {
          x: -0.1,
          y: -0.15,
          duration: 1.8,
          ease: 'power3.inOut',
        });
      } else if (activeArtifact === 'capsule') {
        // Capsule: Lower and move forward
        gsap.to(camera.position, {
          x: 4,
          y: 4,
          z: 4,
          duration: 2,
          ease: 'power3.inOut',
        });

        gsap.to(camera.rotation, {
          x: -0.2,
          y: 0.12,
          duration: 2,
          ease: 'power3.inOut',
        });
      }
    }
  }, [state, activeArtifact, camera]);

  return null;
}
