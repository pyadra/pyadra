'use client';

import { useState } from 'react';

export default function ComposeForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transitioning, setTransitioning] = useState(false);

  const [formData, setFormData] = useState({
    sender_name: '',
    recipient_name: '',
    message: '',
    guardian_email: ''
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
      // 1. Memorize locally
      localStorage.setItem('etn_draft', JSON.stringify(formData));

      // 2. Transmute to Payment Stage
      const res = await fetch('/api/ethernicapsule/checkout', {
        method: 'POST',
      });
      const data = await res.json();

      if (data.url) {
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

      <div className={`fixed inset-0 z-50 bg-[#060504] flex flex-col items-center justify-center transition-opacity duration-[2000ms] pointer-events-none ${transitioning ? 'opacity-100' : 'opacity-0'}`}>
        <p className={`text-[#C4A882] italic text-[14px] tracking-[0.2em] transition-opacity duration-[1500ms] ${transitioning ? 'opacity-100' : 'opacity-0'}`} style={{ fontFamily: 'var(--font-cormorant)' }}>
          Preparing to secure your capsule...
        </p>
      </div>

      <div className={`text-center text-[#C4A882] tracking-[0.3em] text-[10px] mb-20 select-none uppercase transition-opacity duration-[2000ms] ${transitioning ? 'opacity-0' : 'opacity-100'}`} style={{ fontFamily: 'var(--font-cormorant)' }}>
        [ YOUR CAPSULE IS OPEN <span className="animate-pulse text-[#E8D9BB] inline-block -translate-y-[1px] ml-[2px]">·</span> ]
      </div>

      <form onSubmit={handleSubmit} className={`flex flex-col gap-12 text-[#E8D9BB] relative z-20 transition-opacity duration-[2000ms] ${transitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{ fontFamily: 'var(--font-eb-garamond)' }}>
        
        <div className="flex flex-col gap-2">
          <label className="text-[11px] text-[#7A6A55] tracking-widest uppercase" style={{ fontFamily: 'var(--font-cormorant)' }}>Your name</label>
          <input 
            type="text"
            name="sender_name"
            value={formData.sender_name}
            onChange={handleChange}
            placeholder="How you want to be remembered"
            className="bg-transparent border-b border-[rgba(196,168,130,0.3)] text-[#E8D9BB] focus:border-[#C4A882] focus:outline-none pb-2 text-lg placeholder-[#7A6A55] transition-colors"
            maxLength={100}
            disabled={loading || transitioning}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[11px] text-[#7A6A55] tracking-widest uppercase" style={{ fontFamily: 'var(--font-cormorant)' }}>For</label>
          <input 
            type="text"
            name="recipient_name"
            value={formData.recipient_name}
            onChange={handleChange}
            placeholder="The person this is written for — optional"
            className="bg-transparent border-b border-[rgba(196,168,130,0.3)] text-[#E8D9BB] focus:border-[#C4A882] focus:outline-none pb-2 text-lg placeholder-[#7A6A55] transition-colors"
            maxLength={100}
            disabled={loading || transitioning}
          />
        </div>

        <div className="flex flex-col mt-4">
          <textarea 
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write what you need to say. This will exist beyond this moment."
            className="bg-transparent border-b border-[rgba(196,168,130,0.3)] focus:border-[#C4A882] text-[#E8D9BB] focus:outline-none placeholder-[#7A6A55] resize-none overflow-hidden min-h-[320px] pb-6 text-xl leading-[2.0] text-center md:text-left transition-colors"
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = '320px';
              target.style.height = target.scrollHeight + 'px';
            }}
            disabled={loading || transitioning}
          />
        </div>

        <div className="flex flex-col gap-2 mt-8">
          <label className="text-[11px] text-[#7A6A55] tracking-widest uppercase" style={{ fontFamily: 'var(--font-cormorant)' }}>Guardian(s)</label>
          <input 
            type="text"
            name="guardian_email"
            value={formData.guardian_email}
            onChange={handleChange}
            placeholder="Separate multiple emails with commas — optional"
            className="bg-transparent border-b border-[rgba(196,168,130,0.3)] text-[#E8D9BB] focus:border-[#C4A882] focus:outline-none pb-2 text-lg placeholder-[#7A6A55] transition-colors"
            disabled={loading || transitioning}
          />
          <p className="text-[10px] text-[#7A6A55] tracking-widest italic mt-1" style={{ fontFamily: 'var(--font-cormorant)' }}>
            They will hold the key. They decide when to use it.
          </p>
        </div>

        <div className="flex flex-col items-center mt-20 pt-10">
          
          {error && <p className="text-[#C4A882] italic text-sm mb-6 pb-2 text-center max-w-md">{error}</p>}

          <p className="text-[#7A6A55] italic text-sm mb-6" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Sealing the capsule requires a $20 cryptographic toll.
          </p>

          <button 
            type="submit"
            disabled={loading || transitioning}
            className="border border-[#C4A882] bg-transparent w-full md:max-w-md px-16 py-4 text-[#C4A882] tracking-[0.3em] text-[11px] uppercase transition-all duration-700 hover:bg-[#C4A882] hover:text-[#060504] disabled:opacity-80 font-semibold"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {loading ? <span className="animate-pulse tracking-[0.4em] text-[#C4A882]">INITIATING...</span> : 'SEAL THE CAPSULE'}
          </button>
        </div>
      </form>
    </>
  );
}
