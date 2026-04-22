'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { audioAPI } from '../lib/audio';
import { motion, AnimatePresence } from 'framer-motion';

export default function ComposeForm() {
  const [step, setStep] = useState(0);
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

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (step === 1 && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    setError('');
    if (step === 1 && formData.message.trim().length < 5) {
      setError("Forge your truth. The void cannot be sealed.");
      return;
    }
    if (step === 2 && !formData.deliver_at) {
      setError("A chronometric coordinate must be set to ensure preservation.");
      return;
    }
    if (step === 3 && !formData.sender_name.trim()) {
      setError("We require your signature to seal the pact.");
      return;
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(prev => Math.max(0, prev - 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nextStep();
    }
  };

  const handleSubmit = async () => {
    setError('');

    if (!formData.sender_name.trim() || !formData.message.trim()) {
      setError("Your signature and message are required to preserve the ritual.");
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

  // Aura that grows as you type
  const activeGlow = formData.message.length > 5 ? Math.min(0.02 + (formData.message.length * 0.0002), 0.15) : 0;

  return (
    <div className="w-full h-full flex flex-col relative justify-center items-center px-6">

      {/* Background Aura */}
      <motion.div
        animate={{ opacity: transitioning ? 0 : 1 }}
        transition={{ duration: 2 }}
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
        style={{ background: `radial-gradient(circle at 50% 50%, rgba(138,107,68,${step === 1 ? activeGlow : 0.03}) 0%, rgba(0,0,0,0) 70%), radial-gradient(circle at 10% 10%, rgba(4,7,16,1) 0%, rgba(0,0,0,1) 100%)` }}
      ></motion.div>

      {/* Sealing Fade Out */}
      <div className={`fixed inset-0 z-50 bg-[var(--etn-earth)] flex flex-col items-center justify-center transition-opacity duration-[3000ms] pointer-events-none ${transitioning ? 'opacity-100' : 'opacity-0'}`}>
        <p className={`text-[var(--etn-copper)] italic text-sm tracking-wide font-light transition-opacity duration-[1500ms] ${transitioning ? 'opacity-100 delay-1000' : 'opacity-0'}`} style={{ fontFamily: 'var(--font-cormorant)' }}>
          Preparing the Threshold...
        </p>
      </div>

      {/* TOP NAVIGATION / GLOBALS */}
      <div className="absolute top-10 w-full flex justify-between px-10 z-50">
        <Link href="/exhibitions/galaxy/ethernicapsule" className="group flex items-center gap-3 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-full hover:bg-[var(--etn-copper)]/10 hover:border-[var(--etn-copper)]/40 transition-all duration-500 backdrop-blur-md pointer-events-auto" aria-label="Cancel and return to EterniCapsule landing page">
          <span className="text-[var(--etn-copper)] group-hover:-translate-x-1 transition-transform duration-500" aria-hidden="true">←</span>
          <span className="text-[var(--etn-bronze)]/80 group-hover:text-[var(--etn-cream)] text-xs tracking-wide uppercase font-mono transition-colors duration-500">
            ABANDON RITUAL
          </span>
        </Link>
        <div className="flex flex-col items-center gap-2">
          <div className="text-[var(--etn-bronze)]/80 tracking-widest text-xs uppercase font-medium bg-[var(--etn-earth)]/60 backdrop-blur-sm border border-[var(--etn-copper)]/10 px-4 py-2 rounded-full" style={{ fontFamily: 'var(--font-cormorant)' }} role="status" aria-live="polite" aria-label={`Step ${step + 1} of 4`}>
            [ THE RITUAL · ACT {step + 1}/4 ]
          </div>
          <div className="flex gap-2" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={4}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${i === step
                    ? 'bg-[var(--etn-bronze)] shadow-[0_0_8px_currentColor]'
                    : i < step
                      ? 'bg-[var(--etn-cream)] opacity-60'
                      : 'bg-[var(--etn-bronze)]/30'
                  }`}
                aria-label={`Step ${i + 1}${i === step ? ' (current)' : i < step ? ' (completed)' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CORE STEPPER */}
      <div className="w-full max-w-3xl relative z-20 flex flex-col items-center justify-center min-h-[60vh]">
        <AnimatePresence mode="wait">
          {/* ACT 0: INTENTION */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              exit={{ opacity: 0, filter: 'blur(10px)', y: -20, transition: { duration: 0.8 } }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full flex flex-col items-center text-center mt-20"
            >
              <h2 className="text-4xl md:text-6xl text-[var(--etn-cream)] italic mb-16 font-light drop-shadow-[0_0_10px_rgba(245,230,204,0.1)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                Who inherits this memory?
              </h2>
              <div className="relative w-full max-w-lg group">
                <input
                  type="text"
                  name="recipient_name"
                  value={formData.recipient_name}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="The recipient's name (Optional)"
                  className="w-full bg-transparent border-b border-white/10 text-center pb-4 text-[var(--etn-copper)] text-2xl focus:border-transparent focus:outline-none transition-all duration-700 placeholder-[var(--etn-cream)]/10 font-light z-10 relative"
                  autoFocus
                  aria-label="Recipient name (optional)"
                />
                {/* Animated Underline Glow */}
                <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--etn-copper)] to-transparent w-full scale-x-0 group-focus-within:scale-x-100 transition-transform duration-1000"></div>
              </div>
              <button onClick={nextStep} className="mt-20 px-10 py-4 bg-[var(--etn-copper)]/20 border border-[var(--etn-copper)]/50 rounded-full text-[var(--etn-cream)] font-bold uppercase tracking-wide text-xs hover:bg-[var(--etn-copper)]/40 hover:shadow-[0_0_25px_rgba(156,102,68,0.4)] transition-all duration-500 font-mono" aria-label="Continue to write message">
                Begin the Ritual →
              </button>
            </motion.div>
          )}

          {/* ACT 1: THE TEXT */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05, transition: { duration: 0.8 } }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full h-full flex flex-col items-center mt-20"
            >
              {/* Papel Holografico Oscuro - CONTRASTE MEJORADO */}
              <div className="w-full max-w-4xl bg-[var(--etn-soil)]/90 backdrop-blur-md border border-[var(--etn-copper)]/30 p-8 md:p-12 rounded-xl relative shadow-[0_0_80px_rgba(0,0,0,1),inset_0_0_80px_rgba(156,102,68,0.03)] overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(156,102,68,0.1)_0%,_transparent_50%),radial-gradient(ellipse_at_bottom_left,_rgba(100,100,120,0.05)_0%,_transparent_50%)] pointer-events-none group-hover:scale-105 transition-transform duration-[3s]"></div>

                <textarea
                  ref={textareaRef}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write everything that cannot be said today..."
                  className="w-full h-[50vh] md:h-[60vh] bg-transparent border-none text-[var(--etn-parchment)] text-lg md:text-xl leading-[2] focus:outline-none resize-none placeholder-[var(--etn-cream)]/20 font-light font-sans relative z-10"
                  style={{ textShadow: '0 0 20px rgba(245,240,230,0.1)' }}
                />

                {/* Subtle corner accents */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[var(--etn-copper)]/60 transition-opacity duration-1000 opacity-50 group-hover:opacity-100"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[var(--etn-copper)]/60 transition-opacity duration-1000 opacity-50 group-hover:opacity-100"></div>
              </div>

              {error && step === 1 && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[var(--etn-rust)] font-sans text-[13px] mt-6 text-center max-w-md font-light bg-[var(--etn-rust)]/5 px-4 py-2 rounded-md border border-[var(--etn-rust)]/20">
                  {error}
                </motion.p>
              )}

              {/* BOTONES MAS VISIBLES ABAJO EN LUGAR DE ARRIBA */}
              <div className="w-full max-w-4xl flex justify-between items-center mt-6 px-4">
                <button onClick={prevStep} className="px-6 py-3 bg-[var(--etn-copper)]/10 border border-[var(--etn-copper)]/40 rounded-full text-[var(--etn-cream)] uppercase tracking-wide text-xs hover:bg-[var(--etn-copper)]/30 transition-all duration-300 font-mono">
                  ← Return
                </button>
                <p className="text-[var(--etn-bronze)]/70 uppercase text-xs tracking-widest font-mono drop-shadow-[0_0_5px_rgba(201,169,97,0.5)] hidden md:block">The Void Listens</p>
                <button onClick={nextStep} className="px-8 py-3 bg-[var(--etn-copper)]/30 border border-[var(--etn-copper)]/60 rounded-full text-[var(--etn-cream)] font-bold uppercase tracking-wide text-xs hover:bg-[var(--etn-copper)]/50 hover:shadow-[0_0_20px_rgba(156,102,68,0.5)] transition-all duration-300 font-mono">
                  Seal Letter →
                </button>
              </div>
            </motion.div>
          )}

          {/* ACT 2: GUARDIANS */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.8 } }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full flex flex-col items-center text-center mt-20"
            >
              <h2 className="text-4xl md:text-5xl text-[var(--etn-cream)] italic mb-4 font-light drop-shadow-[0_0_15px_rgba(245,230,204,0.1)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                Who will guard the key?
              </h2>
              <p className="text-[var(--etn-cream)]/40 text-[16px] leading-relaxed mb-16 font-light max-w-md font-sans">
                The pact requires guardians. They hold the code until the time is right. (Optional)
              </p>

              <div className="relative w-full max-w-lg group mb-16">
                <input
                  type="text"
                  name="guardian_email"
                  value={formData.guardian_email}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Emails of the custodians (comma-separated)"
                  className="w-full bg-transparent border-b border-white/10 text-center pb-4 text-[var(--etn-copper)] text-lg focus:border-transparent focus:outline-none transition-all duration-700 placeholder-[var(--etn-cream)]/10 font-sans font-light z-10 relative"
                  autoFocus
                />
                <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--etn-copper)] to-transparent w-full scale-x-0 group-focus-within:scale-x-100 transition-transform duration-1000"></div>
              </div>

              <div className="w-full max-w-lg flex flex-col items-center bg-[var(--etn-soil)]/90 backdrop-blur-sm border border-[var(--etn-copper)]/30 shadow-[0_0_40px_rgba(0,0,0,0.8)] py-10 rounded-xl hover:border-[var(--etn-copper)]/50 transition-all duration-500 relative group">
                <div className="absolute inset-0 bg-[var(--etn-copper)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-xl pointer-events-none"></div>
                <label className="text-[var(--etn-copper)] text-xs uppercase tracking-wide mb-6 font-mono drop-shadow-[0_0_5px_rgba(156,102,68,0.4)]">Chronometric Seal (Unlock Date)</label>
                <input
                  type="date"
                  name="deliver_at"
                  value={formData.deliver_at}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="bg-transparent border-b border-[var(--etn-copper)]/40 text-center pb-2 text-[var(--etn-cream)] focus:border-[var(--etn-copper)] focus:text-[var(--etn-cream)] focus:outline-none transition-all duration-700 text-xl font-sans [color-scheme:dark]"
                />
              </div>

              {error && step === 2 && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[var(--etn-rust)] font-sans text-[13px] mt-4 text-center max-w-md font-light bg-[var(--etn-rust)]/5 px-4 py-2 rounded-md border border-[var(--etn-rust)]/20">
                  {error}
                </motion.p>
              )}

              <div className="mt-20 w-full flex justify-between max-w-md items-center">
                <button onClick={prevStep} className="px-6 py-3 bg-[var(--etn-copper)]/10 border border-[var(--etn-copper)]/40 rounded-full text-[var(--etn-cream)] uppercase tracking-wide text-xs hover:bg-[var(--etn-copper)]/30 transition-all duration-300 font-mono">
                  ← Return
                </button>
                <button onClick={nextStep} className="px-8 py-3 bg-[var(--etn-copper)]/30 border border-[var(--etn-copper)]/60 rounded-full text-[var(--etn-cream)] font-bold uppercase tracking-wide text-xs hover:bg-[var(--etn-copper)]/50 hover:shadow-[0_0_20px_rgba(156,102,68,0.5)] transition-all duration-300 font-mono">
                  Proceed to Sign →
                </button>
              </div>
            </motion.div>
          )}

          {/* ACT 3: SIGNATURE & OFFERING */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full flex flex-col items-center text-center mt-12"
            >
              <h2 className="text-4xl md:text-6xl text-[var(--etn-cream)] italic mb-6 font-light drop-shadow-[0_0_15px_rgba(245,230,204,0.1)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                The Cryptographic Seal
              </h2>
              <p className="text-[var(--etn-cream)]/40 text-[16px] leading-relaxed mb-12 font-light max-w-md font-sans">
                Sign with the name you wish to be remembered by.
              </p>

              <div className="relative w-full max-w-lg mb-12 group">
                <input
                  type="text"
                  name="sender_name"
                  value={formData.sender_name}
                  onChange={handleChange}
                  placeholder="Your Signature"
                  className="w-full bg-transparent border-b border-[var(--etn-copper)]/20 text-center pb-4 text-[var(--etn-copper)] text-2xl focus:border-transparent focus:outline-none transition-all duration-700 placeholder-[var(--etn-cream)]/15 italic font-light tracking-wide relative z-10"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                  autoFocus
                />
                <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--etn-copper)] to-transparent w-full scale-x-0 group-focus-within:scale-x-100 transition-transform duration-1000"></div>
              </div>

              {/* Psychological Terminal Checkout Readout */}
              <div className="w-full max-w-md bg-[var(--etn-soil)]/90 border border-[var(--etn-copper)]/40 p-8 rounded-xl text-left mb-12 shadow-[0_0_40px_rgba(0,0,0,1)] backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--etn-copper)] opacity-5 blur-[80px] pointer-events-none"></div>
                <div className="text-[var(--etn-copper)]/80 text-xs uppercase font-mono tracking-wide mb-4 border-b border-white/5 pb-2 drop-shadow-[0_0_5px_rgba(156,102,68,0.2)]">Rite parameters confirmed</div>
                <ul className="text-[var(--etn-cream)]/70 text-xs font-mono leading-[2.2] tracking-wide space-y-2 relative z-10">
                  <li><span className="text-[var(--etn-copper)]">Geometry:</span> {formData.message.trim().split(/\s+/).length} words stabilized.</li>
                  <li><span className="text-[var(--etn-copper)]">Recipient:</span> {formData.recipient_name || 'The Void'}</li>
                  <li><span className="text-[var(--etn-copper)]">Chronometric Lock:</span> {formData.deliver_at || 'Pending Temporal Alignment'}</li>
                </ul>
                <div className="mt-8 text-[var(--etn-rust)]/80 text-xs font-mono leading-relaxed border-t border-[var(--etn-rust)]/20 pt-6 uppercase tracking-widest bg-gradient-to-b from-transparent to-[var(--etn-rust)]/5 -mx-8 -mb-8 px-8 pb-8">
                  <span className="text-[var(--etn-rust)] font-bold">WARNING:</span> Once the $9 AUD toll is injected, the 256-bit private key will be forged. This message will vanish from your device permanently.
                </div>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[var(--etn-rust)] font-sans text-[13px] mb-8 pb-2 text-center max-w-md font-light bg-[var(--etn-rust)]/5 px-4 py-2 rounded-md border border-[var(--etn-rust)]/20">
                  {error}
                </motion.p>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || transitioning}
                className="group relative overflow-hidden bg-[var(--etn-earth)] border border-[var(--etn-copper)]/40 px-20 py-6 text-center transition-all duration-1000 hover:border-[var(--etn-copper)] hover:shadow-[0_0_50px_rgba(156,102,68,0.3)] disabled:opacity-50 disabled:hover:shadow-none min-w-[300px] rounded-lg"
              >
                {!loading && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--etn-copper)]/20 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover:animate-[shimmer_1.5s_infinite]"></div>}
                <span className="relative z-10 text-[var(--etn-cream)] tracking-wide text-xs uppercase font-mono font-bold flex items-center justify-center gap-3 drop-shadow-[0_0_8px_rgba(232,217,208,0.4)]">
                  {loading ? (
                    <>
                      <span className="w-1.5 h-1.5 bg-[var(--etn-copper)] rounded-full animate-ping shadow-[0_0_10px_var(--etn-copper)]"></span>
                      Forging Key...
                    </>
                  ) : 'INJECT TOLL ($9 AUD) & SEAL'}
                </span>
              </button>

              <button onClick={prevStep} className="mt-12 text-[var(--etn-cream)]/20 uppercase tracking-wide text-xs hover:text-[var(--etn-copper)] transition-colors font-mono">
                ← Modify Parameters
              </button>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
