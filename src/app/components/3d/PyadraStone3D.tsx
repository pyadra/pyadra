"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, ContactShadows, Environment, Sparkles } from "@react-three/drei";
import * as THREE from "three";

type Phase = "IDLE" | "AWAKENING" | "CARVING" | "DECLARATION_1" | "DECLARATION_2" | "DECLARATION_3" | "THRESHOLD";

interface PyadraStone3DProps {
  onComplete: (stats: { timeElapsed: number; pulsesSent: number; signalsFound: number; timestamp: string }) => void;
  observerId: string | null;
}

/* =========================================
   3D COMPONENT: The Obsidian Core
   ========================================= */
function ObsidianCore({ phase, holdProgress }: { phase: Phase; holdProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  
  // Gyroscope tracking for mobile
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma && e.beta) {
        // gamma is left/right (-90 to 90)
        // beta is front/back (-180 to 180)
        setMousePosition({
          x: Math.min(Math.max(e.gamma / 45, -1), 1),
          y: Math.min(Math.max((e.beta - 45) / 45, -1), 1)
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("deviceorientation", handleDeviceOrientation);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Base rotation
    meshRef.current.rotation.y += delta * 0.2;
    
    // Interactive rotation (gyroscope / mouse)
    const targetRotX = mousePosition.y * 0.5;
    const targetRotZ = -mousePosition.x * 0.5;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.1);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotZ, 0.1);

    // Awakening shake and explode effect
    if (phase === "AWAKENING") {
      const shakeIntensity = (holdProgress / 100) * 0.1;
      meshRef.current.position.x = (Math.random() - 0.5) * shakeIntensity;
      meshRef.current.position.y = (Math.random() - 0.5) * shakeIntensity;
      
      if (materialRef.current) {
        // Increase transmission and chromatic aberration as it heats up
        materialRef.current.transmission = THREE.MathUtils.lerp(materialRef.current.transmission, 1, 0.05);
        materialRef.current.chromaticAberration = THREE.MathUtils.lerp(materialRef.current.chromaticAberration, 1.5, 0.05);
      }
    } else {
      // Reset position
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, 0, 0.1);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, 0.1);
      
      if (materialRef.current) {
        materialRef.current.transmission = THREE.MathUtils.lerp(materialRef.current.transmission, 0.8, 0.05);
        materialRef.current.chromaticAberration = THREE.MathUtils.lerp(materialRef.current.chromaticAberration, 0.2, 0.05);
      }
    }

    // Carving / Shatter effect
    if (phase === "CARVING" || phase.startsWith("DECLARATION") || phase === "THRESHOLD") {
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 5, 0.05);
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 5, 0.05);
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 5, 0.05);
      if (materialRef.current) {
        materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, 0, 0.05);
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1.5, 0]} />
        <MeshTransmissionMaterial
          ref={materialRef}
          backside
          samples={4}
          thickness={2}
          chromaticAberration={0.2}
          anisotropy={0.3}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.2}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          color="#050810" // Dark obsidian/sapphire
          attenuationDistance={0.5}
          attenuationColor="#FFB000" // Inner amber/gold glow
          transparent
        />
      </mesh>
      
      {/* Inner Light Core */}
      <pointLight 
        color="#FFB000" 
        intensity={phase === "AWAKENING" ? 2 + (holdProgress / 100) * 10 : 2} 
        distance={10} 
      />
    </Float>
  );
}

/* =========================================
   MAIN COMPONENT: The Interactive UI Layer
   ========================================= */
