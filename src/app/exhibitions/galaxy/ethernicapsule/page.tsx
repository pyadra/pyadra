'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import SiteNav from '@/app/components/nav/SiteNav';
import SiteFooter from '@/app/components/nav/SiteFooter';
import MuseumAtmosphere from '@/app/components/ui/MuseumAtmosphere';
import Capsule3D from './Capsule3D';

/* ------------------------------------------------------------------ */
/*  PYADRA — Project № 01 · EterniCapsule                              */
/*  Showcase Dashboard — Single-screen, highly interactive.            */
/*  Fits on one screen on desktop, stacks responsively on mobile.       */
/* ------------------------------------------------------------------ */

const CONTACT_EMAIL = 'pyadra@pyadra.io';
const EXPERIENCE_URL = '/exhibitions/galaxy/ethernicapsule/experience';
const SPRING = { type: 'spring' as const, stiffness: 150, damping: 20 };

// Type scale — Design System v1 roles, dashboard density.
// display=Fraunces title · heading=16 · body=14 (card body) · small=13 (D5) · micro=11 (D6)
const T = {
  display: 'text-3xl lg:text-4xl',
  heading: 'text-base',
  body: 'text-sm',
  small: 'text-[13px]',
  micro: 'text-[11px]',
};

// EterniCapsule brand gold — small accents only (~15%); emerald stays the page's voice.
const GOLD_BG = 'bg-[#D4AF6E]/15';
const GOLD_TEXT = 'text-[#8A6A2F]';

type Stats = { sealed: number; delivered: number; awaiting: number; totalValueAUD: number };
const ZERO_STATS: Stats = { sealed: 0, delivered: 0, awaiting: 0, totalValueAUD: 0 };

const WHAT_YOU_GET = [
  { title: 'The finished app', desc: 'Frontend, backend and database — built, live and working today. Write, seal, pay, deliver, unlock: the whole journey already works.' },
  { title: 'The brand & the design', desc: 'The name, the logo, the gold identity and the ceremonial vault design. The look people remember is done.' },
  { title: 'Sealed until its day', desc: 'A capsule opens only with its key, and the keys are never stored — only their fingerprints. A lost key is truly unrecoverable. That seal is the product.' },
  { title: 'Payments already flowing', desc: 'Stripe checkout is live and takes $9 the moment someone seals. No setup, no integration work.' },
  { title: 'Email & delivery that run themselves', desc: 'Keys go out by email the moment a capsule is sealed, and time-vault capsules unlock for the guardian on the chosen date — no cron jobs, nothing to babysit.' },
  { title: 'A safety net for emergencies', desc: 'A guardian system lets a trusted person unlock a capsule if something happens to the sender. The hard, human edge cases are handled.' },
];

const RISKS = [
  { title: 'No one has bought one yet', desc: 'The app is finished and working, but the first paying customer hasn’t arrived. You’d be buying a finished product, not a proven market.' },
  { title: 'We can’t see where visitors give up', desc: 'There are no analytics installed, so we don’t know why people leave without sealing a capsule. Installing them and finding out is the new owner’s first job.' },
  { title: 'It runs on Pyadra’s servers today', desc: 'Hosting, database and payments all live on Pyadra’s accounts. Moving everything to your own is a documented job (~20 hours), done on close if you take it independent.' },
  { title: 'It’s slow on purpose', desc: 'Sealing takes a deliberate 30-second ritual. That’s what makes it feel important — but it also means it will never be a fast, impulse-buy product.' },
  { title: '$9 is a small ticket', desc: 'Payment fees take about 6% of each $9 capsule. Real income needs volume — or the planned $25 audio and $49 video capsules.' },
];

const FAQ = [
  { q: 'Does it actually work?', a: 'Yes — the complete flow is live: compose, seal, pay $9, scheduled delivery, unlock with a key. Try it yourself in the vault.' },
  { q: 'How is a capsule protected?', a: 'Every capsule opens only with its unique 128-bit key. Keys are never stored — only cryptographic hashes — so a lost key is truly unrecoverable. Messages rest on encrypted infrastructure, and full in-browser encryption is on the roadmap.' },
  { q: 'What exactly would I own?', a: 'The code, the brand, the ceremonial experience, the key and delivery system — plus a documented roadmap to full independence. It stays hosted in Pyadra unless you negotiate otherwise.' },
  { q: 'Why is there no revenue yet?', a: 'It launched recently and the first sale is still pending. We say it plainly because everything on Pyadra is said plainly.' },
];

