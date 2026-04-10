"use client";

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { MeshReflectorMaterial, Preload, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import React, { useRef, useMemo, useState, useEffect, memo } from 'react';

const NODES_DATA = [
  { id: "orbit-77", shape: "fractured-core", color: "#39FF14", baseColor: "#030A05", xPos: 0.5, yPos: 0.30, sizeMultiplier: 1 },
  { id: "ebok", shape: "book-shape", color: "#8B7355", baseColor: "#2A2318", xPos: 0.25, yPos: 0.52, sizeMultiplier: 0.7 },
  { id: "ethernicapsule", shape: "relic-capsule", color: "#C4A882", baseColor: "#0A0805", xPos: 0.5, yPos: 0.65, sizeMultiplier: 0.85 },
  { id: "figurines", shape: "chibi-figurine", color: "#DCA88F", baseColor: "#1A1210", xPos: 0.75, yPos: 0.52, sizeMultiplier: 0.7 },
  { id: "project-mystery-1", shape: "mystery-rings", color: "#888888", baseColor: "#050505", xPos: 0.20, yPos: 0.82, sizeMultiplier: 0.35 },
  { id: "project-mystery-2", shape: "mystery-rings", color: "#888888", baseColor: "#050505", xPos: 0.80, yPos: 0.82, sizeMultiplier: 0.35 }
];

// --- GLOBAL CACHED GEOMETRIES ---
// Instantiated outside the React render cycle to bypass Garbage Collection lag entirely.
const CORE_GEOMETRY = new THREE.IcosahedronGeometry(1, 3);
const CORE_RING_1 = new THREE.TorusGeometry(1.5, 0.012, 16, 64);
const CORE_RING_2 = new THREE.TorusGeometry(1.8, 0.012, 16, 64);

const CAPSULE_GEOMETRY = new THREE.CapsuleGeometry(0.55, 1.2, 16, 32);
const CAPSULE_RING = new THREE.TorusGeometry(0.57, 0.03, 16, 64);

const CHIBI_HEAD = new THREE.SphereGeometry(0.65, 32, 32);
const CHIBI_BODY = new THREE.CapsuleGeometry(0.25, 0.5);
const CHIBI_ARM = new THREE.CapsuleGeometry(0.08, 0.25);
const CHIBI_RING = new THREE.TorusGeometry(0.8, 0.02, 16, 64);

const BOOK_MAIN = new THREE.BoxGeometry(1.2, 1.6, 0.3);
const BOOK_PAGE = new THREE.BoxGeometry(0.02, 1.58, 0.28);
const BOOK_EDGE = new THREE.BoxGeometry(1.18, 0.02, 0.28);

const MYSTERY_RING_1 = new THREE.TorusGeometry(0.4, 0.005, 16, 64);
const MYSTERY_RING_2 = new THREE.TorusGeometry(0.7, 0.005, 16, 64);
const MYSTERY_RING_3 = new THREE.TorusGeometry(1.0, 0.005, 16, 64);

const DUST_PARTICLE_GEO = new THREE.BoxGeometry(1, 1, 1);
const FLOOR_PLANE_GEO = new THREE.PlaneGeometry(100, 100);

const CameraParallax = memo(function CameraParallax() {
  const vec = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    vec.set(state.mouse.x * 0.4, state.mouse.y * 0.4, 8);
    state.camera.position.lerp(vec, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
});

const CinematicVault = memo(function CinematicVault({ hoveredNode }: { hoveredNode: string | null }) {
  const lightRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);
  const { viewport } = useThree();
  const [vec] = useState(() => new THREE.Vector3());

  useFrame((state) => {
    if (lightRef.current && targetRef.current) {
      const targetX = (state.mouse.x * viewport.width) / 2;
      const targetY = (state.mouse.y * viewport.height) / 2;

      vec.set(targetX, targetY, 0);
      targetRef.current.position.lerp(vec, 0.1);

      lightRef.current.target = targetRef.current;
      lightRef.current.position.x = targetRef.current.position.x;
      lightRef.current.position.y = targetRef.current.position.y;

      const targetIntensity = hoveredNode ? 600 : 250;
      lightRef.current.intensity += (targetIntensity - lightRef.current.intensity) * 0.1;

      const targetAngle = hoveredNode ? 0.35 : 0.8;
      lightRef.current.angle += (targetAngle - lightRef.current.angle) * 0.1;
    }
  });

  return (
    <>
      <object3D ref={targetRef} position={[0, 0, -2]} />

      <spotLight
        ref={lightRef}
        position={[0, 0, 8]}
        distance={35}
        angle={0.8}
        penumbra={1}
        decay={2}
        intensity={250}
        color={hoveredNode ? (NODES_DATA.find(n => n.id === hoveredNode)?.color || "#ffffff") : "#E8D9BB"}
        castShadow
        shadow-mapSize-width={256}
        shadow-mapSize-height={256}
        shadow-bias={-0.001}
      />

      <ambientLight intensity={0.25} color="#050810" />
      <directionalLight position={[5, 10, -5]} intensity={0.4} color="#888888" />
      <directionalLight position={[-5, 5, 5]} intensity={0.15} color="#ffffff" />

      <mesh receiveShadow position={[0, -2.5, -3]} rotation={[-Math.PI / 2, 0, 0]} geometry={FLOOR_PLANE_GEO}>
        {/* OPTIMIZED: resolution dropped from 512 to 256 for massive GPU performance uplift */}
        <MeshReflectorMaterial
          blur={[0, 0]}
          resolution={256}
          mixBlur={0}
          mixStrength={15}
          roughness={0.9}
          depthScale={1.2}
          color="#02040A"
          metalness={0.9}
          mirror={1}
        />
      </mesh>
    </>
  );
});

const DustParticles = memo(function DustParticles() {
  const count = 300;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15 + 2
      );
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const size = Math.random() * 0.015 + 0.005;
      dummy.scale.set(size, size, size);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} geometry={DUST_PARTICLE_GEO}>
      <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
    </instancedMesh>
  );
});

