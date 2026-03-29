'use client';

import { useState } from 'react';
import Link from 'next/link';
import { audioAPI } from '@/app/lib/audio';

export default function ComposeForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transitioning, setTransitioning] = useState(false);

  const [formData, setFormData] = useState({
    sender_name: '',
    recipient_name: '',
    message: '',
    guardian_email: '',
    deliver_at: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.sender_name.trim() || !formData.message.trim()) {
      setError("We need a name to remember you by, and a message to preserve.");
      return;
    }

    setLoading(true);

    try {
      // 1. Memorize locally (as a fallback/draft only)
      localStorage.setItem('etn_draft', JSON.stringify(formData));

      // 2. Transmute to Payment Stage and initialize Secure Vault
      const res = await fetch('/api/ethernicapsule/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.url) {
        audioAPI.playCrystallize();
        setTransitioning(true);
        setTimeout(() => {
          window.location.href = data.url;
        }, 1500); // 1.5s fade out before jumping to Stripe
      } else {
        setError(data.error || "Failed to initiate the sealing threshold.");
        setLoading(false);
      }
    } catch {
      setError("A severed connection prevented the preservation.");
      setLoading(false);
    }
  };

  const glowStrength = Math.min(0.07 + (formData.message.length * 0.0003), 0.35);

  return (
    <>
      <div 
        className={`fixed inset-0 pointer-events-none z-0 mix-blend-screen transition-all duration-[2000ms] ${transitioning ? 'opacity-0' : 'opacity-100'}`}
        style={{ background: `radial-gradient(circle at 50% 50%, rgba(122,82,48,${glowStrength}) 0%, rgba(6,5,4,0) 80%)` }}
      ></div>

      {/* Cinematic noise texture layer */}
      <div className="fixed inset-0 pointer-events-none z-10 opacity-[0.04] mix-blend-screen" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

      <div className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-center transition-opacity duration-[3000ms] pointer-events-none ${transitioning ? 'opacity-100' : 'opacity-0'}`}>
        <p className={`text-[#C4A882] italic text-[14px] tracking-[0.2em] transition-opacity duration-[1500ms] ${transitioning ? 'opacity-100 delay-1000' : 'opacity-0'}`} style={{ fontFamily: 'var(--font-cormorant)' }}>
          Your capsule is being sealed...
        </p>
      </div>

      <div className={`text-center text-[#C4A882] tracking-[0.3em] text-[12px] mb-20 select-none uppercase transition-opacity duration-[2000ms] ${transitioning ? 'opacity-0' : 'opacity-100'} font-semibold`} style={{ fontFamily: 'var(--font-cormorant)' }}>
        [ YOUR CAPSULE IS OPEN <span className="animate-pulse text-[#C4A882] inline-block -translate-y-[1px] ml-[2px]">·</span> ]
      </div>

      <form onSubmit={handleSubmit} className={`flex flex-col gap-12 text-[#E8D9BB] relative z-20 transition-opacity duration-[2000ms] ${transitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{ fontFamily: 'var(--font-eb-garamond)' }}>
        
        <div className="flex flex-col gap-2">
          <label className="text-[11px] text-[#7A6A55] tracking-widest uppercase" style={{ fontFamily: 'var(--font-cormorant)' }}>Your name</label>
          <div className="relative w-full">
            <input 
              type="text"
              name="sender_name"
              value={formData.sender_name}
              onChange={handleChange}
              placeholder="How you want to be remembered"
              className="peer w-full bg-transparent border-b border-[rgba(196,168,130,0.2)] text-[#E8D9BB] focus:border-transparent focus:outline-none pb-2 text-lg placeholder-[#7A6A55] transition-colors"
              maxLength={100}
              disabled={loading || transitioning}
            />
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#C4A882] transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] peer-focus:w-full opacity-50 peer-focus:opacity-100"></span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[11px] text-[#7A6A55] tracking-widest uppercase" style={{ fontFamily: 'var(--font-cormorant)' }}>For</label>
          <div className="relative w-full">
            <input 
              type="text"
              name="recipient_name"
              value={formData.recipient_name}
              onChange={handleChange}
              placeholder="The person this is written for — optional"
              className="peer w-full bg-transparent border-b border-[rgba(196,168,130,0.2)] text-[#E8D9BB] focus:border-transparent focus:outline-none pb-2 text-lg placeholder-[#7A6A55] transition-colors"
              maxLength={100}
              disabled={loading || transitioning}
            />
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#C4A882] transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] peer-focus:w-full opacity-50 peer-focus:opacity-100"></span>
          </div>
        </div>

        <div className="flex flex-col mt-4 relative w-full">
          <textarea 
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write what you need to say. This will exist beyond this moment."
            className="peer w-full bg-transparent border-b border-[rgba(196,168,130,0.2)] focus:border-transparent text-[#E8D9BB] focus:outline-none placeholder-[#7A6A55] resize-none overflow-hidden min-h-[320px] pb-6 text-xl leading-[2.0] text-center md:text-left transition-colors"
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = '320px';
              target.style.height = target.scrollHeight + 'px';
            }}
            disabled={loading || transitioning}
          />
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#C4A882] transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] peer-focus:w-full opacity-50 peer-focus:opacity-100 shadow-[0_0_15px_rgba(196,168,130,0.3)]"></span>
        </div>

        <div className="flex flex-col gap-2 mt-8">
          <label className="text-[11px] text-[#7A6A55] tracking-widest uppercase" style={{ fontFamily: 'var(--font-cormorant)' }}>Guardian(s)</label>
          <div className="relative w-full">
            <input 
              type="text"
              name="guardian_email"
              value={formData.guardian_email}
              onChange={handleChange}
              placeholder="Separate multiple emails with commas — optional"
              className="peer w-full bg-transparent border-b border-[rgba(196,168,130,0.2)] text-[#E8D9BB] focus:border-transparent focus:outline-none pb-2 text-lg placeholder-[#7A6A55] transition-colors"
              disabled={loading || transitioning}
            />
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#C4A882] transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] peer-focus:w-full opacity-50 peer-focus:opacity-100"></span>
          </div>
          <p className="text-[10px] text-[#7A6A55] tracking-widest italic mt-1" style={{ fontFamily: 'var(--font-cormorant)' }}>
            They will hold the key. They decide when to use it.
          </p>
        </div>

        <div className="flex flex-col gap-2 mt-8">
          <label className="text-[11px] text-[#7A6A55] tracking-widest uppercase" style={{ fontFamily: 'var(--font-cormorant)' }}>The Time Vault</label>
          <div className="relative w-full">
            <input 
              type="date"
              name="deliver_at"
              value={formData.deliver_at}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="peer w-full bg-transparent border-b border-[rgba(196,168,130,0.2)] text-[#E8D9BB] focus:border-transparent focus:outline-none pb-2 text-lg placeholder-[#7A6A55] transition-colors [color-scheme:dark]"
              disabled={loading || transitioning}
            />
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#C4A882] transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] peer-focus:w-full opacity-50 peer-focus:opacity-100"></span>
          </div>
          <p className="text-[10px] text-[#7A6A55] tracking-widest italic mt-1" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Optional. If set, the key will be securely withheld and sent automatically on this precise date.
          </p>
        </div>

        <div className="flex flex-col items-center mt-20 pt-10">
          
          {error && <p className="text-[#C4A882] italic text-sm mb-6 pb-2 text-center max-w-md">{error}</p>}

          <p className="text-[#7A6A55] italic text-sm mb-8 text-center" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Once sealed, this cannot be changed.
            <br/><span className="text-[11px] opacity-70">A $9 cryptographic toll is required.</span>
          </p>

          <button 
            type="submit"
            disabled={loading || transitioning}
            className="border border-[#C4A882] bg-transparent w-full md:max-w-md px-16 py-4 text-[#C4A882] tracking-[0.3em] text-[12px] uppercase transition-all duration-1000 hover:bg-[rgba(196,168,130,0.1)] disabled:border-[rgba(196,168,130,0.3)] disabled:bg-transparent disabled:text-[#C4A882] flex justify-center"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {loading ? <span className="animate-pulse tracking-[0.4em] text-[#C4A882] font-normal italic lowercase text-[15px]">Sealing...</span> : 'SEAL THE CAPSULE'}
          </button>

          <Link 
            href="/" 
            className="mt-12 text-[#3A2E22] text-[10px] tracking-[0.3em] uppercase hover:text-[#C4A882] transition-colors duration-500"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            [ CANCEL / BACK TO PYADRA ]
          </Link>
        </div>
      </form>
    </>
  );
}

