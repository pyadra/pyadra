'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import SiteNav from '@/app/components/nav/SiteNav';
import SiteFooter from '@/app/components/nav/SiteFooter';

/* ------------------------------------------------------------------ */
/*  PYADRA — Project № 02 · Orbit 77                                   */
/*  CONTRIBUTION page (not a sale). Pablo & Eduardo keep the project. */
/*  Dashboard pattern matches Kangaroo Cleanup + EterniCapsule.       */
/* ------------------------------------------------------------------ */

/* =========== EDITABLE CONFIG — DRAFT v1 — REFINE WITH PABLO ========== */
const CONFIG = {
  /**
   * Season 2 funding goal in AUD.
   * Candidates being weighed with Pablo:
   *   1_000  → original $1k budget for 10 episodes
   *   2_500  → proof-of-traction first goal (recommended in .md)
   *   15_000 → full Bali vision (needs sponsors, not investors)
   */
  FUNDING_GOAL_AUD: 1_000,

  /**
   * Episodes live. HARDCODED — data debt.
   * Becomes dynamic in Season 2 via an `orbit_episodes` table.
   */
  EPISODES_LIVE: 10,

  CONTACT_EMAIL: 'pyadra@pyadra.io',
} as const;

/**
 * Contribution layers — DRAFT v1.
 * `kind: 'stripe'` → /api/donate (Stripe checkout, credential email).
 * `kind: 'form'`   → BigInvestor request form (private conversation).
 */
type Layer =
  | { kind: 'stripe'; amount: number; name: string; tagline: string; sub: string; featured?: boolean }
  | { kind: 'form';   amount: null;   name: string; tagline: string; sub: string; featured?: boolean };

const CONTRIBUTION_LAYERS: Layer[] = [
  { kind: 'stripe', amount: 10,   name: 'Signal Carrier',        tagline: '$10',          sub: 'Permanent credential, name in the archive.', featured: true },
  { kind: 'stripe', amount: 20,   name: 'Archive Node',          tagline: '$20',          sub: 'Above + early Season 2 access.' },
  { kind: 'stripe', amount: 50,   name: 'Transmission Keeper',   tagline: '$50',          sub: 'Above + founder updates, higher status.' },
  { kind: 'stripe', amount: 100,  name: 'Journey Patron',        tagline: '$100–500',     sub: 'Name in S2 credits, Bali behind-the-scenes, exclusive merch.' },
  { kind: 'stripe', amount: 1000, name: 'Co-Producer / Sponsor', tagline: '$1,000+',      sub: 'Brand/logo in the podcast, prominent thanks, product placement.' },
  { kind: 'form',   amount: null, name: 'Big investor',          tagline: "Let's talk",   sub: 'Serious money? Private conversation, not a checkout.' },
];

const PUBLIC_LINKS = [
  { label: 'YouTube',     href: 'https://www.youtube.com/@Orbit77Podcast' },
  { label: 'orbit77.shop', href: 'https://orbit77.shop/' },
  // Spotify + Instagram are TBD in Orbit77.md — intentionally hidden until real.
];

/* =================== Type scale — 6 deliberate steps ================== */
const T = {
  display: 'text-3xl lg:text-4xl',
  heading: 'text-base',
  body: 'text-sm',
  small: 'text-xs',
  micro: 'text-[10px]',
} as const;

const ENTER = 0.75;
const SPRING = { type: 'spring' as const, stiffness: 150, damping: 20 };

const WHAT_YOU_FUND = [
  { title: 'A real archive', desc: `${CONFIG.EPISODES_LIVE} episodes of Season 1, live on YouTube. Raw conversations about life, creation and identity — no script, no filters.` },
  { title: 'A working credential system', desc: 'Supporters receive a permanent credential (O77-S1-XXXXXX) engraved in the archive. Stripe live, email delivery, all operational.' },
  { title: 'A brand with a world', desc: 'The orbital concept, the transmission aesthetic, the ritual copy voice — plus orbit77.shop, the external merch store.' },
  { title: 'The next season', desc: 'Your contribution funds Season 2 production. Founders keep creative control; contributors get recognition, not equity.' },
];

