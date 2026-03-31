import { useRef, useEffect } from 'react';
import { SpotLight, Vector3 } from 'three';
import { useFrame, useThree } from '@react-three/fiber';

/**
 * Cursor-following spotlight (lantern effect)
 * Creates the feeling of scanning the ground with a light
 */
export function LanternPointer() {
  const spotlightRef = useRef<SpotLight>(null);
  const targetRef = useRef(new Vector3(0, 0, 0));
  const currentRef = useRef(new Vector3(0, 0, 0));
  const { viewport, camera, scene } = useThree();

  // Add spotlight target to scene once
  useEffect(() => {
    if (spotlightRef.current?.target) {
      scene.add(spotlightRef.current.target);
      return () => {
        if (spotlightRef.current?.target) {
          scene.remove(spotlightRef.current.target);
        }
      };
    }
  }, [scene]);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Convert mouse to normalized device coordinates
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      // Project to 3D ground plane (y=0)
      const vec = new Vector3(x, y, 0.5);
      vec.unproject(camera);
      vec.sub(camera.position).normalize();

      // Calculate intersection with ground plane (y=0)
      const distance = -camera.position.y / vec.y;
      const groundPos = camera.position
        .clone()
        .add(vec.multiplyScalar(distance));

      targetRef.current.copy(groundPos);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [camera, viewport]);

  // Smooth follow with inertia (heavier, more elegant motion)
  useFrame(() => {
    if (spotlightRef.current) {
      // Slower lerp for weighted, archaeological scanning feel
      currentRef.current.lerp(targetRef.current, 0.05);

      // Position spotlight above ground point
      spotlightRef.current.position.set(
        currentRef.current.x,
        7,
        currentRef.current.z
      );

      // Point at ground
      spotlightRef.current.target.position.set(
        currentRef.current.x,
        0,
        currentRef.current.z
      );
      spotlightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <spotLight
      ref={spotlightRef}
      intensity={12}
      angle={0.4}
      penumbra={0.7}
      distance={30}
      color="#8a7a6a"
      castShadow={false}
    />
  );
}
