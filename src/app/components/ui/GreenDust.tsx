"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function GreenDust({ count = 30 }: { count?: number }) {
  const [particles, setParticles] = useState<{ id: number; left: string; duration: number; delay: number; size: number }[]>([]);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    if (reduced) return;
    // Phones don't need (or handle) hundreds of animated nodes — cap them.
    const effective = window.innerWidth < 768 ? Math.min(count, 60) : count;
    const generated = Array.from({ length: effective }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: Math.random() * 20 + 15, // 15 to 35 seconds (lento y majestuoso)
      delay: Math.random() * 10,
      size: Math.random() * 2.5 + 1 // 1px to 3.5px
    }));
    setParticles(generated);
  }, [count, reduced]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden mix-blend-multiply opacity-80">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bottom-[-10%] bg-[#059669] rounded-full"
          initial={{ y: 0, opacity: 0, x: 0 }}
          animate={{
            y: "-120vh", // Sube hasta desaparecer
            opacity: [0, 0.6, 0.9, 0.6, 0],
            x: [0, Math.random() * 80 - 40] // Desplazamiento lateral sutil (viento)
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
            boxShadow: "0 0 10px rgba(5,150,105,0.6)" // Resplandor esmeralda
          }}
        />
      ))}
    </div>
  );
}
