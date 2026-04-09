'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PresentationControls, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

function StylizedDoll() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating/breathing animation for the doll
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
      // Slight rotation towards mouse
      const targetRotationX = (state.pointer.y * Math.PI) / 10;
      const targetRotationY = (state.pointer.x * Math.PI) / 8;

      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* HUGE Head - Chibi/Funko Style */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[1.2, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.5}
          roughness={0.2}
          transmission={0.9}
          ior={1.5}
          chromaticAberration={0.05}
          color="#C4A882"
        />
        {/* Wireframe overlay for "scan" effect */}
        <mesh>
           <sphereGeometry args={[1.21, 16, 16]} />
           <meshBasicMaterial color="#dca88f" wireframe transparent opacity={0.15} />
        </mesh>
      </mesh>

      {/* Tiny Body - Cute proportions */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <capsuleGeometry args={[0.4, 0.8]} />
        <MeshTransmissionMaterial
          samples={4}
          thickness={1}
          roughness={0.4}
          transmission={0.8}
          color="#C4A882"
        />
      </mesh>

      {/* Tiny Arms */}
      <mesh position={[-0.6, 0.3, 0]} rotation={[0, 0, -Math.PI / 8]} castShadow>
        <capsuleGeometry args={[0.12, 0.4]} />
        <meshPhysicalMaterial color="#C4A882" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0.6, 0.3, 0]} rotation={[0, 0, Math.PI / 8]} castShadow>
        <capsuleGeometry args={[0.12, 0.4]} />
        <meshPhysicalMaterial color="#C4A882" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Tiny Legs */}
      <mesh position={[-0.25, -0.5, 0]} castShadow>
        <capsuleGeometry args={[0.15, 0.5]} />
        <meshPhysicalMaterial color="#C4A882" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0.25, -0.5, 0]} castShadow>
        <capsuleGeometry args={[0.15, 0.5]} />
        <meshPhysicalMaterial color="#C4A882" roughness={0.3} metalness={0.1} />
      </mesh>
    </group>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial color="#C4A882" transparent opacity={0} />
    </mesh>
  );
}

export default function FigurineCanvas() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [use3D, setUse3D] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    // Detect mobile device
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
      setIsMobile(mobile);
      // On mobile, show static fallback by default to save battery
      if (mobile) {
        setUse3D(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent hydration mismatch - show nothing until mounted
  if (!isMounted) {
    return (
      <div className="w-full h-full absolute inset-0 bg-[#02040A]" />
    );
  }

  // Static fallback for mobile or when 3D is disabled
  if (!use3D) {
    return (
      <div className="w-full h-full absolute inset-0 flex items-center justify-center bg-[#02040A]">
        {/* Static SVG representation of the figurine */}
        <div className="relative w-64 h-80 opacity-30">
          <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* HUGE Head - Chibi style */}
            <circle cx="100" cy="80" r="60" fill="#C4A882" fillOpacity="0.3" stroke="#C4A882" strokeWidth="1" />
            <circle cx="100" cy="80" r="60" fill="none" stroke="#dca88f" strokeWidth="0.5" strokeDasharray="2,2" />

            {/* Tiny Body */}
            <ellipse cx="100" cy="170" rx="25" ry="35" fill="#C4A882" fillOpacity="0.2" stroke="#C4A882" strokeWidth="1" />

            {/* Tiny Arms */}
            <line x1="75" y1="160" x2="55" y2="180" stroke="#C4A882" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
            <line x1="125" y1="160" x2="145" y2="180" stroke="#C4A882" strokeWidth="6" strokeLinecap="round" opacity="0.4" />

            {/* Tiny Legs */}
            <line x1="90" y1="205" x2="90" y2="240" stroke="#C4A882" strokeWidth="8" strokeLinecap="round" opacity="0.4" />
            <line x1="110" y1="205" x2="110" y2="240" stroke="#C4A882" strokeWidth="8" strokeLinecap="round" opacity="0.4" />
          </svg>
        </div>

        {isMobile && (
          <button
            onClick={() => setUse3D(true)}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-[#C4A882]/60 hover:text-[#C4A882] uppercase tracking-[0.3em] border border-[#C4A882]/20 px-4 py-2 hover:bg-[#C4A882]/5 transition-all font-mono backdrop-blur-md"
            aria-label="Enable interactive 3D model"
          >
            [ ENABLE 3D ]
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full absolute inset-0 cursor-crosshair">
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 40 }} performance={{ min: 0.5 }}>
        <color attach="background" args={['#02040A']} />

        {/* Cinematic Lighting */}
        <ambientLight intensity={0.2} />
        <spotLight position={[5, 5, 5]} angle={0.2} penumbra={1} intensity={2} color="#C4A882" castShadow />
        <spotLight position={[-5, 5, 5]} angle={0.2} penumbra={1} intensity={1} color="#E8D9BB" />
        <pointLight position={[0, -5, 0]} intensity={0.5} color="#dca88f" />

        <Suspense fallback={<LoadingFallback />}>
          <PresentationControls
            global
            snap
            speed={2}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 2, Math.PI / 2]}
          >
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
              <StylizedDoll />
            </Float>
          </PresentationControls>
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
