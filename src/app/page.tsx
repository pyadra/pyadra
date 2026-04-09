"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useGlobalContext } from "./providers";
import { generateSignature } from "./lib/signature";
import AnimatedNumber from "./components/AnimatedNumber";

const ParticleDecoder = dynamic(() => import("./components/ParticleDecoder"), { ssr: false });

interface GameStats {
  timeElapsed: number;
  pulsesSent: number;
  signalsFound: number;
  timestamp: string;
}

interface GlobalStats {
  totalObservers: number;
  pulsesToday: number;
  scansToday: number;
}

export default function PyAdraHome() {
  const [observerId, setObserverId] = useState<string | null>(null);
  const [observerNum, setObserverNum] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [showSignature, setShowSignature] = useState(false);
  const [showGlobalStats, setShowGlobalStats] = useState(false);
  const { isMuted, toggleAudio } = useGlobalContext();

  useEffect(() => {
    setMounted(true);

    // Setup Observer ID
    const localId = window.localStorage.getItem("pyadra_observer_id");
    const localNum = window.localStorage.getItem("pyadra_observer_num");

    if (localId && localNum) {
      setObserverId(localId);
      setObserverNum(parseInt(localNum));
    } else {
      fetch("/api/observer")
        .then(r => r.json())
        .then(data => {
           const formatted = `#${String(data.id).padStart(4, '0')}`;
           window.localStorage.setItem("pyadra_observer_id", formatted);
           window.localStorage.setItem("pyadra_observer_num", String(data.id));
           setObserverId(formatted);
           setObserverNum(data.id);
        })
        .catch(() => {});
    }
  }, []);

  const handleComplete = async (stats: GameStats) => {
    setGameStats(stats);
    setIsComplete(true);

    // OPTIMISTIC UI: Generate signature immediately (no wait)
    if (observerNum) {
      const sig = generateSignature(
        observerNum,
        stats.timeElapsed,
        stats.pulsesSent,
        stats.timestamp
      );
      setSignature(sig);

      // Save to database in background (fire and forget)
      fetch('/api/home/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          observerId: observerNum,
          timeElapsed: stats.timeElapsed,
          pulsesSent: stats.pulsesSent,
          signalsFound: stats.signalsFound,
          timestamp: stats.timestamp,
        }),
      }).catch(err => console.error('Failed to save completion:', err));

      // Fetch global stats in parallel (don't block)
      fetch('/api/home/stats')
        .then(r => r.json())
        .then(data => setGlobalStats(data))
        .catch(err => console.error('Failed to fetch stats:', err));
    }

    // Stagger animations (starts immediately, no DB wait)
    setTimeout(() => setShowSignature(true), 1500);
    setTimeout(() => setShowGlobalStats(true), 4500);
    setTimeout(() => setShowCTA(true), 6000);
  };

  return (
    <div className="min-h-screen bg-[#030304] text-[#E3DAC9] overflow-hidden font-sans select-none relative">

      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-6 md:p-12"
      >
        <button
          className="text-[9px] md:text-[10px] font-mono tracking-[0.4em] uppercase text-[#FFB000]/70 hover:text-[#FFB000] transition-colors flex items-center gap-3 outline-none"
          aria-label={`Observer ID ${observerId || 'loading'}`}
        >
          <div className="w-1 h-1 bg-[#FFB000] rounded-full animate-pulse"></div>
          OBSERVER {observerId || "..."}
        </button>

        <button
          onClick={toggleAudio}
          className="text-[9px] md:text-[10px] font-mono tracking-[0.4em] uppercase transition-colors hover:text-[#FFB000] flex items-center gap-2 outline-none"
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        >
          <span className={isMuted ? "text-[#E3DAC9]/40" : "text-[#39FF14] animate-pulse"}>
            {isMuted ? "SENSORS MUTED" : "SENSORS ACTIVE"}
          </span>
        </button>
      </motion.div>

      {/* Particle Decoder */}
      {mounted && <ParticleDecoder onComplete={handleComplete} />}

      {/* Initial Hint */}
      <AnimatePresence>
        {mounted && !isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1.5, delay: 2, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-40"
          >
            <motion.div
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-[11px] md:text-[13px] font-mono uppercase tracking-[0.3em] text-[#FFB000]/60 mb-4"
            >
              <motion.span
                animate={{
                  textShadow: [
                    '0 0 10px rgba(255,176,0,0.2)',
                    '0 0 20px rgba(255,176,0,0.4)',
                    '0 0 10px rgba(255,176,0,0.2)',
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                6 SIGNALS HIDDEN
              </motion.span>
            </motion.div>
            <motion.div
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-[9px] md:text-[10px] font-sans text-[#E3DAC9]/40 tracking-wider mb-2"
            >
              Send pulses to scan the field
            </motion.div>
            <motion.div
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="text-[8px] md:text-[9px] font-mono text-[#E3DAC9]/30 tracking-wide"
            >
              TAP / CLICK → REVEAL → CAPTURE
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Sequence */}
      <AnimatePresence>
        {isComplete && (
          <>
            {/* PYADRA Title Formation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-40 w-full px-6 max-w-4xl"
            >
              {/* PYADRA Title - with subtle floating */}
              <motion.h1
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-5xl md:text-8xl font-serif tracking-[0.3em] ml-[0.3em] mb-16"
              >
                <motion.span
                  animate={{
                    textShadow: [
                      '0 0 40px rgba(255,176,0,0.4)',
                      '0 0 60px rgba(255,176,0,0.7)',
                      '0 0 40px rgba(255,176,0,0.4)',
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="bg-gradient-to-b from-[#FFB000] via-[#FF8C00] to-[#FF6B00] bg-clip-text text-transparent"
                >
                  PYADRA
                </motion.span>
              </motion.h1>

              {/* Signature Engraving */}
              <AnimatePresence>
                {showSignature && gameStats && signature && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8 mb-12"
                  >
                    {/* Top Line */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{
                        scaleX: 1,
                        opacity: [1, 0.6, 1],
                      }}
                      transition={{
                        scaleX: { duration: 0.8, ease: "easeOut", delay: 0 },
                        opacity: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }
                      }}
                      className="h-[1px] w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-[#FFB000]/60 to-transparent"
                    />

                    {/* Signature Code */}
                    <div className="space-y-3">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          scale: [1, 1.02, 1],
                        }}
                        transition={{
                          opacity: { duration: 1.5, delay: 0.5 },
                          scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 3 }
                        }}
                        className="text-[18px] md:text-[24px] font-mono tracking-[0.2em] text-[#FFB000]"
                      >
                        <motion.div
                          animate={{
                            textShadow: [
                              '0 0 15px rgba(255,176,0,0.3)',
                              '0 0 25px rgba(255,176,0,0.6)',
                              '0 0 15px rgba(255,176,0,0.3)',
                            ]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          {signature.split('').map((char, i) => (
                            <motion.span
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: 0.8 + (i * 0.05) }}
                            >
                              {char}
                            </motion.span>
                          ))}
                        </motion.div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 2.2 }}
                        className="text-[10px] md:text-[11px] font-mono uppercase tracking-[0.3em] text-[#E3DAC9]/60"
                      >
                        Your Observation Signature
                      </motion.div>
                    </div>

                    {/* Bottom Line */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{
                        scaleX: 1,
                        opacity: [1, 0.6, 1],
                      }}
                      transition={{
                        scaleX: { duration: 0.8, ease: "easeOut", delay: 2.5 },
                        opacity: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 3.5 }
                      }}
                      className="h-[1px] w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-[#FFB000]/60 to-transparent"
                    />

                    {/* Engraved Message */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 3.2 }}
                      className="space-y-2"
                    >
                      <motion.div
                        animate={{
                          opacity: [0.9, 1, 0.9],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="text-[12px] md:text-[14px] font-mono uppercase tracking-[0.2em] text-[#E3DAC9]/90"
                      >
                        Engraved in the Archive
                      </motion.div>
                      <div className="text-[10px] md:text-[11px] font-sans text-[#E3DAC9]/50">
                        {new Date(gameStats.timestamp).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Global Stats */}
              <AnimatePresence>
                {showGlobalStats && globalStats && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="space-y-6"
                  >
                    {/* Divider Line */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{
                        scaleX: 1,
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        scaleX: { duration: 0.6, ease: "easeOut" },
                        opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }
                      }}
                      className="h-[1px] w-24 mx-auto bg-[#FFB000]/30"
                    />

                    {/* Entry confirmation */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{ delay: 0.3 }}
                      className="text-[11px] md:text-[12px] font-sans tracking-wide text-[#E3DAC9]/80"
                    >
                      <motion.span
                        animate={{
                          opacity: [1, 0.8, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1
                        }}
                      >
                        Entry #{String(observerNum).padStart(4, '0')} recorded
                      </motion.span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0, 1, 0.7, 1, 0.7],
                      }}
                      transition={{
                        opacity: { delay: 0.5 },
                        default: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
                      }}
                      className="text-[9px] md:text-[10px] font-sans italic text-[#E3DAC9]/50"
                    >
                      The archive remembers you now
                    </motion.div>

                    {/* Observer Dots */}
                    <motion.div
                      className="flex items-center justify-center gap-1.5 flex-wrap max-w-xs mx-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {Array.from({ length: Math.min(globalStats.totalObservers, 50) }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: i + 1 === observerNum ? 1 : 0.4 }}
                          transition={{ delay: 0.8 + (i * 0.02) }}
                          className={`w-1.5 h-1.5 rounded-full ${i + 1 === observerNum ? 'bg-[#FFB000]' : 'bg-[#E3DAC9]/30'}`}
                        />
                      ))}
                      {globalStats.totalObservers > 50 && (
                        <span className="text-[8px] text-[#E3DAC9]/40 ml-2">+{globalStats.totalObservers - 50}</span>
                      )}
                    </motion.div>

                    {/* Global Stats */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      className="text-[9px] md:text-[10px] font-sans text-[#E3DAC9]/50 space-y-1"
                    >
                      <div>
                        <AnimatedNumber value={globalStats.totalObservers} duration={1200} /> observers registered
                      </div>
                      <div>
                        <AnimatedNumber
                          value={globalStats.pulsesToday}
                          duration={1500}
                          format={(n) => n.toLocaleString()}
                        /> pulses sent today
                      </div>
                      <motion.div
                        animate={{
                          opacity: [0.4, 0.6, 0.4],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="text-[#E3DAC9]/40 italic mt-2"
                      >
                        The archive grows with every scan
                      </motion.div>
                    </motion.div>

                    {/* Divider Line */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{
                        scaleX: 1,
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        scaleX: { duration: 0.6, ease: "easeOut", delay: 1.8 },
                        opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 2.8 }
                      }}
                      className="h-[1px] w-24 mx-auto bg-[#FFB000]/30"
                    />

                    {/* Mystery Hook */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.1 }}
                      className="space-y-3 mt-8 text-center max-w-md mx-auto"
                    >
                      <motion.div
                        animate={{
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="text-[13px] md:text-[15px] font-light tracking-wide text-[#E3DAC9]/90"
                      >
                        You are now an Observer.
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.5 }}
                        className="text-[11px] text-[#E3DAC9]/70 font-light leading-relaxed"
                      >
                        Pyadra is a museum of digital rituals.<br/>
                        Explore exhibitions. Participate in projects.<br/>
                        Everything you create here becomes permanent.
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* CTA */}
            <AnimatePresence>
              {showCTA && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute bottom-24 md:bottom-32 left-1/2 -translate-x-1/2 z-50"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.03, 1],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Link
                      href="/exhibitions"
                      className="group relative overflow-hidden bg-gradient-to-r from-[#FFB000]/20 to-[#FF8C00]/20 backdrop-blur-xl border border-[#FFB000]/60 px-16 md:px-24 py-5 md:py-6 text-center transition-all duration-700 hover:bg-[#FFB000]/30 hover:shadow-[0_0_60px_rgba(255,176,0,0.4)] rounded-full flex items-center gap-4"
                      aria-label="Discover exhibitions"
                    >
                      <motion.div
                        animate={{
                          opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,176,0,0.3)_0%,_transparent_70%)]"
                      />
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,176,0,0.2)_0%,_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <motion.span
                        animate={{
                          textShadow: [
                            '0 0 8px rgba(255,176,0,0.4)',
                            '0 0 12px rgba(255,176,0,0.6)',
                            '0 0 8px rgba(255,176,0,0.4)',
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="relative z-10 text-[#FFB000] group-hover:text-[#FFE5B4] text-[11px] md:text-[12px] font-mono font-bold transition-all duration-500"
                      >
                        ▸ DISCOVER ◂
                      </motion.span>
                    </Link>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.7, 1, 0.7] }}
                    transition={{
                      opacity: { duration: 1, delay: 0.5 },
                      default: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
                    }}
                    className="text-center mt-6 text-[9px] md:text-[10px] font-sans text-[#E3DAC9]/50 tracking-wide italic"
                  >
                    Enter the first exhibition
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Hint Text (before completion) */}
      <AnimatePresence>
        {!isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, delay: 3 }}
            className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 text-center pointer-events-none z-40"
          >
            <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.3em] text-[#E3DAC9]/30">
              Capture all signals to continue
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer (only after completion) */}
      <AnimatePresence>
        {showCTA && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-6 md:bottom-8 left-0 right-0 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-[8px] md:text-[9px] font-mono tracking-[0.2em] text-[#E3DAC9]/20 uppercase z-50"
          >
            <Link href="/manifesto" className="hover:text-[#FFB000] transition-colors">Manifesto</Link>
            <span className="text-[#E3DAC9]/10">|</span>
            <Link href="/legal/terms" className="hover:text-[#FFB000] transition-colors">Terms</Link>
            <span className="text-[#E3DAC9]/10">|</span>
            <Link href="/legal/privacy" className="hover:text-[#FFB000] transition-colors">Privacy</Link>
            <span className="text-[#E3DAC9]/10">|</span>
            <a href="mailto:invest@pyadra.com" className="hover:text-[#FFB000] transition-colors">Contact</a>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
