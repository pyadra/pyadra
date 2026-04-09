import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Environment } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function CrystalMonolith({ hovered, audioActive }: { hovered: boolean, audioActive: boolean }) {
  const outerGlassRef = useRef<THREE.Mesh>(null);
  const innerArchitectureRef = useRef<THREE.Mesh>(null);
  const { mouse, viewport } = useThree();

  useFrame((state, delta) => {
    if (outerGlassRef.current && innerArchitectureRef.current) {
      // Very smooth mouse gravity
      const targetX = (mouse.x * viewport.width) / 10;
      const targetY = (mouse.y * viewport.height) / 10;
      
      const parentGroup = outerGlassRef.current.parent;
      if (parentGroup) {
         parentGroup.position.x = THREE.MathUtils.lerp(parentGroup.position.x, targetX, delta * 2);
         parentGroup.position.y = THREE.MathUtils.lerp(parentGroup.position.y, targetY, delta * 2);
      }

      // Continuous majestic rotation
      const spinSpeed = audioActive ? 0.3 : 0.15;
      outerGlassRef.current.rotation.x += delta * spinSpeed * 0.8;
      outerGlassRef.current.rotation.y += delta * spinSpeed;
      outerGlassRef.current.rotation.z += delta * spinSpeed * 0.5;

      // Inner architecture counter-rotates and spins faster
      innerArchitectureRef.current.rotation.x -= delta * spinSpeed * 1.5;
      innerArchitectureRef.current.rotation.y -= delta * spinSpeed * 2.0;

      // Scale pulse
      const targetScale = hovered ? 1.1 : 1;
      outerGlassRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 4);
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* 1. The Monolithic Glass Shell (Outer) */}
      <mesh ref={outerGlassRef}>
        <icosahedronGeometry args={[2.2, 0]} />
        <meshPhysicalMaterial 
          transmission={0.95}
          opacity={1}
          transparent={true}
          roughness={0.1}
          metalness={0.1}
          thickness={3}
          ior={1.8}
          color="#ffffff"
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* 2. The Golden Architectural Core (Inner Blueprint) */}
      {/* This wireframe is INSIDE the glass. The glass will refract and bend these lines, creating infinite facets. */}
      <mesh ref={innerArchitectureRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial 
          color="#FFB000"
          wireframe={true}
          transparent={true}
          opacity={0.6}
        />
      </mesh>

      {/* External high-contrast lighting to hit the glass facets */}
      <spotLight color="#FFB000" intensity={hovered ? 30 : 15} angle={1} penumbra={0.5} distance={20} position={[5, 8, 8]} />
      <spotLight color="#ffffff" intensity={20} angle={0.8} penumbra={1} distance={20} position={[-8, -8, 5]} />
    </group>
  );
}

export default function Scene({ hovered = false, audioActive = false }: { hovered?: boolean, audioActive?: boolean }) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto z-0 touch-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 40 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} color="#ffffff" />

          {/* Micro-stellar particulate field */}
          <Sparkles count={hovered ? 300 : 100} scale={15} size={1.5} speed={audioActive ? 0.8 : 0.2} opacity={0.6} color="#E3DAC9" />
          <Sparkles count={40} scale={10} size={3} speed={1} opacity={0.8} color="#FFB000" noise={3} />
          
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
             <CrystalMonolith hovered={hovered} audioActive={audioActive} />
          </Float>

          {/* Environmental reflections strictly isolated so they never crash the core rendering */}
          <Suspense fallback={null}>
            <Environment preset="city" environmentIntensity={0.2} />
          </Suspense>
        </Suspense>
      </Canvas>
    </div>
  );
}
