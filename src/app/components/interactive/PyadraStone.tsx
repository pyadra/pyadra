"use client";

import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";

type Phase = "IDLE" | "AWAKENING" | "CARVING" | "DECLARATION_1" | "DECLARATION_2" | "DECLARATION_3" | "THRESHOLD";

interface PyadraStoneProps {
  onComplete: (stats: { timeElapsed: number; pulsesSent: number; signalsFound: number; timestamp: string }) => void;
  observerId: string | null;
}

export default function PyadraStone({ onComplete, observerId }: PyadraStoneProps) {
  const [phase, setPhase] = useState<Phase>("IDLE");
  const [holdProgress, setHoldProgress] = useState(0);
  const [displayId, setDisplayId] = useState("...");
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  
  const HOLD_DURATION = 3000; // 3 seconds
  
  // Parallax tracking for "fake 3D"
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (phase !== "IDLE") return; // Solo parallax cuando está en IDLE
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };
  
  // Haptic feedback helper
  const triggerHaptic = useCallback((pattern: number | number[]) => {
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(pattern);
      } catch (e) {}
    }
  }, []);

  // Sintetizador de audio para el impacto y quiebre (Cero dependencias)
  const playCarvingSound = useCallback(() => {
    if (typeof window === "undefined") return;
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Impacto profundo (Bass drop)
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
    gainNode.gain.setValueAtTime(1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1);

    // Sonido de "Crackle" (Piedra rompiéndose)
    const bufferSize = ctx.sampleRate * 0.5; // 0.5 segundos
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start();
  }, []);

  const handlePointerDown = (e: React.PointerEvent | React.TouchEvent) => {
    if (phase !== "IDLE") return;
    if (e.cancelable) e.preventDefault();

    setPhase("AWAKENING");
    startTimeRef.current = Date.now();
    triggerHaptic(50);
    
    mouseX.set(0);
    mouseY.set(0);

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
    playCarvingSound(); // <--- AUDIO AÑADIDO
    
    onComplete({
      timeElapsed: 3,
      pulsesSent: 1,
      signalsFound: 6,
      timestamp: new Date().toISOString()
    });

    if (observerId) {
      let iterations = 0;
      const scrambleInterval = setInterval(() => {
        setDisplayId(observerId.split("").map((letter, index) => {
          if (index < iterations) return observerId[index];
          return "0123456789ABCDEF"[Math.floor(Math.random() * 16)];
        }).join(""));
        
        if (iterations >= observerId.length) {
          clearInterval(scrambleInterval);
          setDisplayId(observerId);
        }
        iterations += 1/3;
      }, 30);
    }

    setTimeout(() => setPhase("DECLARATION_1"), 3500); // Dar más tiempo para ver el grabado
    setTimeout(() => setPhase("DECLARATION_2"), 7500);
    setTimeout(() => setPhase("DECLARATION_3"), 11500);
    setTimeout(() => setPhase("THRESHOLD"), 16500);
  };

  // Ambient Particles Generator (Más grandes y brillantes)
  const [particles, setParticles] = useState<{ id: number; left: string; duration: number; delay: number; size: number }[]>([]);
  useEffect(() => {
    const generated = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: Math.random() * 10 + 10, // 10 to 20 seconds
      delay: Math.random() * 5,
      size: Math.random() * 3 + 2 // 2px to 5px
    }));
    setParticles(generated);
  }, []);

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    };
  }, []);

  const glowIntensity = phase === "AWAKENING" ? 0.2 + (holdProgress / 100) * 0.8 : 0.2;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      
      {/* 1. Atmospheric Dust (Perpetual Motion) */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute bottom-[-10%] bg-[#FFB000] rounded-full"
            initial={{ y: 0, opacity: 0, x: 0 }}
            animate={{
              y: "-110vh",
              opacity: [0, 0.4, 0.8, 0.4, 0],
              x: [0, Math.random() * 100 - 50] // Drift horizontal
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear"
            }}
            style={{ 
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              boxShadow: "0 0 12px rgba(255,176,0,0.8)"
            }}
          />
        ))}
      </div>

      {/* 2. Background ambient & Portal Light (Ambient Pulse) */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: phase === "THRESHOLD" 
            ? "radial-gradient(ellipse 80% 100% at center, rgba(255,176,0,0.2) 0%, rgba(3,3,4,1) 100%)" 
            : phase.startsWith("DECLARATION")
            ? "radial-gradient(circle at center, rgba(255,176,0,0.1) 0%, rgba(3,3,4,1) 70%)" // Corregido: ya no es azul/pálido, mantiene la energía de la piedra
            : `radial-gradient(circle at center, rgba(255,176,0,${glowIntensity * 0.15}) 0%, rgba(3,3,4,1) ${30 + holdProgress * 0.4}%)`,
          opacity: phase !== "AWAKENING" ? [0.8, 1, 0.8] : 1 // El "Latido" cósmico
        }}
        transition={{ 
          background: { duration: 2 },
          opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* El Haz de luz vertical del Portal (Shimmering Threshold) */}
        <AnimatePresence>
          {phase === "THRESHOLD" && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 0.3, scaleX: 1 }}
              transition={{ duration: 3, ease: "easeOut" }}
              className="absolute inset-0 flex justify-center"
            >
              <motion.div 
                animate={{ opacity: [0.6, 1, 0.6], scaleX: [0.9, 1.1, 0.9] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-[1px] md:w-[2px] h-full bg-gradient-to-b from-transparent via-[#FFB000] to-transparent shadow-[0_0_50px_#FFB000]" 
              />
              <motion.div 
                animate={{ opacity: [0.15, 0.25, 0.15] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-transparent via-[#FFB000] to-transparent blur-2xl" 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Supernova Flash Transition (Piedra rompiéndose hacia la Declaración) */}
      <AnimatePresence>
        {phase === "DECLARATION_1" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 4] }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center"
          >
            <div className="w-64 h-64 bg-[#FFB000] rounded-full blur-[100px]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Pyadra Stone Container */}
      <div 
        className="relative z-20 flex flex-col items-center justify-center w-full h-full max-w-lg mx-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: "1000px" }}
      >
        
        {/* The Stone Visual */}
        <AnimatePresence mode="wait">
          {(!phase.startsWith("DECLARATION") && phase !== "THRESHOLD") && (
            <motion.div
              key="stone"
              className="relative cursor-pointer touch-none flex items-center justify-center"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onContextMenu={(e) => e.preventDefault()}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: phase === "AWAKENING" ? 1 + (holdProgress / 100) * 0.1 : phase === "CARVING" ? 1.1 : 1,
                rotateZ: phase === "AWAKENING" ? [0, -1, 1, -0.5, 0.5, 0] : 0,
                y: phase === "IDLE" || phase === "CARVING" ? [-4, 4, -4] : 0, // Levitación magnética
                filter: `drop-shadow(0 0 ${20 + holdProgress}px rgba(255,176,0,${phase === "CARVING" ? 0.8 : glowIntensity}))`
              }}
              style={{
                rotateX: phase === "IDLE" ? rotateX : 0,
                rotateY: phase === "IDLE" ? rotateY : 0,
                transformStyle: "preserve-3d"
              }}
              transition={{ 
                rotateZ: { repeat: phase === "AWAKENING" ? Infinity : 0, duration: 0.2 },
                y: { repeat: phase !== "AWAKENING" ? Infinity : 0, duration: 4, ease: "easeInOut" },
                scale: { type: "spring", stiffness: 100, damping: 10 },
                opacity: { duration: 1 }
              }}
              exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }} // Explota y desaparece AL ENTRAR a DECLARATION
            >
              {/* Stone shape */}
              <div 
                className="w-40 h-56 md:w-48 md:h-64 relative z-10"
                style={{
                  background: "linear-gradient(135deg, #0f1520 0%, #030408 50%, #010204 100%)",
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  boxShadow: "inset 0 0 40px rgba(255,176,0,0.1)",
                  border: "1px solid rgba(255,255,255,0.05)"
                }}
              >
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 45%, transparent 50%)"
                  }}
                />
                
                <motion.div
                  className="absolute inset-0 bg-[#FFB000]"
                  style={{
                    clipPath: "polygon(48% 20%, 52% 20%, 50% 80%, 45% 70%, 55% 40%)",
                  }}
                  animate={{
                    opacity: phase === "AWAKENING" ? holdProgress / 100 : phase === "CARVING" ? 0.8 : 0.05,
                    filter: `blur(${3 + (holdProgress/20)}px)`
                  }}
                />
              </div>

              {/* Laser Carving Effect FOR OBSERVER ID (AHORA DENTRO DE LA PIEDRA) */}
              <AnimatePresence>
                {phase === "CARVING" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, filter: "brightness(3) blur(10px)" }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      filter: ["brightness(3) blur(4px)", "brightness(1) blur(0px)"],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 flex flex-col items-center justify-center z-40 pointer-events-none"
                  >
                    <div 
                      className="text-lg md:text-xl font-mono tracking-[0.2em] font-bold text-center"
                      style={{
                        // Efecto de grabado en piedra: color oscuro con sombras internas y luz sangrando
                        color: "#030408",
                        textShadow: "-1px -1px 1px rgba(255,176,0,0.3), 1px 1px 2px rgba(0,0,0,0.8), 0 0 15px rgba(255,176,0,0.6)"
                      }}
                    >
                      OBSERVER<br/>{displayId}
                    </div>
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      transition={{ delay: 1 }}
                      className="text-[7px] font-sans font-normal tracking-[0.3em] mt-3 text-[#FFB000]/60 uppercase text-center"
                    >
                      ENGRAVED
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Interaction Hint */}
              <AnimatePresence>
                {phase === "IDLE" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-[9px] md:text-[10px] font-mono tracking-[0.3em] uppercase text-[#E3DAC9]/40 whitespace-nowrap"
                  >
                    Hold to awaken
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress indicator */}
              <AnimatePresence>
                {phase === "AWAKENING" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-white/10"
                  >
                    <motion.div 
                      className="h-full bg-[#FFB000]"
                      style={{ width: `${holdProgress}%` }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 3 & 4: The Declaration */}
        <AnimatePresence>
          {(phase.startsWith("DECLARATION") || phase === "THRESHOLD") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none"
            >
              {/* Minimal Explanation / The Declaration */}
              <div className="absolute inset-0 flex items-center justify-center px-6">
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
                      <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-[#E3DAC9] italic tracking-wide max-w-3xl leading-tight">
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
                      <h2 className="text-xl md:text-3xl lg:text-4xl font-serif text-[#E3DAC9] tracking-wide max-w-2xl leading-snug">
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
                      className="text-center max-w-xl flex flex-col items-center"
                    >
                      <h1 className="text-3xl md:text-5xl font-serif tracking-[0.2em] text-white mb-6">
                        PYADRA
                      </h1>
                      <p className="text-[11px] md:text-[13px] font-sans tracking-widest text-[#E3DAC9]/70 leading-relaxed uppercase">
                        The sanctuary for permanent digital artifacts.
                        <br className="hidden md:block"/> We immortalize your legacy.
                        <br/><br/>
                        <span className="text-[#FFB000]">What you forge here, outlives you.</span>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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
            transition={{ duration: 2 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-auto"
          >
            {/* The Reborn Stone (Cosmic Mandala) */}
            <motion.div
              initial={{ scale: 0, opacity: 0, rotateZ: 0 }}
              animate={{ scale: [1.2, 1.3, 1.2], opacity: 0.15, rotateZ: 360 }}
              transition={{ 
                scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 3 },
                rotateZ: { duration: 30, repeat: Infinity, ease: "linear" }
              }}
              className="absolute z-0 pointer-events-none flex items-center justify-center"
            >
              <div 
                className="w-64 h-96 md:w-[400px] md:h-[500px] relative"
                style={{
                  background: "linear-gradient(135deg, rgba(255,176,0,0.05) 0%, transparent 100%)",
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  boxShadow: "inset 0 0 100px rgba(255,176,0,0.2)",
                  border: "1px solid rgba(255,176,0,0.3)"
                }}
              >
                <div 
                  className="absolute inset-0 bg-[#FFB000]"
                  style={{
                    clipPath: "polygon(48% 20%, 52% 20%, 50% 80%, 45% 70%, 55% 40%)",
                    opacity: 0.5,
                    filter: "blur(15px)"
                  }}
                />
              </div>
            </motion.div>

            {/* The Portal Light */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.8 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute top-0 bottom-0 w-[1px] md:w-[2px] bg-gradient-to-b from-transparent via-[#FFB000] to-transparent shadow-[0_0_50px_rgba(255,176,0,0.8)] z-10"
              style={{
                transformOrigin: "center"
              }}
            />
            
            {/* The Gateway expanding slightly */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "200px", opacity: 0.1 }}
              transition={{ duration: 3, delay: 1, ease: "easeInOut" }}
              className="absolute top-0 bottom-0 bg-gradient-to-r from-transparent via-[#FFB000] to-transparent blur-2xl"
            />

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 2 }}
              className="absolute bottom-24 md:bottom-32"
            >
              <a
                href="/exhibitions"
                className="group relative overflow-hidden bg-black/40 backdrop-blur-xl border border-[#FFB000]/40 px-12 md:px-16 py-4 md:py-5 text-center transition-all duration-700 hover:bg-[#FFB000]/20 hover:border-[#FFB000]/80 hover:shadow-[0_0_40px_rgba(255,176,0,0.3)] rounded-sm flex items-center gap-4"
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,176,0,0.2)_0%,_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <span className="relative z-10 text-[#FFB000] group-hover:text-[#FFE5B4] text-[10px] md:text-[11px] font-mono tracking-[0.2em] uppercase transition-colors duration-500">
                  CROSS THE THRESHOLD
                </span>
              </a>
            </motion.div>
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
  );
}
