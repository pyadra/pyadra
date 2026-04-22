'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { audioAPI } from '../lib/audio';

interface ThresholdEntryProps {
  onEnter: () => void;
}

export default function ThresholdEntry({ onEnter }: ThresholdEntryProps) {
  const [phase, setPhase] = useState(0); // 0: black, 1-5: content phases

  useEffect(() => {
    // NO audio during sequence - only on button click

    // Sequence timing (total ~9 seconds)
    const timers = [
      setTimeout(() => setPhase(1), 5000),    // 5s black → graniflat appears
      setTimeout(() => setPhase(2), 6000),    // +1s → logo
      setTimeout(() => setPhase(3), 7500),    // +1.5s → description
      setTimeout(() => setPhase(4), 9500),    // +2s → details
      setTimeout(() => setPhase(5), 11500),   // +2s → question
      setTimeout(() => setPhase(6), 12500),   // +1s → button
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleEnter = () => {
    // No audio - just enter
    onEnter();
  };

  // Simple fade in text (no typewriter - cleaner)
  const FadeInText = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden">

      {/* Graniflat background (CRT texture) - appears after 5s */}
      {phase >= 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'var(--etn-void)',
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                rgba(0,0,0,0.15) 0px,
                transparent 1px,
                transparent 2px,
                rgba(0,0,0,0.15) 3px
              ),
              url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")
            `,
            backgroundBlendMode: 'overlay',
            opacity: 0.95
          }}
        />
      )}

      {/* CRT scanline effect */}
      {phase >= 1 && (
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.15) 3px)'
          }}
        />
      )}

      {/* Subtle vignette */}
      {phase >= 1 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
          }}
        />
      )}

      {/* Content container - Fixed layout to prevent overlap */}
      <div className="relative z-10 flex flex-col items-start text-left max-w-4xl px-12 font-mono space-y-8">

        {/* Logo / Title (phase 2) */}
        <div className="min-h-[24px]">
          {phase >= 2 && (
            <FadeInText>
              <div className="text-[var(--etn-copper)] text-sm uppercase tracking-[0.3em]">
                [ ETHERNICAPSULE SYSTEM v1.0 ]
              </div>
            </FadeInText>
          )}
        </div>

        {/* Description (phase 3) */}
        <div className="min-h-[80px]">
          {phase >= 3 && (
            <FadeInText>
              <div className="space-y-3">
                <h2 className="text-[var(--etn-bronze-bright)] text-2xl font-light uppercase tracking-wide">
                  Temporal Message Vault
                </h2>
                <p className="text-[var(--etn-cream)]/80 text-base leading-relaxed">
                  Cryptographically sealed messages delivered to the future.
                </p>
              </div>
            </FadeInText>
          )}
        </div>

        {/* How it works (phase 4) */}
        <div className="min-h-[180px]">
          {phase >= 4 && (
            <FadeInText>
              <div className="space-y-4 text-[var(--etn-ash)]/70 text-sm leading-[1.8]">
                <p>What you write here will be locked with 256-bit encryption.</p>
                <p>No one can read it until the date you choose.</p>
                <p className="text-[var(--etn-copper)]/80">Not even us.</p>

                <div className="pt-4 border-t border-[var(--etn-copper)]/20 mt-6">
                  <p className="text-[var(--etn-cream)]/60">
                    One-time seal: <span className="text-[var(--etn-bronze-bright)]">$9.00 AUD</span>
                  </p>
                </div>
              </div>
            </FadeInText>
          )}
        </div>

        {/* Question (phase 5) */}
        <div className="min-h-[32px]">
          {phase >= 5 && (
            <FadeInText>
              <p className="text-[var(--etn-bronze-bright)] text-lg">
                Do you wish to continue?
              </p>
            </FadeInText>
          )}
        </div>

        {/* Button (phase 6) */}
        <div className="min-h-[48px]">
          {phase >= 6 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              onClick={handleEnter}
              className="
                group relative
                bg-transparent border border-[var(--etn-copper)]/40
                px-8 py-3
                text-[var(--etn-cream)]/90
                text-sm uppercase tracking-[0.2em]
                font-mono
                transition-all duration-300
                hover:border-[var(--etn-copper)]
                hover:bg-[var(--etn-copper)]/10
                hover:text-[var(--etn-cream)]
              "
            >
              → CONTINUE
            </motion.button>
          )}
        </div>

      </div>

      {/* CRT flicker effect (subtle) */}
      {phase >= 1 && (
        <motion.div
          animate={{
            opacity: [0, 0.03, 0, 0.03, 0]
          }}
          transition={{
            duration: 0.1,
            repeat: Infinity,
            repeatDelay: 5
          }}
          className="absolute inset-0 bg-white pointer-events-none"
        />
      )}

    </div>
  );
}
