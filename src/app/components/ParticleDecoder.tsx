'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// 6 símbolos ocultos que formarán PYADRA
const SYMBOLS = [
  { id: 'P', letter: 'P', concept: 'PHYSICAL', color: '#FF8C00', frequency: 220, x: -8, y: 3 },
  { id: 'Y', letter: 'Y', concept: '', color: '#FFB000', frequency: 293, x: 4, y: -4 },
  { id: 'A1', letter: 'A', concept: '', color: '#FFB000', frequency: 329, x: -6, y: -2 },
  { id: 'D', letter: 'D', concept: '', color: '#FFB000', frequency: 392, x: 7, y: 1 },
  { id: 'R', letter: 'R', concept: '', color: '#FFB000', frequency: 440, x: 0, y: 4 },
  { id: 'A2', letter: 'A', concept: 'MEDIA + MEMORY', color: '#39FF14', frequency: 523, x: 2, y: -5 },
];

// Posiciones finales para formar PYADRA (horizontal centrado en pantalla)
const FINAL_POSITIONS = [
  { x: 25, y: 45 }, // P
  { x: 35, y: 45 }, // Y
  { x: 45, y: 45 }, // A
  { x: 55, y: 45 }, // D
  { x: 65, y: 45 }, // R
  { x: 75, y: 45 }, // A
];

interface ParticleSystemProps {
  mousePosition: THREE.Vector2;
  decodedSymbols: Set<string>;
  pulses: Pulse[];
}

