import { useRef } from 'react';
import { Group } from 'three';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { useArtifactState } from './useArtifactState';
import { useActivationState } from './useActivationState';
import { OrbitRings } from './OrbitRings';

/**
 * ORBIT ARTIFACT
 * Orbital rings representing global voices and communication
 * Deep blue cosmic connectivity
 */
export function OrbitArtifact() {
  const groupRef = useRef<Group>(null);
  const router = useRouter();
  const { state, detect, undetect, awaken } = useArtifactState();
  const { canActivate, setActivating, setTransitioning } = useActivationState();
  const isActivating = useRef(false);

  // Activation sequence
  const handleActivation = () => {
    if (!canActivate('orbit') || isActivating.current) return;

    isActivating.current = true;
    awaken();
    setActivating('orbit');

    // Activation animation sequence
    setTimeout(() => {
      if (groupRef.current) {
        // Scale up rings dramatically
        gsap.to(groupRef.current.scale, {
          x: 1.5,
          y: 1.5,
          z: 1.5,
          duration: 1.5,
          ease: 'power3.inOut',
        });

        // Spin faster
        gsap.to(groupRef.current.rotation, {
          y: groupRef.current.rotation.y + Math.PI * 3,
          duration: 1.5,
          ease: 'power2.inOut',
        });
      }

      // Navigate after animation
      setTimeout(() => {
        setTransitioning();
        router.push('/projects/orbit');
      }, 1800);
    }, 200);
  };

  return (
    <group
      ref={groupRef}
      position={[-6, 1.0, -2]}
      onPointerEnter={detect}
      onPointerLeave={undetect}
      onClick={(e) => {
        e.stopPropagation();
        handleActivation();
      }}
    >
      <OrbitRings state={state} />
    </group>
  );
}
