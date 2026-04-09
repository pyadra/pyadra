'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleField({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 800 : 2000;

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    // Create PYADRA letter clusters
    const letterPositions = [
      { x: -8, y: 0 },  // P
      { x: -5, y: 0 },  // Y
      { x: -2, y: 0 },  // A
      { x: 1, y: 0 },   // D
      { x: 4, y: 0 },   // R
      { x: 7, y: 0 },   // A
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Cluster particles around letter positions
      const letterIndex = Math.floor(Math.random() * letterPositions.length);
      const letter = letterPositions[letterIndex];

      positions[i3] = letter.x + (Math.random() - 0.5) * 2;
      positions[i3 + 1] = letter.y + (Math.random() - 0.5) * 3;
      positions[i3 + 2] = (Math.random() - 0.5) * 4;

      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    return { positions, velocities };
  }, [particleCount]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Gentle floating animation
      positions[i3 + 1] += Math.sin(time + i) * 0.001;

      // Mouse interaction (subtle parallax)
      const mouseInfluence = 0.1;
      positions[i3] += (mousePosition.x - positions[i3]) * 0.0001 * mouseInfluence;
      positions[i3 + 1] += (mousePosition.y - positions[i3 + 1]) * 0.0001 * mouseInfluence;

      // Slight drift with velocity
      positions[i3] += particles.velocities[i3];
      positions[i3 + 1] += particles.velocities[i3 + 1];
      positions[i3 + 2] += particles.velocities[i3 + 2];

      // Boundaries
      if (Math.abs(positions[i3]) > 12) particles.velocities[i3] *= -1;
      if (Math.abs(positions[i3 + 1]) > 6) particles.velocities[i3 + 1] *= -1;
      if (Math.abs(positions[i3 + 2]) > 5) particles.velocities[i3 + 2] *= -1;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Gentle rotation
    pointsRef.current.rotation.y = time * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
          args={[particles.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#FFB000"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    if (!linesRef.current) return;
    linesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
  });

  const linePositions = useMemo(() => {
    const positions: number[] = [];
    const lineCount = 50;

    for (let i = 0; i < lineCount; i++) {
      const x1 = (Math.random() - 0.5) * 20;
      const y1 = (Math.random() - 0.5) * 10;
      const z1 = (Math.random() - 0.5) * 8;

      const x2 = x1 + (Math.random() - 0.5) * 4;
      const y2 = y1 + (Math.random() - 0.5) * 4;
      const z2 = z1 + (Math.random() - 0.5) * 4;

      positions.push(x1, y1, z1, x2, y2, z2);
    }

    return new Float32Array(positions);
  }, []);

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={linePositions.length / 3}
          array={linePositions}
          itemSize={3}
          args={[linePositions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#FFB000" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

export default function HeroParticles() {
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <color attach="background" args={['#030304']} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#FFB000" />
        <ParticleField mousePosition={mousePosition.current} />
        <ConnectionLines />
      </Canvas>
    </div>
  );
}
