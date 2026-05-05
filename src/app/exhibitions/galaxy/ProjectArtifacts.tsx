"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ============================================
// ORBIT 77 - Torus with Radio Waves
// ============================================
export function OrbitArtifact({
  position,
  isActive,
  isHovered,
  onClick,
  onPointerOver,
  onPointerOut
}: any) {
  const groupRef = useRef<THREE.Group>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const waveRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
      // Scale up when active or hovered
      const targetScale = isActive ? 1.3 : (isHovered ? 1.15 : 1);
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    if (torusRef.current) {
      torusRef.current.rotation.z += delta * 0.5;
    }
    // Animate wave rings pulsing outward
    waveRefs.current.forEach((wave, i) => {
      if (wave) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.15;
        wave.scale.set(scale, scale, scale);
        const material = wave.material as THREE.MeshBasicMaterial;
        material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.2;
      }
    });
  });

  const emissiveIntensity = isActive ? 1.2 : (isHovered ? 0.6 : 0.2);

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Main torus core */}
      <mesh ref={torusRef}>
        <torusGeometry args={[1.2, 0.4, 16, 32]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#39FF14"
          emissiveIntensity={emissiveIntensity}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Wave rings (3 concentric) */}
      {[1.8, 2.2, 2.6].map((radius, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) waveRefs.current[i] = el;
          }}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[radius, 0.02, 16, 64]} />
          <meshBasicMaterial
            color="#39FF14"
            transparent
            opacity={0.08}
          />
        </mesh>
      ))}

      {/* Glow sphere */}
      {isActive && (
        <mesh>
          <sphereGeometry args={[2, 32, 32]} />
          <meshBasicMaterial
            color="#39FF14"
            transparent
            opacity={0.1}
          />
        </mesh>
      )}

      {/* Point light */}
      {isActive && (
        <pointLight position={[0, 0, 0]} distance={10} intensity={3} color="#39FF14" />
      )}
    </group>
  );
}

// ============================================
// ETERNICAPSULE - Sealed Cylinder
// ============================================
export function CapsuleArtifact({
  position,
  isActive,
  isHovered,
  onClick,
  onPointerOver,
  onPointerOut
}: any) {
  const groupRef = useRef<THREE.Group>(null);
  const cylinderRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
      // Scale up when active or hovered
      const targetScale = isActive ? 1.3 : (isHovered ? 1.15 : 1);
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    if (cylinderRef.current) {
      // Subtle floating
      cylinderRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
    }
  });

  const emissiveIntensity = isActive ? 2 : (isHovered ? 1 : 0.3);

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Main cylinder body */}
      <mesh ref={cylinderRef}>
        <cylinderGeometry args={[0.5, 0.5, 2, 32]} />
        <meshStandardMaterial
          color="#1A1410"
          emissive="#C4A882"
          emissiveIntensity={emissiveIntensity}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Three seal rings (cryptographic locks) */}
      {[-0.6, 0, 0.6].map((yPos, i) => (
        <mesh key={i} position={[0, yPos, 0]}>
          <torusGeometry args={[0.55, 0.08, 16, 32]} />
          <meshStandardMaterial
            color="#C4A882"
            emissive="#C4A882"
            emissiveIntensity={isActive ? 1 : 0.5}
            metalness={1}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* Top cap */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.2, 32]} />
        <meshStandardMaterial
          color="#C4A882"
          metalness={1}
          roughness={0.1}
        />
      </mesh>

      {/* Bottom cap */}
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.2, 32]} />
        <meshStandardMaterial
          color="#C4A882"
          metalness={1}
          roughness={0.1}
        />
      </mesh>

      {/* Inner glow (sealed message energy) */}
      {(isActive || isHovered) && (
        <mesh>
          <cylinderGeometry args={[0.4, 0.4, 1.8, 32]} />
          <meshBasicMaterial
            color="#C4A882"
            transparent
            opacity={isActive ? 0.15 : 0.08}
          />
        </mesh>
      )}

      {/* Point light */}
      {isActive && (
        <pointLight position={[0, 0, 0]} distance={8} intensity={2} color="#C4A882" />
      )}
    </group>
  );
}

