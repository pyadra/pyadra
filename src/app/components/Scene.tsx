"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Sparkles } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

// The Artifact: The Genesis Portal (Massive Obsidian Stargate Ring & Golden Human Nucleus)
function LithicCapsule({ hovered }: { hovered: boolean }) {
  const portalRef = useRef<THREE.Mesh>(null);
  const nucleusRef = useRef<THREE.Mesh>(null);
  const internalLightRef = useRef<THREE.PointLight>(null);
  const { mouse } = useThree();

  useFrame((state, delta) => {
    if (portalRef.current) {
      // Interactive Portal tracking
      const targetRotateX = -(mouse.y * 0.2); 
      const targetRotateY = mouse.x * 0.2;
      
      // The massive heavy gate spinning endlessly
      const ritualSpinY = state.clock.elapsedTime * 0.15;
      const ritualSpinZ = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      
      portalRef.current.rotation.x = THREE.MathUtils.lerp(portalRef.current.rotation.x, targetRotateX, delta * 2.0);
      portalRef.current.rotation.y = THREE.MathUtils.lerp(portalRef.current.rotation.y, targetRotateY + ritualSpinY, delta * 2.0);
      portalRef.current.rotation.z = THREE.MathUtils.lerp(portalRef.current.rotation.z, ritualSpinZ, delta * 2.0);
    }

    if (nucleusRef.current) {
       // The human heart/core beating
       const beat = Math.sin(state.clock.elapsedTime * 2.0) * 0.05;
       nucleusRef.current.scale.setScalar(1.0 + beat);
    }
    
    // The Catalyst: A warm amber glow erupts when entering the core
    if (internalLightRef.current) {
       const targetIntensity = hovered ? 20 : 3; // Drastically lowered to preserve typography
       internalLightRef.current.intensity = THREE.MathUtils.lerp(internalLightRef.current.intensity, targetIntensity, delta * 5);
    }
  });

  return (
    <group>
      
      {/* 1. THE OBSIDIAN PORTAL (A massive, ancient stone doorway) */}
      <mesh ref={portalRef}>
        <torusGeometry args={[2.5, 0.45, 64, 100]} />
        <meshPhysicalMaterial 
          color="#0A0A0A"
          roughness={0.2}
          metalness={0.8}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          ior={2} 
        />
      </mesh>

      {/* 2. THE HUMAN SPARK (The Ethereal Nucleus) */}
      <mesh ref={nucleusRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.35, 64, 64]} />
        {/* Transparent glowing plasma so the PYADRA text shines through it */}
        <meshPhysicalMaterial 
          color="#FFB000" 
          emissive="#FFB000" 
          emissiveIntensity={1.5} 
          transparent 
          opacity={0.15} 
          transmission={0.9}
          roughness={0.1}
          ior={1.5}
        />
      </mesh>
      
      {/* Internal Catalyst Spark (The light from the people) */}
      <pointLight ref={internalLightRef} color="#FFB000" distance={15} position={[0, 0, 0]} />
      
      {/* THE AMBER SAND DUST (People/Connection Spores floating around the portal) */}
      <Sparkles count={200} scale={8} size={0.6} speed={0.3} opacity={0.4} color="#E3DAC9" noise={1} />
      {/* Massive hover Catalyst dust storm as you cross the threshold */}
      {hovered && <Sparkles count={150} scale={6} size={1.5} speed={2} opacity={0.8} color="#FFB000" noise={3} />}
    </group>
  );
}

// Pale Champagne light striking the edges of the obsidian ring
function ShadowEarthLighting() {
  const lightRef = useRef<THREE.PointLight>(null);
  const { mouse, viewport } = useThree();
  
  useFrame(() => {
    if (lightRef.current) {
      const x = (mouse.x * viewport.width) / 2;
      const y = (mouse.y * viewport.height) / 2;
      lightRef.current.position.lerp(new THREE.Vector3(x, y, 6), 0.05); 
    }
  });

  return (
    <pointLight 
      ref={lightRef} 
      intensity={12} 
      distance={25} 
      color="#ECE0D1" 
    />
  );
}

export default function Scene({ hovered = false }: { hovered?: boolean }) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto z-0 touch-none">
       {/* Cap DPR to 2 maximum to prevent 4k retina lag and force 60fps locking */}
      <Canvas camera={{ position: [0, 0, 8], fov: 40 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <color attach="background" args={["#000000"]} />
          <ambientLight intensity={0.15} color="#ECE0D1" />
          <ShadowEarthLighting />

          {/* Outer Edge Spotlights tracing the obsidian ring perfectly */}
          <spotLight position={[-6, 8, -5]} angle={0.8} penumbra={1} intensity={6} color="#2D2926" /> 
          <spotLight position={[6, -8, -5]} angle={0.8} penumbra={1} intensity={6} color="#1B2421" /> 

          <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.15}>
             <LithicCapsule hovered={hovered} />
          </Float>

          <Environment preset="studio" environmentIntensity={0.2} />
        </Suspense>
      </Canvas>
    </div>
  );
}
