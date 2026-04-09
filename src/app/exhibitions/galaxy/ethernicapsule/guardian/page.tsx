'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Capsule3D from '../Capsule3D';
import { motion, AnimatePresence } from 'framer-motion';

function GuardianAccessContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const [capsuleKey, setCapsuleKey] = useState('');
  const [senderName, setSenderName] = useState('');
  const [deliverAt, setDeliverAt] = useState('');
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid access link. Please check your email for the correct link.');
      setLoading(false);
      return;
    }

    checkAccess();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const checkAccess = async () => {
    try {
      const res = await fetch('/api/ethernicapsule/guardian-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guardianToken: token })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to access capsule');
        setLoading(false);
        return;
      }

      if (data.ready) {
        setReady(true);
        setCapsuleKey(data.capsuleKey);
        setSenderName(data.senderName);
      } else {
        setReady(false);
        setDeliverAt(data.deliverAt);
      }

      setLoading(false);
    } catch {
      setError('Failed to connect. Please try again later.');
      setLoading(false);
    }
  };

  const handleReveal = () => {
    setRevealed(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#02040A] px-4 font-mono">
        <div className="animate-pulse text-[#C4A882] tracking-[0.3em] text-[10px] uppercase">
          Accessing vault...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#02040A] px-4">
        <Capsule3D isSealed={true} />
        <p className="mt-8 text-[#8B4444] text-center max-w-md font-sans text-sm font-light">
          {error}
        </p>
        <Link
          href="/exhibitions/galaxy/ethernicapsule"
          className="mt-12 text-[#E8D9BB]/80 text-[10px] uppercase tracking-[0.3em] hover:text-[#C4A882] transition-colors font-mono"
        >
          [ RETURN ]
        </Link>
      </div>
    );
  }

  if (!ready) {
    const deliverDate = new Date(deliverAt);
    const formattedDate = deliverDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#02040A] px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5 }} className="flex flex-col items-center text-center">
          <div className="mb-10">
            <Capsule3D isSealed={true} />
          </div>

          <h1 className="text-4xl md:text-5xl text-[#E8D9BB] italic mb-6 text-center font-light" style={{ fontFamily: 'var(--font-cormorant)' }}>
            The vault is still locked.
          </h1>

          <p className="text-[#E8D9BB]/70 text-center max-w-md mb-4 text-[15px] font-sans font-light">
            This capsule cannot be opened yet.
          </p>

          <div className="border border-white/5 bg-black/20 backdrop-blur-md px-10 py-6 rounded-[4px] mt-4 mb-10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <p className="text-[#C4A882] text-sm uppercase tracking-widest font-mono">
              Available on: <br/><span className="text-xl text-[#E8D9BB] mt-3 block">{formattedDate}</span>
            </p>
          </div>

          <p className="text-[#E8D9BB]/80 text-sm text-center max-w-sm font-sans font-light leading-relaxed">
            Return to this link after that date to receive the capsule key.
          </p>

          <Link
            href="/"
            className="mt-16 py-3 px-4 text-[#E8D9BB]/70 text-[10px] tracking-[0.3em] uppercase hover:text-[#C4A882] transition-colors font-mono"
          >
            [ BACK TO PYADRA ]
          </Link>
        </motion.div>
      </div>
    );
  }

  // Capsule is ready - show key
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#02040A] px-4 relative overflow-hidden">

      {/* Expanding amber light effect when revealed */}
      <div
        className={`fixed inset-0 transition-opacity duration-[3000ms] pointer-events-none z-0 ${revealed ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: `radial-gradient(circle at 50% 50%, rgba(196,168,130,0.08) 0%, rgba(2,4,10,0) 70%)` }}
      ></div>

      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 1.5, ease: "easeOut" }}
         className="relative z-10 flex flex-col items-center max-w-2xl w-full"
      >
        <div className="mb-10 relative">
          <Capsule3D isSealed={false} isSealing={revealed} />

          {/* Glow effect when revealed */}
          {revealed && (
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#C4A882] rounded-full pointer-events-none transition-all duration-[2000ms] opacity-60 scale-[4] blur-[80px] z-[-1]"
              style={{ width: '100px', height: '100px' }}
            ></div>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl text-[#E8D9BB] italic mb-6 text-center font-light" style={{ fontFamily: 'var(--font-cormorant)' }}>
          The time has come.
        </h1>

        <p className="text-[#E8D9BB]/80 text-center mb-10 max-w-md text-lg leading-relaxed font-sans font-light">
          <span className="text-[#C4A882]">{senderName}</span> entrusted you with this capsule. The vault is now open.
        </p>

        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.button
              key="reveal-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={handleReveal}
              className="group relative overflow-hidden border border-[#C4A882]/40 bg-[#0A0C14] px-16 py-5 text-center transition-all duration-700 hover:border-[#C4A882] hover:shadow-[0_0_30px_rgba(196,168,130,0.15)] rounded-[2px] mb-12"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C4A882]/10 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <span className="relative z-10 text-[#C4A882] tracking-[0.3em] text-[11px] uppercase font-mono font-medium">
                REVEAL KEY
              </span>
            </motion.button>
          ) : (
            <motion.div 
               key="key-display"
               initial={{ opacity: 0, height: 0, filter: 'blur(10px)' }}
               animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
               transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
               className="w-full max-w-md flex flex-col items-center"
            >
              <div className="text-center w-full">
                <div className="text-[10px] uppercase tracking-[0.4em] text-[#C4A882]/60 mb-4 font-mono">
                  CAPSULE KEY
                </div>

                <div className="border border-white/10 bg-black/40 backdrop-blur-xl p-8 mb-8 shadow-[0_0_40px_rgba(196,168,130,0.15)] rounded-[4px] relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#C4A882]/50 to-transparent"></div>
                  <p className="text-[#C4A882] text-2xl md:text-3xl tracking-[0.15em] font-mono font-medium select-all">
                    {capsuleKey}
                  </p>
                  <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#C4A882]/20 to-transparent"></div>
                </div>

                <p className="text-[#E8D9BB]/80 text-[15px] mb-10 leading-relaxed font-sans font-light">
                  Pass this key to the person it was written for <br/> — or open it yourself.
                </p>

                <Link
                  href={`/exhibitions/galaxy/ethernicapsule/unlock`}
                  className="inline-block border border-[#C4A882]/40 bg-[#C4A882]/5 hover:bg-[#C4A882] hover:text-[#02040A] px-12 py-4 text-[#C4A882] tracking-[0.3em] text-[11px] uppercase transition-all duration-700 font-mono font-medium rounded-[2px]"
                >
                  OPEN CAPSULE
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Link
          href="/"
          className="mt-16 text-[#E8D9BB]/70 text-[10px] tracking-[0.3em] uppercase hover:text-[#C4A882] transition-colors font-mono absolute bottom-8 md:relative md:bottom-auto"
        >
          [ BACK TO PYADRA ]
        </Link>
      </motion.div>
    </div>
  );
}

export default function GuardianAccess() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#02040A] px-4">
        <div className="animate-pulse text-[#C4A882] tracking-[0.3em] text-[10px] uppercase font-mono">
          Accessing Vault...
        </div>
      </div>
    }>
      <GuardianAccessContent />
    </Suspense>
  );
}
