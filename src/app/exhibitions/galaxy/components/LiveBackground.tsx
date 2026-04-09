'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LiveBackgroundProps {
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export default function LiveBackground({ color = '#C4A882', intensity = 'low' }: LiveBackgroundProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: string;
    y: string;
    size: number;
    duration: number;
    delay: number;
  }>>([]);

  const particleCount = intensity === 'high' ? 40 : intensity === 'medium' ? 25 : 15;

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 5 + 4,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, [particleCount]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Radial gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${color}05 0%, transparent 70%)`
        }}
      />

      {/* Animated particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: color,
            opacity: 0.1,
            filter: 'blur(1px)',
            mixBlendMode: 'screen'
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
            y: [0, -20, 0]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Subtle scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px opacity-10"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`
        }}
        animate={{
          top: ['0%', '100%']
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Breathing glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none"
        style={{ backgroundColor: color }}
        animate={{
          opacity: [0.02, 0.05, 0.02],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}
