import { useRef } from 'react';
import { Group } from 'three';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { useArtifactState } from './useArtifactState';
import { useActivationState } from './useActivationState';
import { CapsuleMonolith } from './CapsuleMonolith';

/**
 * ETERNITY CAPSULE ARTIFACT
 * Hexagonal monolith preserving time and memory
 * Subtle gold emissive - sacred geometry
 */
export function CapsuleArtifact() {
  const groupRef = useRef<Group>(null);
  const router = useRouter();
  const { state, detect, undetect, awaken } = useArtifactState();
  const { canActivate, setActivating, setTransitioning } = useActivationState();
  const isActivating = useRef(false);

  // Activation sequence
  const handleActivation = () => {
    if (!canActivate('capsule') || isActivating.current) return;

    isActivating.current = true;
    awaken();
    setActivating('capsule');

    // Activation animation sequence
    setTimeout(() => {
      if (groupRef.current) {
        // Monolith rises dramatically
        gsap.to(groupRef.current.position, {
          y: 3.5,
          duration: 2,
          ease: 'power3.inOut',
        });

        // Slow rotation reveal
        gsap.to(groupRef.current.rotation, {
          y: groupRef.current.rotation.y + Math.PI * 2,
          duration: 2,
          ease: 'power2.inOut',
        });
      }

      // Navigate after animation
      setTimeout(() => {
        setTransitioning();
        router.push('/projects/ethernicapsule');
      }, 2200);
    }, 200);
  };

  return (
    <group
      ref={groupRef}
      position={[6, 1.5, 2]}
      rotation={[0, 0, 0]}
      onPointerEnter={detect}
      onPointerLeave={undetect}
      onClick={(e) => {
        e.stopPropagation();
        handleActivation();
      }}
    >
      <CapsuleMonolith state={state} />
    </group>
  );
}
