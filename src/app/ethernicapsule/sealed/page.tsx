'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AncientChest from '../AncientChest';

export default function EterniCapsuleSealedPage() {
  const [showHeartbeat, setShowHeartbeat] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowHeartbeat(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 select-none">
      <div className="flex flex-col items-center text-center">
        
        <div className="mb-12 mt-10 relative">
          <AncientChest isSealed={true} />
          
          {/* The amber heartbeat pulse */}
          <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-[6px] h-[6px] bg-[#C4A882] rounded-full blur-[1px] transition-opacity duration-[2000ms] ${showHeartbeat ? 'opacity-80 animate-pulse' : 'opacity-0'}`}></div>
        </div>

        <h1 className="text-3xl md:text-4xl italic font-[family-name:var(--font-cormorant)] text-[#C4A882] mb-6 font-normal">
          Your capsule has been sealed.
        </h1>
        
        <p className="text-[#E8D9BB] font-[family-name:var(--font-eb-garamond)] text-xl mb-4">
          It now exists beyond this moment.
        </p>

        <p className="text-[#7A6A55] font-[family-name:var(--font-cormorant)] text-[15px] mt-8 italic tracking-wide">
          Check your email. Your Sender Key is waiting.
        </p>

        <div className="absolute bottom-12 w-full text-center">
          <Link 
            href="/projects" 
            className="text-[#3A2E22] font-[family-name:var(--font-cormorant)] text-[10px] tracking-[0.3em] uppercase hover:text-[#C4A882] transition-colors duration-500"
          >
            [ RETURN TO PYADRA ]
          </Link>
        </div>

      </div>
    </div>
  );
}
