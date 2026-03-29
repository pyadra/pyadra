'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AncientChest from '../AncientChest';

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
        // Let the cinematic sequence play out for 4 seconds before routing
        setTimeout(() => {
          router.push(`/ethernicapsule/letter/${data.capsuleId}?key=${key.trim()}`);
        }, 4000);
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
        
        {/* The rotating chest fades out on success */}
        <div className={`transition-opacity duration-[2000ms] ${success ? 'opacity-0' : 'opacity-100'}`}>
           <AncientChest isSealed={true} />
        </div>

        {/* The identical static front-facing chest fades in to simulate "stopping" to face the user */}
        <div className={`absolute transition-opacity duration-[2000ms] ${success ? 'opacity-100' : 'opacity-0'}`}>
           <div className="relative w-[380px] h-[280px]" style={{ perspective: '1600px' }}>
             <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-5deg)' }}>
               {/* Just the front face of the Ancient Chest */}
               <div className="absolute inset-0 border border-[#150802] shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] rounded-[2px] z-10 overflow-hidden" style={{ background: 'linear-gradient(135deg, #3D2010 0%, #150802 100%)' }}>
                  {/* Edges */}
                  <div className="absolute top-0 left-0 bottom-0 w-3 bg-gradient-to-r from-[#110601] to-transparent opacity-80 z-20"></div>
                  <div className="absolute top-0 right-0 bottom-0 w-3 bg-gradient-to-l from-[#110601] to-transparent opacity-80 z-20"></div>
                  
                  {/* Metallic corner clasps */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-b-2 border-r-2 border-[#1a1410] opacity-60"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-b-2 border-l-2 border-[#1a1410] opacity-60"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-t-2 border-r-2 border-[#1a1410] opacity-60"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-t-2 border-l-2 border-[#1a1410] opacity-60"></div>

                  {/* Wood grain proxy */}
                  <div className="absolute inset-0 opacity-10 mix-blend-multiply" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.8) 10px, rgba(0,0,0,0.8) 20px)' }}></div>

                  {/* Horizontal bands */}
                  <div className="absolute top-[30%] left-0 right-0 h-4 bg-[#0a0502] border-y border-[#2a1b12] shadow-sm transform -translate-y-1/2 opacity-70"></div>
                  <div className="absolute bottom-[30%] left-0 right-0 h-4 bg-[#0a0502] border-y border-[#2a1b12] shadow-sm transform translate-y-1/2 opacity-70"></div>
                  
                  {/* The Keyhole */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-14 bg-[#0a0502] border border-[#2a1b12] rounded-t-full flex items-center justify-center flex-col z-30 shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                     <div className="w-2 h-2 rounded-full bg-black mb-[1px]"></div>
                     <div className="w-2 h-4 bg-black clip-path-keyhole"></div>
                     <style>{`.clip-path-keyhole { clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%); }`}</style>
                  </div>
               </div>
               <div className="absolute -bottom-10 left-10 right-10 h-10 bg-black blur-xl opacity-60 rounded-[100%] shadow-[0_40px_100px_rgba(0,0,0,1)]"></div>
             </div>
           </div>
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
      </div>

    </div>
  );
}