export default function PyadraStone3D({ onComplete, observerId }: PyadraStone3DProps) {
  const [phase, setPhase] = useState<Phase>("IDLE");
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  
  const HOLD_DURATION = 3000; // 3 seconds
  
  // Haptic feedback helper
  const triggerHaptic = useCallback((pattern: number | number[]) => {
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(pattern);
      } catch (e) {}
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent | React.TouchEvent) => {
    if (phase !== "IDLE") return;
    if (e.cancelable) e.preventDefault();

    setPhase("AWAKENING");
    startTimeRef.current = Date.now();
    triggerHaptic(50);

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setHoldProgress(progress);
      
      if (progress > 30 && progress < 35) triggerHaptic(20);
      if (progress > 60 && progress < 65) triggerHaptic(30);
      if (progress > 85 && progress < 90) triggerHaptic(40);

      if (progress >= 100) {
        completeAwakening();
      } else {
        holdTimerRef.current = setTimeout(updateProgress, 50);
      }
    };

    holdTimerRef.current = setTimeout(updateProgress, 50);
  };

  const handlePointerUp = () => {
    if (phase === "AWAKENING") {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      setPhase("IDLE");
      setHoldProgress(0);
      triggerHaptic(10);
    }
  };

  const completeAwakening = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    setPhase("CARVING");
    triggerHaptic([100, 50, 100, 50, 200]);
    
    onComplete({
      timeElapsed: 3,
      pulsesSent: 1,
      signalsFound: 6,
      timestamp: new Date().toISOString()
    });

    // Sequence to DECLARATION and THRESHOLD
    setTimeout(() => setPhase("DECLARATION_1"), 3000);
    setTimeout(() => setPhase("DECLARATION_2"), 7000);
    setTimeout(() => setPhase("DECLARATION_3"), 11000);
    setTimeout(() => setPhase("THRESHOLD"), 16000);
  };

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-[#020203] overflow-hidden">
      
      {/* --- 3D CANVAS LAYER --- */}
      <div 
        className="absolute inset-0 z-10 touch-none"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.1} />
          <Environment preset="city" />
          
          {phase === "IDLE" || phase === "AWAKENING" ? (
             <ObsidianCore phase={phase} holdProgress={holdProgress} />
          ) : null}

          {/* Background Sparkles when carved */}
          {(phase === "CARVING" || phase.startsWith("DECLARATION") || phase === "THRESHOLD") && (
            <Sparkles count={200} scale={10} size={2} speed={0.4} opacity={0.5} color="#FFB000" />
          )}
          
          {/* Contact Shadows for ground grounding */}
          <ContactShadows resolution={1024} scale={10} blur={2} opacity={0.5} far={10} color="#FFB000" />
        </Canvas>
      </div>

      {/* --- UI OVERLAY LAYER --- */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center">
        
        {/* Interaction Hint */}
        <AnimatePresence>
          {phase === "IDLE" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-32 text-[9px] md:text-[10px] font-mono tracking-[0.3em] uppercase text-[#E3DAC9]/40 whitespace-nowrap"
            >
              Touch the stone to awaken
            </motion.div>
          )}
        </AnimatePresence>

        {/* Awakening Progress UI */}
        <AnimatePresence>
          {phase === "AWAKENING" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-32 w-48 h-[1px] bg-white/10"
            >
              <motion.div 
                className="h-full bg-[#FFB000] shadow-[0_0_10px_#FFB000]"
                style={{ width: `${holdProgress}%` }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 3: The Carving */}
        <AnimatePresence>
          {phase === "CARVING" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: "brightness(3) blur(10px)" }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                filter: ["brightness(3) blur(10px)", "brightness(2) blur(2px)", "brightness(1) blur(0px)"],
                color: ["#FFFFFF", "#FF5500", "#FFB000"],
                textShadow: ["0 0 50px #FFFFFF", "0 0 30px #FF0000", "0 0 15px rgba(255,176,0,0.5)"]
              }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="text-2xl md:text-4xl font-mono tracking-[0.3em] font-bold text-center"
            >
              OBSERVER {observerId || "..."}
              <div className="text-[10px] font-sans font-normal tracking-[0.2em] mt-4 text-[#E3DAC9]/50 uppercase">
                Identity Engraved
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 4: The Declaration (3 Steps) */}
        <div className="absolute inset-0 flex items-center justify-center px-6 md:px-12 pointer-events-none">
          <AnimatePresence mode="wait">
            {phase === "DECLARATION_1" && (
              <motion.div
                key="dec1"
                initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif text-[#E3DAC9] italic tracking-wide max-w-4xl leading-tight">
                  Everything you build online <br/><span className="text-[#FFB000]">is rented.</span>
                </h2>
              </motion.div>
            )}

            {phase === "DECLARATION_2" && (
              <motion.div
                key="dec2"
                initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                className="text-center space-y-6"
              >
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-[#E3DAC9] tracking-wide max-w-3xl leading-snug">
                  Servers die. Accounts fade.<br/>
                  Memories are overwritten.
                </h2>
                <div className="w-12 h-[1px] bg-[#FFB000]/50 mx-auto"></div>
              </motion.div>
            )}

            {(phase === "DECLARATION_3" || phase === "THRESHOLD") && (
              <motion.div
                key="dec3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                className="text-center max-w-2xl flex flex-col items-center"
              >
                <h1 className="text-4xl md:text-6xl font-serif tracking-[0.2em] text-white mb-6">
                  PYADRA
                </h1>
                <p className="text-[12px] md:text-[14px] font-sans tracking-widest text-[#E3DAC9]/70 leading-relaxed uppercase">
                  The sanctuary for permanent digital artifacts.
                  <br className="hidden md:block"/> We immortalize your legacy.
                  <br/><br/>
                  <span className="text-[#FFB000]">What you forge here, outlives you.</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Phase 5: The Threshold (Portal & Button) */}
        <AnimatePresence>
          {phase === "THRESHOLD" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 1 }}
              className="absolute bottom-24 md:bottom-32 pointer-events-auto"
            >
              <a
                href="/exhibitions"
                className="group relative overflow-hidden bg-black/60 backdrop-blur-2xl border border-[#FFB000]/30 px-12 md:px-16 py-4 md:py-5 text-center transition-all duration-700 hover:bg-[#FFB000]/10 hover:border-[#FFB000]/80 hover:shadow-[0_0_50px_rgba(255,176,0,0.4)] rounded-sm flex items-center gap-4"
              >
                <span className="relative z-10 text-[#FFB000] group-hover:text-[#FFE5B4] text-[10px] md:text-[11px] font-mono tracking-[0.3em] uppercase transition-colors duration-500">
                  ENTER THE SANCTUARY
                </span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Initial Hint Message (Top left) */}
        <AnimatePresence>
          {phase === "IDLE" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="absolute top-8 left-8 text-[9px] md:text-[10px] font-mono tracking-[0.2em] text-[#E3DAC9]/50 uppercase"
            >
              You have found the Archive.
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
