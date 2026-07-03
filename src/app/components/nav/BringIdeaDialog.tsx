'use client';

/* ------------------------------------------------------------------ */
/*  PYADRA · BringIdeaDialog — the "Bring your idea" form.             */
/*  Opened from SiteNav. Sends to /api/contact → pyadra@pyadra.io.     */
/* ------------------------------------------------------------------ */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Field({
  label, value, onChange, type = 'text', required = false, placeholder, textarea = false, autoFocus = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: 'text' | 'email';
  required?: boolean;
  placeholder?: string;
  textarea?: boolean;
  autoFocus?: boolean;
}) {
  const cls = 'w-full bg-transparent border-0 border-b border-[#1A1C1A]/15 rounded-none px-0 py-2 text-sm text-[#1A1C1A] placeholder:text-[#6B8070]/60 focus:outline-none focus:border-[#059669] transition-colors';
  return (
    <label className="block">
      <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-[#6B8070] mb-0.5">
        {label} {required && <span className="text-[#059669]">*</span>}
      </span>
      {textarea ? (
        <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${cls} resize-none`} />
      ) : (
        <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus} className={cls} />
      )}
    </label>
  );
}

export default function BringIdeaDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!open) return;
    setStatus('idle');
    setErrorMsg('');
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'bring-your-idea',
          project: 'Pyadra',
          model: 'Bring your idea',
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to send');
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
        >
          <motion.div
            className="absolute inset-0 bg-[#0A120E]/40 backdrop-blur-sm"
            onClick={status === 'sending' ? undefined : onClose}
          />
          <motion.div
            role="dialog" aria-modal="true"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            className="relative z-10 w-full max-w-md rounded-[28px] bg-white shadow-2xl ring-1 ring-[#1A1C1A]/8 max-h-[92vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#EDEFED] text-[#3A4A3E] flex items-center justify-center font-mono text-sm font-bold hover:bg-[#059669]/10 hover:text-[#059669] transition-colors"
            >
              ✕
            </button>

            {status === 'success' ? (
              <div className="p-8 text-center">
                <div className="inline-flex w-12 h-12 items-center justify-center rounded-full bg-[#059669]/10 text-[#059669] text-base font-bold mb-4">✓</div>
                <h3 className="font-serif italic text-2xl text-[#1A1C1A] mb-2">Got it.</h3>
                <p className="text-sm text-[#3A4A3E] leading-relaxed mb-6 max-w-xs mx-auto">
                  Your idea is in the museum&rsquo;s inbox. We&rsquo;ll read it and reply personally.
                </p>
                <button type="button" onClick={onClose} className="font-mono text-[13px] font-semibold text-[#059669] hover:underline">Close</button>
              </div>
            ) : (
              <form onSubmit={submit} className="p-6 md:p-8">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#059669] mb-2">
                  Pyadra · Bring your idea
                </div>
                <h3 className="font-serif text-2xl font-light italic leading-tight mb-2">
                  Show us what you&rsquo;re building.
                </h3>
                <p className="text-sm text-[#3A4A3E] leading-relaxed mb-5">
                  Have a project or an idea that belongs in a Pyadra exhibition? Tell us about it — it goes straight to the museum&rsquo;s inbox.
                </p>

                <div className="space-y-4">
                  <Field label="Name" value={name} onChange={setName} required autoFocus />
                  <Field label="Email" type="email" value={email} onChange={setEmail} required />
                  <Field
                    label="Your idea"
                    placeholder="What is it, and why should it live in the museum?"
                    value={message}
                    onChange={setMessage}
                    textarea
                    required
                  />
                </div>

                {status === 'error' && (
                  <p className="text-[13px] text-red-700 mt-3">
                    {errorMsg || 'Something went wrong.'} Email <a href="mailto:pyadra@pyadra.io" className="underline font-semibold">pyadra@pyadra.io</a> instead.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending' || !name.trim() || !email.trim() || !message.trim()}
                  className="mt-6 w-full rounded-full bg-[#059669] text-white py-3.5 font-mono text-[13px] font-semibold shadow-md shadow-[#059669]/15 disabled:opacity-50 uppercase tracking-[0.18em]"
                >
                  {status === 'sending' ? 'Sending…' : 'Send your idea'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
