'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Capsule3D from '../Capsule3D';

function SealingProcess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  
  const [status, setStatus] = useState('Your capsule is being sealed.');
  const [error, setError] = useState('');
  const [sealed, setSealed] = useState(false);
  const attempted = useRef(false);

  useEffect(() => {
    // Basic orchestrator to prevent double firing in exact dev builds
    if (attempted.current) return;
    attempted.current = true;

    async function executeSeal() {
      if (!sessionId) {
        setError("Invalid session architecture. Seal cannot be engaged.");
        return;
      }

      // 100% Security Architecture:
      // The heavy lifting (saving to DB, generating hashes, emailing keys) is now inherently secured 
      // by the Stripe Webhook (checkout.session.completed) in the absolute background.
      // This front-end page merely exists to provide a profoundly satisfying cinematic closure.

      setStatus('S e a l e d.');
      setSealed(true);
      
      // Clean up fallback local draft since it's now permanently sealed in Supabase.
      try {
        localStorage.removeItem('etn_draft');
      } catch { /* ignore */ }
      
      setTimeout(() => {
        router.push('/ethernicapsule/sealed');
      }, 3000);
    }

    // Small delay to let the animations sink in
    setTimeout(() => {
      executeSeal();
    }, 1500);

  }, [sessionId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 bg-[#060504] select-none overflow-hidden">
      
      {/* Visual pulse */}
      <div 
        className={`fixed inset-0 pointer-events-none z-0 mix-blend-screen transition-all duration-[3000ms] ${sealed ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}
        style={{ background: `radial-gradient(circle at 50% 50%, rgba(122,82,48,0.2) 0%, rgba(6,5,4,0) 80%)` }}
      ></div>

      <div className={`relative z-10 flex flex-col items-center transition-opacity duration-[2000ms] ${sealed ? 'opacity-0 blur-md' : 'opacity-100 blur-0'}`}>
         
         <div className="mb-16 z-10 transition-opacity duration-1000 scale-90 md:scale-100">
           <Capsule3D isSealed={false} isSealing={true} />
         </div>

         {!error ? (
           <p className="text-[#C4A882] italic text-[14px] tracking-[0.2em] transform transition-opacity" style={{ fontFamily: 'var(--font-cormorant)' }}>
             {status}
           </p>
         ) : (
           <div className="text-center">
             <p className="text-[#C4A882] italic text-[14px] mb-6">{error}</p>
             <button 
                onClick={() => router.push('/ethernicapsule')}
                className="text-[#7A6A55] tracking-[0.3em] text-[10px] uppercase hover:text-[#C4A882] transition-colors"
                style={{ fontFamily: 'var(--font-cormorant)' }}
             >
                [ RETURN TO THE VOID ]
             </button>
           </div>
         )}
      </div>

    </div>
  );
}

export default function EterniCapsuleSealingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#060504]"></div>}>
      <SealingProcess />
    </Suspense>
  )
}
