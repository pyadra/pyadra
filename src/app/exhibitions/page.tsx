"use client";

import { motion, useMotionValue } from "framer-motion";
import Link from "next/link";
import { useGlobalContext } from "../providers";
import { useEffect, useState } from "react";
import LiveBackground from "./galaxy/components/LiveBackground";

export default function ExhibitionsPage() {
  const { isMuted, toggleAudio } = useGlobalContext();
  const [observerId, setObserverId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [hoveredExhibition, setHoveredExhibition] = useState<string | null>(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    setMounted(true);
    const localId = window.localStorage.getItem("pyadra_observer_id");
    if (localId) {
      setObserverId(localId);
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  const exhibitions = [
    {
      id: "galaxy",
      name: "GALAXY",
      status: "active",
      tagline: "Rituals exploring memory, time, and permanence",
      whatYouDo: [
        "Support creative projects",
        "Seal messages in time",
        "Commission physical artifacts"
      ],
      nodes: 4,
      projects: ["Orbit 77", "EtherniCapsule", "Figurines", "EBOK"],
      period: "Active Now",
      href: "/exhibitions/galaxy",
      color: "#FFB000",
    },
    {
      id: "jungle",
      name: "JUNGLE",
      status: "forming",
      tagline: "Organic growth through collaborative chaos",
      whatYouDo: [
        "Plant seeds that grow with community",
        "Navigate bioluminescent networks",
        "Discover emergent art forms"
      ],
      nodes: null,
      projects: [],
      period: "Opening 2026",
      href: null,
      color: "#39FF14",
    },
    {
      id: "city",
      name: "CITY",
      status: "locked",
      tagline: "Metropolitan rituals at digital scale",
      whatYouDo: [
        "Join synchronized urban experiences",
        "Build collaborative infrastructure",
        "Connect across time zones"
      ],
      nodes: null,
      projects: [],
      period: "Opening 2027",
      href: null,
      color: "#00D9FF",
    },
  ];

  if (!mounted) return null;

  const currentColor = hoveredExhibition
    ? exhibitions.find(e => e.id === hoveredExhibition)?.color || "#FFB000"
    : "#FFB000";

  return (
    <div
      className="min-h-screen bg-[#000000] text-[#E3DAC9] overflow-x-hidden font-sans select-none relative"
      style={{ cursor: 'none' }}
    >
      {/* LIVE BACKGROUND */}
      <LiveBackground color={currentColor} intensity="medium" />

      {/* Custom Cursor - Simplified and fast */}
      <motion.div
        className="fixed w-6 h-6 rounded-full border-2 pointer-events-none z-[100] mix-blend-difference"
        style={{
          left: cursorX,
          top: cursorY,
          x: '-50%',
          y: '-50%',
          borderColor: '#FFFFFF'
        }}
        animate={{
          scale: hoveredExhibition ? 2 : 1,
          opacity: hoveredExhibition ? 1 : 0.6
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 md:p-8 backdrop-blur-sm"
      >
        <Link
          href="/"
          className="text-[9px] font-mono tracking-[0.3em] uppercase text-[#E3DAC9]/50 hover:text-[#FFB000] transition-colors flex items-center gap-2"
        >
          <div className="w-1 h-1 bg-[#FFB000] rounded-full animate-pulse"></div>
          {observerId || "..."}
        </Link>

        <button
          onClick={toggleAudio}
          className="text-[9px] font-mono tracking-[0.3em] uppercase transition-colors hover:text-[#39FF14] flex items-center gap-2"
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        >
          <span className={isMuted ? "text-[#E3DAC9]/30" : "text-[#39FF14]"}>
            {isMuted ? "⊗" : "◉"}
          </span>
        </button>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">

        {/* Compact Intro */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center mb-20"
        >
          <motion.h1
            className="text-3xl md:text-4xl font-serif font-light mb-3 tracking-wide"
            style={{ color: currentColor }}
          >
            Pyadra
          </motion.h1>
          <p className="text-xs text-[#E3DAC9]/50 font-mono uppercase tracking-[0.3em]">
            Spaces where you leave your mark
          </p>
        </motion.div>

        {/* Exhibition Grid - Compact */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {exhibitions.map((exhibition, index) => {
            const isHovered = hoveredExhibition === exhibition.id;

            return (
              <motion.div
                key={exhibition.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 + (index * 0.15) }}
                className="relative"
                onMouseEnter={() => setHoveredExhibition(exhibition.id)}
                onMouseLeave={() => setHoveredExhibition(null)}
              >
                {exhibition.href ? (
                  <Link href={exhibition.href}>
                    <ExhibitionWindow exhibition={exhibition} isHovered={isHovered} />
                  </Link>
                ) : (
                  <ExhibitionWindow exhibition={exhibition} isHovered={isHovered} />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* What makes Pyadra different - Very minimal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="mt-24 text-center pb-16"
        >
          <div className="flex items-center justify-center gap-12 text-[9px] font-mono uppercase tracking-[0.3em] text-[#E3DAC9]/40">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#FFB000] rounded-full"></div>
              <span>Permanent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#39FF14] rounded-full"></div>
              <span>Ritual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#C4A882] rounded-full"></div>
              <span>Physical</span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Bottom Navigation */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-0 left-0 right-0 z-40 p-6 md:p-8"
      >
        <div className="flex justify-center items-center gap-8 text-[8px] md:text-[9px] font-mono uppercase tracking-[0.3em] text-[#E3DAC9]/30">
          <Link href="/manifesto" className="hover:text-[#FFB000]/60 transition-colors">
            Manifesto
          </Link>
          <span className="text-[#E3DAC9]/20">•</span>
          <Link href="/legal/privacy" className="hover:text-[#FFB000]/60 transition-colors">
            Privacy
          </Link>
          <span className="text-[#E3DAC9]/20">•</span>
          <Link href="/legal/terms" className="hover:text-[#FFB000]/60 transition-colors">
            Terms
          </Link>
          <span className="text-[#E3DAC9]/20">•</span>
          <a href="mailto:contact@pyadra.io" className="hover:text-[#FFB000]/60 transition-colors">
            Contact
          </a>
        </div>
      </motion.nav>

    </div>
  );
}

function ExhibitionWindow({ exhibition, isHovered }: { exhibition: any; isHovered: boolean }) {
  const isActive = exhibition.status === "active";
  const isForming = exhibition.status === "forming";
  const isLocked = exhibition.status === "locked";

  return (
    <motion.div
      whileHover={{ y: isActive ? -8 : 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative cursor-none h-full"
    >
      {/* Window Frame */}
      <div
        className={`
          relative overflow-hidden rounded-xl border backdrop-blur-lg h-full
          ${isActive ? 'bg-[#000000]/70' : 'bg-[#000000]/40'}
        `}
        style={{
          borderColor: isActive ? `${exhibition.color}40` : `${exhibition.color}15`,
          boxShadow: isHovered && isActive ? `0 0 40px ${exhibition.color}20` : 'none'
        }}
      >
        {/* Energy glow */}
        {isActive && (
          <motion.div
            animate={{
              opacity: isHovered ? [0.15, 0.3, 0.15] : [0.05, 0.15, 0.05],
              scale: isHovered ? [1, 1.2, 1] : [1, 1.1, 1]
            }}
            transition={{
              duration: isHovered ? 2 : 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${exhibition.color}30 0%, transparent 70%)`
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 p-6 flex flex-col h-full min-h-[320px]">

          {/* Top */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <motion.h2
                animate={{
                  color: isHovered && isActive ? exhibition.color : `${exhibition.color}90`
                }}
                className="text-2xl font-serif italic font-light mb-2"
              >
                {exhibition.name}
              </motion.h2>
              <p className="text-[9px] font-mono uppercase tracking-wider text-[#E3DAC9]/40">
                {exhibition.period}
              </p>
            </div>

            {/* Status */}
            <motion.div
              animate={isActive ? {
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`w-2 h-2 rounded-full ${
                isActive ? 'bg-[#39FF14]' :
                isForming ? 'bg-[#FFB000]' :
                'bg-[#E3DAC9]/20'
              }`}
              style={{
                boxShadow: isActive ? '0 0 10px #39FF14' : 'none'
              }}
            />
          </div>

          {/* Tagline */}
          <p className="text-xs text-[#E3DAC9]/70 leading-relaxed mb-6 italic font-light">
            {exhibition.tagline}
          </p>

          {/* Actions - Active only */}
          {isActive && (
            <motion.div
              animate={{ opacity: isHovered ? 1 : 0.7 }}
              className="space-y-2 mb-6 flex-1"
            >
              {exhibition.whatYouDo.slice(0, 3).map((action: string, i: number) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-[10px] text-[#E3DAC9]/80"
                >
                  <span style={{ color: exhibition.color }}>→</span>
                  <span className="font-light line-clamp-1">{action}</span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Forming */}
          {isForming && (
            <div className="text-[10px] text-[#E3DAC9]/50 italic mb-6 flex-1">
              In development
            </div>
          )}

          {/* Locked */}
          {isLocked && (
            <div className="flex items-center gap-3 mb-6 flex-1">
              <svg className="w-5 h-5 text-[#E3DAC9]/20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <p className="text-[10px] text-[#E3DAC9]/30 italic">Sealed</p>
            </div>
          )}

          {/* Bottom */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E3DAC9]/10">
            {exhibition.nodes !== null ? (
              <div className="text-[9px] font-mono text-[#E3DAC9]/40 uppercase tracking-wide">
                {exhibition.nodes} {exhibition.nodes === 1 ? 'node' : 'nodes'}
              </div>
            ) : (
              <div></div>
            )}

            {isActive && (
              <motion.div
                animate={{
                  x: isHovered ? [0, 5, 0] : 0
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-[9px] font-mono uppercase tracking-wider"
                style={{ color: exhibition.color }}
              >
                Enter →
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
