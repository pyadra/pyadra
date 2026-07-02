'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import SiteNav from '@/app/components/nav/SiteNav';
import SiteFooter from '@/app/components/nav/SiteFooter';

/* ------------------------------------------------------------------ */
/*  PYADRA — Project № 04 · Kangaroo Cleanup                           */
/*  Showcase Dashboard — Single-screen, highly interactive.            */
/*  Fits on one screen on desktop, stacks responsively on mobile.       */
/* ------------------------------------------------------------------ */

const CONTACT_EMAIL = 'pyadra@pyadra.io';
const ENTER = 0.75;
const SPRING = { type: 'spring' as const, stiffness: 150, damping: 20 };

// Type scale — deliberate steps, no 1px sprawl.
// display=4xl/3xl · heading=base · body=sm (14px) · small=xs (12px) · micro=10px
const T = {
  display: 'text-3xl lg:text-4xl',
  heading: 'text-base',
  body: 'text-sm',
  small: 'text-xs',
  micro: 'text-[10px]',
};

// Last-known-good Airtasker numbers (Section 05 — June 2026).
// Used as a graceful fallback if the live fetch fails.
const AIRTASKER_FALLBACK = { tasks: 248, reviews: 213 };

const PUBLIC_LINKS = [
  { label: 'Airtasker', href: 'https://www.airtasker.com/users/a9226792b540-p-29587653/' },
  { label: 'Instagram', href: 'https://www.instagram.com/kangaroocleanup' },
  { label: 'Website', href: 'https://kangaroocleanup.com.au' },
];

const TAKEOVER = [
  { title: 'A name Sydney already trusts', desc: 'Brand, logo, identity — plus a 5.0 reputation built one honest job at a time. You inherit the reviews.' },
  { title: 'Channels that already ring', desc: 'Phone, WhatsApp, website, Instagram, email. Inbound messages from day one, not a cold start.' },
  { title: 'The pricing playbook', desc: 'What to charge, how to quote, which Sydney disposal sites to use and what they cost. The margin lives here.' },
  { title: 'The mistakes, already paid for', desc: 'Which jobs make money, which to walk away from. You start on year two, not year zero.' },
];

const RISKS = [
  { title: "It's physical work", desc: 'Lifting, logistics, showing up. No remote version. You have to be in Sydney.' },
  { title: 'Competition is real', desc: 'Other operators work this city. Demand shifts by season and suburb.' },
  { title: 'Reputation is daily', desc: 'The 5.0 rating helps you win — it doesn’t win for you. Keep the standard.' },
  { title: 'Numbers get verified', desc: 'Founder-recorded revenue, confirmed in due diligence. Requires a signed agreement.' },
];

const NOT_INCLUDED = [
  { item: 'The ute', note: 'it was sold. You bring your own vehicle.' },
  { item: 'The ABN', note: 'you operate under your own legal structure.' },
  { item: 'A guarantee', note: 'results depend on your execution.' },
];

const FAQ = [
  { q: 'Is this real?', a: 'Yes — and you don’t have to take my word for it. The Airtasker profile is public; check the reviews, the rating and the completed jobs yourself before you ever message me.' },
  { q: 'What exactly am I buying?', a: 'Brand, reputation, active channels, operational playbook, and flexible participation options.' },
  { q: 'Why did it stop?', a: 'The founder relocated to Perth and sold the ute. Not because of lack of demand.' },
  { q: 'If you’re in Perth, what’s really transferable?', a: 'Everything except the physical presence — which was always the operator’s job. The brand, the 5.0 reputation, the playbook, the disposal contacts, and the live channels all transfer. You skip the two years of building trust from zero.' },
  { q: 'What if it doesn’t work?', a: 'The demand is proven and the channels are live — what’s left is execution. We document every risk honestly below, but you’re not gambling on whether the market exists. It does.' },
];

