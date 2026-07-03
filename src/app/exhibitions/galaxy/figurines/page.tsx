'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import SiteNav from '@/app/components/nav/SiteNav';
import SiteFooter from '@/app/components/nav/SiteFooter';
import MuseumAtmosphere from '@/app/components/ui/MuseumAtmosphere';

/* ------------------------------------------------------------------ */
/*  PYADRA — Project № 03 · Figuitoon                                  */
/*  SALE page (Pyadra dashboard for the project). The actual product   */
/*  store lives on Shopify — linked from "Make mine →".                */
/* ------------------------------------------------------------------ */

/* ============== EDITABLE CONFIG ============== */
const CONFIG = {
  PRICE_AUD: 49,
  /** Project valuation vs launch sale price — decided by owner July 2026 */
  VALUE_ANCHOR_AUD: 15_000,
  SALE_PRICE_AUD: 11_500,
  CONTACT_EMAIL: 'pyadra@pyadra.io',
  /** Live Shopify storefront */
  SHOPIFY_URL: 'https://www.figuitoon.com',
  SOCIAL: {
    instagram: 'https://www.instagram.com/figuitoon',
    /** TODO: real TikTok URL */
    tiktok: '',
  },
} as const;

const DEALS = [
  {
    name: 'Take it all',
    sub: 'Everything included — store, brand, printer, files, styles, know-how.',
    price: '$11,500',
    featured: true,
  },
  {
    name: 'Make an offer',
    sub: "Different structure? Let's talk.",
    price: "Let's talk",
    featured: false,
  },
] as const;
type Deal = typeof DEALS[number];

const WHAT_YOU_GET = [
  { title: 'The store',             desc: 'A polished Shopify e-commerce where customers order their figuitoons — products, inventory and deliveries managed in one place.' },
  { title: '100+ styles',           desc: 'More than one hundred designs across teams, sports and professions, ready to sell.' },
  { title: 'The brand',             desc: 'Name, logo, visual identity and the Instagram presence — all included.' },
  { title: 'The 3D printer',        desc: 'The Bambu printer that produces every figurine comes with the project.' },
  { title: 'The software pipeline', desc: "Turns a customer's photo into a stylized render, then into a print-ready 3D file." },
  { title: 'The know-how',          desc: "Print settings, measurements, filaments, 3D structure — and what we've learned about making it profitable." },
];

const RISKS = [
  { title: 'No sales yet',         desc: "The store and the product are real and tested, but no one has bought one yet. You'd be validating demand." },
  { title: 'Costs not yet measured', desc: "Print times are still high and the true cost per figurine isn't calculated yet. Margin is unproven." },
  { title: 'Quality still maturing', desc: 'It prints and assembles, but finish, waste and calibration still need work to reach premium quality.' },
  { title: 'Built to hand over',   desc: "It's designed to run without the original builder — but the operations manual is still being written." },
];

const FAQ = [
  { q: 'Does it really work end-to-end?', a: 'Yes — the pipeline runs from photo to physical figurine. The Shopify store is live for orders. The first paying customer is still pending; everything else has been tested.' },
  { q: 'Why $11,500 and not $15,000?', a: "The project is valued at $15,000 AUD — brand, store, styles, printer, pipeline and know-how. $11,500 is the launch price while Figuitoon is new to the museum." },
  { q: 'What exactly is for sale on this page?', a: 'The whole project — brand, Shopify store, the 3D printer, files, pipeline and know-how. Buying a figurine is a separate thing (the Make mine button).' },
  { q: 'Why $49 per figurine?', a: 'It is a launch / validation price set before the true per-figurine cost is fully measured. It may change once production costs and waste are properly calculated.' },
];

type SocialLink = { label: string; href: string };
const PUBLIC_SOCIAL: SocialLink[] = (
  [
    { label: 'Instagram', href: CONFIG.SOCIAL.instagram as string },
    { label: 'TikTok',    href: CONFIG.SOCIAL.tiktok    as string },
  ] satisfies SocialLink[]
).filter((x) => x.href.length > 0);

/* ============== Type scale — 5 deliberate steps ============== */
const T = {
  display: 'text-3xl lg:text-4xl',
  heading: 'text-base',
  body: 'text-sm',
  small: 'text-[13px]',
  micro: 'text-[11px]',
} as const;

const ENTER = 0.75;
const SPRING = { type: 'spring' as const, stiffness: 150, damping: 20 };

/* ---------- the Figuitoon logo, draggable ---------- */
/* Logo file expected at: public/figuitoon-logo.png                       */
/* If missing, the rounded white tile still renders (logo just won't show).*/

