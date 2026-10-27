'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TYPE } from '@/app/components/ui/type';
import type { Option, Room } from '../rooms';

/* The two doors a project dashboard opens (room/ProjectDashboard.tsx).
   InterestDialog — a conversation: acquire, operate, make an offer, follow.
     Goes to /api/contact as 'express-interest', so the inbox knows the
     project and the option the visitor chose.
   SupportDialog — Orbit 77's contribution layers: a real Stripe checkout
     through /api/donate, or a private note for the largest. Its strings
     are Orbit's copy deck (04_Projects/Orbit77.md, "Lock In dialog"). */

const CONTACT_EMAIL = 'pyadra@pyadra.io';

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
  const field =
    'w-full bg-transparent border-0 border-b border-ink/15 rounded-none px-0 py-2 font-sans text-sm text-ink placeholder:text-ink-mute/60 focus:outline-none focus:border-accent transition-colors';
  return (
    <label className="block">
      <span className={`block mb-0.5 ${TYPE.label}`}>
        {label} {required && <span className="text-accent">*</span>}
      </span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder} required={required} className={`${field} resize-none`} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} autoFocus={autoFocus} className={field} />
      )}
    </label>
  );
}

function Shell({ open, onClose, busy, children }: { open: boolean; onClose: () => void; busy: boolean; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !busy && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, busy, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
          <div className="absolute inset-0 bg-ink/35 backdrop-blur-sm" onClick={busy ? undefined : onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            className="relative z-10 w-full max-w-md max-h-[92vh] overflow-y-auto rounded-[28px] bg-white shadow-2xl ring-1 ring-ink/8"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 flex w-8 h-8 items-center justify-center rounded-full bg-paper text-ink-soft border-0 cursor-pointer hover:bg-accent/10 hover:text-accent-deep transition-colors"
            >
              ✕
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Sent({ title, line, onClose }: { title: string; line: string; onClose: () => void }) {
  return (
    <div className="p-8 text-center">
      <div className="inline-flex w-12 h-12 items-center justify-center rounded-full bg-accent/10 text-accent-deep font-bold mb-4">✓</div>
      <h3 className={`${TYPE.title} mb-2`}>{title}</h3>
      <p className={`mx-auto mb-6 max-w-xs ${TYPE.small}`}>{line}</p>
      <button type="button" onClick={onClose} className="bg-transparent border-0 cursor-pointer font-sans text-[13px] font-semibold text-accent-deep hover:underline">Close</button>
    </div>
  );
}

const submitClass =
  'mt-6 w-full rounded-full bg-ink px-5 py-3.5 font-sans text-sm font-semibold text-white border-0 cursor-pointer transition-colors hover:bg-accent-deep disabled:opacity-50 disabled:cursor-default';

export function InterestDialog({
  open, onClose, project, option, kind, person,
}: {
  open: boolean;
  onClose: () => void;
  project: string;
  option: Option;
  kind: Room['ways']['kind'];
  /** First name of the person who answers, when the project has one. */
  person: string | null;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const offer = option.price === 'Let’s talk';
  const follow = kind === 'forming' && !offer;
  const who = person ?? 'Pyadra';

  useEffect(() => {
    if (open) setStatus('idle');
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || (offer && !message.trim())) return;
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'express-interest', project, model: option.name, name: name.trim(), email: email.trim(), message: message.trim() || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to send');
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <Shell open={open} onClose={onClose} busy={status === 'sending'}>
      {status === 'success' ? (
        <Sent
          title={follow ? 'You’re on the list.' : 'Got it.'}
          line={follow ? `We’ll write when ${project} is ready to meet.` : `Your note has reached ${who}. Expect a reply within a few days.`}
          onClose={onClose}
        />
      ) : (
        <form onSubmit={submit} className="p-6 md:p-8">
          <p className={`${TYPE.label} text-accent-deep mb-2`}>{project} · {option.name}</p>
          <h3 className={`${TYPE.title} mb-2`}>{follow ? `Follow ${project}.` : offer ? 'Tell us the structure you have in mind.' : `Talk with ${who}.`}</h3>
          <p className={`mb-5 ${TYPE.small}`}>
            {follow
              ? 'Leave your email. One note when it opens, nothing else.'
              : offer
                ? 'Upfront, share, hosted or independent: sketch it, and we reply directly.'
                : `Leave your details. ${who} answers personally, and every deal starts as a conversation.`}
          </p>
          <div className="space-y-4">
            <Field label="Name" value={name} onChange={setName} required autoFocus />
            <Field label="Email" type="email" value={email} onChange={setEmail} required />
            {!follow && (
              <Field
                label={offer ? 'Your offer' : 'Short note'}
                placeholder={offer ? 'e.g. a smaller start, a partnership, or taking it independent' : 'optional'}
                value={message}
                onChange={setMessage}
                textarea
                required={offer}
              />
            )}
          </div>
          {status === 'error' && (
            <p className="mt-3 font-sans text-[13px] text-red-700">
              {error || 'Something went wrong.'} Write to {CONTACT_EMAIL} instead.
            </p>
          )}
          <button type="submit" disabled={status === 'sending' || !name.trim() || !email.trim() || (offer && !message.trim())} className={submitClass}>
            {status === 'sending' ? 'Sending…' : follow ? 'Follow →' : 'Send →'}
          </button>
        </form>
      )}
    </Shell>
  );
}

export function SupportDialog({ open, onClose, option }: { open: boolean; onClose: () => void; option: Option }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const isForm = !option.checkout;

  useEffect(() => {
    if (open) setStatus('idle');
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || (isForm && (!name.trim() || !message.trim()))) return;
    setStatus('sending');
    setError('');
    try {
      if (option.checkout) {
        const res = await fetch('/api/donate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            intent: 'orbit-support',
            amount: option.checkout * 100,
            project_id: 'orbit-77',
            currency: 'AUD',
            supporter_name: name.trim() || 'Anonymous',
            supporter_email: email.trim(),
            is_anonymous: !name.trim(),
            support_message: message.trim(),
          }),
        });
        const data = await res.json();
        if (data?.url) {
          window.location.href = data.url;
          return; // the browser is on its way to Stripe
        }
        throw new Error(data?.error || 'Unable to start checkout');
      }
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'express-interest', project: 'Orbit 77', model: option.name, name: name.trim(), email: email.trim(), message: message.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to send');
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <Shell open={open} onClose={onClose} busy={status === 'sending'}>
      {status === 'success' ? (
        <Sent title="Transmission recorded." line="Pablo has received your note. He’ll reach out personally." onClose={onClose} />
      ) : (
        <form onSubmit={submit} className="p-6 md:p-8">
          <p className={`${TYPE.label} text-accent-deep mb-2`}>{isForm ? 'Orbit 77 · Private channel' : 'Orbit 77 · Lock In Your Frequency'}</p>
          <h3 className={`${TYPE.title} mb-2`}>{isForm ? 'Tell us the structure you’re thinking.' : `Lock in: ${option.name}.`}</h3>
          <p className={`mb-5 ${TYPE.small}`}>
            {isForm
              ? 'Sketch the kind of involvement you have in mind: sponsorship, a larger contribution, a partnership. We reply directly.'
              : `Your credential (O77-S1-XXXXXX) is delivered to your email after Stripe checkout.${(option.checkout ?? 0) >= 100 ? ' For ranges, the exact final amount is set at checkout.' : ''}`}
          </p>
          <div className="space-y-4">
            <Field label={isForm ? 'Name' : 'Display name'} value={name} onChange={setName} required={isForm} placeholder={isForm ? '' : 'optional, or stay anonymous'} autoFocus />
            <Field label="Email" type="email" value={email} onChange={setEmail} required />
            <Field
              label={isForm ? 'Your proposal' : 'Short note'}
              placeholder={isForm ? 'e.g. sponsor a season, fund Bali production, distribution partnership' : 'optional'}
              value={message}
              onChange={setMessage}
              textarea
              required={isForm}
            />
          </div>
          <p className={`mt-4 ${TYPE.label}`}>
            Layer: <span className="text-ink">{option.name}</span> · <span className="text-accent-deep">{option.price}</span>
          </p>
          {status === 'error' && (
            <p className="mt-3 font-sans text-[13px] text-red-700">
              {error || 'Something went wrong.'} Write to {CONTACT_EMAIL} instead.
            </p>
          )}
          <button type="submit" disabled={status === 'sending' || !email.trim() || (isForm && (!name.trim() || !message.trim()))} className={submitClass}>
            {status === 'sending' ? (isForm ? 'Sending…' : 'Opening checkout…') : isForm ? 'Hold the signal: send →' : `Lock in $${option.checkout} AUD →`}
          </button>
          {!isForm && <p className="mt-3 text-center font-sans text-xs text-ink-mute">Secure payment via Stripe · credential is permanent</p>}
        </form>
      )}
    </Shell>
  );
}
