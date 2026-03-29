'use client';

import { useState, useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LetterRenderClient({ capsule, type }: { capsule: any, type: string }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // 13s exact sequence as requested
    const s1 = setTimeout(() => setStage(1), 500);   // ID + Date
    const s2 = setTimeout(() => setStage(2), 2500);  // Recipient
    const s3 = setTimeout(() => setStage(3), 4000);  // Message
    const s4 = setTimeout(() => setStage(4), 7000);  // Sender
    const s5 = setTimeout(() => setStage(5), 8500);  // Opened Date
    const s6 = setTimeout(() => setStage(6), 10000); // Footer
    const s7 = setTimeout(() => setStage(7), 13000); // Ghost Archive append
    
    return () => {
      clearTimeout(s1); clearTimeout(s2); clearTimeout(s3);
      clearTimeout(s4); clearTimeout(s5); clearTimeout(s6); clearTimeout(s7);
    };
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const st = ["st", "nd", "rd"][((day + 90) % 100 - 10) % 10 - 1] || "th";
      const mon = date.toLocaleString('en-US', { month: 'long' });
      return `The ${day}${st} of ${mon}, ${date.getFullYear()}`;
    } catch {
      return dateString;
    }
  }

  const sealedDate = formatDate(capsule.created_at);
  const openedDate = capsule.opened_at ? formatDate(capsule.opened_at) : '';

  const fadeClass = "transition-opacity ease-in-out";

  return (
    <div className="min-h-screen bg-[#060504] relative flex flex-col items-center justify-start pt-24 pb-16 px-6 select-none leading-relaxed overflow-x-hidden">
      
      {/* Ambient background glow — 'as if the words themselves emit light' */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 mix-blend-screen opacity-100"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(122,82,48,0.04) 0%, rgba(6,5,4,0) 70%)' }}
      ></div>

      <div className="relative z-10 w-full max-w-[580px] flex flex-col items-center text-center mx-auto">
        
        {/* 1: Meta ID & Sealed Date (0.5s delay, 1.5s fade duration) */}
        <div 
           className={`${fadeClass} duration-[1500ms] flex flex-col items-center ${stage >= 1 ? 'opacity-100' : 'opacity-0'}`}
        >
           <div 
             className="text-[9px] uppercase text-[#7A6A55] tracking-[0.3em] mb-4"
             style={{ fontFamily: 'var(--font-cormorant)' }}
           >
             ETHERNICAPSULE · {capsule.id.split('-')[0]}-{capsule.id.split('-')[1]}
           </div>
           {type === 'sender' && (
             <div 
               className="text-[#3A2E22] text-[10px] italic mb-2 tracking-widest uppercase"
               style={{ fontFamily: 'var(--font-cormorant)' }}
             >
               PREVIEW MODE — READ ONLY
             </div>
           )}
           <div 
             className="text-[#C4A882] text-sm italic"
             style={{ fontFamily: 'var(--font-eb-garamond)' }}
           >
             Sealed on {sealedDate}
           </div>
        </div>

        <div className="h-[80px]"></div>

        {/* 2: Recipient (2.5s delay) */}
        {capsule.recipient_name && (
          <div 
            className={`${fadeClass} duration-[1500ms] text-[#C4A882] text-lg tracking-widest ${stage >= 2 ? 'opacity-100' : 'opacity-0'}`}
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            For {capsule.recipient_name}
          </div>
        )}

        {capsule.recipient_name && <div className="h-[60px]"></div>}

        {/* 3: The Letter Heart (4s delay, 2.5s fade) */}
        <div className={`${fadeClass} duration-[2500ms] w-full flex justify-center ${stage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          <p 
            className={`whitespace-pre-wrap text-[#E8D9BB] text-[22px] leading-[2.0] w-full max-w-[580px] text-center drop-shadow-[0_0_15px_rgba(196,168,130,0.1)]`}
            style={{ fontFamily: 'var(--font-eb-garamond)' }}
          >
            {capsule.message}
          </p>
        </div>

        <div className="h-[80px]"></div>

        {/* 4: Sender (7.0s delay) */}
        <div 
          className={`${fadeClass} duration-[1500ms] text-[#E8D9BB] text-[18px] tracking-widest ${stage >= 4 ? 'opacity-100' : 'opacity-0'}`}
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          — {capsule.sender_name}
        </div>

        <div className="h-[40px]"></div>

        {/* 5: Opened Meta (8.5s delay) */}
        {openedDate && (
          <div 
            className={`${fadeClass} duration-[1500ms] text-[#7A6A55] text-[13px] italic ${stage >= 5 ? 'opacity-100' : 'opacity-0'}`}
            style={{ fontFamily: 'var(--font-eb-garamond)' }}
          >
            Opened on {openedDate}
          </div>
        )}
      </div>

      <div className="h-[60px]"></div>

      {/* 6 & 7: Footer Ghost sequence (10s and 13s delay) */}
      <div className={`mt-auto w-full text-center flex flex-col items-center relative z-10`}>
        <div 
          className={`text-[#3A2E22] text-[9px] tracking-[0.3em] uppercase mb-4 ${fadeClass} duration-[1500ms] ${stage >= 6 ? 'opacity-100' : 'opacity-0'}`}
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Preserved by EterniCapsule · Pyadra
        </div>
        
        <div 
          className={`text-[#2F261E] text-[10px] tracking-[0.15em] italic ${fadeClass} duration-[2000ms] ${stage >= 7 ? 'opacity-100' : 'opacity-0'}`}
          style={{ fontFamily: 'var(--font-eb-garamond)' }}
        >
          [ this letter is now part of the archive ]
        </div>
      </div>
    </div>
  );
}