const RISKS = [
  { title: 'The audience is small',          desc: 'Early YouTube channel, supporters still being counted. You’d be backing it before the proof — that’s the point, and the risk.' },
  { title: 'Monetization isn’t active yet',  desc: 'No AdSense, no Spotify revenue, no sponsors yet. Today the only revenue is credentials and merch.' },
  { title: 'Production is real work',        desc: 'A podcast doesn’t run itself. Episodes need recording, editing and publishing — actively, every season.' },
  { title: 'Shared infrastructure',          desc: 'Stripe webhook and database are shared with Pyadra today. Independence is documented and takes 10–12 hours.' },
  { title: 'Draft numbers',                  desc: 'The tiers and the funding goal are v1, still being refined with Pablo. The shape of the deal is right; the exact amounts may shift.' },
];

const NOT_INCLUDED = [
  { item: 'Equity',         note: 'no shares, no ownership — Pablo & Eduardo keep the project.' },
  { item: 'A return',       note: 'this is a contribution, not an investment.' },
  { item: 'Creative votes', note: 'no influence on episodes, guests or direction.' },
];

const FAQ_BASE = [
  { q: 'Is this real?', a: `${CONFIG.EPISODES_LIVE} episodes are public on YouTube and the credential system processes real payments through Stripe. Watch first, decide later.` },
  { q: 'What do supporters get?', a: 'A permanent credential engraved in the archive (O77-S1-XXXXXX), founding member status, early Season 2 access, and direct founder updates.' },
  { q: 'Is this an investment? Do I own a piece?', a: 'No. You’re funding the journey, not buying equity. Pablo & Eduardo keep the project and creative control. Supporters get recognition, perks and a permanent credential — never ownership, never a return, never a vote on the content.' },
];

/* ---------- the interactive monolith (Orbit sphere, draggable) ---------- */

function OrbitSphere() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 15 });

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - rect.left) / rect.width - 0.5);
        my.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
    >
      <div aria-hidden className="absolute -inset-16 pointer-events-none" style={{ background: 'radial-gradient(50% 50% at 50% 45%, rgba(57,255,20,0.10), transparent 70%)' }} />
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}>
        <motion.div
          drag
          dragSnapToOrigin
          dragElastic={0.18}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 18 }}
          whileHover={{ scale: 1.04 }}
          whileDrag={{ scale: 1.08, rotate: 3 }}
          style={{ rotateX, rotateY, transformPerspective: 900 }}
          className="relative cursor-grab active:cursor-grabbing touch-none w-44 h-44 md:w-56 md:h-56"
        >
          <div className="relative w-full h-full rounded-full bg-[radial-gradient(circle_at_30%_30%,#FFFFFF,#E8E9E8,#C8C9C8)] shadow-[-14px_18px_38px_rgba(10,18,14,0.5)] overflow-hidden ring-1 ring-white/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/orbit-logo.png"
                alt="Orbit 77"
                width={300}
                height={300}
                className="w-3/5 h-3/5 object-contain opacity-75 pointer-events-none select-none"
                draggable={false}
              />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 opacity-30 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_180deg,rgba(255,255,255,0.4)_270deg,transparent_360deg)]"
            />
          </div>
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

