'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Capsule3D from '../Capsule3D';
import { motion } from 'framer-motion';
import ProjectNav from '../../components/ProjectNav';
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
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 bg-[#000000] select-none overflow-hidden">

      <LiveBackground color="#C4A882" intensity="low" />
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
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at 50% 50%, #040710 0%, #000000 60%)' }}></div>

      {/* Absolute white/amber fade to consume the screen before navigation */}
      <div 
        className={`fixed inset-0 z-50 bg-[#cba37b] transition-opacity duration-[3000ms] pointer-events-none ${success ? 'opacity-10 delay-[2500ms]' : 'opacity-0'}`}
      ></div>

      <div className="mb-4 relative flex items-center justify-center h-[300px] z-10">
        
        {/* The Capsule materializes and unlocks natively based on success state */}
        <div className={`transition-all duration-[3000ms] ease-out z-10 ${success ? 'scale-110 translate-y-4' : 'scale-100'}`}>
           <Capsule3D isSealed={!success} isSealing={success} />
        </div>

        {/* The intense expanding amber bloom from the keyhole (success state) */}
        <div 
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#8A6B44] rounded-full pointer-events-none transition-all duration-[3000ms] ${success ? 'opacity-80 scale-[15] blur-[80px] delay-[1000ms]' : 'opacity-0 scale-50 blur-[40px]'}`}
          style={{ width: '100px', height: '100px' }}
        ></div>

        {/* The base radial glow behind the chest */}
        <div 
          className="absolute inset-0 pointer-events-none z-[-1] transition-all duration-1000 opacity-100"
          style={{ background: 'radial-gradient(circle at 50% 50%, rgba(138,107,68,0.1) 0%, rgba(0,0,0,0) 60%)' }}
        ></div>
      </div>

      <div className={`flex flex-col items-center w-full mt-10 max-w-sm transition-opacity duration-1000 z-10 ${success ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <label className="text-[12px] uppercase text-[#B89968]/80 tracking-[0.3em] mb-8 font-mono drop-shadow-[0_0_5px_rgba(138,107,68,0.3)]">
          Enter your key
        </label>
        
        <form onSubmit={handleUnlock} className="flex flex-col w-full items-center gap-12 group">
          <div className="relative w-full">
              <input 
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                disabled={loading}
                placeholder="ETN-CAPSULE-XXXX-XXXX"
                className="w-full bg-transparent text-center border-b border-white/10 text-[#F5E6CC] focus:border-transparent outline-none pb-4 text-xl md:text-2xl font-mono placeholder-[#F5E6CC]/10 transition-colors z-10 relative"
              />
              <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#8A6B44] to-transparent w-full scale-x-0 group-focus-within:scale-x-100 transition-transform duration-1000"></div>
          </div>

          {error && <p className="text-[#8B4444] bg-[#8B4444]/5 px-4 py-2 rounded border border-[#8B4444]/20 italic text-sm text-center font-light w-full" style={{ fontFamily: 'var(--font-cormorant)' }}>{error}</p>}

          <button
             type="submit"
             disabled={loading || !key.trim()}
             className="group/btn relative overflow-hidden bg-gradient-to-r from-[#8A6B44]/20 via-[#8A6B44]/30 to-[#8A6B44]/20 border border-[#8A6B44]/60 px-20 py-6 text-center transition-all duration-1000 hover:border-[#8A6B44] hover:bg-[#8A6B44] hover:shadow-[0_0_50px_rgba(138,107,68,0.4)] disabled:opacity-50 disabled:hover:shadow-none min-w-[300px] rounded-lg"
             aria-label={loading ? "Decrypting capsule" : "Open capsule with key"}
          >
             {!loading && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#8A6B44]/25 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>}
             <span className="relative z-10 text-[#F5E6CC] group-hover/btn:text-[#000000] tracking-[0.3em] text-[13px] uppercase font-mono flex justify-center items-center font-semibold transition-colors duration-500">
               {loading ? (
                  <span className="animate-pulse tracking-[0.4em] drop-shadow-[0_0_10px_rgba(138,107,68,0.5)]">DECRYPTING...</span>
               ) : (
                  'OPEN CAPSULE'
               )}
             </span>
          </button>
        </form>

        <Link
          href="/"
          className="mt-16 py-3 px-4 text-[#B89968]/60 font-mono text-[10px] tracking-[0.3em] uppercase hover:text-[#F5E6CC] transition-colors duration-500 border-b border-transparent hover:border-[#F5E6CC]/30"
        >
          [ BACK TO PYADRA ]
        </Link>
      </div>

    </div>
  );
}
