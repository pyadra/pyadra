'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Capsule3D from './Capsule3D';
import { motion } from 'framer-motion';
import ProjectNav from '../components/ProjectNav';
import LiveBackground from '../components/LiveBackground';

export default function EterniCapsuleEntry() {
  const [mounted, setMounted] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoTextStage, setDemoTextStage] = useState(0);
  const [particles, setParticles] = useState<Array<{
    width: string, height: string, top: string, left: string, opacity: number, animation: string
  }>>([]);

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
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative bg-[#000000] select-none selection:bg-[#8A6B44] selection:text-[#000000]">

      {/* LIVE BACKGROUND */}
      <LiveBackground color="#C4A882" intensity="low" />

      {/* EXPERIMENTAL NAV */}
      <ProjectNav
        projectName="EtherniCapsule"
        projectColor="#C4A882"
        links={[
          { href: "/exhibitions/galaxy/ethernicapsule", label: "Home" },
          { href: "/exhibitions/galaxy/ethernicapsule/compose", label: "Compose" },
          { href: "/exhibitions/galaxy/ethernicapsule/unlock", label: "Unlock" }
        ]}
      />

      {/* Deep Space Radial Gradient Background */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at 50% 0%, #040710 0%, #000000 60%)' }}></div>

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
               className="absolute bg-[#C4A882] rounded-full mix-blend-screen"
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

        {/* HERO SECTION */}
        <div className="min-h-[90vh] flex flex-col items-center justify-center pt-20">
          
          <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
             className="relative mb-8 flex justify-center w-full"
          >
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#C4A882] rounded-full blur-[120px] opacity-10 pointer-events-none" />
             <Capsule3D isSealed={false} />
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0, filter: 'blur(5px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl italic text-[#F5E6CC] mt-12 font-light text-center drop-shadow-[0_0_15px_rgba(245,230,204,0.1)]" style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            EterniCapsule
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, filter: 'blur(5px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 2, delay: 1.5 }}
            className="text-[#B89968] max-w-md text-center text-[14px] md:text-[16px] tracking-[0.05em] mt-8 leading-[2] font-light" style={{ fontFamily: 'var(--font-eb-garamond)' }}
          >
            There are truths the present cannot bear.<br/> 
            Write what you never said. Seal it in time.<br/>
            <span className="text-[#F5E6CC]/80">Let them find it when they are ready.</span>
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 2 }}
            onClick={() => setDemoOpen(true)}
            className="mt-8 text-[10px] text-[#C4A882] hover:text-[#E8D9BB] hover:border-[#E8D9BB]/30 uppercase tracking-[0.3em] transition-colors border border-[#C4A882]/30 px-6 py-3 hover:bg-[#C4A882]/10"
          >
            [ VIEW SAMPLE CAPSULE ]
          </motion.button>

          <Link href="#lore">
            <motion.div 
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: 64, opacity: 0.5 }}
               transition={{ duration: 1.5, delay: 2.5 }}
               className="w-[1px] bg-gradient-to-b from-[#C4A882] to-transparent cursor-pointer mt-16"
            />
          </Link>
        </div>

        {/* LORE & DASHBOARD SECTION */}
        <div id="lore" className="min-h-screen py-32 flex flex-col items-center gap-24">
           
           <div className="max-w-2xl text-center">
              <h2 className="text-[#E8D9BB] font-light italic text-4xl mb-8" style={{ fontFamily: 'var(--font-cormorant)' }}>A Permanent Monument</h2>
              <p className="text-[#E8D9BB]/60 text-[16px] leading-[2.2] mb-6 font-sans font-light">
                This is not a file storage system. It is a cryptographic sealing ritual. 
                You forge a message intended for a specific date in the future. Once the toll is paid and the seal is cast, absolutely no one—not even us—can unlock it until the clock has physically run down.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-16 w-full max-w-4xl relative">
              <div className="absolute top-8 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-[#C4A882]/20 to-transparent hidden md:block"></div>
              
              <div className="flex flex-col items-center text-center relative z-10 bg-[#02040A] pt-4">
                 <div className="text-[#C4A882] text-2xl font-mono font-bold mb-6 bg-[#02040A] px-4">01</div>
                 <div className="text-[#E8D9BB] text-[18px] mb-4 font-medium" style={{ fontFamily: 'var(--font-cormorant)' }}>Write</div>
                 <div className="text-[#E8D9BB]/50 text-[13px] font-sans leading-[2] px-4 font-light">
                   Compose a letter for yourself, a loved one, or someone you haven't met yet.
                 </div>
              </div>
              <div className="flex flex-col items-center text-center relative z-10 bg-[#02040A] pt-4">
                 <div className="text-[#C4A882] text-2xl font-mono font-bold mb-6 bg-[#02040A] px-4">02</div>
                 <div className="text-[#E8D9BB] text-[18px] mb-4 font-medium" style={{ fontFamily: 'var(--font-cormorant)' }}>Seal</div>
                 <div className="text-[#E8D9BB]/50 text-[13px] font-sans leading-[2] px-4 font-light">
                   Set an unlock date. Pay the $9 encryption toll to permanently lock it into the blockchain-grade database.
                 </div>
              </div>
              <div className="flex flex-col items-center text-center relative z-10 bg-[#02040A] pt-4">
                 <div className="text-[#C4A882] text-2xl font-mono font-bold mb-6 bg-[#02040A] px-4">03</div>
                 <div className="text-[#E8D9BB] text-[18px] mb-4 font-medium" style={{ fontFamily: 'var(--font-cormorant)' }}>Pass The Key</div>
                 <div className="text-[#E8D9BB]/50 text-[13px] font-sans leading-[2] px-4 font-light">
                   Give the Capsule Key to its rightful owner. They must wait until the date to reveal the message inside.
                 </div>
              </div>
           </div>

           <div className="max-w-xl w-full border border-[#8A6B44]/20 bg-[#020308]/60 backdrop-blur-3xl p-12 mt-8 flex flex-col items-center text-center shadow-[0_30px_100px_rgba(0,0,0,1)] rounded-xl relative overflow-hidden group">
               {/* Ambient Glow */}
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#8A6B44]/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>

               <h3 className="relative z-10 uppercase font-mono tracking-[0.4em] text-[10px] mb-8 text-[#8A6B44] drop-shadow-[0_0_10px_rgba(138,107,68,0.2)]">The Permanence Toll</h3>
                <p className="relative z-10 text-[#F5E6CC] text-[32px] leading-relaxed mb-6 font-light drop-shadow-[0_0_15px_rgba(245,230,204,0.3)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  A$9.00
                </p>
                <p className="relative z-10 text-[#F5E6CC]/70 text-[15px] leading-relaxed mb-4 font-sans font-light">
                  Time erodes memory. The Capsule preserves it.
                </p>
                <p className="relative z-10 text-[#B89968]/70 text-[10px] leading-relaxed mb-12 font-mono uppercase tracking-[0.2em]">
                  [ Single Injection · Permanent Ledger · Zero Knowledge ]
                </p>
                
               <Link
                 href="/exhibitions/galaxy/ethernicapsule/compose"
                 className="relative z-10 group/btn w-full overflow-hidden border border-[#8A6B44]/60 bg-gradient-to-r from-[#8A6B44]/20 via-[#8A6B44]/30 to-[#8A6B44]/20 px-10 py-6 text-center transition-all duration-700 hover:border-[#8A6B44] hover:bg-[#8A6B44] hover:shadow-[0_0_40px_rgba(138,107,68,0.4)] rounded-lg"
                 aria-label="Create new time capsule for $9 AUD"
               >
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#8A6B44]/25 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover/btn:animate-[shimmer_1.5s_infinite]" aria-hidden="true"></div>
                 <span className="relative z-10 text-[#F5E6CC] group-hover/btn:text-[#000000] tracking-[0.3em] text-[13px] uppercase font-semibold drop-shadow-[0_0_8px_rgba(245,230,204,0.4)] transition-colors duration-700" style={{ fontFamily: 'var(--font-cormorant)' }}>
                   INITIATE SEALING RITUAL
                 </span>
               </Link>

               <Link href="/exhibitions/galaxy/ethernicapsule/unlock" className="relative z-10 mt-8 text-[10px] text-[#B89968]/70 hover:text-[#F5E6CC] uppercase tracking-[0.2em] transition-colors border-b border-transparent hover:border-[#F5E6CC]/30 pb-1" style={{ fontFamily: 'var(--font-cormorant)' }} aria-label="Unlock existing capsule with key">
                 I ALREADY HAVE A KEY
               </Link>
           </div>

        </div>
      </motion.div>

      {/* SAMPLE CAPSULE OVERLAY (CINEMATIC DEMO) */}
      {demoOpen && (
        <div className="fixed inset-0 z-50 bg-[#02040A] flex flex-col items-center justify-center p-8">
           <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
           
           <div className="max-w-2xl w-full text-center relative z-10">
              <div className="text-[#C4A882]/50 font-mono text-[10px] tracking-[0.4em] mb-12 uppercase">
                [ Decryption Simulation ]
              </div>

              {/* The Cinematic Blur Effect */}
              <motion.div
                initial={{ filter: 'blur(30px)', opacity: 0, scale: 0.95 }}
                animate={{ filter: 'blur(0px)', opacity: 1, scale: 1 }}
                transition={{ duration: 4, ease: "easeInOut" }}
                className="text-[#E8D9BB] text-xl md:text-2xl font-light leading-relaxed mb-16 text-left" style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                <p className="mb-6">
                  "If you are reading this, the ten years have passed. I sealed this capsule on the eve of my departure."
                </p>
                <p className="mb-6">
                  "The world is likely very different now, and so are you. But I needed to make sure these words survived the passage of time intact, untouched by consequence."
                </p>
                <p className="text-[#C4A882]">
                  "Forgive me. And remember."
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5, duration: 2 }}
                onClick={() => setDemoOpen(false)}
                className="text-[10px] text-[#E8D9BB]/40 hover:text-[#C4A882] tracking-[0.3em] font-mono border border-transparent hover:border-[#C4A882]/20 px-6 py-3 transition-all"
              >
                [ CLOSE SAMPLE ]
              </motion.button>
           </div>
        </div>
      )}
    </div>
  );
}
