"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

// The Artifact: A Warm, Smooth, Glowing Amber Capsule
function AmberCapsule() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Very smooth, gentle tilt following mouse (Connected & Organic)
      const targetRotateX = -(mouse.y * 0.12);
      const targetRotateY = mouse.x * 0.12;
      
      // Floating gentle breath on top of mouse tilt to give it "life"
      const breathX = Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
      const breathY = Math.cos(state.clock.elapsedTime * 0.6) * 0.05;
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotateX + breathX, delta * 2.5);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotateY + breathY, delta * 2.5);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Perfect Capsule / Pill shape (Soft, deeply human form factor) */}
      <RoundedBox args={[2.5, 4.0, 0.4]} radius={1.25} smoothness={10}>
        <MeshTransmissionMaterial 
          backside
          samples={4}
          thickness={4}
          chromaticAberration={0.03}
          anisotropy={0.1}
          distortion={0.3} // Subtle inner fluid flow
          distortionScale={0.5}
          temporalDistortion={0.05} // Very gentle internal movement
          clearcoat={1}
          clearcoatRoughness={0.1}
          color="#FCA880" // Soft Rose Gold / Amber Core
          transparent
          opacity={0.8}
        />
      </RoundedBox>
    </group>
  );
}

// Emitting a soft, warm peach glow instead of a sharp flashlight
function WarmSunrise() {
  const lightRef = useRef<THREE.PointLight>(null);
  const { mouse, viewport } = useThree();
  
  useFrame(() => {
    if (lightRef.current) {
      const x = (mouse.x * viewport.width) / 2;
      const y = (mouse.y * viewport.height) / 2;
      // Delay tracking intentionally to feel dreamy
      lightRef.current.position.lerp(new THREE.Vector3(x, y, 4), 0.05); 
    }
  });

  return (
    <pointLight 
      ref={lightRef} 
      intensity={8} // High intensity but extremely soft falloff
      distance={15} 
      color="#FFDFD3" // Soft Peach illumination
    />
  );
}

export default function Scene() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto z-0 touch-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 35 }}>
        {/* Deep, grounding Warm Mahogany base (Not cold black) */}
        <color attach="background" args={["#171211"]} />
        
        {/* Highly pervasive warm ambient light so there are no cold shadows */}
        <ambientLight intensity={0.8} color="#FFD0BA" />
        
        <WarmSunrise />

        {/* Soft, blushing rim lights replacing the sharp neon rims */}
        <spotLight position={[-5, 8, -5]} angle={0.6} penumbra={1} intensity={6} color="#E07A5F" /> {/* Terracotta Rim */}
        <spotLight position={[5, -8, -5]} angle={0.6} penumbra={1} intensity={4} color="#F4F1DE" /> {/* Warm Ivory Highlight */}

        {/* Soft floating geometry taking the breath of the user */}
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
           <AmberCapsule />
        </Float>

        {/* Warm sunrise HDRI for soft, glowing sunrise reflections */}
        <Environment preset="dawn" />
      </Canvas>
    </div>
  );
}
