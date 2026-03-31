import { useMemo, useEffect, useRef } from 'react';
import { Mesh } from 'three';

/**
 * Mars-like ground plane with subtle elevation
 * Rough, matte surface with natural irregularities
 */
export function MarsGround() {
  const meshRef = useRef<Mesh>(null);

  // Generate terrain with subtle burial hints
  const heightMap = useMemo(() => {
    const size = 100 * 100;
    const heights: number[] = [];

    // Define subtle anomaly locations (2 artifacts only)
    const anomalies = [
      { x: 0.35, y: 0.42, radius: 0.11, depth: 0.14 },   // Orbit - left area
      { x: 0.65, y: 0.52, radius: 0.1, depth: 0.12 },    // Capsule - right area
    ];

    for (let i = 0; i < size; i++) {
      const x = (i % 100) / 100;
      const y = Math.floor(i / 100) / 100;

      // Base terrain layers - more variation for grazing light
      const largeDunes = Math.sin(x * Math.PI * 1.8) * Math.cos(y * Math.PI * 1.5) * 0.35;
      const mediumRidges = Math.sin(x * Math.PI * 6.5 + y * 4) * 0.15;
      const smallDetail = Math.cos(x * Math.PI * 15) * Math.sin(y * Math.PI * 12) * 0.08;
      const microTexture = (Math.random() - 0.5) * 0.1;

      // Erosion channels for realism
      const channelX = Math.abs(Math.sin(x * Math.PI * 9.5)) < 0.08 ? -0.04 : 0;
      const channelY = Math.abs(Math.cos(y * Math.PI * 7.5)) < 0.06 ? -0.03 : 0;

      // Add subtle burial mounds/depressions
      let anomalyInfluence = 0;
      anomalies.forEach(anomaly => {
        const dx = x - anomaly.x;
        const dy = y - anomaly.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < anomaly.radius) {
          // Gaussian-like mound with slight depression in center
          const influence = Math.exp(-((dist * dist) / (anomaly.radius * anomaly.radius * 0.3)));
          anomalyInfluence += influence * anomaly.depth * (dist < anomaly.radius * 0.3 ? -0.5 : 1);
        }
      });

      const height = largeDunes + mediumRidges + smallDetail + microTexture +
                     channelX + channelY + anomalyInfluence;

      heights.push(height);
    }

    return heights;
  }, []);

  // Apply height to geometry once
  useEffect(() => {
    if (meshRef.current) {
      const posAttr = meshRef.current.geometry.attributes.position;

      for (let i = 0; i < posAttr.count; i++) {
        const height = heightMap[i] || 0;
        posAttr.setZ(i, height);
      }

      posAttr.needsUpdate = true;
      meshRef.current.geometry.computeVertexNormals();
    }
  }, [heightMap]);

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[50, 50, 99, 99]} />
      <meshStandardMaterial
        color="#8a5235"
        roughness={0.98}
        metalness={0.01}
        flatShading={false}
      />
    </mesh>
  );
}
