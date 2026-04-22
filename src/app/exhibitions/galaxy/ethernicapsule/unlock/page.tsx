'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Capsule3D from '../Capsule3D';
import { motion } from 'framer-motion';
import LiveBackground from '../../components/LiveBackground';

export default function EterniCapsuleUnlock() {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/ethernicapsule/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: key.trim(), type: 'capsule' })
      });
      const data = await res.json();

      if (res.ok && data.capsuleId) {
        setSuccess(true);
        // Let the cinematic sequence play out for 5.5 seconds before routing
        // This ensures the screen is fully consumed by the amber light before transitioning.
        setTimeout(() => {
          router.push(`/exhibitions/galaxy/ethernicapsule/letter/${data.capsuleId}?key=${key.trim()}`);
        }, 5500);
      } else {
        // "No red. No harsh color. Dim amber text."
        setError("This key does not match any capsule.");
        setLoading(false);
      }
    } catch {
      setError("This key does not match any capsule.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 bg-[var(--etn-earth)] select-none overflow-hidden">

      <LiveBackground color="var(--etn-bronze-bright)" intensity="low" />

      {/* Deep Space Radial Gradient Background */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at 50% 50%, var(--etn-soil) 0%, var(--etn-earth) 60%)' }}></div>

      {/* Absolute white/amber fade to consume the screen before navigation */}
      <div 
        className={`fixed inset-0 z-50 bg-[#cba37b] transition-opacity duration-[3000ms] pointer-events-none ${success ? 'opacity-10 delay-[2500ms]' : 'opacity-0'}`}
      ></div>

      <div className="mb-4 mt-20 relative flex items-center justify-center h-[300px] z-10">
        
        {/* The Capsule materializes and unlocks natively based on success state */}
        <div className={`transition-all duration-[3000ms] ease-out z-10 ${success ? 'scale-110 translate-y-4' : 'scale-100'}`}>
           <Capsule3D isSealed={!success} isSealing={success} />
        </div>

        {/* The intense expanding amber bloom from the keyhole (success state) */}
        <div 
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--etn-copper)] rounded-full pointer-events-none transition-all duration-[3000ms] ${success ? 'opacity-80 scale-[15] blur-[80px] delay-[1000ms]' : 'opacity-0 scale-50 blur-[40px]'}`}
          style={{ width: '100px', height: '100px' }}
        ></div>

        {/* The base radial glow behind the chest */}
        <div 
          className="absolute inset-0 pointer-events-none z-[-1] transition-all duration-1000 opacity-100"
          style={{ background: 'radial-gradient(circle at 50% 50%, rgba(138,107,68,0.1) 0%, rgba(0,0,0,0) 60%)' }}
        ></div>
      </div>

      <div className={`flex flex-col items-center w-full mt-10 max-w-md transition-opacity duration-1000 z-10 ${success ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <label className="text-xs uppercase text-[var(--etn-bronze-bright)]/80 tracking-[0.25em] mb-6 font-mono">
          Enter your key
        </label>

        <form onSubmit={handleUnlock} className="flex flex-col w-full items-center gap-8 group">
          <div className="relative w-full bg-[var(--etn-soil)]/75 border border-[var(--etn-copper)]/30 rounded-lg p-3 hover:border-[var(--etn-copper)]/50 transition-all">
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                disabled={loading}
                placeholder="ETN-CAPSULE-XXXX-XXXX"
                className="w-full bg-transparent text-center text-[var(--etn-cream)] focus:outline-none text-base font-mono placeholder-[var(--etn-cream)]/20 transition-colors"
              />
          </div>

          {error && <p className="text-[var(--etn-rust)] bg-[var(--etn-rust)]/5 px-4 py-3 rounded-lg border border-[var(--etn-rust)]/20 text-sm text-center w-full" style={{ fontFamily: 'var(--font-cormorant)' }}>{error}</p>}

          <button
             type="submit"
             disabled={loading || !key.trim()}
             className="group relative overflow-hidden bg-transparent border border-[var(--etn-copper)]/40 px-8 py-4 text-center transition-all duration-700 hover:border-[var(--etn-copper)] hover:shadow-[0_0_30px_rgba(156,102,68,0.2)] rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
             aria-label={loading ? "Decrypting capsule" : "Open capsule with key"}
          >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--etn-copper)]/10 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover:animate-[shimmer_2s_infinite]"></div>
             <span className="relative z-10 text-[var(--etn-cream)]/90 group-hover:text-[var(--etn-cream)] tracking-widest text-xs uppercase font-mono transition-colors duration-700">
               {loading ? 'Decrypting...' : 'Open Capsule'}
             </span>
          </button>
        </form>

        <Link
          href="/"
          className="mt-16 inline-flex items-center gap-3 px-6 py-3 bg-[var(--etn-soil)]/60 border border-white/5 rounded-full hover:bg-[var(--etn-copper)]/10 hover:border-[var(--etn-copper)]/40 transition-all duration-500 backdrop-blur-md"
        >
          <span className="text-[var(--etn-bronze)]/80 hover:text-[var(--etn-cream)] text-xs tracking-wide uppercase font-mono transition-colors duration-500">
            RETURN TO PYADRA
          </span>
        </Link>
      </div>

    </div>
  );
}