function RelicCore({ isActive, color, baseColor }: { isActive: boolean, color: string, baseColor: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  // Memoize expensive physical material
  const coreMaterial = useMemo(() =>
    new THREE.MeshPhysicalMaterial({
      color: baseColor,
      roughness: 0.1,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.4,
      emissive: color,
      flatShading: true,
    }), [baseColor, color]
  );

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Manual float effect (replaces <Float>)
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 2) * 0.6;
      groupRef.current.rotation.x = Math.sin(time * 0.5) * 0.5;
      groupRef.current.rotation.z = Math.cos(time * 0.5) * 0.5;
    }

    // Existing rotations
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x += delta * 0.2;
    }
    if (ring1Ref.current) ring1Ref.current.rotation.x += delta * 0.8;
    if (ring2Ref.current) ring2Ref.current.rotation.y += delta * 0.5;

    // Animate emissive intensity
    coreMaterial.emissiveIntensity = isActive ? 0.8 : 0.15;
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} geometry={CORE_GEOMETRY} material={coreMaterial} castShadow receiveShadow />
      <group scale={1.15}>
        <mesh ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]} geometry={CORE_RING_1}>
          <meshBasicMaterial color={color} transparent opacity={isActive ? 0.7 : 0.15} />
        </mesh>
        <mesh ref={ring2Ref} rotation={[0, Math.PI / 4, 0]} geometry={CORE_RING_2}>
          <meshBasicMaterial color={color} transparent opacity={isActive ? 0.7 : 0.15} />
        </mesh>
      </group>
    </group>
  );
}

function RelicCapsule({ isActive, color, baseColor }: { isActive: boolean, color: string, baseColor: string }) {
  const floatGroupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Group>(null);

  // Memoize expensive physical material
  const capsuleMaterial = useMemo(() =>
    new THREE.MeshPhysicalMaterial({
      color: baseColor,
      roughness: 0.2,
      metalness: 0.8,
      clearcoat: 1.0,
      emissive: color,
      flatShading: true,
    }), [baseColor, color]
  );

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Manual float effect
    if (floatGroupRef.current) {
      floatGroupRef.current.position.y = Math.sin(time * 1.5) * 0.5;
      floatGroupRef.current.rotation.x = Math.sin(time * 0.2) * 0.2;
      floatGroupRef.current.rotation.z = Math.cos(time * 0.2) * 0.2;
    }

    if (meshRef.current) meshRef.current.rotation.y += delta * 0.3;

    // Animate emissive intensity
    if (!isActive) {
      const breath = (Math.sin(time * Math.PI * 2 / 5) + 1) / 2;
      capsuleMaterial.emissiveIntensity = 0.1 + (breath * 0.25);
    } else {
      capsuleMaterial.emissiveIntensity = 1.0;
    }
  });

  return (
    <group ref={floatGroupRef}>
      <group ref={meshRef}>
        <mesh castShadow receiveShadow geometry={CAPSULE_GEOMETRY} material={capsuleMaterial} />
        <mesh rotation={[Math.PI / 2, 0, 0]} geometry={CAPSULE_RING}>
          <meshBasicMaterial color={color} transparent opacity={isActive ? 0.8 : 0.3} />
        </mesh>
      </group>
    </group>
  );
}

