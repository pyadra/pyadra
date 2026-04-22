'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Capsule3D from '../Capsule3D';
import { audioAPI } from '../lib/audio';

export default function ComposeFormUnified() {
  const [formData, setFormData] = useState({
    sender_name: '',
    recipient_name: '',
    message: '',
    guardian_email: '',
    deliver_at: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transitioning, setTransitioning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Progressive revelation state (ONLY for left sidebar fields)
  const [revealedFields, setRevealedFields] = useState<string[]>(['recipient_name']);

  // Word count and glow calculations
  const wordCount = formData.message.trim().split(/\s+/).filter(Boolean).length;
  const glow = Math.min(wordCount / 500, 1);

  // Field completion status
  const isRecipientComplete = formData.recipient_name.trim().length > 0;
  const isDateComplete = formData.deliver_at !== '' && new Date(formData.deliver_at) > new Date();
  const isSignatureComplete = formData.sender_name.trim().length > 0;
  const isGuardianComplete = formData.guardian_email.trim().length > 0 && formData.guardian_email.includes('@');
  const isMessageComplete = formData.message.trim().length > 10;

  // Validation - all fields required
  const canSeal = isDateComplete && isSignatureComplete && isGuardianComplete && isMessageComplete;

  // Capsule completion intensity (0-1 based on completed fields)
  const completionFields = [isRecipientComplete, isDateComplete, isSignatureComplete, isGuardianComplete, isMessageComplete];
  const completionRatio = completionFields.filter(Boolean).length / completionFields.length;
  const capsuleGlow = Math.max(glow, completionRatio);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // Progressive field revelation (ONLY for sidebar, NOT for textarea)
  useEffect(() => {
    if (isRecipientComplete && !revealedFields.includes('deliver_at')) {
      setTimeout(() => setRevealedFields(prev => [...prev, 'deliver_at']), 500);
    }
    if (isDateComplete && !revealedFields.includes('sender_name')) {
      setTimeout(() => setRevealedFields(prev => [...prev, 'sender_name']), 500);
    }
    if (isSignatureComplete && !revealedFields.includes('guardian_email')) {
      setTimeout(() => setRevealedFields(prev => [...prev, 'guardian_email']), 500);
    }
  }, [isRecipientComplete, isDateComplete, isSignatureComplete, revealedFields]);

  const handleSubmit = async () => {
    setError('');

    if (!formData.sender_name.trim() || !formData.message.trim()) {
      setError("Your signature and message are required to preserve the ritual.");
      return;
    }

    if (!formData.deliver_at) {
      setError("A chronometric coordinate must be set to ensure preservation.");
      return;
    }

    if (!formData.guardian_email.trim()) {
      setError("A guardian is required to hold the key.");
      return;
    }

    setLoading(true);

    try {
      localStorage.setItem('etn_draft', JSON.stringify(formData));

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
        }, 1500);
      } else {
        setError(data.error || "The preservation portal did not respond. Try again.");
        setLoading(false);
      }
    } catch {
      setError("Connection shattered during the sealing. Try again.");
      setLoading(false);
    }
  };

  // Auto-scroll textarea into view on mobile when focused
  useEffect(() => {
    if (textareaRef.current) {
      const handleFocus = () => {
        setTimeout(() => {
          textareaRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 300);
      };

      textareaRef.current.addEventListener('focus', handleFocus);
      return () => textareaRef.current?.removeEventListener('focus', handleFocus);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--etn-earth)] relative">

      {/* Sealing Transition Overlay */}
      <div className={`fixed inset-0 z-50 bg-[var(--etn-earth)] flex flex-col items-center justify-center transition-opacity duration-[3000ms] pointer-events-none ${transitioning ? 'opacity-100' : 'opacity-0'}`}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2 }}
          className="flex flex-col items-center"
        >
          <Capsule3D isSealed={false} isSealing={true} />
          <p className="text-[var(--etn-bronze)] text-sm uppercase tracking-[0.3em] mt-12 font-mono animate-pulse">
            Forging the Seal...
          </p>
        </motion.div>
      </div>

      {/* Back Button - Subtle top-left */}
      <a
        href="/exhibitions/galaxy/ethernicapsule"
        className="fixed top-6 left-6 z-30 text-[var(--etn-ash)]/40 hover:text-[var(--etn-copper)] transition-colors duration-300 text-sm font-mono uppercase tracking-widest"
      >
        ← Step Away
      </a>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">

        {/* Desktop: 2 columns | Mobile: Stack */}
        <div className="lg:grid lg:grid-cols-[450px_1fr] lg:gap-20">

          {/* LEFT COLUMN - Capsule + Inputs (Progressive) */}
          <div className="lg:sticky lg:top-8 lg:self-start">

            {/* Capsule 3D - LARGER and more reactive */}
            <motion.div
              className="flex justify-center mb-8"
              animate={{
                scale: 1 + (capsuleGlow * 0.1)
              }}
              transition={{ duration: 0.8 }}
            >
              <div className="scale-[0.65] md:scale-90 lg:scale-100">
                <Capsule3D
                  isSealed={false}
                  isSealing={false}
                  glowIntensity={capsuleGlow}
                />
              </div>
            </motion.div>

            {/* Progressive Fields - BALANCED */}
            <div className="space-y-4">

              {/* FIELD 1: For (Always visible) */}
              <FieldTablet
                label="For"
                isComplete={isRecipientComplete}
                isRevealed={true}
              >
                <input
                  name="recipient_name"
                  value={formData.recipient_name}
                  onChange={handleChange}
                  placeholder="Their name (optional)"
                  className="w-full bg-transparent border-none text-[var(--etn-cream)] text-base font-serif italic focus:outline-none placeholder:text-[var(--etn-cream)]/20"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                  autoFocus
                />
                <p className="text-[var(--etn-ash)]/40 text-xs mt-1 leading-normal">
                  Who inherits this memory?
                </p>
              </FieldTablet>

              {/* FIELD 2: Opens (Revealed after recipient) */}
              {revealedFields.includes('deliver_at') && (
                <FieldTablet
                  label="Opens"
                  isComplete={isDateComplete}
                  isRevealed={true}
                >
                  <input
                    type="date"
                    name="deliver_at"
                    value={formData.deliver_at}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-transparent border-none text-[var(--etn-cream)] text-base font-mono focus:outline-none [color-scheme:dark]"
                  />
                  <p className="text-[var(--etn-ash)]/40 text-xs mt-1 leading-normal">
                    The seal breaks on this date.
                  </p>
                </FieldTablet>
              )}

              {/* FIELD 3: Your Signature (Revealed after date) */}
              {revealedFields.includes('sender_name') && (
                <FieldTablet
                  label="Your Signature"
                  isComplete={isSignatureComplete}
                  isRevealed={true}
                >
                  <input
                    name="sender_name"
                    value={formData.sender_name}
                    onChange={handleChange}
                    placeholder="The name you wish to be remembered by"
                    className="w-full bg-transparent border-none text-[var(--etn-cream)] text-base font-serif italic focus:outline-none placeholder:text-[var(--etn-cream)]/20"
                    style={{ fontFamily: 'var(--font-cormorant)' }}
                  />
                  <p className="text-[var(--etn-ash)]/40 text-xs mt-1 leading-normal">
                    How shall you be known?
                  </p>
                </FieldTablet>
              )}

              {/* FIELD 4: Guardian (Revealed after signature) */}
              {revealedFields.includes('guardian_email') && (
                <FieldTablet
                  label="Guardian Email"
                  isComplete={isGuardianComplete}
                  isRevealed={true}
                >
                  <input
                    type="email"
                    name="guardian_email"
                    value={formData.guardian_email}
                    onChange={handleChange}
                    placeholder="guardian@example.com"
                    required
                    className="w-full bg-transparent border-none text-[var(--etn-cream)] text-base focus:outline-none placeholder:text-[var(--etn-cream)]/20"
                  />
                  <p className="text-[var(--etn-ash)]/40 text-xs mt-1 leading-normal">
                    They will hold the key until the moment arrives.
                  </p>
                </FieldTablet>
              )}

            </div>
          </div>

          {/* RIGHT COLUMN - Message (ALWAYS VISIBLE) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mt-8 lg:mt-0"
          >
                <h2 className="text-2xl md:text-3xl font-serif italic text-[var(--etn-cream)] mb-6 leading-tight" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  What must be said?
                </h2>

                <motion.div
                  animate={{
                    boxShadow: `0 0 ${30 + wordCount * 1.5}px rgba(156,102,68,${glow * 0.4}), inset 0 0 60px rgba(156,102,68,${glow * 0.08})`,
                    borderColor: isMessageComplete
                      ? `rgba(156,102,68,0.8)`
                      : `rgba(156,102,68,0.3)`
                  }}
                  className="bg-[var(--etn-soil)]/90 border-2 rounded-2xl p-6 md:p-8 relative group"
                  transition={{ duration: 0.5 }}
                >
                  <textarea
                    ref={textareaRef}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write what cannot be spoken today..."
                    className="w-full h-[35vh] md:h-[40vh] bg-transparent text-lg md:text-xl leading-[1.8] md:leading-[2] font-serif text-[var(--etn-parchment)] focus:outline-none resize-none placeholder:text-[var(--etn-cream)]/15"
                    style={{ fontFamily: 'var(--font-cormorant)' }}
                  />

                  {/* Word Counter */}
                  {wordCount > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 + (glow * 0.4) }}
                      className="absolute bottom-6 right-6 text-[var(--etn-bronze)]/70 text-sm font-mono"
                    >
                      {wordCount} {wordCount === 1 ? 'stroke' : 'strokes'}
                    </motion.div>
                  )}

                  {/* Checkmark when complete */}
                  {isMessageComplete && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-6 right-6 text-[var(--etn-bronze)] text-3xl"
                    >
                      ✓
                    </motion.div>
                  )}

                  {/* Corner Accents */}
                  <motion.div
                    className="absolute top-4 left-4 border-t-2 border-l-2 border-[var(--etn-copper)]/40 rounded-tl-lg"
                    animate={{
                      width: 16 + (glow * 32),
                      height: 16 + (glow * 32),
                      opacity: 0.4 + (glow * 0.5)
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.div
                    className="absolute bottom-4 right-4 border-b-2 border-r-2 border-[var(--etn-copper)]/40 rounded-br-lg"
                    animate={{
                      width: 16 + (glow * 32),
                      height: 16 + (glow * 32),
                      opacity: 0.4 + (glow * 0.5)
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 text-center text-[var(--etn-rust)] text-sm bg-[var(--etn-rust)]/5 border border-[var(--etn-rust)]/20 rounded-lg px-4 py-3"
                  >
                    {error}
                  </motion.div>
                )}

                {/* SEAL BUTTON - Simple, below textarea */}
                <AnimatePresence>
                  {canSeal && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.5 }}
                      className="mt-8 flex justify-center"
                    >
                      <button
                        onClick={handleSubmit}
                        disabled={loading || transitioning}
                        className="group relative overflow-hidden bg-transparent border border-[var(--etn-copper)]/40 px-8 py-4 text-center transition-all duration-700 hover:border-[var(--etn-copper)] hover:shadow-[0_0_30px_rgba(156,102,68,0.2)] rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--etn-copper)]/10 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover:animate-[shimmer_2s_infinite]"></div>

                        {loading || transitioning ? (
                          <span className="relative z-10 text-[var(--etn-cream)]/90 tracking-widest text-xs uppercase font-mono">
                            Forging the Seal...
                          </span>
                        ) : (
                          <span className="relative z-10 text-[var(--etn-cream)]/90 group-hover:text-[var(--etn-cream)] tracking-widest text-xs uppercase font-mono transition-colors duration-700">
                            Strike the Metal — $9 AUD
                          </span>
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

        </div>
      </div>

    </div>
  );
}

// FieldTablet Component - BALANCED
interface FieldTabletProps {
  label: string;
  isComplete: boolean;
  isRevealed: boolean;
  children: React.ReactNode;
}

function FieldTablet({ label, isComplete, isRevealed, children }: FieldTabletProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{
        opacity: isRevealed ? 1 : 0,
        y: isRevealed ? 0 : 10,
        scale: isRevealed ? 1 : 0.98
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        animate={{
          borderColor: isComplete
            ? 'rgba(156,102,68,0.6)'
            : 'rgba(156,102,68,0.3)',
          boxShadow: isComplete
            ? '0 0 20px rgba(156,102,68,0.25), inset 0 0 30px rgba(156,102,68,0.06)'
            : '0 0 0px rgba(156,102,68,0)'
        }}
        className="bg-[var(--etn-soil)]/75 border rounded-lg p-2 relative group hover:border-[var(--etn-copper)]/50 transition-all"
        transition={{ duration: 0.4 }}
      >
        {/* Label - Readable */}
        <div className="flex items-center justify-between mb-1">
          <label className="text-[var(--etn-bronze-bright)] text-xs uppercase tracking-[0.2em] font-mono font-bold">
            {label}
          </label>
          {/* Checkmark when complete */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                className="text-[var(--etn-bronze)] text-xl"
              >
                ✓
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Field content */}
        {children}

        {/* Glow effect when complete */}
        {isComplete && (
          <div className="absolute inset-0 bg-[var(--etn-copper)] opacity-5 rounded-lg pointer-events-none" />
        )}
      </motion.div>
    </motion.div>
  );
}
