'use client';

import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { audioAPI } from "../../lib/audio";

export default function LetterRenderClient({ capsule, type, senderKey }: { capsule: any, type: string, senderKey?: string }) {
  const [stage, setStage] = useState(0);
  const [lightFade, setLightFade] = useState(type === 'capsule');
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const [editForm, setEditForm] = useState({
    recipient_name: capsule.recipient_name || '',
    message: capsule.message || '',
    guardian_email: capsule.guardian_email || ''
  });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const hoursSinceCreation = (Date.now() - new Date(capsule.created_at).getTime()) / (1000 * 60 * 60);
  const isEditable = type === 'sender' && !!senderKey && hoursSinceCreation < 24;

  const handleSave = async () => {
    setSaving(true);
    setEditError('');
    try {
      const res = await fetch('/api/ethernicapsule/edit', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            capsule_id: capsule.id,
            key: senderKey,
            ...editForm
         })
      });
      if (res.ok) {
        audioAPI.playCrystallize();
        setIsEditing(false);
        router.refresh();
        window.location.reload();
      } else {
        const d = await res.json();
        setEditError(d.error || 'Failed to revise.');
        setSaving(false);
      }
    } catch {
       setEditError('Connection severed.');
       setSaving(false);
    }
  };

  useEffect(() => {
    if (type === 'capsule') {
      setTimeout(() => setLightFade(false), 200);
    }

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
      
      {/* Light Materialization Cross-Fade */}
      <div className={`fixed inset-0 z-[100] bg-[#C4A882] pointer-events-none transition-opacity duration-[4000ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${lightFade ? 'opacity-100' : 'opacity-0'}`}></div>

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
        {(capsule.recipient_name || isEditing) && (
          <div 
            className={`${fadeClass} duration-[1500ms] text-[#C4A882] text-lg tracking-widest ${stage >= 2 || isEditing ? 'opacity-100' : 'opacity-0'} w-full flex justify-center`}
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {isEditing ? (
              <input 
                type="text" 
                value={editForm.recipient_name}
                onChange={e => setEditForm({...editForm, recipient_name: e.target.value})}
                className="bg-transparent border-b border-[rgba(196,168,130,0.4)] text-center text-[#C4A882] focus:outline-none focus:border-[#C4A882]/80 w-full max-w-[300px]"
                placeholder="For whom? (Optional)"
                disabled={saving}
              />
            ) : `For ${capsule.recipient_name}`}
          </div>
        )}

        {(capsule.recipient_name || isEditing) && <div className="h-[60px]"></div>}

        {/* 3: The Letter Heart (4s delay, 2.5s fade) */}
        <div className={`${fadeClass} duration-[2500ms] w-full flex justify-center ${stage >= 3 || isEditing ? 'opacity-100' : 'opacity-0'}`}>
          {isEditing ? (
             <textarea 
               value={editForm.message}
               onChange={e => {
                  setEditForm({...editForm, message: e.target.value});
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = '320px';
                  target.style.height = target.scrollHeight + 'px';
               }}
               className="bg-transparent border border-[rgba(196,168,130,0.2)] text-[#E8D9BB] text-[20px] leading-[2.0] w-full max-w-[580px] p-6 focus:outline-none focus:border-[rgba(196,168,130,0.5)] resize-none min-h-[400px] transition-colors"
               style={{ fontFamily: 'var(--font-eb-garamond)' }}
               disabled={saving}
             />
          ) : (
             <p 
               className={`whitespace-pre-wrap text-[#E8D9BB] text-[22px] leading-[2.0] w-full max-w-[580px] text-center drop-shadow-[0_0_15px_rgba(196,168,130,0.1)]`}
               style={{ fontFamily: 'var(--font-eb-garamond)' }}
             >
               {capsule.message}
             </p>
          )}
        </div>

        <div className="h-[80px]"></div>

        {/* 4: Sender (7.0s delay) */}
        {!isEditing && (
          <div 
            className={`${fadeClass} duration-[1500ms] text-[#E8D9BB] text-[18px] tracking-widest ${stage >= 4 ? 'opacity-100' : 'opacity-0'}`}
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            — {capsule.sender_name}
          </div>
        )}

        {/* Edit Mode Custom Footer */}
        {isEditing && (
          <div className="w-full max-w-[580px] mt-12 flex flex-col items-center gap-4 animate-[fadeIn_1s_forwards]">
             <label className="text-[10px] uppercase text-[#7A6A55] tracking-widest" style={{ fontFamily: 'var(--font-cormorant)' }}>Guardian Email (Optional)</label>
             <input 
                type="text" 
                value={editForm.guardian_email}
                onChange={e => setEditForm({...editForm, guardian_email: e.target.value})}
                className="bg-transparent border-b border-[rgba(196,168,130,0.4)] text-center text-[#E8D9BB] focus:outline-none focus:border-[#C4A882]/80 w-full max-w-[400px]"
                placeholder="guardian@example.com"
                disabled={saving}
              />
             
             {editError && <div className="text-[#C4A882] italic text-sm mt-4">{editError}</div>}
             <div className="flex gap-6 mt-8">
               <button onClick={() => setIsEditing(false)} disabled={saving} className="text-[#7A6A55] uppercase text-[10px] tracking-widest hover:text-white transition-colors px-6 py-2">CANCEL</button>
               <button onClick={handleSave} disabled={saving} className="border border-[#C4A882] text-[#C4A882] uppercase text-[10px] tracking-widest px-8 py-3 hover:bg-[rgba(196,168,130,0.1)] transition-colors disabled:opacity-50">
                 {saving ? 'CRYSTALLIZING...' : 'CRYSTALLIZE REVISIONS'}
               </button>
             </div>
          </div>
        )}

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

      {/* Revise Seal Button for Creators */}
      {isEditable && !isEditing && stage >= 7 && (
        <div className="mt-8 mb-4 w-full text-center flex flex-col items-center opacity-0 animate-[fadeIn_2s_forwards]">
          <p className="text-[10px] text-[#7A6A55] italic mb-4 max-w-xs" style={{ fontFamily: 'var(--font-cormorant)' }}>
             The seal has not yet crystallized. You have {Math.floor(24 - hoursSinceCreation)} hours remaining to make revisions.
          </p>
          <button 
             onClick={() => setIsEditing(true)}
             className="text-[#C4A882] border-b border-[#C4A882]/30 uppercase text-[9px] tracking-[0.2em] pb-1 hover:border-[#C4A882] transition-colors"
          >
             [ REVISE SEAL ]
          </button>
        </div>
      )}

      {/* 6 & 7: Footer Ghost sequence (10s and 13s delay) */}
      {!isEditing && (
        <div className={`mt-auto w-full text-center flex flex-col items-center relative z-10`}>
          <div 
            className={`text-[#3A2E22] text-[9px] tracking-[0.3em] uppercase mb-4 ${fadeClass} duration-[1500ms] ${stage >= 6 ? 'opacity-100' : 'opacity-0'}`}
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Preserved by EterniCapsule · Pyadra
          </div>
        
        <Link 
          href="/" 
          className={`mt-10 text-[#3A2E22] text-[10px] tracking-[0.3em] uppercase hover:text-[#C4A882] transition-colors duration-500 ${fadeClass} duration-[2000ms] ${stage >= 7 ? 'opacity-100' : 'opacity-0'}`}
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          [ RETURN TO PYADRA ]
        </Link>
      </div>
      )}
    </div>
  );
}

