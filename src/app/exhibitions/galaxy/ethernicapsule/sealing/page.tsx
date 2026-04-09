'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Capsule3D from '../Capsule3D';
import { motion, AnimatePresence } from 'framer-motion';
import { audioAPI } from '../lib/audio';

function SealingProcess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [sealed, setSealed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [streams, setStreams] = useState<{ id: number, x: number, duration: number, delay: number, hash1: string, hash2: string }[]>([]);
  const attempted = useRef(false);

  const steps = [
    "Establishing secure connection...",
    "Validating Cryptographic Toll...",
    "Generating Sender Hash (AES-256)...",
    "Generating Guardian Keys...",
    "Encrypting memory payload...",
    "Sealing the Vault..."
  ];

  useEffect(() => {
    setMounted(true);
    setStreams(Array.from({length: 40}).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 1000,
        duration: 2 + Math.random() * 2,
        delay: Math.random() * 5,
        hash1: `0x${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
        hash2: Math.random().toString(36).slice(2, 10).toUpperCase()
    })));

    if (attempted.current) return;
    attempted.current = true;

    async function executeSeal() {
      if (!sessionId) {
        setError("Invalid session architecture. Seal cannot be engaged.");
        return;
      }

      // Cryptography Theatre Sequence
      for (let i = 0; i < steps.length; i++) {
        setStep(i);
        audioAPI.playLithicClick(); // Small UI tick
        await new Promise(r => setTimeout(r, 600 + Math.random() * 600)); 
      }

      setSealed(true);
      audioAPI.playCrystallize(); // Big hit
      
      try {
        localStorage.removeItem('etn_draft');
      } catch { /* ignore */ }
      
      setTimeout(() => {
        router.push('/exhibitions/galaxy/ethernicapsule/sealed');
      }, 3000);
    }

    setTimeout(() => {
      executeSeal();
    }, 1000);

  }, [sessionId, router, steps.length]); // Added steps.length to dep array safely

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 bg-[#000000] select-none overflow-hidden">
      
      {/* Deep Space Radial Gradient Background */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at 50% 50%, #040710 0%, #000000 60%)' }}></div>

      {/* Visual pulse */}
      <div 
        className={`fixed inset-0 pointer-events-none z-0 transition-all duration-[3000ms] ${sealed ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}
        style={{ background: `radial-gradient(circle at 50% 50%, rgba(138,107,68,0.1) 0%, transparent 60%)` }}
      ></div>

      {/* Hex/Data floating overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-5 flex flex-col justify-center items-center overflow-hidden font-mono text-[8px] leading-tight text-[#8A6B44]" suppressHydrationWarning>
         {/* Fake background hash streams */}
         {mounted && streams.map((stream) => (
           <motion.div 
             key={stream.id}
             initial={{ x: stream.x, opacity: 0 }}
             animate={{ opacity: [0, 1, 0] }}
             transition={{ duration: stream.duration, repeat: Infinity, repeatType: 'loop', delay: stream.delay }}
           >
             {stream.hash1} - {stream.hash2}
           </motion.div>
         ))}
      </div>

      <div className={`relative z-10 flex flex-col items-center transition-all duration-[2000ms] ${sealed ? 'scale-90 blur-[2px] opacity-0' : 'scale-100 blur-0 opacity-100'} min-h-[400px] justify-center`}>
         
         <div className="mb-12 mt-8 z-10 w-48 h-48 md:w-64 md:h-64 relative flex justify-center items-center">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#8A6B44] rounded-full blur-[60px] opacity-20 animate-pulse pointer-events-none" />
           <Capsule3D isSealed={false} isSealing={!sealed} />
         </div>

         {!error ? (
           <div className="h-10 relative w-full flex justify-center items-center mt-8">
             <AnimatePresence mode="wait">
               {sealed ? (
                 <motion.div
                   key="sealed"
                   initial={{ opacity: 0, scale: 0.9, filter: 'blur(5px)' }}
                   animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                   className="text-[#39FF14] uppercase tracking-[0.4em] font-mono text-[12px] font-semibold"
                 >
                   [ THRESHOLD SEALED ]
                 </motion.div>
               ) : (
                 <motion.div
                   key={step}
                   initial={{ opacity: 0, y: 5 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -5 }}
                   transition={{ duration: 0.3 }}
                   className="text-[#8A6B44] uppercase tracking-widest font-mono text-[10px]"
                 >
                   {steps[step]}
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
         ) : (
           <div className="text-center mt-8">
             <p className="text-[#8B4444] italic text-[14px] mb-8">{error}</p>
             <button 
                onClick={() => router.push('/exhibitions/galaxy/ethernicapsule')}
                className="text-[#F5E6CC]/30 tracking-[0.3em] text-[10px] uppercase hover:text-[#8A6B44] transition-colors font-mono"
             >
                [ RETURN TO THE ARCHIVE ]
             </button>
           </div>
         )}
      </div>

    </div>
  );
}

export default function EterniCapsuleSealingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#000000]"></div>}>
      <SealingProcess />
    </Suspense>
  )
}