// ============================================
// FIGURINES - Faceted Crystal
// ============================================
export function FigurineArtifact({
  position,
  isActive,
  isHovered,
  onClick,
  onPointerOver,
  onPointerOut
}: any) {
  const groupRef = useRef<THREE.Group>(null);
  const crystalRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
      // Scale up when active or hovered
      const targetScale = isActive ? 1.3 : (isHovered ? 1.15 : 1);
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    if (crystalRef.current) {
      crystalRef.current.rotation.x += delta * 0.3;
      crystalRef.current.rotation.z += delta * 0.2;
    }
  });

  const emissiveIntensity = isActive ? 1.8 : (isHovered ? 0.9 : 0.25);

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Main crystal (octahedron for faceted look) */}
      <mesh ref={crystalRef}>
        <octahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#8B4A3A"
          emissive="#DCA88F"
          emissiveIntensity={emissiveIntensity}
          metalness={0.3}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Inner humanoid silhouette (subtle sphere) */}
      <mesh scale={0.6}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#DCA88F"
          emissiveIntensity={0.3}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Outer facets (dodecahedron wireframe) */}
      <mesh scale={1.2}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          color="#DCA88F"
          wireframe
          transparent
          opacity={isActive ? 0.4 : (isHovered ? 0.25 : 0.12)}
        />
      </mesh>

      {/* Glow aura */}
      {isActive && (
        <mesh>
          <sphereGeometry args={[2, 32, 32]} />
          <meshBasicMaterial
            color="#DCA88F"
            transparent
            opacity={0.08}
          />
        </mesh>
      )}

      {/* Point light */}
      {isActive && (
        <pointLight position={[0, 0, 0]} distance={8} intensity={2} color="#DCA88F" />
      )}
    </group>
  );
}

// ============================================
// EBOK - Open Book with Wireframe Pages
// ============================================
export function BookArtifact({
  position,
  isActive,
  isHovered,
  onClick,
  onPointerOver,
  onPointerOut
}: any) {
  const groupRef = useRef<THREE.Group>(null);
  const leftPageRef = useRef<THREE.Mesh>(null);
  const rightPageRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
      // Scale up when active or hovered
      const targetScale = isActive ? 1.3 : (isHovered ? 1.15 : 1);
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    // Subtle page turning animation
    if (leftPageRef.current) {
      leftPageRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 - 0.6;
    }
    if (rightPageRef.current) {
      rightPageRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + 0.6;
    }
  });

  const emissiveIntensity = isActive ? 1.5 : (isHovered ? 0.8 : 0.2);

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      rotation={[0, 0, Math.PI / 6]} // Tilt book slightly
    >
      {/* Spine (center binding) */}
      <mesh>
        <boxGeometry args={[0.1, 1.5, 0.05]} />
        <meshStandardMaterial
          color="#5A3825"
          emissive="#8B7355"
          emissiveIntensity={emissiveIntensity}
          roughness={0.8}
        />
      </mesh>

      {/* Left cover */}
      <mesh position={[-0.6, 0, 0]} rotation={[0, -0.6, 0]}>
        <boxGeometry args={[1.2, 1.5, 0.05]} />
        <meshStandardMaterial
          color="#3A2515"
          emissive="#8B7355"
          emissiveIntensity={emissiveIntensity * 0.5}
          roughness={0.9}
        />
      </mesh>

      {/* Right cover */}
      <mesh position={[0.6, 0, 0]} rotation={[0, 0.6, 0]}>
        <boxGeometry args={[1.2, 1.5, 0.05]} />
        <meshStandardMaterial
          color="#3A2515"
          emissive="#8B7355"
          emissiveIntensity={emissiveIntensity * 0.5}
          roughness={0.9}
        />
      </mesh>

      {/* Left page (wireframe) */}
      <mesh ref={leftPageRef} position={[-0.5, 0, 0.1]}>
        <planeGeometry args={[1, 1.3]} />
        <meshBasicMaterial
          color="#8B7355"
          wireframe
          transparent
          opacity={isActive ? 0.4 : (isHovered ? 0.25 : 0.12)}
        />
      </mesh>

      {/* Right page (wireframe) */}
      <mesh ref={rightPageRef} position={[0.5, 0, 0.1]}>
        <planeGeometry args={[1, 1.3]} />
        <meshBasicMaterial
          color="#8B7355"
          wireframe
          transparent
          opacity={isActive ? 0.4 : (isHovered ? 0.25 : 0.12)}
        />
      </mesh>

      {/* Additional page layers (depth) */}
      {[-0.05, -0.1].map((zOffset, i) => (
        <group key={i}>
          <mesh position={[-0.5, 0, zOffset]} rotation={[0, -0.55, 0]}>
            <planeGeometry args={[1, 1.3]} />
            <meshBasicMaterial
              color="#8B7355"
              transparent
              opacity={0.1}
            />
          </mesh>
          <mesh position={[0.5, 0, zOffset]} rotation={[0, 0.55, 0]}>
            <planeGeometry args={[1, 1.3]} />
            <meshBasicMaterial
              color="#8B7355"
              transparent
              opacity={0.1}
            />
          </mesh>
        </group>
      ))}

      {/* Glow aura */}
      {isActive && (
        <mesh>
          <sphereGeometry args={[2, 32, 32]} />
          <meshBasicMaterial
            color="#8B7355"
            transparent
            opacity={0.06}
          />
        </mesh>
      )}

      {/* Point light */}
      {isActive && (
        <pointLight position={[0, 0, 0]} distance={8} intensity={1.5} color="#8B7355" />
      )}
    </group>
  );
}
