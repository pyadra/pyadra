'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Capsule3D from '../Capsule3D';

export default function EterniCapsulePreview() {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/ethernicapsule/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: key.trim(), type: 'sender' })
      });
      const data = await res.json();

      if (res.ok && data.capsuleId) {
        setSuccess(true);
        // Send to letter render with sender key context after brief fade
        setTimeout(() => {
          router.push(`/exhibitions/galaxy/ethernicapsule/letter/${data.capsuleId}?key=${key.trim()}&type=sender`);
        }, 1500);
      } else {
        setError(data.error || "This key does not match any capsule.");
        setLoading(false);
      }
    } catch {
      setError("This key does not match any capsule.");
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen relative px-4 bg-[#000000] select-none overflow-hidden transition-opacity duration-[1500ms] ${success ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* Deep Space Radial Gradient Background */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at 50% 50%, var(--etn-void) 0%, #000000 60%)' }}></div>

      <div className="relative z-10 text-center text-[var(--etn-bronze)]/70 tracking-[0.4em] text-xs mb-8 select-none uppercase font-mono drop-shadow-[0_0_5px_rgba(138,107,68,0.2)]">
        [ PREVIEW MODE ]
      </div>

      <div className="mb-4 relative flex items-center justify-center h-[300px] z-10 scale-[0.7] opacity-80 pointer-events-none">
        
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
          style={{ background: 'radial-gradient(circle at 50% 50%, rgba(138,107,68,0.05) 0%, rgba(0,0,0,0) 60%)' }}
        ></div>
      </div>

      <div className="flex flex-col items-center w-full max-w-sm mt-8 z-10 relative">
        <label className="text-xs uppercase text-[var(--etn-bronze)]/80 tracking-[0.3em] mb-8 font-mono drop-shadow-[0_0_5px_rgba(138,107,68,0.3)]">
          Enter your Sender Key
        </label>
        
        <form onSubmit={handlePreview} className="flex flex-col w-full items-center gap-12 group">
          <div className="relative w-full">
              <input 
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                disabled={loading}
                placeholder="ETN-CREATOR-XXXX-XXXX"
                className="w-full bg-transparent text-center border-b border-white/10 text-[var(--etn-parchment)] focus:border-transparent outline-none pb-4 text-xl md:text-2xl font-mono placeholder-[var(--etn-parchment)]/10 transition-colors z-10 relative"
              />
              <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--etn-copper)] to-transparent w-full scale-x-0 group-focus-within:scale-x-100 transition-transform duration-1000"></div>
          </div>

          {error && <p className="text-[var(--etn-rust)] bg-[var(--etn-rust)]/5 px-4 py-2 rounded border border-[var(--etn-rust)]/20 italic text-sm text-center font-light w-full" style={{ fontFamily: 'var(--font-cormorant)' }}>{error}</p>}

          <button 
             type="submit"
             disabled={loading || !key.trim()}
             className="group/btn relative overflow-hidden bg-[var(--etn-charcoal)] border border-[var(--etn-copper)]/20 px-20 py-6 text-center transition-all duration-1000 hover:border-[var(--etn-copper)] hover:shadow-[0_0_50px_rgba(138,107,68,0.2)] disabled:opacity-50 disabled:hover:shadow-none min-w-[300px] rounded-lg"
          >
             {!loading && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--etn-copper)]/10 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>}
             <span className="relative z-10 text-[var(--etn-copper)] group-hover/btn:text-[var(--etn-parchment)] tracking-[0.3em] text-xs uppercase font-mono flex justify-center items-center font-semibold transition-colors duration-500">
               {loading ? (
                  <span className="animate-pulse tracking-[0.4em] drop-shadow-[0_0_10px_rgba(138,107,68,0.5)]">VERIFYING...</span>
               ) : (
                  'OPEN PREVIEW'
               )}
             </span>
          </button>
        </form>

        <p className="text-[var(--etn-bronze)]/70 text-xs mt-12 font-serif italic text-center max-w-[200px]">
          This is how your letter will appear when opened. Read only.
        </p>

        <a
          onClick={() => router.push('/exhibitions/galaxy/ethernicapsule')}
          className="mt-12 py-3 px-4 text-[var(--etn-bronze)]/60 font-mono text-xs tracking-[0.3em] uppercase hover:text-[var(--etn-parchment)] cursor-pointer transition-colors duration-500 border-b border-transparent hover:border-[var(--etn-parchment)]/30"
        >
          [ BACK TO PYADRA ]
        </a>
      </div>
    </div>
  );
}
