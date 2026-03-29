'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Capsule3D from '../Capsule3D';

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
          router.push(`/ethernicapsule/letter/${data.capsuleId}?key=${key.trim()}`);
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
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 bg-[#060504] select-none overflow-hidden">
      
      {/* Absolute white/amber fade to consume the screen before navigation */}
      <div 
        className={`fixed inset-0 z-50 bg-[#C4A882] transition-opacity duration-[3000ms] pointer-events-none ${success ? 'opacity-10 delay-[2500ms]' : 'opacity-0'}`}
      ></div>

      <div className="mb-4 relative flex items-center justify-center h-[300px]">
        
        {/* The Capsule materializes and unlocks natively based on success state */}
        <div className={`transition-all duration-[3000ms] ease-out z-10 ${success ? 'scale-110 translate-y-4' : 'scale-100'}`}>
           <Capsule3D isSealed={!success} isSealing={success} />
        </div>

        {/* The intense expanding amber bloom from the keyhole (success state) */}
        <div 
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#dca88f] rounded-full pointer-events-none transition-all duration-[3000ms] ${success ? 'opacity-80 scale-[15] blur-[60px] delay-[1000ms]' : 'opacity-0 scale-50 blur-[40px]'}`}
          style={{ width: '100px', height: '100px' }}
        ></div>

        {/* The base radial glow behind the chest */}
        <div 
          className="absolute inset-0 pointer-events-none z-[-1] transition-all duration-1000 opacity-100"
          style={{ background: 'radial-gradient(circle at 50% 50%, rgba(122,82,48,0.1) 0%, rgba(6,5,4,0) 60%)' }}
        ></div>
      </div>

      <div className={`flex flex-col items-center w-full mt-10 max-w-sm transition-opacity duration-1000 ${success ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <label className="text-[12px] uppercase text-[#7A6A55] tracking-[0.3em] mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>
          Enter your key
        </label>
        
        <form onSubmit={handleUnlock} className="flex flex-col w-full items-center gap-10">
          <input 
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            disabled={loading}
            placeholder="ETN-CAPSULE-XXXX-XXXX"
            className="w-full bg-transparent text-center border-b border-[rgba(196,168,130,0.3)] text-[#E8D9BB] focus:border-[#C4A882] outline-none pb-2 text-lg md:text-xl font-mono placeholder-[#7A6A55] transition-colors"
          />

          {error && <p className="text-[#C4A882] italic text-sm text-center" style={{ fontFamily: 'var(--font-cormorant)' }}>{error}</p>}

          <button 
            type="submit"
            disabled={loading || !key.trim()}
            className="border border-[#C4A882] bg-transparent px-12 py-[14px] text-[#C4A882] tracking-[0.3em] text-[11px] uppercase transition-all duration-500 hover:bg-[#C4A882] hover:text-[#060504] disabled:opacity-50 w-full"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {loading ? <span className="animate-pulse tracking-[0.4em]">OPENING...</span> : 'OPEN'}
          </button>
        </form>

        <Link 
          href="/" 
          className="mt-16 text-[#3A2E22] font-[family-name:var(--font-cormorant)] text-[10px] tracking-[0.3em] uppercase hover:text-[#C4A882] transition-colors duration-500"
        >
          [ BACK TO PYADRA ]
        </Link>
      </div>

    </div>
  );
}