function ChibiFigurine({ isActive, color, baseColor }: { isActive: boolean, color: string, baseColor: string }) {
  const floatGroupRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Memoize expensive physical materials
  const headMaterial = useMemo(() =>
    new THREE.MeshPhysicalMaterial({
      color: baseColor,
      roughness: 0.3,
      metalness: 0.6,
      clearcoat: 0.8,
      emissive: color,
    }), [baseColor, color]
  );

  const bodyMaterial = useMemo(() =>
    new THREE.MeshPhysicalMaterial({
      color: baseColor,
      roughness: 0.4,
      metalness: 0.5,
      emissive: color,
    }), [baseColor, color]
  );

  const armMaterial = useMemo(() =>
    new THREE.MeshPhysicalMaterial({
      color: baseColor,
      roughness: 0.4,
      metalness: 0.5,
      emissive: color,
    }), [baseColor, color]
  );

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Manual float effect
    if (floatGroupRef.current) {
      floatGroupRef.current.position.y = Math.sin(time * 1.2) * 0.4;
      floatGroupRef.current.rotation.x = Math.sin(time * 0.3) * 0.3;
      floatGroupRef.current.rotation.z = Math.cos(time * 0.3) * 0.3;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }

    // Animate emissive intensities
    headMaterial.emissiveIntensity = isActive ? 0.5 : 0.15;
    bodyMaterial.emissiveIntensity = isActive ? 0.3 : 0.1;
    armMaterial.emissiveIntensity = isActive ? 0.2 : 0.08;
  });

  return (
    <group ref={floatGroupRef}>
      <group ref={groupRef}>
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow geometry={CHIBI_HEAD} material={headMaterial} />
        <mesh position={[0, -0.2, 0]} castShadow receiveShadow geometry={CHIBI_BODY} material={bodyMaterial} />
        <mesh position={[-0.35, -0.1, 0]} rotation={[0, 0, -0.3]} castShadow geometry={CHIBI_ARM} material={armMaterial} />
        <mesh position={[0.35, -0.1, 0]} rotation={[0, 0, 0.3]} castShadow geometry={CHIBI_ARM} material={armMaterial.clone()} />

        {isActive && (
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} geometry={CHIBI_RING}>
            <meshBasicMaterial color={color} transparent opacity={0.5} />
          </mesh>
        )}
      </group>
    </group>
  );
}

function BookShape({ isActive, color, baseColor }: { isActive: boolean, color: string, baseColor: string }) {
  const floatGroupRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Memoize expensive physical material
  const bookMaterial = useMemo(() =>
    new THREE.MeshPhysicalMaterial({
      color: baseColor,
      roughness: 0.7,
      metalness: 0.2,
      clearcoat: 0.3,
      emissive: color,
    }), [baseColor, color]
  );

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Manual float effect
    if (floatGroupRef.current) {
      floatGroupRef.current.position.y = Math.sin(time * 1) * 0.3;
      floatGroupRef.current.rotation.x = Math.sin(time * 0.4) * 0.4;
      floatGroupRef.current.rotation.z = Math.cos(time * 0.4) * 0.4;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }

    // Animate emissive intensity
    bookMaterial.emissiveIntensity = isActive ? 0.4 : 0.12;
  });

  return (
    <group ref={floatGroupRef}>
      <group ref={groupRef} rotation={[0.2, 0, 0]}>
        <mesh castShadow receiveShadow geometry={BOOK_MAIN} material={bookMaterial} />
        <mesh position={[0.61, 0, 0]} geometry={BOOK_PAGE}>
          <meshBasicMaterial color={color} transparent opacity={isActive ? 0.6 : 0.2} />
        </mesh>
        <mesh position={[-0.61, 0, 0]} geometry={BOOK_PAGE}>
          <meshBasicMaterial color={color} transparent opacity={isActive ? 0.6 : 0.2} />
        </mesh>
        <mesh position={[0, 0.81, 0]} geometry={BOOK_EDGE}>
          <meshBasicMaterial color={color} transparent opacity={isActive ? 0.5 : 0.15} />
        </mesh>
        <mesh position={[0, -0.81, 0]} geometry={BOOK_EDGE}>
          <meshBasicMaterial color={color} transparent opacity={isActive ? 0.5 : 0.15} />
        </mesh>
      </group>
    </group>
  );
}

