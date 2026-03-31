import { useRef } from 'react';
import { BackSide, Mesh } from 'three';

/**
 * Background depth gradient
 * Creates atmospheric horizon without feeling flat
 * Not space, not bright - just dusty depth
 */
export function AtmosphericDepth() {
  const meshRef = useRef<Mesh>(null);

  return (
    <mesh ref={meshRef} scale={[1, 1, 1]}>
      <sphereGeometry args={[70, 32, 32]} />
      <shaderMaterial
        vertexShader={`
          varying vec3 vWorldPosition;

          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vWorldPosition;

          void main() {
            float h = normalize(vWorldPosition).y;

            // Almost black - mysterious cosmic void
            vec3 topColor = vec3(0.01, 0.01, 0.02);          // Near black with blue tint
            vec3 midColor = vec3(0.03, 0.025, 0.02);         // Very dark
            vec3 horizonColor = vec3(0.08, 0.06, 0.04);      // Subtle warm horizon

            // Smooth blend
            float horizonBlend = smoothstep(-0.2, 0.15, h);
            float topBlend = smoothstep(0.0, 0.8, h);

            vec3 color = mix(horizonColor, midColor, horizonBlend);
            color = mix(color, topColor, topBlend);

            gl_FragColor = vec4(color, 1.0);
          }
        `}
        side={BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}
