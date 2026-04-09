'use client';

import { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { audioAPI } from "../../lib/audio";
import { motion, AnimatePresence } from 'framer-motion';

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
    const s1 = setTimeout(() => setStage(1), 300);   // ID + Date (reduced from 500ms)
    const s2 = setTimeout(() => setStage(2), 1500);  // Recipient (reduced from 2500ms)
    const s3 = setTimeout(() => setStage(3), 2500);  // Message (reduced from 4000ms)
    const s4 = setTimeout(() => setStage(4), 4500);  // Sender (reduced from 7000ms)
    const s5 = setTimeout(() => setStage(5), 5500);  // Opened Date (reduced from 8500ms)
    const s6 = setTimeout(() => setStage(6), 6500);  // Footer (reduced from 10000ms)
    const s7 = setTimeout(() => setStage(7), 9000);  // Ghost Archive append (reduced from 13000ms)
    
    return () => {
      clearTimeout(s1); clearTimeout(s2); clearTimeout(s3);
      clearTimeout(s4); clearTimeout(s5); clearTimeout(s6); clearTimeout(s7);
    };
  }, [type]);

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

  return (
    <div className="min-h-screen bg-[#000000] relative flex flex-col items-center justify-start pt-24 pb-16 px-6 select-none leading-relaxed overflow-x-hidden selection:bg-[#8A6B44] selection:text-[#000000]">
      
      {/* Deep Space Radial Gradient Background */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at 50% 50%, #040710 0%, #000000 60%)' }}></div>

      {/* Light Materialization Cross-Fade from unlock */}
      <div className={`fixed inset-0 z-[100] bg-[#8A6B44] pointer-events-none transition-opacity duration-[4000ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${lightFade ? 'opacity-100' : 'opacity-0'}`}></div>

      {/* Ambient background glow — 'as if the words themselves emit light' */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 mix-blend-screen opacity-100"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(138,107,68,0.05) 0%, rgba(0,0,0,0) 70%)' }}
      ></div>

      <div className="relative z-10 w-full max-w-[680px] flex flex-col items-center text-center mx-auto">
        
        {/* 1: Meta ID & Sealed Date (0.5s delay, 1.5s fade duration) */}
        <AnimatePresence>
          {stage >= 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5 }}
              className="flex flex-col items-center"
            >
              <div className="text-[10px] uppercase text-[#7A6A55] tracking-[0.4em] mb-4 font-mono">
                ETHERNICAPSULE · {capsule.id.split('-')[0]}-{capsule.id.split('-')[1]}
              </div>
              {type === 'sender' && (
                <div className="text-[#8B4444]/80 text-[10px] italic mb-2 tracking-widest uppercase font-mono">
                  PREVIEW MODE — SENDER ACCESS
                </div>
              )}
              <div 
                className="text-[#C4A882] text-sm italic font-light"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                Sealed on {sealedDate}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-[80px]"></div>

        {/* 2: Recipient (2.5s delay) */}
        <AnimatePresence>
          {(capsule.recipient_name || isEditing) && stage >= 2 && (
            <motion.div 
              initial={{ opacity: 0, filter: 'blur(5px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.5 }}
              className="text-[#C4A882] text-xl tracking-widest w-full flex justify-center italic"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              {isEditing ? (
                <input 
                  type="text" 
                  value={editForm.recipient_name}
                  onChange={e => setEditForm({...editForm, recipient_name: e.target.value})}
                  className="bg-transparent border-b border-[#C4A882]/20 text-center text-[#C4A882] focus:outline-none focus:border-[#C4A882] w-full max-w-[300px] pb-2 font-light"
                  placeholder="For whom? (Optional)"
                  disabled={saving}
                />
              ) : `For ${capsule.recipient_name}`}
            </motion.div>
          )}
        </AnimatePresence>

        {(capsule.recipient_name || isEditing) && <div className="h-[60px]"></div>}

        {/* 3: The Letter Heart (4s delay, Cinematic Decryption Blur) */}
        <AnimatePresence>
          {(stage >= 3 || isEditing) && (
            <motion.div 
              initial={{ opacity: 0, filter: 'blur(20px)', scale: 0.98 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              transition={{ duration: 3, ease: "easeOut" }}
              className="w-full max-w-4xl flex justify-center relative bg-[#0A0C16]/90 backdrop-blur-3xl border border-[#8A6B44]/30 p-8 md:p-12 rounded-xl shadow-[0_0_80px_rgba(0,0,0,1),inset_0_0_80px_rgba(138,107,68,0.03)] overflow-hidden group"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(138,107,68,0.1)_0%,_transparent_50%),radial-gradient(ellipse_at_bottom_left,_rgba(100,100,120,0.05)_0%,_transparent_50%)] pointer-events-none group-hover:scale-105 transition-transform duration-[3s]"></div>
              {isEditing ? (
                <div className="w-full relative z-10 text-left">
                  <textarea 
                    value={editForm.message}
                    onChange={e => {
                        setEditForm({...editForm, message: e.target.value});
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = '320px';
                        target.style.height = target.scrollHeight + 'px';
                    }}
                    className="bg-transparent border-none text-[#F5F0E6] text-[18px] md:text-[20px] leading-[2.2] w-full focus:outline-none resize-none min-h-[400px] transition-colors font-sans font-light"
                    disabled={saving}
                  />
                  {/* Underline focus effect */}
                  <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#8A6B44] to-transparent w-full scale-x-0 group-focus-within:scale-x-100 transition-transform duration-1000"></div>
                </div>
              ) : (
                <div className="w-full relative z-10 text-center md:text-left">
                  <p 
                    className="whitespace-pre-wrap text-[#F5F0E6] text-[16px] md:text-[18px] leading-[2.2] w-full font-sans font-light"
                    style={{ textShadow: '0 0 5px rgba(245,240,230,0.1)' }}
                  >
                    {capsule.message}
                  </p>
                </div>
              )}
              
              {/* Subtle corner accents */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#8A6B44]/60 transition-opacity duration-1000 opacity-50 group-hover:opacity-100"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#8A6B44]/60 transition-opacity duration-1000 opacity-50 group-hover:opacity-100"></div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-[80px]"></div>

        {/* 4: Sender (7.0s delay) */}
        {!isEditing && stage >= 4 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="text-[#E8D9BB] text-[20px] tracking-widest italic"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            — {capsule.sender_name}
          </motion.div>
        )}

        {/* Edit Mode Custom Footer */}
        {isEditing && (
          <div className="w-full max-w-[580px] mt-12 flex flex-col items-center gap-4 animate-[fadeIn_1s_forwards]">
             <label className="text-[10px] uppercase text-[#7A6A55] tracking-widest font-mono">Guardian Email (Optional)</label>
              {/* Guardian Focus Underline */}
              <div className="relative mt-2">
                 <input 
                    type="text" 
                    value={editForm.guardian_email}
                    onChange={e => setEditForm({...editForm, guardian_email: e.target.value})}
                    className="bg-transparent text-center text-[#F5E6CC] focus:outline-none w-full max-w-[400px] font-sans pb-2 peer relative z-10"
                    placeholder="guardian@example.com"
                    disabled={saving}
                  />
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10 group-focus-within/guard:bg-[#8A6B44]/20"></div>
                  <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#8A6B44] to-transparent w-full scale-x-0 peer-focus:scale-x-100 transition-transform duration-1000 z-20"></div>
              </div>
             
             {editError && <div className="text-[#8B4444] font-sans italic text-sm mt-4">{editError}</div>}
             <div className="flex gap-6 mt-10 w-full justify-center">
               <button onClick={() => setIsEditing(false)} disabled={saving} className="px-6 py-3 bg-[#8A6B44]/10 border border-[#8A6B44]/40 rounded-full text-[#F5E6CC] uppercase tracking-[0.2em] text-[10px] hover:bg-[#8A6B44]/30 transition-all duration-300 font-mono disabled:opacity-50">CANCEL</button>
               <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-[#8A6B44]/30 border border-[#8A6B44]/60 rounded-full text-[#F5E6CC] font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-[#8A6B44]/50 hover:shadow-[0_0_20px_rgba(138,107,68,0.5)] transition-all duration-300 font-mono disabled:opacity-50 min-w-[200px]">
                 {saving ? 'CRYSTALLIZING...' : 'CRYSTALLIZE REVISIONS'}
               </button>
             </div>
          </div>
        )}

        <div className="h-[60px]"></div>

        {/* 5: Opened Meta (8.5s delay) */}
        {openedDate && stage >= 5 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="text-[#7A6A55] text-[13px] font-sans font-light italic"
          >
            Opened on {openedDate}
          </motion.div>
        )}
      </div>

      <div className="h-[60px]"></div>

      {/* Revise Seal Button for Creators */}
      {isEditable && !isEditing && stage >= 7 && (
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 2 }}
           className="mt-8 mb-4 w-full text-center flex flex-col items-center"
        >
          <p className="text-[14px] text-[#7A6A55] italic mb-6 max-w-sm font-light font-sans">
             The seal has not yet crystallized completely. You have {Math.floor(24 - hoursSinceCreation)} hours remaining to make physical revisions.
          </p>
          <button 
             onClick={() => setIsEditing(true)}
             className="px-6 py-3 bg-[#8A6B44]/20 border border-[#8A6B44]/50 rounded-full text-[#F5E6CC] uppercase tracking-[0.2em] text-[10px] hover:bg-[#8A6B44]/40 hover:shadow-[0_0_20px_rgba(138,107,68,0.4)] transition-all duration-300 font-mono focus:outline-none"
          >
             REVISE SEAL
          </button>
        </motion.div>
      )}

      {/* 6 & 7: Footer Ghost sequence (10s and 13s delay) */}
      {!isEditing && (
        <div className="mt-auto w-full text-center flex flex-col items-center relative z-10">
          {stage >= 6 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              className="text-[#3A2E22] text-[10px] tracking-[0.3em] uppercase mb-6 font-mono"
            >
              Preserved by EterniCapsule · Pyadra
            </motion.div>
          )}
        
          {stage >= 7 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
            >
              <Link
                href="/"
                className="py-3 px-4 text-[#E8D9BB]/40 text-[10px] tracking-[0.3em] uppercase hover:text-[#C4A882] transition-colors duration-500 font-mono"
              >
                [ RETURN TO PYADRA ]
              </Link>
            </motion.div>
          )}
      </div>
      )}
    </div>
  );
}