function ParticleSystem({ mousePosition, decodedSymbols, pulses }: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { size } = useThree();
  const isMobile = size.width < 768;
  const particleCount = isMobile ? 2500 : 6000; // Mucho más denso

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const x = (Math.random() - 0.5) * 30;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 10;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;

      velocities[i3] = (Math.random() - 0.5) * 0.005;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.005;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.005;
    }

    return { positions, velocities, originalPositions };
  }, [particleCount]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    const now = Date.now();

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Gentle drift
      positions[i3] += particles.velocities[i3];
      positions[i3 + 1] += particles.velocities[i3 + 1];
      positions[i3 + 2] += particles.velocities[i3 + 2];

      // REPULSIÓN por PULSOS
      pulses.forEach(pulse => {
        const age = (now - pulse.startTime) / 1000;
        const radius = age * 8;

        const dx = positions[i3] - pulse.x;
        const dy = positions[i3 + 1] - pulse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Partículas cerca del borde del pulso se repelen
        if (distance > radius - 1 && distance < radius + 1) {
          const force = 0.25 * (1 - age / 1.5); // Decay con tiempo
          positions[i3] += (dx / distance) * force;
          positions[i3 + 1] += (dy / distance) * force;
        }
      });

      // Retorno suave a posición original
      positions[i3] += (particles.originalPositions[i3] - positions[i3]) * 0.02;
      positions[i3 + 1] += (particles.originalPositions[i3 + 1] - positions[i3 + 1]) * 0.02;

      // Floating animation
      positions[i3 + 1] += Math.sin(time * 0.3 + i * 0.05) * 0.002;

      // Boundaries
      if (Math.abs(positions[i3]) > 15) particles.velocities[i3] *= -1;
      if (Math.abs(positions[i3 + 1]) > 10) particles.velocities[i3 + 1] *= -1;
      if (Math.abs(positions[i3 + 2]) > 5) particles.velocities[i3 + 2] *= -1;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
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
        size={0.04}
        color="#FFB000"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function HiddenSymbol({
  symbol,
  isDecoded,
  isRevealed
}: {
  symbol: typeof SYMBOLS[0];
  isDecoded: boolean;
  isRevealed: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current || isDecoded) return;

    // Idle rotation suave
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;

    // Pulse cuando revelado
    if (isRevealed) {
      const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.2 + 1.2;
      meshRef.current.scale.setScalar(pulse);
    } else {
      meshRef.current.scale.setScalar(1);
    }
  });

  const glowOpacity = isDecoded ? 0 : (isRevealed ? 0.6 : 0.02);
  const coreOpacity = isDecoded ? 0 : (isRevealed ? 0.9 : 0.05);

  return (
    <group ref={meshRef} position={[symbol.x, symbol.y, 0]}>
      {/* Glow exterior (brillante cuando revelado) */}
      <mesh>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color={symbol.color} transparent opacity={glowOpacity} />
      </mesh>

      {/* Core del símbolo */}
      <mesh>
        <torusGeometry args={[0.5, 0.08, 8, 32]} />
        <meshBasicMaterial
          color={symbol.color}
          transparent
          opacity={coreOpacity}
        />
      </mesh>

      {/* Inner dot (visible solo cuando revelado) */}
      {isRevealed && (
        <mesh>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial
            color={symbol.color}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
}

interface Pulse {
  id: string;
  x: number;
  y: number;
  startTime: number;
}

interface GameStats {
  timeElapsed: number;
  pulsesSent: number;
  signalsFound: number;
  timestamp: string;
}

export default function ParticleDecoder({ onComplete }: { onComplete?: (stats: GameStats) => void }) {
  const mousePositionRef = useRef(new THREE.Vector2(0, 0));
  const [mousePosition, setMousePosition] = useState(new THREE.Vector2(0, 0));
  const [decodedSymbols, setDecodedSymbols] = useState<Set<string>>(new Set());
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [revealedSymbols, setRevealedSymbols] = useState<Set<string>>(new Set());
  const [capturedSymbol, setCapturedSymbol] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastMouseUpdateRef = useRef(0);

  // Game stats tracking
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pulseCount, setPulseCount] = useState(0);
  const [gameStartTimestamp] = useState(() => new Date().toISOString());

  // Detectar símbolos revelados por pulsos
  useEffect(() => {
    if (pulses.length === 0) return;

    const now = Date.now();
    const newRevealed = new Set<string>();
    const processedPulses = new Set<string>();

    pulses.forEach(pulse => {
      const age = (now - pulse.startTime) / 1000; // segundos
      const radius = age * 8; // Velocidad de expansión

      SYMBOLS.forEach(symbol => {
        if (decodedSymbols.has(symbol.id)) return;
        if (processedPulses.has(`${pulse.id}-${symbol.id}`)) return;

        const distance = Math.sqrt(
          Math.pow(pulse.x - symbol.x, 2) +
          Math.pow(pulse.y - symbol.y, 2)
        );

        // Si el pulso golpea el símbolo
        if (distance < radius && distance > radius - 0.5) {
          newRevealed.add(symbol.id);
          processedPulses.add(`${pulse.id}-${symbol.id}`);
          playPingSound(symbol.frequency);
        }
      });
    });

    if (newRevealed.size > 0) {
      setRevealedSymbols(prev => new Set([...prev, ...newRevealed]));

      // Ocultar después de 3 segundos
      const hideTimer = setTimeout(() => {
        setRevealedSymbols(prev => {
          const updated = new Set(prev);
          newRevealed.forEach(id => updated.delete(id));
          return updated;
        });
      }, 3000);

      return () => clearTimeout(hideTimer);
    }
  }, [pulses.length, decodedSymbols]);

  // Limpiar pulsos viejos en intervalo separado
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setPulses(prev => {
        const now = Date.now();
        return prev.filter(p => (now - p.startTime) < 1500);
      });
    }, 500);

    return () => clearInterval(cleanupInterval);
  }, []);

  const playPingSound = (frequency: number) => {
    if (!audioEnabled || typeof window === 'undefined') return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new AudioContextClass();
      } catch (e) {
        return;
      }
    }

    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.value = frequency;
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  };

  useEffect(() => {
    if (decodedSymbols.size === SYMBOLS.length && !isComplete) {
      setIsComplete(true);
      playCompleteSound();

      // Calculate stats
      const endTime = Date.now();
      const timeElapsed = startTime ? Math.floor((endTime - startTime) / 1000) : 0;

      const stats: GameStats = {
        timeElapsed,
        pulsesSent: pulseCount,
        signalsFound: SYMBOLS.length,
        timestamp: gameStartTimestamp,
      };

      setTimeout(() => {
        onComplete?.(stats);
      }, 1000);
    }
  }, [decodedSymbols.size, isComplete, onComplete, startTime, pulseCount, gameStartTimestamp]);

  const playCompleteSound = () => {
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    try {
      const ctx = new AudioContextClass();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.value = 523.25; // C5
      osc2.frequency.value = 659.25; // E5

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.8);
      osc2.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.log('Audio context blocked');
    }
  };

  const playDecodeSound = () => {
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    try {
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.value = 1200;
      osc.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.log('Audio context blocked');
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const now = Date.now();
    // Throttle a 60fps máximo
    if (now - lastMouseUpdateRef.current < 16) return;

    lastMouseUpdateRef.current = now;
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;

    mousePositionRef.current.set(x, y);
    setMousePosition(new THREE.Vector2(x, y));
  };

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    // Habilitar audio en primer tap (mobile)
    if (!audioEnabled) {
      setAudioEnabled(true);
    }

    let clientX: number;
    let clientY: number;

    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Convertir a coordenadas 3D
    const x = (clientX / window.innerWidth) * 30 - 15;
    const y = -((clientY / window.innerHeight) * 20 - 10);

    // Verificar si estamos haciendo click sobre un símbolo revelado
    let captured = false;
    SYMBOLS.forEach(symbol => {
      if (decodedSymbols.has(symbol.id) || !revealedSymbols.has(symbol.id)) return;

      const distance = Math.sqrt(
        Math.pow(x - symbol.x, 2) +
        Math.pow(y - symbol.y, 2)
      );

      if (distance < 2) {
        setCapturedSymbol(symbol.id);
        playDecodeSound();
        captured = true;

        // Stronger haptic feedback for capture
        if ('vibrate' in navigator) {
          navigator.vibrate([30, 50, 30]);
        }

        setTimeout(() => {
          setDecodedSymbols(prev => new Set([...prev, symbol.id]));
          setRevealedSymbols(prev => {
            const updated = new Set(prev);
            updated.delete(symbol.id);
            return updated;
          });
          setCapturedSymbol(null);
        }, 600);
      }
    });

    // Si no capturamos, crear pulso
    if (!captured) {
      // Start timer on first pulse
      if (startTime === null) {
        setStartTime(Date.now());
      }

      // Increment pulse count
      setPulseCount(prev => prev + 1);

      setPulses(prev => [...prev, {
        id: `${Date.now()}-${Math.random()}`,
        x,
        y,
        startTime: Date.now(),
      }]);

      // Haptic feedback on mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }

      // Sonar de pulso
      playPulseSound();
    }
  };

  const playPulseSound = () => {
    if (!audioEnabled || typeof window === 'undefined') return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new AudioContextClass();
      } catch (e) {
        return;
      }
    }

    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.value = 150;
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  };

  return (
    <div
      className="absolute inset-0 w-full h-full cursor-crosshair"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onTouchStart={handleClick}
    >
      {/* Three.js Canvas */}
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <color attach="background" args={['#030304']} />
        <ParticleSystem
          mousePosition={mousePosition}
          decodedSymbols={decodedSymbols}
          pulses={pulses}
        />
        {SYMBOLS.map(symbol => {
          return (
            <HiddenSymbol
              key={symbol.id}
              symbol={symbol}
              isDecoded={decodedSymbols.has(symbol.id)}
              isRevealed={revealedSymbols.has(symbol.id)}
            />
          );
        })}
      </Canvas>

      {/* Pulsos Visuales (HTML Overlay) */}
      <AnimatePresence>
        {pulses.map(pulse => {
          const screenX = ((pulse.x + 15) / 30) * 100;
          const screenY = (1 - (pulse.y + 10) / 20) * 100;

          return (
            <motion.div
              key={pulse.id}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute pointer-events-none rounded-full border-2 border-[#FFB000]"
              style={{
                left: `${screenX}%`,
                top: `${screenY}%`,
                width: '40px',
                height: '40px',
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        })}
      </AnimatePresence>

      {/* Progress Indicator - Show during game, hide when complete */}
      {!isComplete && startTime !== null && (
        <div className="absolute top-20 md:top-24 left-1/2 -translate-x-1/2 pointer-events-none z-40">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] md:text-[11px] font-mono uppercase tracking-[0.3em] text-[#E3DAC9]/60 flex items-center gap-3"
          >
            <span className="text-[#FFB000]">SIGNALS: {decodedSymbols.size}/{SYMBOLS.length}</span>
            {revealedSymbols.size > 0 && (
              <>
                <span className="text-[#E3DAC9]/30">•</span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#39FF14] rounded-full animate-pulse"></span>
                  {revealedSymbols.size} DETECTED
                </span>
              </>
            )}
          </motion.div>
        </div>
      )}

      {/* Decoded Symbol Labels - FLY TO CENTER - Solo mostrar ANTES de completar */}
      <AnimatePresence>
        {!isComplete && Array.from(decodedSymbols).map((symbolId) => {
          const symbol = SYMBOLS.find(s => s.id === symbolId);
          if (!symbol) return null;

          const finalPos = FINAL_POSITIONS[SYMBOLS.findIndex(s => s.id === symbolId)];

          // Convertir posición 3D a screen coordinates
          const screenX = 50 + (symbol.x / 15) * 40;
          const screenY = 50 - (symbol.y / 10) * 30;

          return (
            <motion.div
              key={symbolId}
              initial={{
                left: `${screenX}%`,
                top: `${screenY}%`,
                opacity: 0,
                scale: 0.3,
                filter: 'blur(20px)',
              }}
              animate={{
                left: `${finalPos.x}%`,
                top: `${finalPos.y}%`,
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
              }}
              exit={{
                opacity: 0,
                scale: 0.5,
                filter: 'blur(10px)',
              }}
              transition={{
                duration: 1.4,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.1,
              }}
              className="absolute pointer-events-none"
              style={{
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="flex flex-col items-center gap-1">
                <div
                  className="text-5xl md:text-6xl font-serif italic font-light"
                  style={{
                    color: symbol.color,
                    textShadow: `0 0 30px ${symbol.color}80, 0 0 60px ${symbol.color}40`,
                  }}
                >
                  {symbol.letter}
                </div>
                {symbol.concept && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    className="text-[8px] md:text-[9px] font-mono uppercase tracking-[0.3em] whitespace-nowrap"
                    style={{ color: symbol.color, opacity: 0.6 }}
                  >
                    {symbol.concept}
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Explosion effect cuando captures */}
      <AnimatePresence>
        {capturedSymbol && (() => {
          const symbol = SYMBOLS.find(s => s.id === capturedSymbol);
          if (!symbol) return null;

          const screenX = 50 + (symbol.x / 15) * 40;
          const screenY = 50 - (symbol.y / 10) * 30;

          return (
            <motion.div
              key={capturedSymbol}
              initial={{ opacity: 0.8, scale: 0.5 }}
              animate={{ opacity: 0, scale: 3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 pointer-events-none mix-blend-screen"
              style={{
                background: `radial-gradient(circle at ${screenX}% ${screenY}%, ${symbol.color}60 0%, transparent 20%)`,
              }}
            />
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
