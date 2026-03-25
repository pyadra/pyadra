"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

// The Artifact: Dense, heavy Smoky Quartz / Dark Olive Obsidian mapping to the Alien Orbit vibe inherently
function LithicCapsule({ hovered }: { hovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const internalLightRef = useRef<THREE.PointLight>(null);
  const { mouse } = useThree();

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Heavy Gravitational Inertia. Smaller numbers feel like immense weight.
      const targetRotateX = -(mouse.y * 0.08); 
      const targetRotateY = mouse.x * 0.08;
      
      // Extremely slow respiration
      const breathX = Math.sin(state.clock.elapsedTime * 0.2) * 0.03;
      const breathY = Math.cos(state.clock.elapsedTime * 0.3) * 0.03;
      
      // Damped lerp for sheer physical lag/weight
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotateX + breathX, delta * 1.5);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotateY + breathY, delta * 1.5);
    }
    
    // The Catalyst: A warm amber glow erupts from deep inside the stone when hovered
    if (internalLightRef.current) {
       const targetIntensity = hovered ? 15 : 0;
       internalLightRef.current.intensity = THREE.MathUtils.lerp(internalLightRef.current.intensity, targetIntensity, delta * 2.5);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Physical Heavy Mineral Chamber */}
      <RoundedBox args={[3.0, 4.5, 0.4]} radius={1.5} smoothness={16}>
        <MeshTransmissionMaterial 
          backside
          samples={4}
          thickness={8} // Massive thickness to create dense stone optical density
          chromaticAberration={0.04}
          anisotropy={0.5} // High anisotropy generates a perfectly cloudy core inside
          distortion={1.2} // High distortion -> swirling physical interior minerals/cracks
          distortionScale={0.3}
          temporalDistortion={hovered ? 0.3 : 0.05} // Physically vibrates faster when Catalyst is active
          clearcoat={1} // Polished obsidian exterior reflection
          clearcoatRoughness={0.15} // Micro-grain stone reflection
          roughness={0.25} // Traps the interior light severely
          color="#1B2421" // Dark Olive-Oil Green / Smoky core
          transparent
          opacity={0.99} // Barely translucent, almost pure heavy stone block
        />
      </RoundedBox>
      {/* Internal Catalyst Spark (Trapped light) */}
      <pointLight ref={internalLightRef} color="#FFB000" distance={6} position={[0, 0, -0.1]} />
    </group>
  );
}

// Pale Champagne / Silver light striking the stone edges
function ShadowEarthLighting() {
  const lightRef = useRef<THREE.PointLight>(null);
  const { mouse, viewport } = useThree();
  
  useFrame(() => {
    if (lightRef.current) {
      const x = (mouse.x * viewport.width) / 2;
      const y = (mouse.y * viewport.height) / 2;
      // Heavy light inertia to match stone lag
      lightRef.current.position.lerp(new THREE.Vector3(x, y, 4), 0.03); 
    }
  });

  return (
    <pointLight 
      ref={lightRef} 
      intensity={8} 
      distance={15} 
      color="#ECE0D1" // Pale Champagne/Silver Highlight
    />
  );
}

export default function Scene({ hovered = false }: { hovered?: boolean }) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto z-0 touch-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 35 }}>
        {/* Absolute Void Black to create ultra high-end focus isolation */}
        <color attach="background" args={["#000000"]} />
        
        {/* Extremely low ambient light to force spotlight contrast reading on the edges */}
        <ambientLight intensity={0.1} color="#ECE0D1" />
        
        <ShadowEarthLighting />

        {/* Deep Smoky Quartz reflections slicing the ambient void edges from behind */}
        <spotLight position={[-5, 8, -5]} angle={0.6} penumbra={1} intensity={6} color="#2D2926" /> 
        <spotLight position={[5, -8, -5]} angle={0.6} penumbra={1} intensity={4} color="#1B2421" /> 

        <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
           <LithicCapsule hovered={hovered} />
        </Float>

        {/* Studio environment heavily darkened so the stone feels realistically heavy and lit physically, not mirrored perfectly */}
        <Environment preset="studio" environmentIntensity={0.2} />
      </Canvas>
    </div>
  );
}