const DEALS = [
  {
    name: 'Operator — hosted',
    sub: '$4k up front · Pyadra keeps 15% per capsule',
    desc: null,
    price: '$4,000',
    featured: true,
  },
  {
    name: 'Owner — hosted',
    sub: '$8k up front · Pyadra keeps 5% per capsule',
    desc: null,
    price: '$8,000',
    featured: false,
  },
  {
    name: 'Make an offer',
    sub: "Different structure? Let's talk.",
    desc: 'Including taking the full architecture to your own servers.',
    price: "Let's talk",
    featured: false,
  },
];

/* ---------- request-info form (mirrors Kangaroo's ContactDialog) ---------- */

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder,
  disabled = false,
  textarea = false,
  autoFocus = false,
  emphasised = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: 'text' | 'email' | 'tel';
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  textarea?: boolean;
  autoFocus?: boolean;
  emphasised?: boolean;
}) {
  const borderColor = emphasised ? 'border-[#059669]' : 'border-[#1A1C1A]/15';
  const sharedClass =
    `w-full bg-transparent border-0 border-b ${borderColor} rounded-none px-0 py-2 ${T.body} text-[#1A1C1A] placeholder:text-[#6B8070]/60 focus:outline-none focus:border-[#059669] transition-colors disabled:opacity-50`;
  return (
    <label className="block">
      <span className={`block font-mono ${T.micro} uppercase tracking-[0.2em] ${emphasised ? 'text-[#059669]' : 'text-[#6B8070]'} mb-0.5`}>
        {label} {required && <span className="text-[#059669]">*</span>}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={emphasised ? 4 : 2}
          placeholder={placeholder}
          disabled={disabled}
          className={`${sharedClass} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          className={sharedClass}
        />
      )}
    </label>
  );
}

function RequestInfoDialog({
  open,
  model,
  onClose,
}: {
  open: boolean;
  model: string;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const isOffer = model === 'Make an offer';

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    if (isOffer && !message.trim()) return;

    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'express-interest',
          project: 'EterniCapsule',
          model,
          name: name.trim(),
          email: email.trim(),
          message: message.trim() || undefined,
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
        >
          <motion.div
            className="absolute inset-0 bg-[#0A120E]/40 backdrop-blur-sm"
            onClick={status === 'sending' ? undefined : onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            className="relative z-10 w-full max-w-md rounded-[28px] bg-white shadow-2xl ring-1 ring-[#1A1C1A]/8 max-h-[92vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={onClose}
              className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-[#EDEFED] text-[#3A4A3E] flex items-center justify-center font-mono ${T.body} font-bold hover:bg-[#059669]/10 hover:text-[#059669] transition-colors`}
            >
              ✕
            </button>

            {status === 'success' ? (
              <div className="p-8 text-center">
                <div className={`inline-flex w-12 h-12 items-center justify-center rounded-full bg-[#059669]/10 text-[#059669] ${T.heading} font-bold mb-4`}>
                  ✓
                </div>
                <h3 className="font-serif italic text-2xl text-[#1A1C1A] mb-2">Got it.</h3>
                <p className={`${T.body} text-[#3A4A3E] leading-relaxed mb-6 max-w-xs mx-auto`}>
                  Your request has reached Cristian. He’ll get back to you within 24 hours.
                </p>
                <button type="button" onClick={onClose} className={`font-mono ${T.small} font-semibold text-[#059669] hover:underline`}>
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="p-6 md:p-8">
                <div className={`font-mono ${T.micro} uppercase tracking-[0.22em] text-[#059669] mb-2`}>
                  EterniCapsule Enquiry
                </div>
                <h3 className="font-serif text-2xl font-light italic leading-tight mb-2">
                  {isOffer ? 'Tell us your structure.' : 'Talk with Cristian.'}
                </h3>
                <p className={`${T.body} text-[#3A4A3E] leading-relaxed mb-5`}>
                  {isOffer
                    ? 'Sketch the shape of the deal you’re thinking of — upfront, share, hosted or independent. Cristian will reply directly.'
                    : 'Leave your details below. Cristian handles negotiations directly and personally.'}
                </p>

                <div className="space-y-4">
                  <Field label="Name" value={name} onChange={setName} required autoFocus />
                  <Field label="Email" type="email" value={email} onChange={setEmail} required />
                  <Field
                    label={isOffer ? 'Your offer' : 'Short note'}
                    placeholder={isOffer ? 'e.g. lower upfront, larger Pyadra share — or take it independent at $X' : 'optional'}
                    value={message}
                    onChange={setMessage}
                    textarea
                    emphasised={isOffer}
                    required={isOffer}
                  />
                </div>

                <div className={`mt-4 font-mono ${T.micro} uppercase tracking-[0.18em] text-[#6B8070]`}>
                  Interest: <span className="text-[#1A1C1A] font-bold">{model}</span>
                </div>

                {status === 'error' && (
                  <p className={`${T.small} text-red-700 mt-3`}>
                    {errorMsg || 'Something went wrong.'} Email <a href={`mailto:${CONTACT_EMAIL}`} className="underline font-semibold">{CONTACT_EMAIL}</a> instead.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={
                    status === 'sending' ||
                    !name.trim() ||
                    !email.trim() ||
                    (isOffer && !message.trim())
                  }
                  className={`mt-6 w-full rounded-full bg-[#059669] text-white py-3.5 font-mono ${T.small} font-semibold shadow-md shadow-[#059669]/15 disabled:opacity-50 uppercase tracking-[0.18em]`}
                >
                  {status === 'sending' ? 'Sending…' : 'Send Request'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- main layout ---------- */

export default function EterniCapsuleShowcase() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [stats, setStats] = useState<Stats>(ZERO_STATS);
  const [dialog, setDialog] = useState<{ open: boolean; model: string }>({
    open: false,
    model: 'Operator — hosted',
  });

  const openDialog = (model: string) => setDialog({ open: true, model });
  const closeDialog = () => setDialog(d => ({ ...d, open: false }));

  // Live capsule metrics. Resolves to honest zeroes on any failure — never invented activity.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/stats/ethernicapsule')
      .then((r) => {
        if (!r.ok) throw new Error(`stats/ethernicapsule responded ${r.status}`);
        return r.json();
      })
      .then((data: Partial<Stats> | null) => {
        if (cancelled || !data) return;
        setStats({
          sealed: typeof data.sealed === 'number' ? data.sealed : 0,
          delivered: typeof data.delivered === 'number' ? data.delivered : 0,
          awaiting: typeof data.awaiting === 'number' ? data.awaiting : 0,
          totalValueAUD: typeof data.totalValueAUD === 'number' ? data.totalValueAUD : 0,
        });
      })
      .catch((err) => {
        console.warn('[ethernicapsule] stats fetch failed, showing zeroes', err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const metricCells = [
    { value: String(stats.sealed), label: 'Capsules Sealed', sub: 'be the first' },
    { value: String(stats.delivered), label: 'Delivered', sub: 'on schedule' },
    { value: String(stats.awaiting), label: 'Awaiting Delivery', sub: 'in safe storage' },
    { value: `$${stats.totalValueAUD.toLocaleString('en-AU')}`, label: 'Total Value', sub: 'AUD generated' },
  ];

  return (
    <div className={`bg-[#EDEFED] text-[#1A1C1A] antialiased selection:bg-[#059669] selection:text-white min-h-screen lg:h-screen lg:overflow-hidden flex flex-col justify-between py-4 lg:py-6 px-4 lg:px-8 relative`}>

      <RequestInfoDialog open={dialog.open} model={dialog.model} onClose={closeDialog} />

      {/* Background ambient light */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.12), transparent 70%)' }} />
        <div className="absolute -bottom-56 -right-32 w-[720px] h-[720px] rounded-full opacity-35" style={{ background: 'radial-gradient(circle, rgba(212,175,110,0.12), transparent 70%)' }} />
      </div>

      {/* galaxy atmosphere — grid, grain, green dust */}
      <MuseumAtmosphere />

      {/* shared nav */}
      <SiteNav
        variant="inline"
        crumbs={[
          { label: 'Galaxy', href: '/exhibitions/galaxy' },
          { label: 'EterniCapsule' },
        ]}
        status={{ label: 'For sale', live: true }}
      />

      {/* Main dashboard content */}
      <main className="relative z-10 w-full max-w-7xl mx-auto flex-grow grid grid-cols-1 lg:grid-cols-[1.05fr_1.3fr_1.05fr] gap-4 lg:gap-6 my-4 overflow-y-auto lg:overflow-hidden h-full">

        {/* LEFT COLUMN: Identity & What You Get */}
        <div className="rise-col rise-col-1 flex flex-col gap-4 lg:gap-5 h-full lg:overflow-hidden">

          {/* Identity panel */}
          <div className="panel-lift rounded-3xl bg-white/70 backdrop-blur-md p-6 ring-1 ring-black/5 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`rounded-full ${GOLD_BG} ${GOLD_TEXT} px-2.5 py-1 ${T.micro} font-mono tracking-[0.18em] uppercase`}>
                  Global · Digital Vault
                </span>
                <span className={`rounded-full bg-[#059669]/10 text-[#047857] px-2.5 py-1 ${T.micro} font-mono font-semibold uppercase tracking-[0.18em]`}>
                  Live
                </span>
              </div>
              <h1 className={`${T.display} font-serif font-semibold tracking-[-0.01em] mb-2 leading-none`}>
                EterniCapsule
              </h1>
              <p className={`font-serif italic ${T.heading} text-[#059669] mb-4`}>
                Leave a message in time. It opens on the date you choose.
              </p>
              <p className={`${T.body} text-[#3A4A3E] leading-relaxed`}>
                EterniCapsule is an app for saying something today that can only be read in the future — a promise, an apology, words for someone you&rsquo;re not ready to talk to yet. You write it, seal it and pick the date. Until that day arrives, only the key can open it.
              </p>
            </div>
          </div>

          {/* What You Get */}
          <div className="panel-lift rounded-3xl bg-white/70 backdrop-blur-md p-6 ring-1 ring-black/5 flex-grow flex flex-col shadow-sm lg:overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`font-mono ${T.small} font-bold uppercase tracking-[0.18em] text-[#6B8070]`}>
                What You Get
              </h2>
              <span className={`font-mono ${T.micro} text-[#059669] bg-[#059669]/10 px-2 py-0.5 rounded-full font-bold`}>
                6 things
              </span>
            </div>

            <div className="flex-grow overflow-y-auto pr-1 space-y-3 custom-scrollbar">
              {WHAT_YOU_GET.map((asset) => (
                <div
                  key={asset.title}
                  className="p-3 rounded-2xl bg-white/50 border border-white/40 hover:bg-white hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`flex w-4.5 h-4.5 shrink-0 items-center justify-center rounded-full ${GOLD_BG} ${GOLD_TEXT} ${T.micro} font-mono font-bold`}>
                      ✓
                    </span>
                    <h3 className={`${T.body} font-bold text-[#1A1C1A]`}>{asset.title}</h3>
                  </div>
                  <p className={`${T.small} text-[#6B8070] pl-6 leading-relaxed`}>
                    {asset.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Capsule 3D Monolith & Live Stats */}
        <div className="rise-col rise-col-2 flex flex-col gap-4 lg:gap-5 h-full">

          {/* Monolith Container — clickable, IS the way to try the product */}
          <div className="rounded-[32px] bg-[#1A1410] border border-white/5 shadow-2xl p-6 relative flex flex-col items-center justify-center flex-grow min-h-[380px] lg:min-h-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,110,0.06),transparent_60%)] pointer-events-none" />

            <Link
              href={EXPERIENCE_URL}
              aria-label="Enter the vault — try the live product"
              className="relative z-10 group flex flex-col items-center justify-center py-4 scale-95 lg:scale-100"
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} transition={SPRING}>
                <Capsule3D isSealed={false} glowIntensity={0.45} />
              </motion.div>
              <span
                className={`mt-4 font-mono ${T.micro} uppercase tracking-[0.22em] text-[#C4B5A8] opacity-70 group-hover:opacity-100 group-hover:text-[#D4AF6E] transition-opacity`}
              >
                $9 AUD per capsule · client-side sealed
              </span>
            </Link>
          </div>

          {/* Metrics Widget — all live, honest zeroes until the first capsule */}
          <div className="grid grid-cols-2 gap-3 lg:gap-4 shrink-0">
            {metricCells.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white/70 backdrop-blur-md p-4 ring-1 ring-black/5 hover:bg-white transition-all shadow-sm"
              >
                <div className={`font-mono ${T.micro} uppercase tracking-[0.18em] text-[#6B8070] mb-1`}>
                  {stat.label}
                </div>
                <div className={`${T.heading} font-serif font-semibold text-[#1A1C1A] leading-none mb-0.5`}>
                  {stat.value}
                </div>
                <div className={`font-mono ${T.micro} text-[#3A4A3E] font-medium opacity-85`}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Participation & Risks */}
        <div className="rise-col rise-col-3 flex flex-col gap-4 lg:gap-5 h-full lg:overflow-hidden">

          {/* Participation Panel — acquisition only (3 deals) */}
          <div className="panel-lift rounded-3xl bg-white/70 backdrop-blur-md p-4 lg:p-5 ring-1 ring-black/5 shadow-sm shrink-0">
            <h2 className={`font-mono ${T.small} font-bold uppercase tracking-[0.18em] text-[#6B8070] mb-2.5`}>
              Participation Models
            </h2>

            {/* Build-effort anchor (not a sale-price headline) */}
            <div className="flex justify-between items-end border-b border-black/5 pb-2.5 mb-3">
              <div>
                <span className={`font-mono ${T.micro} text-[#6B8070] uppercase tracking-[0.18em]`}>What it cost to build</span>
                <div className={`${T.heading} font-serif font-semibold text-[#1A1C1A] leading-none mt-1`}>$12,000 AUD</div>
                <div className={`font-mono ${T.micro} text-[#6B8070] mt-1`}>~150h of senior dev + design — not the price.</div>
              </div>
              <div className="text-right">
                <span className={`font-mono ${T.micro} text-[#6B8070] uppercase tracking-[0.18em]`}>Availability</span>
                <div className={`${T.body} font-semibold text-[#059669] leading-none mt-1`}>100% Available</div>
              </div>
            </div>

            {/* Deal cards — Kangaroo style, button → opens request-info form */}
            <div className="space-y-1.5">
              {DEALS.map((deal) => (
                <button
                  key={deal.name}
                  type="button"
                  onClick={() => openDialog(deal.name)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all group text-left ${
                    deal.featured
                      ? 'bg-[#059669]/5 border-2 border-[#059669] hover:bg-[#059669]/10'
                      : 'bg-white/50 border border-white/40 hover:bg-white'
                  }`}
                >
                  <div className="pr-2">
                    <div className={`font-bold text-[#1A1C1A] group-hover:text-[#059669] transition-colors flex items-center gap-1.5 ${T.body}`}>
                      {deal.name}
                      {deal.featured && (
                        <span className={`font-mono ${T.micro} bg-[#059669] text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-[0.18em]`}>
                          Pick
                        </span>
                      )}
                    </div>
                    <div className={`${T.micro} text-[#3A4A3E] mt-0.5 leading-snug`}>{deal.sub}</div>
                    {deal.desc && (
                      <div className={`${T.micro} text-[#6B8070] mt-0.5 leading-snug`}>{deal.desc}</div>
                    )}
                  </div>
                  <span className={`font-mono font-bold text-[#059669] bg-[#059669]/10 px-2 py-0.5 rounded shrink-0 ${T.small}`}>
                    {deal.price}
                  </span>
                </button>
              ))}
            </div>

            <p className={`${T.micro} text-[#6B8070] italic leading-snug mt-2.5`}>
              &ldquo;Hosted&rdquo; = the app keeps running on Pyadra&rsquo;s servers; you cover its running costs (hosting, email, database, payment fees). Prefer your own servers? Make an offer.
            </p>
          </div>

          {/* The Honest Risks Panel */}
          <div className="panel-lift rounded-3xl bg-white/70 backdrop-blur-md p-6 ring-1 ring-black/5 flex-grow flex flex-col justify-between shadow-sm lg:overflow-hidden">
            <div className="lg:overflow-hidden flex flex-col flex-grow">
              <h2 className={`font-mono ${T.small} font-bold uppercase tracking-[0.18em] text-red-700/80 mb-3 shrink-0 flex items-center gap-1.5`}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                The Honest Risks
              </h2>

              <div className="flex-grow overflow-y-auto space-y-3 custom-scrollbar pr-1 lg:min-h-[140px]">
                {RISKS.map((risk) => (
                  <div
                    key={risk.title}
                    className="p-2.5 rounded-2xl bg-red-50/20 border border-red-100/10"
                  >
                    <div className={`${T.small} font-bold text-red-950 mb-0.5`}>
                      ⚠️ {risk.title}
                    </div>
                    <p className={`${T.small} text-[#3A4A3E] leading-relaxed pl-4`}>
                      {risk.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA to FAQ Drawer */}
            <button
              onClick={() => setShowDrawer(true)}
              className={`w-full text-center mt-3 bg-white/90 hover:bg-white py-2.5 rounded-2xl font-mono ${T.small} font-bold text-[#6B8070] hover:text-[#059669] transition-colors border border-black/5 shrink-0 uppercase tracking-[0.18em]`}
            >
              Read FAQ & Origin Story →
            </button>
          </div>
        </div>
      </main>

      {/* Slide-over Drawer for FAQ & Founder's Note */}
      <AnimatePresence>
        {showDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDrawer(false)}
              className="fixed inset-0 bg-[#0D0907] z-40 cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#1A1410] text-[#F5E6D3] z-50 p-8 shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                  <h3 className="font-serif italic text-2xl text-[#E8D9D0]">The Origin Story</h3>
                  <button
                    onClick={() => setShowDrawer(false)}
                    className={`flex w-7 h-7 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white font-mono ${T.small} transition-colors`}
                  >
                    ✕
                  </button>
                </div>

                {/* Founder Photo & Quote */}
                <div className="rounded-2xl overflow-hidden bg-[#2C2218] border border-white/5 p-4 mb-8">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 ring-1 ring-white/10">
                    <Image
                      src="/images/ethernicapsule/cristian_founder.jpg"
                      alt="Cristian Niño, founder of EterniCapsule"
                      fill
                      sizes="400px"
                      className="object-cover"
                    />
                    <div className={`absolute bottom-2 left-3 font-mono ${T.micro} uppercase tracking-[0.18em] text-white bg-black/40 px-2 py-0.5 rounded`}>
                      Cristian · Australia
                    </div>
                  </div>
                  <p className={`font-serif italic ${T.heading} leading-relaxed text-[#E8D9D0] mb-4`}>
                    &ldquo;I came to Australia as an IT student with a suitcase and a head full of
                    ideas. I like building things that feel different — and EterniCapsule is the
                    one I couldn&rsquo;t let go: a place where sealed means sealed, until the day
                    you chose.&rdquo;
                  </p>
                  <div className="text-right">
                    <span className={`block ${T.small} font-bold text-[#F5E6D3]`}>Cristian Niño</span>
                    <span className={`block ${T.micro} text-[#C4B5A8] font-mono`}>Founder · EterniCapsule, 2025</span>
                  </div>
                </div>

                {/* FAQ section */}
                <h4 className={`font-mono ${T.micro} font-bold uppercase tracking-[0.18em] text-[#C4B5A8] mb-4`}>
                  Quick Answers (FAQ)
                </h4>
                <div className="space-y-5">
                  {FAQ.map(item => (
                    <div key={item.q} className="border-b border-white/5 pb-4 last:border-b-0">
                      <h5 className={`${T.body} font-bold text-[#E8D9D0] mb-1.5`}>{item.q}</h5>
                      <p className={`${T.small} text-[#C4B5A8] leading-relaxed`}>{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/5 pt-6 mt-8 space-y-2">
                <button
                  type="button"
                  onClick={() => { setShowDrawer(false); openDialog('Make an offer'); }}
                  className={`w-full text-center rounded-full bg-white/5 hover:bg-white/10 text-white py-3 font-mono ${T.small} font-bold transition-all border border-white/10 uppercase tracking-[0.18em]`}
                >
                  Contact the founder
                </button>
                <span className={`block text-center font-mono ${T.micro} text-[#C4B5A8]`}>
                  {CONTACT_EMAIL}
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SiteFooter />

      {/* Custom scrollbar styles helper */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