/* ---------- Lock-In dialog: handles BOTH Stripe tiers and Big-Investor form ---------- */

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder,
  textarea = false,
  emphasised = false,
  autoFocus = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: 'text' | 'email';
  required?: boolean;
  placeholder?: string;
  textarea?: boolean;
  emphasised?: boolean;
  autoFocus?: boolean;
}) {
  const borderColor = emphasised ? 'border-[#059669]' : 'border-[#1A1C1A]/15';
  const labelColor = emphasised ? 'text-[#059669]' : 'text-[#6B8070]';
  const cls = `w-full bg-transparent border-0 border-b ${borderColor} rounded-none px-0 py-2 ${T.body} text-[#1A1C1A] placeholder:text-[#6B8070]/60 focus:outline-none focus:border-[#059669] transition-colors`;
  return (
    <label className="block">
      <span className={`block font-mono ${T.micro} uppercase tracking-[0.2em] ${labelColor} mb-0.5`}>
        {label} {required && <span className="text-[#059669]">*</span>}
      </span>
      {textarea ? (
        <textarea rows={emphasised ? 4 : 2} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${cls} resize-none`} />
      ) : (
        <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus} className={cls} />
      )}
    </label>
  );
}

function LockInDialog({
  open,
  layer,
  onClose,
}: {
  open: boolean;
  layer: Layer | null;
  onClose: () => void;
}) {
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

  if (!layer) return null;
  const isForm = layer.kind === 'form';

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!layer) return;
    if (!email.trim()) return;
    if (isForm && (!name.trim() || !message.trim())) return;

    setStatus('sending');
    setErrorMsg('');

    try {
      if (layer.kind === 'stripe') {
        const res = await fetch('/api/donate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            intent: 'orbit-support',
            amount: layer.amount * 100,
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
          return; // browser navigating; leave status = 'sending'
        }
        throw new Error(data?.error || 'Unable to start checkout');
      } else {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'express-interest',
            project: 'Orbit 77',
            model: layer.name,
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
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  const canSubmit =
    !!email.trim() &&
    (!isForm || (!!name.trim() && !!message.trim())) &&
    status !== 'sending';

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
              className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-[#EDEFED] text-[#3A4A3E] flex items-center justify-center font-mono ${T.body} font-bold hover:bg-[#059669]/10 hover:text-[#059669] transition-colors`}
            >
              ✕
            </button>

            {status === 'success' ? (
              <div className="p-8 text-center">
                <div className={`inline-flex w-12 h-12 items-center justify-center rounded-full bg-[#059669]/10 text-[#059669] ${T.heading} font-bold mb-4`}>✓</div>
                <h3 className="font-serif italic text-2xl text-[#1A1C1A] mb-2">Transmission recorded.</h3>
                <p className={`${T.body} text-[#3A4A3E] leading-relaxed mb-6 max-w-xs mx-auto`}>
                  Pablo &amp; Eduardo have received your note. They’ll reach out personally.
                </p>
                <button type="button" onClick={onClose} className={`font-mono ${T.small} font-semibold text-[#059669] hover:underline`}>Close</button>
              </div>
            ) : (
              <form onSubmit={submit} className="p-6 md:p-8">
                <div className={`font-mono ${T.micro} uppercase tracking-[0.22em] text-[#059669] mb-2`}>
                  {isForm ? 'Orbit 77 · Private channel' : 'Orbit 77 · Lock In Your Frequency'}
                </div>
                <h3 className="font-serif text-2xl font-light italic leading-tight mb-2">
                  {isForm ? 'Tell us the structure you’re thinking.' : `Lock in — ${layer.name}.`}
                </h3>
                <p className={`${T.body} text-[#3A4A3E] leading-relaxed mb-5`}>
                  {isForm
                    ? 'Sketch the kind of involvement you have in mind — sponsorship, larger contribution, partnership. We reply directly.'
                    : `Your credential (O77-S1-XXXXXX) is delivered to your email after Stripe checkout. ${layer.kind === 'stripe' && layer.amount >= 100 ? 'For ranges, the exact final amount is set at checkout.' : ''}`}
                </p>

                <div className="space-y-4">
                  <Field
                    label={isForm ? 'Name' : 'Display name'}
                    value={name}
                    onChange={setName}
                    required={isForm}
                    placeholder={isForm ? '' : 'optional — or stay anonymous'}
                    autoFocus
                  />
                  <Field label="Email" type="email" value={email} onChange={setEmail} required />
                  <Field
                    label={isForm ? 'Your proposal' : 'Short note'}
                    placeholder={isForm ? 'e.g. sponsor a season, fund Bali production, distribution partnership' : 'optional'}
                    value={message}
                    onChange={setMessage}
                    textarea
                    emphasised={isForm}
                    required={isForm}
                  />
                </div>

                <div className={`mt-4 font-mono ${T.micro} uppercase tracking-[0.18em] text-[#6B8070]`}>
                  Layer: <span className="text-[#1A1C1A] font-bold">{layer.name}</span>{' '}
                  · <span className="text-[#059669] font-bold">{layer.tagline}</span>
                </div>

                {status === 'error' && (
                  <p className={`${T.small} text-red-700 mt-3`}>
                    {errorMsg || 'Something went wrong.'} Email <a href={`mailto:${CONFIG.CONTACT_EMAIL}`} className="underline font-semibold">{CONFIG.CONTACT_EMAIL}</a> instead.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`mt-6 w-full rounded-full bg-[#059669] text-white py-3.5 font-mono ${T.small} font-semibold shadow-md shadow-[#059669]/15 disabled:opacity-50 uppercase tracking-wider`}
                >
                  {status === 'sending'
                    ? (isForm ? 'Sending…' : 'Opening checkout…')
                    : (isForm ? 'Hold The Signal — Send →' : `Lock In — $${layer.kind === 'stripe' ? layer.amount : ''} AUD →`)}
                </button>

                {!isForm && (
                  <p className={`${T.micro} font-mono text-[#6B8070] mt-3 text-center uppercase tracking-wider`}>
                    Secure payment via Stripe · credential is permanent
                  </p>
                )}
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- main layout ---------- */

export default function OrbitDashboard() {
  const [raised, setRaised] = useState<number | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [dialog, setDialog] = useState<{ open: boolean; layer: Layer | null }>({ open: false, layer: null });

  const openDialog = (layer: Layer) => setDialog({ open: true, layer });
  const closeDialog = () => setDialog(d => ({ ...d, open: false }));

  // Live Season 2 funding total — graceful fallback to "loading" if it fails.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/stats/orbit-fund')
      .then((r) => {
        if (!r.ok) throw new Error(`orbit-fund responded ${r.status}`);
        return r.json();
      })
      .then((data: { total?: number } | null) => {
        if (cancelled || !data) return;
        if (typeof data.total === 'number') setRaised(data.total);
      })
      .catch((err) => {
        console.warn('[orbit] funding stats fetch failed', err);
      });
    return () => { cancelled = true; };
  }, []);

  const goal = CONFIG.FUNDING_GOAL_AUD;
  const pct = raised !== null ? Math.min((raised / goal) * 100, 100) : 0;
  const raisedDisplay = raised !== null ? `$${raised.toLocaleString('en-AU')}` : '$…';

  const FAQ = [
    ...FAQ_BASE,
    { q: 'Where does the money go?', a: `Straight into Season 2 production. The goal is $${goal.toLocaleString('en-AU')} AUD — the progress bar on this page is live, and every credential moves it.` },
  ];

  return (
    <div className="bg-[#EDEFED] text-[#1A1C1A] font-serif antialiased selection:bg-[#059669] selection:text-white min-h-screen lg:h-screen lg:overflow-hidden flex flex-col justify-between py-4 lg:py-6 px-4 lg:px-8 relative">

      <LockInDialog open={dialog.open} layer={dialog.layer} onClose={closeDialog} />

      {/* Background ambient light */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full opacity-35" style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.12), transparent 70%)' }} />
        <div className="absolute -bottom-56 -right-32 w-[720px] h-[720px] rounded-full opacity-40" style={{ background: 'radial-gradient(circle, rgba(57,255,20,0.08), transparent 70%)' }} />
      </div>

      {/* shared nav */}
      <SiteNav
        variant="inline"
        crumbs={[
          { label: 'Galaxy', href: '/exhibitions/galaxy' },
          { label: 'Orbit 77' },
        ]}
        status={{ label: 'For support', live: true }}
      />

      {/* Main dashboard content */}
      <main className="relative z-10 w-full max-w-7xl mx-auto flex-grow grid grid-cols-1 lg:grid-cols-[1.05fr_1.3fr_1.05fr] gap-4 lg:gap-6 my-4 overflow-y-auto lg:overflow-hidden h-full">

        {/* LEFT COLUMN: Identity & What You Fund */}
        <div className="rise-col rise-col-1 flex flex-col gap-4 lg:gap-5 h-full lg:overflow-hidden">

          {/* Identity panel */}
          <div className="panel-lift rounded-3xl bg-white/70 backdrop-blur-sm p-6 ring-1 ring-black/5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className={`rounded-full bg-black/5 text-[#3A4A3E] px-2.5 py-1 ${T.micro} font-mono tracking-wider uppercase`}>
                Global · Podcast Archive
              </span>
              <span className={`rounded-full bg-[#059669]/10 text-[#047857] px-2.5 py-1 ${T.micro} font-mono font-semibold uppercase tracking-wider`}>
                Funding S2
              </span>
            </div>
            <h1 className={`${T.display} font-bold tracking-tight mb-2 leading-none`}>
              Orbit 77
            </h1>
            <p className={`font-serif italic ${T.heading} text-[#059669] mb-4 leading-snug`}>
              Real conversations. No filters. No script. No bullshit.
            </p>
            <p className={`${T.body} text-[#3A4A3E] leading-relaxed`}>
              A podcast recorded from Australia exploring life, creation, identity — and what we leave behind. {CONFIG.EPISODES_LIVE} episodes live. Built for permanence, not virality.
            </p>
          </div>

          {/* What you fund */}
          <div className="panel-lift rounded-3xl bg-white/70 backdrop-blur-sm p-6 ring-1 ring-black/5 flex-grow flex flex-col shadow-sm lg:overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`font-mono ${T.small} font-bold uppercase tracking-wider text-[#6B8070]`}>
                What You Fund
              </h2>
              <span className={`font-mono ${T.micro} text-[#059669] bg-[#059669]/10 px-2 py-0.5 rounded-full font-bold`}>
                4 pieces
              </span>
            </div>

            <div className="flex-grow overflow-y-auto pr-1 space-y-3 custom-scrollbar">
              {WHAT_YOU_FUND.map((item) => (
                <div
                  key={item.title}
                  className="p-3 rounded-2xl bg-white/50 border border-white/40 hover:bg-white hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`flex w-4.5 h-4.5 shrink-0 items-center justify-center rounded-full bg-[#059669]/10 text-[#059669] ${T.micro} font-mono font-bold`}>✓</span>
                    <h3 className={`${T.body} font-bold text-[#1A1C1A]`}>{item.title}</h3>
                  </div>
                  <p className={`${T.small} text-[#6B8070] pl-6 leading-relaxed`}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Orbit sphere + live funding bar + stats */}
        <div className="rise-col rise-col-2 flex flex-col gap-4 lg:gap-5 h-full">

          {/* Monolith (dark, orbit aesthetic) */}
          <div className="rounded-[32px] bg-[#0A120D] border border-white/5 shadow-2xl p-6 relative flex flex-col items-center justify-center flex-grow min-h-[380px] lg:min-h-0 overflow-hidden">
            {/* Subtle green grid overlay — transmission feel */}
            <div
              className="absolute inset-0 pointer-events-none z-0 opacity-[0.08]"
              style={{
                backgroundImage: 'linear-gradient(to right, #39FF14 1px, transparent 1px), linear-gradient(to bottom, #39FF14 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(57,255,20,0.08),transparent_60%)] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center py-2">
              <OrbitSphere />
              <p className={`mt-6 text-center ${T.micro} font-mono text-[#86efac]/70 uppercase tracking-[0.22em]`}>
                Season 1 complete · Season 2 in orbit
              </p>
            </div>

            {/* Live funding bar — the page's heartbeat */}
            <div className="relative z-20 w-full mt-4">
              <div className="flex items-baseline justify-between mb-1.5">
                <span className={`font-mono ${T.micro} uppercase tracking-wider text-[#86efac]/70`}>Season 2 fund</span>
                <span className={`font-mono ${T.micro} font-bold text-[#86efac]`}>
                  {raised !== null ? `${raisedDisplay} / $${goal.toLocaleString('en-AU')} AUD` : 'loading…'}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden ring-1 ring-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ type: 'spring', stiffness: 60, damping: 20, delay: 0.3 }}
                  className="h-full rounded-full bg-[#39FF14] shadow-[0_0_12px_rgba(57,255,20,0.5)]"
                />
              </div>
              <p className={`${T.micro} font-mono text-white/40 mt-2 text-center uppercase tracking-wider`}>
                every credential moves this bar
              </p>
            </div>
          </div>

          {/* Stats — Block A (live) */}
          <div className="grid grid-cols-4 gap-2 shrink-0">
            {[
              { label: 'Episodes', value: String(CONFIG.EPISODES_LIVE), desc: 'live on YouTube' },
              { label: 'Raised', value: raisedDisplay, desc: 'Season 2 fund · live' },
              { label: 'Goal', value: `$${(goal / 1000).toFixed(goal % 1000 === 0 ? 0 : 1)}k`, desc: 'AUD · draft v1' },
              { label: 'Progress', value: `${Math.round(pct)}%`, desc: 'funded' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-white/70 backdrop-blur-sm p-3 ring-1 ring-black/5 hover:bg-white transition-all shadow-sm text-center"
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
        </div>

        {/* RIGHT COLUMN: Contribution layers + Risks */}
        <div className="rise-col rise-col-3 flex flex-col gap-4 lg:gap-5 h-full lg:overflow-hidden">

          {/* Contribution layers */}
          <div className="panel-lift rounded-3xl bg-white/70 backdrop-blur-sm p-6 ring-1 ring-black/5 shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <h2 className={`font-mono ${T.small} font-bold uppercase tracking-wider text-[#6B8070]`}>
                Contribution Layers
              </h2>
              <span className={`font-mono ${T.micro} text-[#6B8070]/70 uppercase tracking-wider`}>
                draft v1
              </span>
            </div>
            <p className={`${T.micro} text-[#6B8070] mb-4 italic`}>
              Funding the journey · no equity, no return, no vote on content.
            </p>

            <div className="space-y-1.5">
              {CONTRIBUTION_LAYERS.map((layer) => (
                <button
                  key={layer.name}
                  type="button"
                  onClick={() => openDialog(layer)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all group text-left ${
                    layer.featured
                      ? 'bg-[#059669]/5 border-2 border-[#059669] hover:bg-[#059669]/10'
                      : 'bg-white/50 border border-white/40 hover:bg-white'
                  }`}
                >
                  <div className="pr-2 min-w-0">
                    <div className={`font-bold text-[#1A1C1A] group-hover:text-[#059669] transition-colors flex items-center gap-1.5 ${T.body}`}>
                      <span className="truncate">{layer.name}</span>
                      {layer.featured && (
                        <span className={`font-mono ${T.micro} bg-[#059669] text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0`}>
                          Entry
                        </span>
                      )}
                    </div>
                    <div className={`${T.small} text-[#6B8070] mt-0.5 line-clamp-1`}>{layer.sub}</div>
                  </div>
                  <span className={`font-mono font-bold ${layer.kind === 'form' ? 'text-[#6B8070] bg-black/5' : 'text-[#059669] bg-[#059669]/10'} px-2 py-0.5 rounded shrink-0 ${T.small}`}>
                    {layer.tagline}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* The Honest Risks */}
          <div className="panel-lift rounded-3xl bg-white/70 backdrop-blur-sm p-6 ring-1 ring-black/5 flex-grow flex flex-col justify-between shadow-sm lg:overflow-hidden">
            <div className="lg:overflow-hidden flex flex-col flex-grow">
              <h2 className={`font-mono ${T.small} font-bold uppercase tracking-wider text-red-700/80 mb-3 shrink-0 flex items-center gap-1.5`}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                The Honest Risks
              </h2>

              <div className="flex-grow overflow-y-auto space-y-3 custom-scrollbar pr-1">
                {RISKS.map((risk) => (
                  <div key={risk.title} className="p-2.5 rounded-xl bg-red-50/20 border border-red-100/10">
                    <div className={`${T.small} font-bold text-red-950 mb-0.5`}>⚠️ {risk.title}</div>
                    <p className={`${T.small} text-[#3A4A3E] leading-relaxed pl-3`}>{risk.desc}</p>
                  </div>
                ))}

                {/* What contributors DO NOT get */}
                <div className="border-t border-black/5 pt-2 mt-2">
                  <div className={`font-mono ${T.micro} uppercase tracking-wider text-[#6B8070] mb-1.5`}>What you don&rsquo;t get</div>
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

            <button
              type="button"
              onClick={() => setShowDrawer(true)}
              className={`w-full text-center mt-3 bg-white/90 hover:bg-white py-2.5 rounded-2xl font-mono ${T.small} font-bold text-[#6B8070] hover:text-[#059669] transition-colors border border-black/5 shrink-0 uppercase tracking-wider`}
            >
              Read FAQ &amp; Origin Story →
            </button>
          </div>
        </div>
      </main>

      {/* Slide-over Drawer — Origin Story + FAQ */}
      <AnimatePresence>
        {showDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDrawer(false)}
              className="fixed inset-0 bg-[#020503] z-40 cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0A120D] text-[#F4EFEA] z-50 p-6 md:p-8 shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                  <h3 className="font-serif italic text-2xl text-[#F4EFEA]">The Origin Story</h3>
                  <button
                    onClick={() => setShowDrawer(false)}
                    className={`flex w-7 h-7 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white font-mono ${T.small} transition-colors`}
                  >✕</button>
                </div>

                {/* Founders' quote */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 mb-8">
                  <p className={`font-serif italic ${T.heading} leading-relaxed text-[#F4EFEA] mb-4`}>
                    &ldquo;We didn&rsquo;t want an audience. We wanted an archive — conversations
                    that still matter in twenty years. Every supporter is engraved in it, permanently.&rdquo;
                  </p>
                  <div className="text-right">
                    <span className={`block ${T.small} font-bold text-[#F4EFEA]`}>Pablo &amp; Eduardo</span>
                    <span className={`block ${T.micro} text-[#86efac]/60 font-mono uppercase tracking-wider`}>Founders · Orbit 77, Australia</span>
                  </div>
                </div>

                {/* Verify Links */}
                <div className="mb-6">
                  <div className={`font-mono ${T.micro} uppercase tracking-wider text-[#86efac]/60 mb-2`}>Verify Links</div>
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

                {/* FAQ */}
                <h4 className={`font-mono ${T.micro} font-bold uppercase tracking-wider text-[#86efac]/60 mb-3`}>
                  Quick FAQ
                </h4>
                <div className="space-y-4">
                  {FAQ.map(item => (
                    <div key={item.q} className="border-b border-white/5 pb-3 last:border-b-0">
                      <h5 className={`${T.body} font-bold text-[#F4EFEA] mb-1 leading-snug`}>{item.q}</h5>
                      <p className={`${T.small} text-white/60 leading-relaxed`}>{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/5 pt-6 mt-8 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDrawer(false);
                    const big = CONTRIBUTION_LAYERS.find(l => l.kind === 'form');
                    if (big) openDialog(big);
                  }}
                  className={`w-full text-center rounded-full bg-white/5 hover:bg-white/10 text-white py-3 font-mono ${T.small} font-bold transition-all border border-white/10 uppercase tracking-wider`}
                >
                  Contact the founders
                </button>
                <Link
                  href="/exhibitions/galaxy/orbit/join"
                  className={`block text-center font-mono ${T.micro} text-white/50 hover:text-[#F4EFEA] transition-colors uppercase tracking-wider`}
                >
                  Or join the crew →
                </Link>
                <span className={`block text-center font-mono ${T.micro} text-white/40`}>
                  {CONFIG.CONTACT_EMAIL}
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SiteFooter />

      {/* Custom scrollbar styles */}
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
