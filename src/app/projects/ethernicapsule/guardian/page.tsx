'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Capsule3D from '../Capsule3D';

function GuardianAccessContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const [capsuleKey, setCapsuleKey] = useState('');
  const [senderName, setSenderName] = useState('');
  const [deliverAt, setDeliverAt] = useState('');
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid access link. Please check your email for the correct link.');
      setLoading(false);
      return;
    }

    checkAccess();
  }, [token]);

  const checkAccess = async () => {
    try {
      const res = await fetch('/api/ethernicapsule/guardian-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guardianToken: token })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to access capsule');
        setLoading(false);
        return;
      }

      if (data.ready) {
        setReady(true);
        setCapsuleKey(data.capsuleKey);
        setSenderName(data.senderName);
      } else {
        setReady(false);
        setDeliverAt(data.deliverAt);
      }

      setLoading(false);
    } catch {
      setError('Failed to connect. Please try again later.');
      setLoading(false);
    }
  };

  const handleReveal = () => {
    setRevealed(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#060504] px-4">
        <div className="animate-pulse text-[#C4A882] tracking-[0.3em] text-sm uppercase" style={{ fontFamily: 'var(--font-cormorant)' }}>
          Accessing vault...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#060504] px-4">
        <Capsule3D isSealed={true} />
        <p className="mt-8 text-[#C4A882] text-center max-w-md" style={{ fontFamily: 'var(--font-cormorant)' }}>
          {error}
        </p>
        <Link
          href="/projects/ethernicapsule"
          className="mt-8 text-[#7A6A55] text-xs uppercase tracking-[0.3em] hover:text-[#C4A882] transition-colors"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Return
        </Link>
      </div>
    );
  }

  if (!ready) {
    const deliverDate = new Date(deliverAt);
    const formattedDate = deliverDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#060504] px-4">
        <div className="mb-8">
          <Capsule3D isSealed={true} />
        </div>

        <h1 className="text-2xl text-[#E8D9BB] italic mb-6 text-center" style={{ fontFamily: 'var(--font-cormorant)' }}>
          The vault is still locked.
        </h1>

        <p className="text-[#AAAAAA] text-center max-w-md mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          This capsule cannot be opened yet.
        </p>

        <p className="text-[#C4A882] text-lg mb-8" style={{ fontFamily: 'var(--font-cormorant)' }}>
          Available on: <span className="font-semibold">{formattedDate}</span>
        </p>

        <p className="text-[#7A6A55] text-sm text-center max-w-sm italic" style={{ fontFamily: 'var(--font-cormorant)' }}>
          Return to this link after that date to receive the key.
        </p>

        <Link
          href="/"
          className="mt-16 text-[#3A2E22] text-[10px] tracking-[0.3em] uppercase hover:text-[#C4A882] transition-colors"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          [ BACK TO PYADRA ]
        </Link>
      </div>
    );
  }

  // Capsule is ready - show key
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#060504] px-4 relative overflow-hidden">

      {/* Expanding amber light effect when revealed */}
      <div
        className={`fixed inset-0 bg-[#C4A882] transition-opacity duration-[2000ms] pointer-events-none z-0 ${revealed ? 'opacity-5' : 'opacity-0'}`}
      ></div>

      <div className="relative z-10 flex flex-col items-center max-w-2xl w-full">
        <div className="mb-8 relative">
          <Capsule3D isSealed={false} isSealing={revealed} />

          {/* Glow effect when revealed */}
          {revealed && (
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#dca88f] rounded-full pointer-events-none transition-all duration-[2000ms] opacity-60 scale-[8] blur-[60px] z-[-1]"
              style={{ width: '100px', height: '100px' }}
            ></div>
          )}
        </div>

        <h1 className="text-2xl text-[#E8D9BB] italic mb-4 text-center" style={{ fontFamily: 'var(--font-cormorant)' }}>
          The time has come.
        </h1>

        <p className="text-[#AAAAAA] text-center mb-8 max-w-md" style={{ fontFamily: 'Georgia, serif' }}>
          {senderName} entrusted you with this capsule. The vault is now open.
        </p>

        {!revealed ? (
          <button
            onClick={handleReveal}
            className="border border-[#C4A882] bg-transparent px-16 py-4 text-[#C4A882] tracking-[0.3em] text-xs uppercase transition-all duration-500 hover:bg-[#C4A882] hover:text-[#060504] mb-8"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            REVEAL KEY
          </button>
        ) : (
          <div className="w-full max-w-md transition-all duration-1000 delay-500">
            <div className="text-center mb-4">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#7A6A55] mb-4" style={{ fontFamily: 'monospace' }}>
                CAPSULE KEY
              </div>

              <div className="border border-[rgba(196,168,130,0.25)] bg-[#0F0C09] p-6 mb-6">
                <p className="text-[#C4A882] text-2xl tracking-[0.1em] font-mono font-semibold select-all">
                  {capsuleKey}
                </p>
              </div>

              <p className="text-[#7A6A55] text-sm italic mb-8" style={{ fontFamily: 'var(--font-cormorant)' }}>
                Pass this key to the person it was written for — or use it yourself.
              </p>

              <Link
                href={`/projects/ethernicapsule/unlock`}
                className="inline-block border border-[#C4A882] bg-transparent px-12 py-3 text-[#C4A882] tracking-[0.3em] text-xs uppercase transition-all duration-500 hover:bg-[#C4A882] hover:text-[#060504]"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                OPEN CAPSULE
              </Link>
            </div>
          </div>
        )}

        <Link
          href="/"
          className="mt-16 text-[#3A2E22] text-[10px] tracking-[0.3em] uppercase hover:text-[#C4A882] transition-colors"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          [ BACK TO PYADRA ]
        </Link>
      </div>
    </div>
  );
}

export default function GuardianAccess() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#060504] px-4">
        <div className="animate-pulse text-[#C4A882] tracking-[0.3em] text-sm uppercase" style={{ fontFamily: 'var(--font-cormorant)' }}>
          Loading...
        </div>
      </div>
    }>
      <GuardianAccessContent />
    </Suspense>
  );
}