function MysteryRings({ isActive, color }: { isActive: boolean, color: string }) {
  const floatGroupRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Manual float effect
    if (floatGroupRef.current) {
      floatGroupRef.current.position.y = Math.sin(time * 0.5) * 0.2;
    }

    if (groupRef.current && isActive) {
      groupRef.current.rotation.z += delta * 0.5;
    }
  });

  return (
    <group ref={floatGroupRef}>
      <group ref={groupRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <mesh geometry={MYSTERY_RING_1}>
          <meshBasicMaterial color={color} transparent opacity={isActive ? 0.4 : 0.08} />
        </mesh>
        <mesh geometry={MYSTERY_RING_2}>
          <meshBasicMaterial color={color} transparent opacity={isActive ? 0.2 : 0.05} />
        </mesh>
        <mesh geometry={MYSTERY_RING_3}>
          <meshBasicMaterial color={color} transparent opacity={isActive ? 0.1 : 0.02} />
        </mesh>
      </group>
    </group>
  );
}

const BloomEffect = memo(function BloomEffect({ hoveredNode }: { hoveredNode: string | null }) {
  const intensityRef = useRef(0.2);

  useFrame(() => {
    const targetIntensity = hoveredNode ? 1.0 : 0.2;
    intensityRef.current += (targetIntensity - intensityRef.current) * 0.1;
  });

  return (
    <Bloom
      luminanceThreshold={0.7}
      mipmapBlur={false}
      intensity={intensityRef.current}
      radius={0.8}
    />
  );
});

const NodeMeshes = memo(function NodeMeshes({ hoveredNode }: { hoveredNode: string | null }) {
  const { viewport } = useThree();

  return (
    <>
      {NODES_DATA.map((node) => {
        const x = (node.xPos - 0.5) * viewport.width;
        const y = (0.5 - node.yPos) * viewport.height;
        const isActive = hoveredNode === node.id;

        return (
          <group key={node.id} position={[x, y, -0.5]} scale={node.sizeMultiplier}>
            {node.shape === 'fractured-core' && <RelicCore isActive={isActive} color={node.color} baseColor={node.baseColor} />}
            {node.shape === 'relic-capsule' && <RelicCapsule isActive={isActive} color={node.color} baseColor={node.baseColor} />}
            {node.shape === 'chibi-figurine' && <ChibiFigurine isActive={isActive} color={node.color} baseColor={node.baseColor} />}
            {node.shape === 'book-shape' && <BookShape isActive={isActive} color={node.color} baseColor={node.baseColor} />}
            {node.shape === 'mystery-rings' && <MysteryRings isActive={isActive} color={node.color} />}
          </group>
        );
      })}
    </>
  );
});

export default function EcosystemCanvas({ hoveredNode }: { hoveredNode: string | null }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 1.5]}>
        <fog attach="fog" args={['#02040A', 5, 20]} />
        <CameraParallax />
        <CinematicVault hoveredNode={hoveredNode} />
        <DustParticles />
        <NodeMeshes hoveredNode={hoveredNode} />

        <EffectComposer multisampling={0}>
          <BloomEffect hoveredNode={hoveredNode} />
          <Vignette eskil={false} offset={0.2} darkness={0.8} />
        </EffectComposer>

        {/*
          Performance Optimizations:
          - AdaptiveDpr lowers pixel ratio smoothly when GPU is stressed (pixelated removed for smoother visuals).
          - Preload forces WebGL shader compilation on load instead of on interaction (selective instead of all).
        */}
        <AdaptiveDpr />
        <Preload />
      </Canvas>
    </div>
  );
}
