'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Capsule3D from './Capsule3D';
import { motion, AnimatePresence } from 'framer-motion';
import LiveBackground from '../components/LiveBackground';

// Mineral Inscription Component - carved stone that illuminates with spotlight
function MineralInscription({
  number,
  title,
  description,
  mousePos
}: {
  number: string;
  title: string;
  description: string;
  mousePos: { x: number; y: number };
}) {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [isIlluminated, setIsIlluminated] = useState(false);

  useEffect(() => {
    if (ref && mousePos.x > 0) {
      const rect = ref.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(mousePos.x - centerX, 2) + Math.pow(mousePos.y - centerY, 2)
      );

      setIsIlluminated(distance < 300);
    }
  }, [ref, mousePos]);

  return (
    <motion.div
      ref={setRef}
      className="flex flex-col items-center text-center relative"
      animate={{
        opacity: isIlluminated ? 1 : 0.5
      }}
      transition={{ duration: 0.4 }}
    >
      {/* Roman numeral - engraved in stone */}
      <div
        className="text-3xl font-serif mb-4 tracking-wider transition-all duration-500"
        style={{
          color: isIlluminated ? '#FFB000' : '#8A6B44',
          textShadow: isIlluminated
            ? '0 0 20px rgba(255,176,0,0.6), 0 2px 4px rgba(0,0,0,0.8)'
            : '0 2px 4px rgba(0,0,0,0.9), inset 0 -1px 2px rgba(255,255,255,0.1)'
        }}
      >
        {number}
      </div>

      {/* Title - carved inscription */}
      <div
        className="text-xl font-light mb-3 uppercase tracking-[0.25em] transition-all duration-500"
        style={{
          fontFamily: 'var(--font-cormorant)',
          color: isIlluminated ? 'var(--etn-cream)' : 'var(--etn-ash)',
          textShadow: isIlluminated
            ? '0 0 15px rgba(232,217,208,0.4), 0 2px 3px rgba(0,0,0,0.7)'
            : '0 1px 3px rgba(0,0,0,0.9), inset 0 -1px 1px rgba(255,255,255,0.05)'
        }}
      >
        {title}
      </div>

      {/* Description - faded inscription - MORE COMPACT */}
      <div
        className="text-xs leading-[1.6] font-light max-w-[220px] transition-all duration-500"
        style={{
          fontFamily: 'var(--font-eb-garamond)',
          color: isIlluminated ? 'var(--etn-parchment)' : 'var(--etn-ash)',
          opacity: isIlluminated ? 0.8 : 0.3,
          textShadow: isIlluminated
            ? '0 0 8px rgba(245,230,211,0.2)'
            : '0 1px 2px rgba(0,0,0,0.8)'
        }}
      >
        {description}
      </div>

      {/* Engraved border line that appears when illuminated */}
      <motion.div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#FFB000] to-transparent"
        animate={{
          width: isIlluminated ? '70%' : '0%',
          opacity: isIlluminated ? 0.6 : 0
        }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
}

export default function EterniCapsuleEntry() {
  const [mounted, setMounted] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoTextStage, setDemoTextStage] = useState(0);
  const [particles, setParticles] = useState<Array<{
    width: string, height: string, top: string, left: string, opacity: number, animation: string
  }>>([]);

  // Entry ritual sequence
  const [entryStage, setEntryStage] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [typewriterText1, setTypewriterText1] = useState('');
  const [typewriterText2, setTypewriterText2] = useState('');
  const [typewriterText3, setTypewriterText3] = useState('');
  const [typewriterText4, setTypewriterText4] = useState('');

  // Embers data - generated client-side to avoid hydration mismatch
  const [embers, setEmbers] = useState<Array<{
    left: string;
    width: number;
    height: number;
    duration: number;
    delay: number;
    xOffset: number;
  }>>([]);

  // Spotlight effect - track mouse position
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const fullText1 = "There are words you cannot say today.";
  const fullText2 = "Write them. Seal them in cryptographic metal.\nSet when they can be opened.";
  const fullText3 = "The seal costs $9 AUD.\nOnce forged, not even we can unlock it.";
  const fullText4 = "Do you want to continue?";

  useEffect(() => {
    setMounted(true);
    setParticles([...Array(20)].map(() => ({
      width: `${Math.random() * 2 + 1}px`,
      height: `${Math.random() * 2 + 1}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.5 + 0.1,
      animation: `pulse ${Math.random() * 5 + 3}s infinite alternate`
    })));

    // Generate ember data client-side
    setEmbers([...Array(25)].map(() => ({
      left: `${Math.random() * 100}%`,
      width: 1 + Math.random() * 2,
      height: 1 + Math.random() * 2,
      duration: 8 + Math.random() * 6,
      delay: Math.random() * 8,
      xOffset: (Math.random() - 0.5) * 100
    })));

    // Entry sequence timing - Adjusted for slower typewriter
    const s1 = setTimeout(() => setEntryStage(1), 3000);   // After 3s darkness, start first text
    const s2 = setTimeout(() => setEntryStage(2), 6500);   // After first text completes (~3.5s total = 3s wait + ~2.6s typing)
    const s3 = setTimeout(() => setEntryStage(3), 11000);  // After second text completes (~4.5s for text2)
    const s4 = setTimeout(() => setEntryStage(4), 15000);  // After third text completes (~4s for text3)
    const s5 = setTimeout(() => setEntryStage(5), 17500);  // Show continue button (~2.5s for text4)

    return () => {
      clearTimeout(s1); clearTimeout(s2); clearTimeout(s3); clearTimeout(s4); clearTimeout(s5);
    };
  }, []);

  // Typewriter effect for text 1 - SLOWER and more visible
  useEffect(() => {
    if (entryStage >= 1 && entryStage < 2) {
      let i = 0;
      const interval = setInterval(() => {
        setTypewriterText1(fullText1.slice(0, i + 1));
        i++;
        if (i > fullText1.length) clearInterval(interval);
      }, 70); // Slower: 70ms per character
      return () => clearInterval(interval);
    }
  }, [entryStage]);

  // Typewriter effect for text 2 - SLOWER
  useEffect(() => {
    if (entryStage >= 2 && entryStage < 3) {
      let i = 0;
      const interval = setInterval(() => {
        setTypewriterText2(fullText2.slice(0, i + 1));
        i++;
        if (i > fullText2.length) clearInterval(interval);
      }, 60); // Slower: 60ms per character
      return () => clearInterval(interval);
    }
  }, [entryStage]);

  // Typewriter effect for text 3 - SLOWER
  useEffect(() => {
    if (entryStage >= 3 && entryStage < 4) {
      let i = 0;
      const interval = setInterval(() => {
        setTypewriterText3(fullText3.slice(0, i + 1));
        i++;
        if (i > fullText3.length) clearInterval(interval);
      }, 60); // Slower: 60ms per character
      return () => clearInterval(interval);
    }
  }, [entryStage]);

  // Typewriter effect for text 4 - SLOWER
  useEffect(() => {
    if (entryStage >= 4 && entryStage < 5) {
      let i = 0;
      const interval = setInterval(() => {
        setTypewriterText4(fullText4.slice(0, i + 1));
        i++;
        if (i > fullText4.length) clearInterval(interval);
      }, 70); // Slower: 70ms per character
      return () => clearInterval(interval);
    }
  }, [entryStage]);

  // Track mouse position for spotlight effect
  useEffect(() => {
    if (hasEntered) {
      const handleMouseMove = (e: MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [hasEntered]);

  const handleEnter = () => {
    // Start zoom-in animation
    setIsZooming(true);

    // After zoom completes, reveal main content
    setTimeout(() => {
      setHasEntered(true);
    }, 2500);
  };

  return (
    <div className="flex flex-col min-h-screen relative bg-[var(--etn-earth)] select-none selection:bg-[var(--etn-copper)] selection:text-[var(--etn-parchment)]">

      {/* ENTRY RITUAL SEQUENCE - The Threshold */}
      <AnimatePresence>
        {!hasEntered && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{
              opacity: isZooming ? 0 : 1,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="fixed inset-0 z-[200] bg-[var(--etn-earth)] min-h-screen flex items-center justify-center px-6"
            style={{ perspective: '1000px' }}
            suppressHydrationWarning
          >
            {mounted ? (
              <>
                {/* Deep darkness background */}
                <div className="absolute inset-0 bg-black" />

                {/* Breathing ambient glow - pulses subtly */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{
                    opacity: [0.2, 0.35, 0.2],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--etn-copper)_0%,_transparent_60%)]" />
                </motion.div>

                {/* Light source - grows DRAMATICALLY with each stage */}
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                  animate={{
                    width: entryStage === 0 ? '80px' :
                           entryStage === 1 ? '220px' :
                           entryStage === 2 ? '380px' :
                           entryStage === 3 ? '560px' :
                           entryStage === 4 ? '760px' : '1000px',
                    height: entryStage === 0 ? '80px' :
                            entryStage === 1 ? '220px' :
                            entryStage === 2 ? '380px' :
                            entryStage === 3 ? '560px' :
                            entryStage === 4 ? '760px' : '1000px',
                  }}
                  transition={{ duration: 2.5, ease: [0.4, 0, 0.2, 1] }}
                  style={{
                    background: 'radial-gradient(circle, rgba(156,102,68,0.6) 0%, rgba(156,102,68,0.3) 30%, rgba(156,102,68,0.1) 60%, transparent 80%)',
                    filter: 'blur(60px)'
                  }}
                />

                {/* Inner glow layer - sharper */}
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                  animate={{
                    width: entryStage === 0 ? '40px' :
                           entryStage === 1 ? '120px' :
                           entryStage === 2 ? '220px' :
                           entryStage === 3 ? '340px' :
                           entryStage === 4 ? '480px' : '640px',
                    height: entryStage === 0 ? '40px' :
                            entryStage === 1 ? '120px' :
                            entryStage === 2 ? '220px' :
                            entryStage === 3 ? '340px' :
                            entryStage === 4 ? '480px' : '640px',
                    opacity: entryStage === 0 ? 0.4 :
                             entryStage === 1 ? 0.5 :
                             entryStage === 2 ? 0.6 :
                             entryStage === 3 ? 0.7 :
                             entryStage === 4 ? 0.8 : 1
                  }}
                  transition={{ duration: 2.5, ease: [0.4, 0, 0.2, 1] }}
                  style={{
                    background: 'radial-gradient(circle, rgba(255,176,0,0.4) 0%, rgba(156,102,68,0.2) 50%, transparent 70%)',
                    filter: 'blur(30px)'
                  }}
                />

                {/* HEAVY vignette fog - MUCH darker at start */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{
                    opacity: entryStage === 0 ? 1 :
                             entryStage === 1 ? 0.95 :
                             entryStage === 2 ? 0.85 :
                             entryStage === 3 ? 0.7 :
                             entryStage === 4 ? 0.5 : 0.3
                  }}
                  transition={{ duration: 2.5 }}
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.4) 15%, rgba(0,0,0,0.9) 40%, #000000 70%)'
                  }}
                />

                {/* Extra darkness layer for maximum mystery at start */}
                <motion.div
                  className="absolute inset-0 pointer-events-none bg-black"
                  animate={{
                    opacity: entryStage === 0 ? 0.8 :
                             entryStage === 1 ? 0.6 :
                             entryStage === 2 ? 0.4 :
                             entryStage === 3 ? 0.2 : 0
                  }}
                  transition={{ duration: 2.5 }}
                />

            {/* Floating embers - only visible in light */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {embers.map((ember, i) => (
                <motion.div
                  key={`ember-${i}`}
                  className="absolute rounded-full"
                  initial={{
                    left: ember.left,
                    bottom: `-10%`,
                    opacity: 0
                  }}
                  animate={{
                    y: [-100, -1000],
                    x: [0, ember.xOffset],
                    opacity: [0, 0.6, 0.6, 0]
                  }}
                  transition={{
                    duration: ember.duration,
                    repeat: Infinity,
                    delay: ember.delay,
                    ease: "easeInOut"
                  }}
                  style={{
                    width: `${ember.width}px`,
                    height: `${ember.height}px`,
                    background: 'var(--etn-copper)',
                    boxShadow: '0 0 4px var(--etn-copper)',
                    filter: 'blur(0.5px)'
                  }}
                />
              ))}
            </div>

            {/* Typewriter text container - CENTERED with 3D zoom */}
            <motion.div
              className="relative z-10 max-w-2xl w-full text-center space-y-8"
              animate={{
                scale: isZooming ? 3 : 1,
                z: isZooming ? 500 : 0,
                opacity: isZooming ? 0 : 1
              }}
              transition={{
                duration: 2.5,
                ease: [0.6, 0.05, 0.01, 0.9]
              }}
              style={{ transformStyle: 'preserve-3d' }}
              suppressHydrationWarning
            >

              {/* Stage 1: Typewriter text 1 */}
              {entryStage >= 1 && (
                <p
                  className="text-[var(--etn-parchment)] text-xl md:text-2xl leading-[2] font-light"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  {typewriterText1}
                  {typewriterText1.length < fullText1.length && (
                    <span className="inline-block w-[3px] h-[1.3em] bg-[var(--etn-cream)] ml-2 animate-pulse" />
                  )}
                </p>
              )}

              {/* Stage 2: Typewriter text 2 */}
              {entryStage >= 2 && (
                <p
                  className="text-[var(--etn-bronze-bright)] text-xl md:text-2xl leading-[2] font-light italic whitespace-pre-line"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  {typewriterText2}
                  {typewriterText2.length < fullText2.length && (
                    <span className="inline-block w-[3px] h-[1.3em] bg-[var(--etn-bronze-bright)] ml-2 animate-pulse" />
                  )}
                </p>
              )}

              {/* Stage 3: Typewriter text 3 with $9 AUD highlighted */}
              {entryStage >= 3 && (
                <p
                  className="text-[var(--etn-ash)] text-lg md:text-xl leading-[2] font-light whitespace-pre-line"
                  style={{ fontFamily: 'var(--font-eb-garamond)' }}
                >
                  {typewriterText3.split('$9 AUD').map((part, i) => (
                    <span key={i}>
                      {part}
                      {i === 0 && typewriterText3.includes('$9 AUD') && (
                        <span className="text-[var(--etn-copper)] font-medium">$9 AUD</span>
                      )}
                    </span>
                  ))}
                  {typewriterText3.length < fullText3.length && (
                    <span className="inline-block w-[3px] h-[1.3em] bg-[var(--etn-ash)] ml-2 animate-pulse" />
                  )}
                </p>
              )}

              {/* Stage 4: Typewriter text 4 */}
              {entryStage >= 4 && (
                <p
                  className="text-[var(--etn-cream)] text-xl md:text-2xl leading-[2] font-light pt-8"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  {typewriterText4}
                  {typewriterText4.length < fullText4.length && (
                    <span className="inline-block w-[3px] h-[1.3em] bg-[var(--etn-cream)] ml-2 animate-pulse" />
                  )}
                </p>
              )}

              {/* Stage 5: Continue button */}
              <AnimatePresence>
                {entryStage >= 5 && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5 }}
                    onClick={handleEnter}
                    className="group relative overflow-hidden bg-transparent border border-[var(--etn-copper)]/40 px-8 py-4 text-center transition-all duration-700 hover:border-[var(--etn-copper)] hover:shadow-[0_0_30px_rgba(156,102,68,0.3)] rounded-sm mt-12"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--etn-copper)]/10 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover:animate-[shimmer_2s_infinite]"></div>
                    <span className="relative z-10 text-[var(--etn-cream)]/90 group-hover:text-[var(--etn-cream)] tracking-widest text-xs uppercase font-mono transition-colors duration-700">
                      Enter
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        ) : (
          <div className="absolute inset-0 bg-black" />
        )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIVE BACKGROUND */}
      <LiveBackground color="var(--etn-bronze)" intensity="low" />

      {/* Deep Space Radial Gradient Background with Stone Texture */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at 50% 0%, var(--etn-soil) 0%, var(--etn-earth) 60%)' }}></div>

      {/* Subtle Stone Carved Texture Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      ></div>

      {/* Spotlight effect that follows cursor */}
      {hasEntered && (
        <>
          <motion.div
            className="fixed pointer-events-none z-[5]"
            animate={{
              x: mousePos.x - 300,
              y: mousePos.y - 300
            }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            style={{
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(255,176,0,0.15) 0%, rgba(255,176,0,0.05) 30%, transparent 60%)',
              mixBlendMode: 'screen'
            }}
          />

          {/* Dust particles in suspension that react to light */}
          <div className="fixed inset-0 pointer-events-none z-[6] overflow-hidden">
            {particles.map((p, i) => {
              const distanceX = Math.abs(mousePos.x - (parseFloat(p.left) / 100 * window.innerWidth));
              const distanceY = Math.abs(mousePos.y - (parseFloat(p.top) / 100 * window.innerHeight));
              const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
              const inSpotlight = distance < 300;

              return (
                <motion.div
                  key={i}
                  className="absolute bg-[#FFB000] rounded-full"
                  style={{
                    ...p,
                    opacity: inSpotlight ? p.opacity * 2 : p.opacity * 0.3
                  }}
                  animate={{
                    opacity: inSpotlight ? p.opacity * 2.5 : p.opacity * 0.4,
                    scale: inSpotlight ? 1.5 : 1
                  }}
                  transition={{ duration: 0.6 }}
                />
              );
            })}
          </div>
        </>
      )}

      {/* Subtle Star Particles Base */}
      {mounted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ duration: 4 }}
          className="fixed inset-0 pointer-events-none z-0"
        >
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute bg-[var(--etn-bronze)] rounded-full mix-blend-screen"
              style={p}
            ></div>
          ))}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="w-full max-w-4xl mx-auto px-6 relative z-10 pt-20"
      >

        {/* SPLIT SCREEN LAYOUT - Responsive */}
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0 py-8 md:py-0" suppressHydrationWarning>

          {/* LEFT: Capsule 3D - 40% width on desktop */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
            className="relative flex justify-center items-center w-full md:w-[40%] md:min-h-screen scale-75 md:scale-100"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--etn-bronze-bright)_0%,_transparent_60%)] opacity-5 pointer-events-none" />
            <Capsule3D isSealed={false} />
          </motion.div>

          {/* RIGHT: Content - 60% width on desktop */}
          <div className="flex flex-col items-center md:items-start justify-center w-full md:w-[60%] px-6 md:px-12 gap-4 max-w-2xl">

            {/* Title & Tagline */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.8 }}
              className="text-center md:text-left"
            >
              <h1 className="text-5xl md:text-6xl italic text-[var(--etn-cream)] font-light drop-shadow-[0_0_15px_rgba(232,217,208,0.1)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                EterniCapsule
              </h1>
              <p className="text-[var(--etn-bronze)] text-sm md:text-base tracking-[0.05em] mt-3 font-light" style={{ fontFamily: 'var(--font-eb-garamond)' }}>
                Cryptographic vault. Zero knowledge. Permanent.
              </p>
            </motion.div>

            {/* Explanation Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 1.0 }}
              className="text-center md:text-left space-y-2"
            >
              <p className="text-[var(--etn-ash)] text-sm leading-relaxed font-light" style={{ fontFamily: 'var(--font-eb-garamond)' }}>
                There are words you cannot say today. Thoughts too early, too fragile, too dangerous.
                <span className="text-[var(--etn-bronze-bright)]"> EterniCapsule</span> lets you seal them in cryptographic metal—forever readable, forever unchangeable.
              </p>
              <p className="text-[var(--etn-ash)]/80 text-xs leading-relaxed font-light" style={{ fontFamily: 'var(--font-eb-garamond)' }}>
                Write for yourself, a friend, or a stranger. Lock it with a passphrase only they know.
                When the time comes, they'll use their key to unlock what you left behind.
              </p>
            </motion.div>

            {/* Mineral Inscriptions - Vertical with descriptions */}
            <div className="flex flex-col gap-3 w-full">

              {/* Inscription I - WRITE */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 1.3 }}
                className="flex flex-col md:flex-row items-start gap-3 border-l-2 border-[var(--etn-bronze)]/30 pl-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl text-[var(--etn-bronze-bright)] font-serif">I</span>
                  <span className="text-xs text-[var(--etn-ash)] uppercase tracking-wider font-mono">WRITE</span>
                </div>
                <p className="text-[var(--etn-ash)]/70 text-xs leading-relaxed font-light mt-1 md:mt-0" style={{ fontFamily: 'var(--font-eb-garamond)' }}>
                  Pour your message into the form. No one reads it. No server stores the plaintext.
                </p>
              </motion.div>

              {/* Inscription II - SEAL */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 1.5 }}
                className="flex flex-col md:flex-row items-start gap-3 border-l-2 border-[var(--etn-bronze)]/30 pl-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl text-[var(--etn-bronze-bright)] font-serif">II</span>
                  <span className="text-xs text-[var(--etn-ash)] uppercase tracking-wider font-mono">SEAL</span>
                </div>
                <p className="text-[var(--etn-ash)]/70 text-xs leading-relaxed font-light mt-1 md:mt-0" style={{ fontFamily: 'var(--font-eb-garamond)' }}>
                  Encrypt it with a passphrase. The capsule glows as the fire hardens your words into permanent form.
                </p>
              </motion.div>

              {/* Inscription III - PASS */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 1.7 }}
                className="flex flex-col md:flex-row items-start gap-3 border-l-2 border-[var(--etn-bronze)]/30 pl-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl text-[var(--etn-bronze-bright)] font-serif">III</span>
                  <span className="text-xs text-[var(--etn-ash)] uppercase tracking-wider font-mono">PASS</span>
                </div>
                <p className="text-[var(--etn-ash)]/70 text-xs leading-relaxed font-light mt-1 md:mt-0" style={{ fontFamily: 'var(--font-eb-garamond)' }}>
                  Share the capsule ID. Only someone with the right key can read what's inside. Forever.
                </p>
              </motion.div>
            </div>

            {/* Action Buttons - Capsule shaped, clean, $9 AUD prominent */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 1.8 }}
              className="flex flex-col gap-3 w-full md:max-w-md"
            >

              {/* SEAL CAPSULE - Primary */}
              <Link
                href="/exhibitions/galaxy/ethernicapsule/compose"
                className="group relative overflow-hidden border border-[var(--etn-copper)]/60 bg-gradient-to-r from-[var(--etn-copper)]/20 via-[var(--etn-copper)]/30 to-[var(--etn-copper)]/20 px-6 py-3 transition-all duration-700 hover:border-[var(--etn-copper)] hover:bg-[var(--etn-copper)] hover:shadow-[0_0_40px_rgba(139,90,60,0.5)] rounded-full"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--etn-copper)]/25 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[var(--etn-parchment)] group-hover:text-[var(--etn-earth)] tracking-[0.15em] text-xs uppercase font-mono font-semibold transition-colors duration-700">
                    SEAL CAPSULE
                  </span>
                  <span className="text-[var(--etn-cream)] group-hover:text-[var(--etn-earth)] text-base font-medium transition-colors duration-700" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    $9 AUD
                  </span>
                </div>
              </Link>

              {/* UNLOCK CAPSULE - Secondary */}
              <Link
                href="/exhibitions/galaxy/ethernicapsule/unlock"
                className="group relative overflow-hidden border border-[var(--etn-bronze)]/40 bg-[var(--etn-soil)]/60 px-6 py-3 transition-all duration-700 hover:border-[var(--etn-bronze)] hover:bg-[var(--etn-bronze)]/10 hover:shadow-[0_0_30px_rgba(201,169,97,0.3)] rounded-full"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--etn-bronze)]/15 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[var(--etn-bronze)] group-hover:text-[var(--etn-bronze-bright)] tracking-[0.15em] text-xs uppercase font-mono font-semibold transition-colors duration-700">
                    UNLOCK CAPSULE
                  </span>
                  <span className="text-[var(--etn-ash)] group-hover:text-[var(--etn-cream)] text-sm transition-colors duration-700">
                    →
                  </span>
                </div>
              </Link>

            </motion.div>

            {/* Footer - Return to Galaxy */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 2.2 }}
              className="w-full flex justify-center mt-8 md:mt-12"
            >
              <Link
                href="/exhibitions/galaxy"
                className="group inline-flex items-center gap-3 px-6 py-3 bg-[var(--etn-soil)]/60 border border-white/5 rounded-full hover:bg-[var(--etn-copper)]/10 hover:border-[var(--etn-copper)]/40 transition-all duration-500 backdrop-blur-md"
              >
                <span className="text-[var(--etn-bronze)]/80 group-hover:text-[var(--etn-cream)] text-xs tracking-wide uppercase font-mono transition-colors duration-500">
                  ← Return to Galaxy
                </span>
              </Link>
            </motion.div>

          </div>
        </div>

      </motion.div>

      {/* SAMPLE CAPSULE OVERLAY (CINEMATIC DEMO) */}
      {demoOpen && (
        <div className="fixed inset-0 z-50 bg-[var(--etn-earth)] flex flex-col items-center justify-center p-8">
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

          <div className="max-w-2xl w-full text-center relative z-10">
            <div className="text-[var(--etn-bronze)]/50 font-mono text-xs tracking-widest mb-12 uppercase">
              [ Decryption Simulation ]
            </div>

            {/* The Cinematic Blur Effect */}
            <motion.div
              initial={{ filter: 'blur(30px)', opacity: 0, scale: 0.95 }}
              animate={{ filter: 'blur(0px)', opacity: 1, scale: 1 }}
              transition={{ duration: 4, ease: "easeInOut" }}
              className="text-[var(--etn-parchment)] text-xl md:text-2xl font-light leading-relaxed mb-16 text-left" style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              <p className="mb-6">
                "If you are reading this, the ten years have passed. I sealed this capsule on the eve of my departure."
              </p>
              <p className="mb-6">
                "The world is likely very different now, and so are you. But I needed to make sure these words survived the passage of time intact, untouched by consequence."
              </p>
              <p className="text-[var(--etn-bronze-bright)]">
                "Forgive me. And remember."
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5, duration: 2 }}
              onClick={() => setDemoOpen(false)}
              className="text-xs text-[var(--etn-ash)] hover:text-[var(--etn-bronze)] tracking-wide font-mono border border-transparent hover:border-[var(--etn-bronze)]/20 px-6 py-3 transition-all"
            >
              [ CLOSE SAMPLE ]
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
