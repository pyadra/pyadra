import { useRef, useEffect } from 'react';
import { AmbientLight, Fog } from 'three';
import { useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import { useActivationState } from './useActivationState';

/**
 * Environment responds to artifact activation
 * TEMPORARY flash of light during activation - returns to dark
 */
export function EnvironmentResponse() {
  const { scene } = useThree();
  const { state } = useActivationState();
  const ambientRef = useRef<AmbientLight | null>(null);
  const fogRef = useRef<Fog | null>(null);
  const originalIntensity = useRef(0.2);

  useEffect(() => {
    // Find ambient light and fog in scene
    scene.traverse((obj) => {
      if (obj instanceof AmbientLight && !ambientRef.current) {
        ambientRef.current = obj;
        originalIntensity.current = obj.intensity;
      }
    });

    if (scene.fog instanceof Fog) {
      fogRef.current = scene.fog;
    }
  }, [scene]);

  useEffect(() => {
    if (state === 'activating' && ambientRef.current) {
      // TEMPORARY flash - automatically returns to original
      gsap.to(ambientRef.current, {
        intensity: originalIntensity.current * 3.0,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
      });

      // Optional fog flash
      if (fogRef.current) {
        const originalNear = fogRef.current.near;
        const originalFar = fogRef.current.far;

        gsap.to(fogRef.current, {
          near: 10,
          far: 35,
          duration: 0.4,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut',
        });
      }
    }
  }, [state]);

  return null;
}