function FiguitoonOrb() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 15 });

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
      <div
        aria-hidden
        className="absolute -inset-16 pointer-events-none"
        style={{ background: 'radial-gradient(50% 50% at 50% 45%, rgba(124,58,237,0.22), transparent 70%)' }}
      />
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}>
        <motion.div
          drag
          dragSnapToOrigin
          dragElastic={0.18}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 18 }}
          whileHover={{ scale: 1.04 }}
          whileDrag={{ scale: 1.08, rotate: 3 }}
          style={{ rotateX, rotateY, transformPerspective: 900 }}
          className="relative cursor-grab active:cursor-grabbing touch-none"
        >
          <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-[36px] bg-white shadow-[0_20px_50px_rgba(124,58,237,0.35)] ring-1 ring-white/40 flex items-center justify-center p-6 overflow-hidden">
            <Image
              src="/figuitoon-logo.png"
              alt="Figuitoon"
              width={520}
              height={260}
              priority
              draggable={false}
              className="w-full h-auto select-none pointer-events-none"
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

/* ---------- Request-info dialog (Kangaroo/EterniCapsule pattern) ---------- */

function Field({
  label, value, onChange, type = 'text', required = false, placeholder, textarea = false, emphasised = false, autoFocus = false,
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

function RequestInfoDialog({
  open, deal, onClose,
}: {
  open: boolean;
  deal: Deal | null;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const isOffer = deal?.name === 'Make an offer';

  useEffect(() => {
    if (!open) return;
    setStatus('idle');
    setErrorMsg('');
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!deal) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!deal) return;
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
          project: 'Figuitoon',
          model: deal.name,
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
                <h3 className="font-serif italic text-2xl text-[#1A1C1A] mb-2">Got it.</h3>
                <p className={`${T.body} text-[#3A4A3E] leading-relaxed mb-6 max-w-xs mx-auto`}>
                  Charina has your note. She&rsquo;ll get back to you within 24 hours.
                </p>
                <button type="button" onClick={onClose} className={`font-mono ${T.small} font-semibold text-[#059669] hover:underline`}>Close</button>
              </div>
            ) : (
              <form onSubmit={submit} className="p-6 md:p-8">
                <div className={`font-mono ${T.micro} uppercase tracking-[0.22em] text-[#059669] mb-2`}>
                  Figuitoon · Acquisition enquiry
                </div>
                <h3 className="font-serif text-2xl font-light italic leading-tight mb-2">
                  {isOffer ? 'Tell us your structure.' : 'Talk about Figuitoon.'}
                </h3>
                <p className={`${T.body} text-[#3A4A3E] leading-relaxed mb-5`}>
                  {isOffer
                    ? 'Sketch the shape of the deal you’re thinking of — upfront, share, take it independent. Charina will reply directly.'
                    : 'Leave your details below. Charina handles negotiations directly and personally.'}
                </p>

                <div className="space-y-4">
                  <Field label="Name" value={name} onChange={setName} required autoFocus />
                  <Field label="Email" type="email" value={email} onChange={setEmail} required />
                  <Field
                    label={isOffer ? 'Your offer' : 'Short note'}
                    placeholder={isOffer ? 'e.g. lower upfront + larger Pyadra share, or operate as a partner' : 'optional'}
                    value={message}
                    onChange={setMessage}
                    textarea
                    emphasised={isOffer}
                    required={isOffer}
                  />
                </div>

                <div className={`mt-4 font-mono ${T.micro} uppercase tracking-[0.18em] text-[#6B8070]`}>
                  Interest: <span className="text-[#1A1C1A] font-bold">{deal.name}</span> · <span className="text-[#059669] font-bold">{deal.price}</span>
                </div>

                {status === 'error' && (
                  <p className={`${T.small} text-red-700 mt-3`}>
                    {errorMsg || 'Something went wrong.'} Email <a href={`mailto:${CONFIG.CONTACT_EMAIL}`} className="underline font-semibold">{CONFIG.CONTACT_EMAIL}</a> instead.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending' || !name.trim() || !email.trim() || (isOffer && !message.trim())}
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

export default function FiguitoonDashboard() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [dialog, setDialog] = useState<{ open: boolean; deal: Deal | null }>({ open: false, deal: null });

  const openDialog = (deal: Deal) => setDialog({ open: true, deal });
  const closeDialog = () => setDialog(d => ({ ...d, open: false }));

  return (
    <div className="bg-[#EDEFED] text-[#1A1C1A] antialiased selection:bg-[#059669] selection:text-white min-h-screen lg:h-screen lg:overflow-hidden flex flex-col justify-between py-4 lg:py-6 px-4 lg:px-8 relative">

      <RequestInfoDialog open={dialog.open} deal={dialog.deal} onClose={closeDialog} />

      {/* Background ambient light — warm amber + cool emerald */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full opacity-35" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)' }} />
        <div className="absolute -bottom-56 -right-32 w-[720px] h-[720px] rounded-full opacity-40" style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.10), transparent 70%)' }} />
      </div>

      {/* galaxy atmosphere — grid, grain, green dust */}
      <MuseumAtmosphere />

      {/* shared nav */}
      <SiteNav
        variant="inline"
        crumbs={[
          { label: 'Galaxy', href: '/exhibitions/galaxy' },
          { label: 'Figuitoon' },
        ]}
        status={{ label: 'For sale', live: true }}
      />

      {/* Main dashboard content */}
      <main className="relative z-10 w-full max-w-7xl mx-auto flex-grow grid grid-cols-1 lg:grid-cols-[1.05fr_1.3fr_1.05fr] gap-4 lg:gap-6 my-4 overflow-y-auto lg:overflow-hidden h-full">

        {/* LEFT COLUMN: Identity + What You Get */}
        <div className="rise-col rise-col-1 flex flex-col gap-4 lg:gap-5 h-full lg:overflow-hidden">

          {/* Identity panel */}
          <div className="panel-lift rounded-3xl bg-white/70 backdrop-blur-sm p-6 ring-1 ring-black/5 shadow-sm">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={`rounded-full bg-black/5 text-[#3A4A3E] px-2.5 py-1 ${T.micro} font-mono tracking-[0.18em] uppercase`}>
                Local production · Global store
              </span>
              <span className={`rounded-full bg-[#7C3AED]/10 text-[#5B21B6] px-2.5 py-1 ${T.micro} font-mono font-semibold uppercase tracking-[0.18em]`}>
                Prototype · Pre-launch
              </span>
            </div>
            <h1 className={`${T.display} font-serif font-semibold tracking-[-0.01em] mb-2 leading-none`}>Figuitoon</h1>
            <p className={`font-serif italic ${T.heading} text-[#7C3AED] mb-4 leading-snug`}>
              Your face. Your team. Your figurine.
            </p>
            <p className={`${T.body} text-[#3A4A3E] leading-relaxed`}>
              Figuitoon turns one photo into a mini you — a 3D-printed figurine in your favourite team&rsquo;s colors, your sport or your profession. Made for gifts, keepsakes and collectors.
            </p>
          </div>

          {/* What You Get */}
          <div className="panel-lift rounded-3xl bg-white/70 backdrop-blur-sm p-6 ring-1 ring-black/5 flex-grow flex flex-col shadow-sm lg:overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`font-mono ${T.small} font-bold uppercase tracking-[0.18em] text-[#6B8070]`}>
                What You Get
              </h2>
              <span className={`font-mono ${T.micro} text-[#7C3AED] bg-[#7C3AED]/10 px-2 py-0.5 rounded-full font-bold`}>
                6 assets
              </span>
            </div>

            <div className="flex-grow overflow-y-auto pr-1 space-y-3 custom-scrollbar">
              {WHAT_YOU_GET.map((item) => (
                <div
                  key={item.title}
                  className="p-3 rounded-2xl bg-white/50 border border-white/40 hover:bg-white hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`flex w-4.5 h-4.5 shrink-0 items-center justify-center rounded-full bg-[#7C3AED]/10 text-[#7C3AED] ${T.micro} font-mono font-bold`}>✓</span>
                    <h3 className={`${T.body} font-bold text-[#1A1C1A]`}>{item.title}</h3>
                  </div>
                  <p className={`${T.small} text-[#6B8070] pl-6 leading-relaxed`}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Orb + Make-mine product CTA + metrics + expectation line */}
        <div className="rise-col rise-col-2 flex flex-col gap-4 lg:gap-5 h-full">

          {/* Warm-dark monolith with the orb and the PRODUCT CTA (amber) */}
          <div className="rounded-[32px] bg-[#1A0F2E] border border-white/5 shadow-2xl p-6 relative flex flex-col items-center justify-center flex-grow min-h-[380px] lg:min-h-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.12),transparent_60%)] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center py-2">
              <FiguitoonOrb />
            </div>

            {/* PRODUCT CTA — amber, visually distinct from the green acquisition deals */}
            <div className="relative z-20 w-full max-w-xs mt-4 text-center">
              <motion.a
                href={CONFIG.SHOPIFY_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={SPRING}
                className={`cta-glow [--glow-color:rgba(124,58,237,0.45)] block text-center rounded-full bg-[#7C3AED] text-white px-8 py-3.5 font-mono ${T.body} font-semibold tracking-wide shadow-lg shadow-[#7C3AED]/30 hover:bg-[#6D28D9] uppercase`}
              >
                Make mine →
              </motion.a>
              <p className={`font-mono ${T.micro} uppercase tracking-[0.18em] text-[#E9D5FF]/80 mt-2.5`}>
                ${CONFIG.PRICE_AUD} AUD · ships from Perth
              </p>
            </div>
          </div>

          {/* Store metrics — real, honest, no fake sales */}
          <div className="grid grid-cols-3 gap-2 shrink-0">
            {[
              { label: 'Styles',         value: '+100',                      desc: 'teams & professions' },
              { label: 'Price',          value: `$${CONFIG.PRICE_AUD} AUD`,  desc: 'launch price' },
              { label: 'Made to order',  value: '100%',                      desc: 'from your photo' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-white/70 backdrop-blur-sm p-3 ring-1 ring-black/5 hover:bg-white transition-all shadow-sm text-center"
              >
                <div className={`font-mono ${T.micro} uppercase tracking-[0.18em] text-[#6B8070] mb-0.5`}>{stat.label}</div>
                <div className={`${T.heading} font-serif font-semibold text-[#1A1C1A] leading-none mb-0.5`}>{stat.value}</div>
                <div className={`font-mono ${T.micro} text-[#6B8070] truncate leading-none`}>{stat.desc}</div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: Acquisition + Risks */}
        <div className="rise-col rise-col-3 flex flex-col gap-4 lg:gap-5 h-full lg:overflow-hidden">

          {/* Acquisition panel — Kangaroo / EterniCapsule pattern */}
          <div className="panel-lift rounded-3xl bg-white/70 backdrop-blur-sm p-6 ring-1 ring-black/5 shadow-sm">
            <h2 className={`font-mono ${T.small} font-bold uppercase tracking-[0.18em] text-[#6B8070] mb-4`}>
              Acquire the Project
            </h2>

            {/* Value anchor + launch price */}
            <div className="flex justify-between items-end border-b border-black/5 pb-3 mb-4">
              <div>
                <span className={`font-mono ${T.micro} text-[#6B8070] uppercase tracking-[0.18em]`}>Project value</span>
                <div className={`${T.heading} font-serif font-semibold text-[#1A1C1A] leading-none mt-1`}>
                  <span className="line-through decoration-[#6B8070]/50 text-[#6B8070]">${CONFIG.VALUE_ANCHOR_AUD.toLocaleString('en-AU')}</span>{' '}
                  ${CONFIG.SALE_PRICE_AUD.toLocaleString('en-AU')} AUD
                </div>
                <div className={`font-mono ${T.micro} text-[#6B8070] mt-1`}>brand, store, pipeline, printer, files, know-how</div>
              </div>
              <div className="text-right">
                <span className={`font-mono ${T.micro} text-[#6B8070] uppercase tracking-[0.18em]`}>Availability</span>
                <div className={`${T.body} font-semibold text-[#059669] leading-none mt-1`}>By conversation</div>
              </div>
            </div>

            {/* Deal cards */}
            <div className="space-y-2">
              {DEALS.map((deal) => (
                <button
                  key={deal.name}
                  type="button"
                  onClick={() => openDialog(deal)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group text-left ${
                    deal.featured
                      ? 'bg-[#059669]/5 border-2 border-[#059669] hover:bg-[#059669]/10'
                      : 'bg-white/50 border border-white/40 hover:bg-white'
                  }`}
                >
                  <div className="pr-2 min-w-0">
                    <div className={`font-bold text-[#1A1C1A] group-hover:text-[#059669] transition-colors flex items-center gap-1.5 ${T.body}`}>
                      {deal.name}
                      {deal.featured && (
                        <span className={`font-mono ${T.micro} bg-[#059669] text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-[0.18em] shrink-0`}>
                          Pick
                        </span>
                      )}
                    </div>
                    <div className={`${T.small} text-[#6B8070] mt-0.5 line-clamp-2`}>{deal.sub}</div>
                  </div>
                  <span className={`font-mono font-bold text-[#059669] bg-[#059669]/10 px-2 py-0.5 rounded shrink-0 ${T.small}`}>
                    {deal.price}
                  </span>
                </button>
              ))}
            </div>

            <p className={`${T.small} text-[#6B8070] italic leading-relaxed mt-3`}>
              Launch price — the full project for $11,500 instead of $15,000. The buyer takes everything, printer included. Final terms set in writing.
            </p>
          </div>

          {/* The Honest Risks */}
          <div className="panel-lift rounded-3xl bg-white/70 backdrop-blur-sm p-6 ring-1 ring-black/5 flex-grow flex flex-col justify-between shadow-sm lg:overflow-hidden">
            <div className="lg:overflow-hidden flex flex-col flex-grow">
              <h2 className={`font-mono ${T.small} font-bold uppercase tracking-[0.18em] text-red-700/80 mb-3 shrink-0 flex items-center gap-1.5`}>
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
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDrawer(true)}
              className={`w-full text-center mt-3 bg-white/90 hover:bg-white py-2.5 rounded-2xl font-mono ${T.small} font-bold text-[#6B8070] hover:text-[#059669] transition-colors border border-black/5 shrink-0 uppercase tracking-[0.18em]`}
            >
              Read FAQ &amp; The Full Story →
            </button>
          </div>
        </div>
      </main>

      {/* Slide-over drawer — FAQ + creator note */}
      <AnimatePresence>
        {showDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDrawer(false)}
              className="fixed inset-0 bg-[#1A0F2E] z-40 cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#1A0F2E] text-[#E9D5FF] z-50 p-6 md:p-8 shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                  <h3 className="font-serif italic text-2xl text-[#E9D5FF]">The Full Story</h3>
                  <button
                    onClick={() => setShowDrawer(false)}
                    className={`flex w-7 h-7 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white font-mono ${T.small} transition-colors`}
                  >✕</button>
                </div>

                {/* Founder */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 mb-8">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 ring-1 ring-white/10">
                    <Image
                      src="/images/figuitoon/charina_founder.jpg"
                      alt="Charina Oan, founder of Figuitoon"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 448px"
                    />
                    <span className={`absolute bottom-2 left-2 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 ${T.micro} font-mono uppercase tracking-[0.18em] text-[#E9D5FF]`}>
                      Charina · Philippines
                    </span>
                  </div>
                  <p className={`font-serif italic ${T.heading} leading-relaxed text-[#E9D5FF] mb-4`}>
                    &ldquo;I&rsquo;m from the Philippines and helping people is just who I am. Figuitoon
                    caught me because I love new things — innovating, creating something people
                    haven&rsquo;t seen before.&rdquo;
                  </p>
                  <div className="text-right">
                    <span className={`block ${T.small} font-bold text-[#E9D5FF]`}>Charina Oan</span>
                    <span className={`block ${T.micro} text-[#E9D5FF]/60 font-mono uppercase tracking-[0.18em]`}>Founder · Figuitoon, 2026</span>
                  </div>
                </div>

                {/* Verify / Try links */}
                <div className="mb-6">
                  <div className={`font-mono ${T.micro} uppercase tracking-[0.18em] text-[#E9D5FF]/60 mb-2`}>See it for yourself</div>
                  <div className="flex gap-2 flex-wrap">
                    <a
                      href={CONFIG.SHOPIFY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`rounded-full bg-[#7C3AED] text-white border border-[#7C3AED] px-3 py-1 font-mono ${T.small} hover:bg-[#6D28D9] transition-colors uppercase tracking-[0.18em]`}
                    >
                      Make mine ↗
                    </a>
                    {PUBLIC_SOCIAL.map(s => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`rounded-full bg-white/5 border border-white/10 px-3 py-1 font-mono ${T.small} hover:bg-white/10 transition-colors`}
                      >
                        {s.label} ↗
                      </a>
                    ))}
                  </div>
                </div>

                {/* FAQ */}
                <h4 className={`font-mono ${T.micro} font-bold uppercase tracking-[0.18em] text-[#E9D5FF]/60 mb-3`}>
                  Quick FAQ
                </h4>
                <div className="space-y-4">
                  {FAQ.map(item => (
                    <div key={item.q} className="border-b border-white/5 pb-3 last:border-b-0">
                      <h5 className={`${T.body} font-bold text-[#E9D5FF] mb-1 leading-snug`}>{item.q}</h5>
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
                    openDialog(DEALS.find(d => d.name === 'Make an offer')!);
                  }}
                  className={`w-full text-center rounded-full bg-white/5 hover:bg-white/10 text-white py-3 font-mono ${T.small} font-bold transition-all border border-white/10 uppercase tracking-[0.18em]`}
                >
                  Talk about Figuitoon
                </button>
                <span className={`block text-center font-mono ${T.micro} text-[#E9D5FF]/50`}>
                  {CONFIG.CONTACT_EMAIL}
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SiteFooter />

      {/* Custom scrollbar */}
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
