import { Canvas } from '@react-three/fiber';
import { LightingRig } from './LightingRig';
import { MarsGround } from './MarsGround';
import { DustField } from './DustField';
import { LanternPointer } from './LanternPointer';
import { CameraBreathing } from './CameraBreathing';
import { CameraSetup } from './CameraSetup';
import { AtmosphericDepth } from './AtmosphericDepth';
import { OrbitArtifact } from './OrbitArtifact';
import { CapsuleArtifact } from './CapsuleArtifact';
import { CameraTransition } from './CameraTransition';
import { EnvironmentResponse } from './EnvironmentResponse';
import { PostProcessing } from './PostProcessing';
import { EnergyParticles } from './EnergyParticles';

/**
 * Main 3D scene for /projects page
 * Dark Mars excavation environment with cursor-following lantern
 * Phase 1: Foundation - atmosphere and exploration mechanics
 * Phase 2: Two buried artifacts - Orbit and Capsule (simplified for clarity)
 * Phase 3: Cinematic activation and transitions
 */
export default function ProjectsScene() {
  return (
    <Canvas
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
      camera={{
        position: [0, 6, 10],
        fov: 55,
        near: 0.1,
        far: 100,
      }}
      gl={{
        antialias: true,
        alpha: false,
      }}
    >
      {/* Background atmospheric gradient */}
      <AtmosphericDepth />

      {/* Camera rotation setup */}
      <CameraSetup />

      {/* Lighting setup - minimal ambient + cursor spotlight */}
      <LightingRig />

      {/* Cursor-following lantern spotlight */}
      <LanternPointer />

      {/* Subtle camera breathing motion */}
      <CameraBreathing />

      {/* Phase 3: Camera transitions during activation */}
      <CameraTransition />

      {/* Phase 3: Environment lighting response */}
      <EnvironmentResponse />

      {/* Mars-like ground plane with burial hints */}
      <MarsGround />

      {/* Phase 2: Two main artifacts */}
      <OrbitArtifact />
      <CapsuleArtifact />

      {/* Subtle energy particles */}
      <EnergyParticles
        position={[-6, 1.0, -2]}
        count={25}
        radius={3.2}
        color="#2a4a6a"
      />
      <EnergyParticles
        position={[6, 1.5, 2]}
        count={20}
        radius={2.5}
        color="#6a5a3a"
      />

      {/* Floating dust particles */}
      <DustField />

      {/* Atmospheric fog */}
      <fog attach="fog" args={['#4a3828', 30, 80]} />

      {/* Post-processing effects - MUST BE LAST */}
      <PostProcessing />
    </Canvas>
  );
}