const DEALS = [
  {
    name: 'Grow Together',
    price: '$5,000',
    sub: 'AUD up front · 8% of yearly revenue, shared',
    desc: 'The lowest door in. You keep your cash for the van and tools, and we grow this together over the years. The one I’d shake hands on.',
    featured: true,
  },
  {
    name: 'Shared Path',
    price: '$8,000',
    sub: 'AUD up front · 5% of yearly revenue, shared',
    desc: 'Bigger step in, lighter share. Solid commitment, real upside left for both sides.',
    featured: false,
  },
  {
    name: 'Take the Wheel',
    price: '$12,000',
    sub: 'AUD up front · 3% of yearly revenue, shared',
    desc: 'Most up front, smallest share. For the operator who wants it almost clean and keeps nearly everything they earn.',
    featured: false,
  },
];

/* ---------- components ---------- */

function PhysicalCard() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 15 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <div className="relative" onMouseMove={onMove} onMouseLeave={() => { mx.set(0); my.set(0); }}>
      <div
        aria-hidden
        className="absolute -inset-16 pointer-events-none"
        style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(5,150,105,0.08), transparent 70%)' }}
      />
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          drag
          dragSnapToOrigin
          dragElastic={0.18}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 18 }}
          whileHover={{ scale: 1.03 }}
          whileDrag={{ scale: 1.06, rotate: 2 }}
          style={{ rotateX, rotateY, transformPerspective: 900 }}
          className="relative cursor-grab active:cursor-grabbing touch-none max-w-[240px] md:max-w-[280px] mx-auto"
        >
          <Image
            src="/images/kangaroo/kangaroo_logo.png"
            alt="Kangaroo Cleanup brand mark"
            width={400}
            height={400}
            priority
            draggable={false}
            className="w-full h-auto select-none pointer-events-none drop-shadow-[0_20px_30px_rgba(5,150,105,0.18)]"
          />
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ENTER + 1.2, ...SPRING }}
            className={`absolute -top-2 -right-2 rounded-full bg-white px-3 py-1 ${T.micro} font-mono font-semibold text-[#1A1C1A] shadow-md ring-1 ring-[#1A1C1A]/10 rotate-3`}
          >
            grab me ✦
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  );
}

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
}) {
  const sharedClass =
    `w-full bg-transparent border-0 border-b border-[#1A1C1A]/15 rounded-none px-0 py-2 ${T.body} text-[#1A1C1A] placeholder:text-[#6B8070]/60 focus:outline-none focus:border-[#059669] transition-colors disabled:opacity-50`;
  return (
    <label className="block">
      <span className={`block font-mono ${T.micro} uppercase tracking-[0.2em] text-[#6B8070] mb-0.5`}>
        {label} {required && <span className="text-[#059669]">*</span>}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
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

function ContactDialog({
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
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

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

    setStatus('sending');
    setErrorMsg('');

    const composedMessage =
      [phone.trim() ? `Phone: ${phone.trim()}` : '', message.trim()].filter(Boolean).join('\n\n') ||
      undefined;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'express-interest',
          project: 'Kangaroo Cleanup',
          model,
          name: name.trim(),
          email: email.trim(),
          message: composedMessage,
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
              className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-[#EDEFED] text-[#3A4A3E] flex items-center justify-center ${T.body} font-mono font-bold hover:bg-[#059669]/10 hover:text-[#059669] transition-colors`}
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
                  Eduardo has received your contact request. He will reach out to you within 24 hours.
                </p>
                <button type="button" onClick={onClose} className={`font-mono ${T.small} font-semibold text-[#059669] hover:underline`}>
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="p-6 md:p-8">
                <div className={`font-mono ${T.micro} uppercase tracking-[0.22em] text-[#059669] mb-2`}>
                  Handover Enquiry
                </div>
                <h3 className="font-serif text-2xl font-light italic leading-tight mb-2">
                  Talk with Eduardo.
                </h3>
                <p className={`${T.body} text-[#3A4A3E] leading-relaxed mb-5`}>
                  Leave your details below. Eduardo handles negotiations directly and personally.
                </p>

                <div className="space-y-4">
                  <Field label="Name" value={name} onChange={setName} required autoFocus />
                  <Field label="Email" type="email" value={email} onChange={setEmail} required />
                  <Field label="Phone" type="tel" placeholder="optional — for direct call" value={phone} onChange={setPhone} />
                  <Field label="Short note" placeholder="optional" value={message} onChange={setMessage} textarea />
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
                  disabled={status === 'sending' || !name.trim() || !email.trim()}
                  className={`mt-6 w-full rounded-full bg-[#059669] text-white py-3.5 font-mono ${T.small} font-semibold shadow-md shadow-[#059669]/15 disabled:opacity-50`}
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

export default function KangarooCleanupPage() {
  const [stats, setStats] = useState(AIRTASKER_FALLBACK);
  const [showDrawer, setShowDrawer] = useState(false);
  const [dialog, setDialog] = useState<{ open: boolean; model: string }>({
    open: false,
    model: 'Open conversation',
  });

  const openDialog = (model = 'Open conversation') => {
    setDialog({ open: true, model });
  };

  const closeDialog = () => {
    setDialog(d => ({ ...d, open: false }));
  };

  // Fetch Airtasker stats live; fall back to last-known-good (Section 05) on any failure.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/airtasker-stats')
      .then((r) => {
        if (!r.ok) throw new Error(`airtasker-stats responded ${r.status}`);
        return r.json();
      })
      .then((data: { tasks?: number; reviews?: number } | null) => {
        if (cancelled || !data) return;
        if (typeof data.tasks === 'number' && typeof data.reviews === 'number') {
          setStats({ tasks: data.tasks, reviews: data.reviews });
        }
      })
      .catch((err) => {
        console.warn('[kangaroo-cleanup] airtasker-stats fetch failed, using fallback', err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={`bg-[#EDEFED] text-[#1A1C1A] font-serif antialiased selection:bg-[#059669] selection:text-white min-h-screen lg:h-screen lg:overflow-hidden flex flex-col justify-between py-4 lg:py-6 px-4 lg:px-8 relative`}>

      <ContactDialog open={dialog.open} model={dialog.model} onClose={closeDialog} />

      {/* Background ambient light */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full opacity-35" style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.12), transparent 70%)' }} />
        <div className="absolute -bottom-56 -right-32 w-[720px] h-[720px] rounded-full opacity-40" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.10), transparent 70%)' }} />
      </div>

      {/* shared nav */}
      <SiteNav
        variant="inline"
        crumbs={[
          { label: 'Galaxy', href: '/exhibitions/galaxy' },
          { label: 'Kangaroo' },
        ]}
        status={{ label: 'For sale', live: true }}
      />

      {/* Main dashboard content */}
      <main className="relative z-10 w-full max-w-7xl mx-auto flex-grow grid grid-cols-1 lg:grid-cols-[1.05fr_1.3fr_1.05fr] gap-4 lg:gap-6 my-4 overflow-y-auto lg:overflow-hidden h-full">

        {/* LEFT COLUMN: Identity & Included Assets */}
        <div className="flex flex-col gap-4 lg:gap-5 h-full lg:overflow-hidden">

          {/* Identity panel */}
          <div className="rounded-3xl bg-white/70 backdrop-blur-md p-6 ring-1 ring-black/5 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`rounded-full bg-black/5 text-[#3A4A3E] px-2.5 py-1 ${T.micro} font-mono tracking-wider uppercase`}>
                  Local · Sydney, NSW
                </span>
                <span className={`rounded-full bg-[#059669]/10 text-[#047857] px-2.5 py-1 ${T.micro} font-mono font-semibold uppercase tracking-wider`}>
                  Handover Ready
                </span>
              </div>
              <h1 className={`${T.display} font-bold tracking-tight mb-2 leading-none`}>
                Kangaroo Cleanup
              </h1>
              <p className={`font-serif italic ${T.heading} text-[#059669] mb-4`}>
                Your own business — without starting from zero.
              </p>
              <p className={`${T.body} text-[#3A4A3E] leading-relaxed`}>
                500+ jobs, a 5.0 name, and channels that still ring today — all built one honest job at a time. The hard part’s done. You bring the van and show up.
              </p>
            </div>
          </div>

          {/* Included Assets */}
          <div className="rounded-3xl bg-white/70 backdrop-blur-md p-6 ring-1 ring-black/5 flex-grow flex flex-col shadow-sm lg:overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`font-mono ${T.small} font-bold uppercase tracking-wider text-[#6B8070]`}>
                Assets Transferred
              </h2>
              <span className={`font-mono ${T.micro} text-[#059669] bg-[#059669]/10 px-2 py-0.5 rounded-full font-bold`}>
                4 modules
              </span>
            </div>

            <div className="flex-grow overflow-y-auto pr-1 space-y-3 custom-scrollbar">
              {TAKEOVER.map((item) => (
                <div
                  key={item.title}
                  className="p-3 rounded-2xl bg-white/50 border border-white/40 hover:bg-white hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`flex w-4.5 h-4.5 shrink-0 items-center justify-center rounded-full bg-[#059669]/10 text-[#059669] ${T.micro} font-mono font-bold`}>
                      ✓
                    </span>
                    <h3 className={`${T.body} font-bold text-[#1A1C1A]`}>{item.title}</h3>
                  </div>
                  <p className={`${T.small} text-[#6B8070] pl-6 leading-relaxed`}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Interactive Card & Live Stats */}
        <div className="flex flex-col gap-4 lg:gap-5 h-full">

          {/* Monolith/Card Container */}
          <div className="rounded-[32px] bg-white/50 border border-white/40 shadow-xl p-6 relative flex flex-col items-center justify-center flex-grow min-h-[380px] lg:min-h-0 overflow-hidden">

            {/* Grid overlay for eco-technical blueprint aesthetic */}
            <div
              className="absolute inset-0 pointer-events-none z-0 opacity-[0.08]"
              style={{
                backgroundImage: 'linear-gradient(to right, #059669 1px, transparent 1px), linear-gradient(to bottom, #059669 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="relative z-10 flex items-center justify-center py-4 scale-95 lg:scale-100">
              <PhysicalCard />
            </div>

            {/* Direct CTA + rebuild-cost value line (replaces hard valuation figure) */}
            <div className="relative z-20 w-full max-w-md mt-2 text-center">
              <motion.button
                onClick={() => openDialog('Take this over')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={SPRING}
                className={`w-full text-center rounded-full bg-[#059669] text-white px-8 py-3.5 font-mono ${T.body} font-semibold tracking-wide shadow-lg shadow-[#059669]/20 hover:bg-[#047857]`}
              >
                TAKE THIS OVER →
              </motion.button>
              <p className={`${T.small} text-[#3A4A3E] mt-3 leading-relaxed font-serif italic`}>
                What it takes to build this from zero: 2 years, 500+ jobs, a 5.0 reputation one customer at a time — and a business that cleared real money each year. You can start there. Or start here, from $5,000.
              </p>
            </div>
          </div>

          {/* Numbers — Block A (public proof) + Block B (founder-recorded revenue), kept visually distinct */}
          <div className="shrink-0 space-y-3">
            {/* BLOCK A — Public, verifiable today */}
            <div>
              <div className={`flex items-center gap-1.5 mb-1.5 font-mono ${T.micro} uppercase tracking-wider text-[#047857]`}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                Public proof · verify it yourself
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Jobs done', value: '500+', desc: 'across Airtasker & direct' },
                  { label: 'On Airtasker', value: stats.tasks, desc: 'publicly verifiable' },
                  { label: 'Rating', value: '5.0 ★', desc: `${stats.reviews} reviews` },
                  { label: 'Completion', value: '100%', desc: 'reliable record' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl bg-white/70 backdrop-blur-md p-3 ring-1 ring-black/5 hover:bg-white transition-all shadow-sm text-center"
                  >
                    <div className={`font-mono ${T.micro} uppercase tracking-wider text-[#6B8070] mb-0.5`}>
                      {stat.label}
                    </div>
                    <div className={`${T.heading} font-bold tracking-tight text-[#1A1C1A] leading-none mb-0.5`}>
                      {stat.value}
                    </div>
                    <div className={`font-mono ${T.micro} text-[#6B8070] truncate leading-none`}>
                      {stat.desc}
                    </div>
                  </div>
                ))}
              </div>
              <p className={`${T.small} text-[#6B8070] italic leading-relaxed mt-2`}>
                {stats.tasks} verifiable on Airtasker — plus hundreds more by direct referral, once customers started calling instead of booking through the platform.
              </p>
            </div>

            {/* BLOCK B — Founder-recorded revenue, verified in due diligence */}
            <div>
              <div className={`flex items-center gap-1.5 mb-1.5 font-mono ${T.micro} uppercase tracking-wider text-[#6B8070]`}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#6B8070]" />
                Revenue · founder-recorded, verified in due diligence
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: '~$30k', sub: 'AUD · FY2025', desc: 'Invoiced gross revenue' },
                  { value: '~$23k', sub: 'AUD · FY2024', desc: 'Invoiced gross revenue' },
                ].map((row) => (
                  <div
                    key={row.sub}
                    className="rounded-xl bg-white/70 backdrop-blur-md p-3 ring-1 ring-black/5 shadow-sm text-center"
                  >
                    <div className={`${T.heading} font-bold tracking-tight text-[#1A1C1A] leading-none mb-0.5`}>
                      {row.value}
                    </div>
                    <div className={`font-mono ${T.micro} uppercase tracking-wider text-[#047857] mb-0.5`}>
                      {row.sub}
                    </div>
                    <div className={`font-mono ${T.micro} text-[#6B8070] truncate leading-none`}>
                      {row.desc}
                    </div>
                  </div>
                ))}
              </div>
              <p className={`${T.small} text-[#3A4A3E] italic leading-relaxed mt-2`}>
                Grew every year. From zero to a known name in the Sydney cleanup market in two years.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Ways to Participate & Risks */}
        <div className="flex flex-col gap-4 lg:gap-5 h-full lg:overflow-hidden">

          {/* Participation Options */}
          <div className="rounded-3xl bg-white/70 backdrop-blur-md p-6 ring-1 ring-black/5 shadow-sm">
            <h2 className={`font-mono ${T.small} font-bold uppercase tracking-wider text-[#6B8070] mb-4`}>
              Deal Choices
            </h2>

            <div className="space-y-2">
              {DEALS.map((deal) => (
                <button
                  key={deal.name}
                  onClick={() => openDialog(deal.name)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${T.small} group text-left ${
                    deal.featured
                      ? 'bg-[#059669]/5 border-2 border-[#059669] hover:bg-[#059669]/10'
                      : 'bg-white/50 border border-white/40 hover:bg-white'
                  }`}
                >
                  <div className="pr-2">
                    <div className={`font-bold text-[#1A1C1A] group-hover:text-[#059669] transition-colors flex items-center gap-1.5 ${T.body}`}>
                      {deal.name}
                      {deal.featured && (
                        <span className={`font-mono ${T.micro} bg-[#059669] text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider`}>
                          Pick
                        </span>
                      )}
                    </div>
                    <div className={`${T.small} text-[#3A4A3E] mt-0.5`}>{deal.sub}</div>
                    <div className={`${T.small} text-[#6B8070] mt-0.5 line-clamp-2`}>{deal.desc}</div>
                  </div>
                  <span className={`font-mono font-bold text-[#059669] bg-[#059669]/10 px-2 py-0.5 rounded shrink-0 ${T.body}`}>
                    {deal.price}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Risks and Exclusions */}
          <div className="rounded-3xl bg-white/70 backdrop-blur-md p-6 ring-1 ring-black/5 flex-grow flex flex-col justify-between shadow-sm lg:overflow-hidden">
            <div className="lg:overflow-hidden flex flex-col flex-grow">
              <h2 className={`font-mono ${T.small} font-bold uppercase tracking-wider text-red-700/80 mb-3 shrink-0 flex items-center gap-1.5`}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                The Honest Risks
              </h2>

              <div className="flex-grow overflow-y-auto space-y-3 custom-scrollbar pr-1">
                {/* Risks */}
                {RISKS.map((risk) => (
                  <div
                    key={risk.title}
                    className="p-2.5 rounded-xl bg-red-50/20 border border-red-100/10"
                  >
                    <div className={`${T.small} font-bold text-red-950 mb-0.5`}>
                      ⚠️ {risk.title}
                    </div>
                    <p className={`${T.small} text-[#3A4A3E] leading-relaxed pl-3`}>
                      {risk.desc}
                    </p>
                  </div>
                ))}

                {/* Exclusions */}
                <div className="border-t border-black/5 pt-2 mt-2">
                  <div className={`font-mono ${T.micro} uppercase tracking-wider text-[#6B8070] mb-1.5`}>Not Included</div>
                  <div className="space-y-1">
                    {NOT_INCLUDED.map(not => (
                      <div key={not.item} className={`${T.small} text-[#3A4A3E] flex items-baseline gap-1`}>
                        <span className="text-red-700 font-bold">•</span>
                        <span><span className="font-bold">{not.item}</span> — {not.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA to FAQ Drawer */}
            <button
              onClick={() => setShowDrawer(true)}
              className={`w-full text-center mt-3 bg-white/90 hover:bg-white py-2.5 rounded-2xl font-mono ${T.small} font-bold text-[#6B8070] hover:text-[#059669] transition-colors border border-black/5 shrink-0 uppercase tracking-wider`}
            >
              Read FAQ & Founder Story →
            </button>
          </div>
        </div>
      </main>

      {/* Slide-over Drawer for FAQ & Founder's Letter */}
      <AnimatePresence>
        {showDrawer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDrawer(false)}
              className="fixed inset-0 bg-[#0A120E] z-40 cursor-pointer"
            />
            {/* Drawer Body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0D1612] text-[#EDEFED] z-50 p-6 md:p-8 shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                  <h3 className="font-serif italic text-2xl text-[#EDEFED]">The Full Story</h3>
                  <button
                    onClick={() => setShowDrawer(false)}
                    className={`flex w-7 h-7 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white font-mono ${T.small} transition-colors`}
                  >
                    ✕
                  </button>
                </div>

                {/* Founder Photo & Story */}
                <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/15 p-4 mb-6">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 ring-1 ring-white/10">
                    <Image
                      src="/images/kangaroo/kangaroo_founder.jpg"
                      alt="Eduardo Díaz with the Kangaroo Cleanup ute in Sydney"
                      fill
                      sizes="400px"
                      className="object-cover"
                    />
                    <div className={`absolute bottom-2 left-3 font-mono ${T.micro} uppercase tracking-wider text-white bg-black/40 px-2 py-0.5 rounded`}>
                      Eduardo · Sydney
                    </div>
                  </div>
                  <p className={`font-serif italic ${T.body} leading-relaxed text-[#EDEFED] opacity-90 mb-3`}>
                    &ldquo;I showed up to a country where I knew nobody, bought a beat-up ute,
                    and built this with my own hands — one honest job at a time.
                    I’m only letting it go because I had to move, not because I stopped believing in it. If you’re willing to graft, it pays — and it grows.&rdquo;
                  </p>
                  <div className="text-right">
                    <span className={`block ${T.small} font-bold`}>Eduardo Díaz</span>
                    <span className={`block ${T.micro} text-[#6B8070] font-mono`}>Founder · Sydney 2023 — Perth 2026</span>
                  </div>
                </div>

                {/* Verification strip */}
                <div className="mb-6">
                  <div className={`font-mono ${T.micro} uppercase tracking-wider text-[#6B8070] mb-2`}>Verify Links</div>
                  <div className="flex gap-2 flex-wrap">
                    {PUBLIC_LINKS.map(link => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`rounded-full bg-white/5 border border-white/10 px-3 py-1 font-mono ${T.small} hover:bg-white/10 transition-colors`}
                      >
                        {link.label} ↗
                      </a>
                    ))}
                  </div>
                </div>

                {/* FAQ section */}
                <h4 className={`font-mono ${T.micro} font-bold uppercase tracking-wider text-[#6B8070] mb-3`}>
                  Quick FAQ
                </h4>
                <div className="space-y-4">
                  {FAQ.map(item => (
                    <div key={item.q} className="border-b border-white/5 pb-3 last:border-b-0">
                      <h5 className={`${T.body} font-bold text-[#EDEFED] mb-1 leading-snug`}>{item.q}</h5>
                      <p className={`${T.small} text-[#6B8070] leading-relaxed`}>{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/5 pt-6 mt-8 space-y-2">
                <button
                  onClick={() => { setShowDrawer(false); openDialog('Talk to Eduardo'); }}
                  className={`w-full text-center rounded-full bg-[#059669] hover:bg-[#047857] text-white py-3 font-mono ${T.small} font-bold transition-all uppercase tracking-wider`}
                >
                  Talk to Eduardo
                </button>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className={`block w-full text-center font-mono ${T.micro} text-[#6B8070] hover:text-[#EDEFED] transition-colors`}
                >
                  {CONTACT_EMAIL}
                </a>
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
