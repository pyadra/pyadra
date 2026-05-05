'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface NavLink {
  href: string;
  label: string;
}

interface ProjectNavProps {
  projectName: string;
  projectColor: string;
  links?: NavLink[];
}

export default function ProjectNav({ projectName, projectColor, links = [] }: ProjectNavProps) {
  const pathname = usePathname();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Custom cursor for nav
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    const initAudio = () => {
      if (audioInitialized || audioContextRef.current) return;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      try {
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = 80; // Low frequency hum

        osc.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.value = 0.01; // Nearly silent
        osc.start();

        oscillatorRef.current = osc;
        gainNodeRef.current = gain;
        setAudioInitialized(true);
      } catch (err) {
        // Audio initialization blocked by browser - expected behavior
      }
    };

    const handleClick = () => {
      initAudio();
      document.removeEventListener('click', handleClick);
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [audioInitialized]);

  useEffect(() => {
    if (!oscillatorRef.current || !audioContextRef.current) return;

    const now = audioContextRef.current.currentTime;

    if (hoveredLink) {
      // Subtle frequency shift on hover
      oscillatorRef.current.frequency.cancelScheduledValues(now);
      oscillatorRef.current.frequency.setTargetAtTime(120, now, 0.3);

      if (gainNodeRef.current) {
        gainNodeRef.current.gain.cancelScheduledValues(now);
        gainNodeRef.current.gain.setTargetAtTime(0.03, now, 0.3);
      }
    } else {
      oscillatorRef.current.frequency.cancelScheduledValues(now);
      oscillatorRef.current.frequency.setTargetAtTime(80, now, 0.5);

      if (gainNodeRef.current) {
        gainNodeRef.current.gain.cancelScheduledValues(now);
        gainNodeRef.current.gain.setTargetAtTime(0.01, now, 0.5);
      }
    }
  }, [hoveredLink]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    cursorX.set(e.clientX - rect.left - 8);
    cursorY.set(e.clientY - rect.top - 8);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
    >
      <div className="w-full px-6 md:px-12 py-6">
        <motion.div
          className="relative bg-[#02040A]/80 backdrop-blur-xl border border-white/5 px-6 py-4 pointer-events-auto overflow-hidden"
          style={{
            borderTopColor: `${projectColor}20`,
            boxShadow: `0 0 30px ${projectColor}10`
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            cursorX.set(-100);
            cursorY.set(-100);
          }}
        >
          {/* Animated background glow */}
          <motion.div
            className="absolute inset-0 opacity-0 pointer-events-none"
            animate={{
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: `radial-gradient(circle at 50% 50%, ${projectColor}20, transparent 70%)`
            }}
          />

          {/* Custom mini cursor for nav */}
          <motion.div
            className="absolute w-4 h-4 rounded-full border pointer-events-none"
            style={{
              x: cursorX,
              y: cursorY,
              borderColor: projectColor,
              opacity: 0.6
            }}
            animate={{
              scale: hoveredLink ? 1.5 : 1
            }}
            transition={{ duration: 0.2 }}
          />

          <div className="flex items-center justify-between gap-8 relative z-10">
            {/* Left: Return to Gallery */}
            <Link
              href="/exhibitions/galaxy"
              className="group flex items-center gap-2 text-[#E8D9BB]/60 hover:text-[#E8D9BB] transition-colors duration-300"
              onMouseEnter={() => setHoveredLink('galaxy')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <motion.span
                className="text-sm"
                animate={{
                  x: hoveredLink === 'galaxy' ? -3 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                ←
              </motion.span>
              <span className="text-[9px] uppercase tracking-[0.3em] font-mono">
                Galaxy
              </span>
            </Link>

            {/* Center: Project Name */}
            <motion.div
              className="flex items-center gap-3"
              animate={{
                scale: hoveredLink ? 0.98 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: projectColor,
                  boxShadow: `0 0 10px ${projectColor}`
                }}
              />
              <span
                className="text-xs font-mono tracking-[0.2em] uppercase"
                style={{ color: projectColor }}
              >
                {projectName}
              </span>
            </motion.div>

            {/* Right: Project Links */}
            {links.length > 0 && (
              <div className="flex items-center gap-6">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="relative text-[10px] uppercase tracking-[0.25em] font-mono transition-all duration-300"
                      style={{
                        color: isActive ? projectColor : '#E8D9BB60',
                        opacity: isActive ? 1 : hoveredLink === link.href ? 0.9 : 0.5
                      }}
                      onMouseEnter={() => setHoveredLink(link.href)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      {link.label}

                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavLink"
                          className="absolute -bottom-1 left-0 right-0 h-[1px]"
                          style={{ backgroundColor: projectColor }}
                          transition={{ duration: 0.3 }}
                        />
                      )}

                      {/* Hover glow */}
                      {hoveredLink === link.href && !isActive && (
                        <motion.div
                          className="absolute inset-0 -z-10 blur-md"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.3 }}
                          exit={{ opacity: 0 }}
                          style={{ backgroundColor: projectColor }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Scan line effect */}
          <motion.div
            className="absolute left-0 right-0 h-[1px] pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${projectColor}40, transparent)`,
              top: '50%'
            }}
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>
      </div>
    </motion.nav>
  );
}
