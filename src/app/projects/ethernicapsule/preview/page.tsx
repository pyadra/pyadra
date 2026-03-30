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
          router.push(`/projects/ethernicapsule/letter/${data.capsuleId}?key=${key.trim()}&type=sender`);
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
    <div className={`flex flex-col items-center justify-center min-h-screen px-4 select-none transition-opacity duration-[1500ms] ${success ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center text-[#7A6A55] tracking-[0.3em] text-[10px] mb-8 select-none uppercase font-[family-name:var(--font-cormorant)]">
        [ PREVIEW MODE ]
      </div>

      <div className="mb-8 scale-[0.6] opacity-60 pointer-events-none">
        <Capsule3D isSealed={true} />
      </div>

      <div className="flex flex-col items-center w-full max-w-sm">
        <label className="text-[10px] uppercase font-[family-name:var(--font-cormorant)] text-[#7A6A55] tracking-[0.3em] mb-4">
          Enter your Sender Key
        </label>
        
        <form onSubmit={handlePreview} className="flex flex-col w-full items-center gap-10">
          <input 
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            disabled={loading}
            placeholder="ETN-CREATOR-XXXX-XXXX"
            className="w-full bg-transparent text-center border-b border-[#7A5230]/40 text-[#E8D9BB] focus:border-[#C4A882]/80 outline-none pb-2 text-lg md:text-xl font-mono placeholder-[#3A2E22] transition-colors"
          />

          {error && <p className="text-[#C4A882] italic text-sm text-center">{error}</p>}

          <button 
            type="submit"
            disabled={loading || !key.trim()}
            className="border border-[#7A5230]/40 bg-transparent px-10 py-3 text-[#C4A882] font-[family-name:var(--font-cormorant)] tracking-[0.3em] text-xs uppercase transition-all duration-700 hover:bg-[#7A5230]/15 hover:border-[#C4A882]/80 disabled:opacity-50"
          >
            {loading ? 'VERIFYING...' : 'OPEN PREVIEW'}
          </button>
        </form>

        <p className="text-[#3A2E22] text-xs mt-12 font-[family-name:var(--font-cormorant)] italic text-center max-w-[200px]">
          This is how your letter will appear when opened. Read only.
        </p>
      </div>
    </div>
  );
}
