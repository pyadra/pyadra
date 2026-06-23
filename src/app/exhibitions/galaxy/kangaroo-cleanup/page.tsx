'use client';

import {
  animate,
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import PyadraLogo from '@/app/components/brand/PyadraLogo';

/* ------------------------------------------------------------------ */
/*  PYADRA — Acquisition № 04 · Kangaroo Cleanup                       */
/*  Opportunity dossier (not a service landing). 7 sections.           */
/*  ONE wow moment: The Deal. Every CTA opens the same ContactDialog,  */
/*  which posts to /api/contact (Resend → eduardo@pyadra.io).          */
/* ------------------------------------------------------------------ */

/* template.tsx dissolve takes ~1.5s — entrance starts after it */
const ENTER = 0.75;

const SPRING = { type: 'spring' as const, stiffness: 130, damping: 18, mass: 0.9 };

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { type: 'spring' as const, stiffness: 110, damping: 22 },
};

const PUBLIC_LINKS = [
  { label: 'Airtasker', href: 'https://www.airtasker.com/users/a9226792b540-p-29587653/' },
  { label: 'Instagram', href: 'https://www.instagram.com/kangaroocleanup' },
  { label: 'Website', href: 'https://kangaroocleanup.com.au' },
];

const TAKEOVER = [
  {
    num: '01',
    title: 'A name Sydney already trusts',
    body: "Brand, logo, identity — plus a 5.0 reputation built one honest job at a time. You can't buy reviews. You're inheriting them.",
  },
  {
    num: '02',
    title: 'Channels that already ring',
    body: 'Phone, WhatsApp, website, Instagram, email. Customers messaging today. Day one, you have inbound — not a cold start.',
  },
  {
    num: '03',
    title: 'The pricing playbook',
    body: "What to charge, how to quote, which Sydney disposal sites to use and what they cost. The margin lives here — written down, not guessed.",
  },
  {
    num: '04',
    title: 'The mistakes, already paid for',
    body: 'Which jobs make money, which to walk away from. You start on year two, not year zero.',
  },
];

const NUMBERS = [
  { value: '~$30k', sub: 'AUD · FY2025' },
  { value: '~$23k', sub: 'AUD · FY2024' },
  { value: '↑', sub: 'grew every year' },
  { value: '2 yrs', sub: 'to a known name' },
];

const STORY = [
  { year: '2023', text: 'Eduardo, a Latin American student in Sydney, starts the business with a second-hand ute. No contacts, no capital.' },
  { year: '2025', text: 'Its best year yet. Then he relocates to Perth and sells the ute.' },
  { year: 'Today', text: "The phone keeps ringing. Customers still messaging — jobs no one is there to take." },
];

const DEALS = [
  {
    badge: '①',
    name: 'Grow Together',
    chip: "Founder's pick",
    price: '$5,000',
    sub: 'AUD up front · 8% of yearly revenue, shared',
    desc: "The lowest door in. You keep your cash for the van and tools, and we grow this together over the years. The one I'd shake hands on.",
    featured: true,
  },
  {
    badge: '②',
    name: 'Shared Path',
    chip: null,
    price: '$8,000',
    sub: 'AUD up front · 5% of yearly revenue, shared',
    desc: 'Bigger step in, lighter share. Solid commitment, real upside left for both sides.',
    featured: false,
  },
  {
    badge: '③',
    name: 'Take the Wheel',
    chip: null,
    price: '$12,000',
    sub: 'AUD up front · 3% of yearly revenue, shared',
    desc: 'Most up front, smallest share. For the operator who wants it almost clean and keeps nearly everything they earn.',
    featured: false,
  },
];

const RISKS = [
  { t: "It's physical work", b: "Lifting, logistics, showing up. No remote version. You have to be in Sydney." },
  { t: 'Competition is real', b: "Other operators work this city. Demand shifts by season and suburb." },
  { t: 'Reputation is daily', b: 'The 5.0 helps you win — it doesn’t win for you. Keep the standard.' },
  { t: 'Numbers get verified', b: 'Founder-recorded revenue, confirmed in due diligence. Nothing closes without a written, legally-reviewed agreement.' },
];

const NOT_INCLUDED = [
  { item: 'The ute', note: 'it was sold. You bring your own vehicle.' },
  { item: 'The ABN', note: 'you operate under your own legal structure.' },
  { item: 'A guarantee', note: "it's a service business. Results depend on you." },
];

/* ---------- pieces ---------- */

type PillProps = {
  children: React.ReactNode;
  primary?: boolean;
} & ({ href: string; onClick?: undefined } | { href?: undefined; onClick: () => void });

function PillButton(props: PillProps) {
  const { primary = false, children } = props;
  const className = `inline-block rounded-full px-7 py-3.5 text-sm font-semibold tracking-tight ${
    primary
      ? 'bg-[#059669] text-white shadow-lg shadow-[#059669]/25'
      : 'bg-white text-[#1A1C1A] ring-1 ring-[#1A1C1A]/10 shadow-sm'
  }`;
  const motionMods = {
    whileHover: { scale: 1.04, y: -2 },
    whileTap: { scale: 0.96 },
    transition: { type: 'spring' as const, stiffness: 350, damping: 17 },
  };

  if ('onClick' in props && props.onClick) {
    return (
      <motion.button type="button" onClick={props.onClick} {...motionMods} className={className}>
        {children}
      </motion.button>
    );
  }
  return (
    <motion.a href={props.href!} {...motionMods} className={className}>
      {children}
    </motion.a>
  );
}

function CountUp({
  to,
  decimals = 0,
  suffix = '',
}: {
  to: number;
  decimals?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(fromRef.current, to, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        setValue(v);
        fromRef.current = v;
      },
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function Stars() {
  return (
    <span className="inline-flex gap-0.5" aria-label="5.0 rating">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0, rotate: -30 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.3 + i * 0.08 }}
          className="text-[#059669] text-base leading-none"
        >
          ★
        </motion.span>
      ))}
    </span>
  );
}

/* The artifact — a physical object. Tilt it, grab it, throw it. */
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
        style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(5,150,105,0.14), transparent 70%)' }}
      />
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          drag
          dragSnapToOrigin
          dragElastic={0.18}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 18 }}
          whileHover={{ scale: 1.03 }}
          whileDrag={{ scale: 1.07, rotate: 2 }}
          style={{ rotateX, rotateY, transformPerspective: 900 }}
          className="relative cursor-grab active:cursor-grabbing touch-none"
        >
          <Image
            src="/images/kangaroo/kangaroo_logo.png"
            alt="Kangaroo Cleanup brand mark"
            width={500}
            height={500}
            priority
            draggable={false}
            className="w-full h-auto select-none pointer-events-none drop-shadow-[0_30px_40px_rgba(5,150,105,0.25)]"
          />
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ENTER + 1.6, ...SPRING }}
            className="absolute -top-3 -right-3 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-semibold text-[#1A1C1A] shadow-md ring-1 ring-[#1A1C1A]/10 rotate-3"
          >
            grab me ✦
          </motion.span>
        </motion.div>
      </motion.div>
      <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-[#6B8070]">
        The brand · Sydney, 2023
      </p>
    </div>
  );
}

/* ---------- contact dialog ---------- */

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
    'w-full bg-transparent border-0 border-b border-[#1A1C1A]/15 rounded-none px-0 py-2.5 text-[15px] text-[#1A1C1A] placeholder:text-[#6B8070]/60 focus:outline-none focus:border-[#059669] transition-colors disabled:opacity-50';
  return (
    <label className="block">
      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#6B8070] mb-1">
        {label} {required && <span className="text-[#059669]">*</span>}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
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
          autoComplete={
            type === 'email' ? 'email' : type === 'tel' ? 'tel' : label.toLowerCase() === 'name' ? 'name' : 'off'
          }
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

  /* esc to close */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  /* lock body scroll while open */
  useEffect(() => {
    if (!open) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = orig;
    };
  }, [open]);

  /* reset after dialog finishes closing post-success */
  useEffect(() => {
    if (open || status !== 'success') return;
    const t = setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setStatus('idle');
      setErrorMsg('');
    }, 400);
    return () => clearTimeout(t);
  }, [open, status]);

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
            className="absolute inset-0 bg-[#0A120E]/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={status === 'sending' ? undefined : onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-dialog-title"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24 }}
            className="relative z-10 w-full max-w-md rounded-[28px] bg-white shadow-2xl ring-1 ring-[#1A1C1A]/8 max-h-[92vh] overflow-y-auto"
          >
            {/* close X */}
            <button
              type="button"
              onClick={status === 'sending' ? undefined : onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#EDEFED] text-[#3A4A3E] flex items-center justify-center text-[15px] font-bold hover:bg-[#059669]/10 hover:text-[#059669] transition-colors"
            >
              ×
            </button>

            {status === 'success' ? (
              <div className="p-8 md:p-10 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                  className="inline-flex w-14 h-14 items-center justify-center rounded-full bg-[#059669]/12 text-[#059669] text-2xl font-bold mb-5"
                >
                  ✓
                </motion.div>
                <p className="font-serif italic text-3xl md:text-4xl font-light text-[#1A1C1A] mb-3 leading-tight">
                  Got it.
                </p>
                <p className="text-[15px] text-[#3A4A3E] leading-relaxed mb-7 max-w-xs mx-auto">
                  Eduardo got your details. He&rsquo;ll reach out personally —
                  usually within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[13px] font-semibold text-[#059669] hover:underline"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="p-7 md:p-9">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#059669] mb-3">
                  Leave your details
                </div>
                <h3
                  id="contact-dialog-title"
                  className="font-serif text-3xl md:text-[2.25rem] font-light italic tracking-tight leading-[1.1] mb-3"
                >
                  Eduardo will call you.
                </h3>
                <p className="text-[14px] text-[#3A4A3E] leading-relaxed mb-7">
                  Drop your contact and a short note if you want.
                  He answers personally — no team, no funnel.
                </p>

                <div className="space-y-5">
                  <Field
                    label="Name"
                    value={name}
                    onChange={setName}
                    required
                    disabled={status === 'sending'}
                    autoFocus
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    required
                    disabled={status === 'sending'}
                  />
                  <Field
                    label="Phone"
                    type="tel"
                    placeholder="optional — he can call you"
                    value={phone}
                    onChange={setPhone}
                    disabled={status === 'sending'}
                  />
                  <Field
                    label="Anything to say first?"
                    placeholder="optional"
                    value={message}
                    onChange={setMessage}
                    disabled={status === 'sending'}
                    textarea
                  />
                </div>

                <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6B8070]">
                  Interest: <span className="text-[#1A1C1A]">{model}</span>
                </div>

                {status === 'error' && (
                  <p className="text-[13px] text-[#8B4444] mt-4 leading-relaxed">
                    {errorMsg || 'Something went wrong.'} You can email{' '}
                    <a
                      href="mailto:eduardo@pyadra.io"
                      className="font-semibold underline text-[#8B4444] hover:text-[#1A1C1A]"
                    >
                      eduardo@pyadra.io
                    </a>{' '}
                    instead.
                  </p>
                )}

                <motion.button
                  type="submit"
                  disabled={status === 'sending' || !name.trim() || !email.trim()}
                  whileHover={{ scale: status === 'sending' ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 17 }}
                  className="mt-7 w-full rounded-full bg-[#059669] text-white px-6 py-3.5 text-sm font-semibold shadow-lg shadow-[#059669]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {status === 'sending' ? 'Sending…' : 'Send to Eduardo'}
                </motion.button>

                <p className="text-[11px] text-[#6B8070] text-center mt-4 leading-relaxed">
                  Goes straight to <span className="font-mono">eduardo@pyadra.io</span> · no list, no spam.
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- the page ---------- */

export default function KangarooCleanupPage() {
  const [stats, setStats] = useState({ tasks: 248, reviews: 213 });
  const [dialog, setDialog] = useState<{ open: boolean; model: string }>({
    open: false,
    model: 'Open conversation',
  });

  const openDialog = (model = 'Open conversation') => setDialog({ open: true, model });
  const closeDialog = () => setDialog((d) => ({ ...d, open: false }));

  useEffect(() => {
    let cancelled = false;
    fetch('/api/airtasker-stats')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { tasks?: number; reviews?: number } | null) => {
        if (cancelled || !data) return;
        if (typeof data.tasks === 'number' && typeof data.reviews === 'number') {
          setStats({ tasks: data.tasks, reviews: data.reviews });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-[#EDEFED] text-[#1A1C1A] overflow-x-clip antialiased selection:bg-[#059669] selection:text-white">

      <ContactDialog open={dialog.open} model={dialog.model} onClose={closeDialog} />

      {/* floating pill nav */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: ENTER, ...SPRING }}
        className="fixed top-4 inset-x-0 z-50 flex justify-center px-4"
      >
        <div className="flex items-center gap-1 rounded-full bg-white/80 backdrop-blur-md shadow-lg shadow-[#1A1C1A]/5 ring-1 ring-[#1A1C1A]/5 pl-5 pr-1.5 py-1.5">
          <Link href="/" aria-label="Pyadra · Home" className="flex items-center gap-2 mr-2 group">
            <PyadraLogo size={22} />
            <span className="text-sm font-bold tracking-tight transition-colors group-hover:text-[#059669]">
              Pyadra
            </span>
          </Link>
          <Link
            href="/exhibitions/galaxy"
            className="hidden sm:block rounded-full px-3.5 py-2 text-[13px] font-medium text-[#3A4A3E] hover:bg-[#EDEFED] transition-colors"
          >
            ← All projects
          </Link>
          <span className="hidden md:block rounded-full px-3.5 py-2 text-[13px] font-medium text-[#6B8070]">
            Kangaroo Cleanup
          </span>
          <motion.button
            type="button"
            onClick={() => openDialog('Open conversation')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 17 }}
            className="rounded-full bg-[#059669] text-white px-5 py-2 text-[13px] font-semibold shadow-sm shadow-[#059669]/20"
          >
            Contact
          </motion.button>
        </div>
      </motion.nav>

      {/* ============ 1 · HERO ============ */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full opacity-60"
            style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.10), transparent 65%)' }}
          />
          <div
            className="absolute -bottom-56 -right-32 w-[720px] h-[720px] rounded-full opacity-60"
            style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.10), transparent 65%)' }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 w-full grid md:grid-cols-[7fr_5fr] gap-14 md:gap-10 items-center pt-28 pb-20">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: ENTER + 0.1, ...SPRING }}
              className="inline-flex items-center gap-2 rounded-full bg-[#059669]/10 text-[#047857] px-4 py-2 text-[12px] font-semibold mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
              Looking for its next operator
            </motion.span>

            <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.035em] leading-[1.02] mb-7">
              {[
                'Someone built this',
                'from zero in Sydney.',
                "Now it's waiting for",
                'its next operator.',
              ].map((line, i, arr) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ delay: ENTER + 0.2 + i * 0.09, type: 'spring', stiffness: 110, damping: 20 }}
                  >
                    {i === arr.length - 1 ? <span className="text-[#059669]">{line}</span> : line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ENTER + 0.55, ...SPRING }}
              className="text-lg md:text-xl text-[#3A4A3E] leading-snug max-w-md mb-10"
            >
              A 5.0-rated removal &amp; recycling business in Sydney —
              with customers still messaging today.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ENTER + 0.7, ...SPRING }}
            >
              <PillButton onClick={() => openDialog('Open conversation')} primary>
                Take this over →
              </PillButton>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: ENTER + 0.5, type: 'spring', stiffness: 90, damping: 16 }}
            className="max-w-[300px] md:max-w-[360px] mx-auto w-full"
          >
            <PhysicalCard />
          </motion.div>
        </div>
      </section>

      {/* ============ 2 · THE OPPORTUNITY ============ */}
      <section id="opportunity" className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <motion.h2 {...fadeUp} className="text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.05] mb-5 max-w-2xl">
          What you&rsquo;d take over.
        </motion.h2>
        <motion.p {...fadeUp} className="text-lg text-[#3A4A3E] max-w-xl mb-16">
          Four things, all already paid for in years and real money.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-12 mb-24">
          {TAKEOVER.map((item, i) => (
            <motion.div
              key={item.num}
              {...fadeUp}
              transition={{ ...SPRING, delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              className="group"
            >
              <div className="font-mono text-4xl md:text-5xl font-light text-[#059669]/35 leading-none mb-4 tracking-tight transition-colors duration-300 group-hover:text-[#059669]/60">
                {item.num}
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2.5 leading-tight">
                {item.title}
              </h3>
              <p className="text-[15px] text-[#3A4A3E] leading-relaxed max-w-md">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp} className="mb-12">
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#059669]">revenue</span>
            <span className="text-[13px] text-[#6B8070]">what it actually did</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {NUMBERS.map((n, i) => (
              <motion.div
                key={n.sub}
                {...fadeUp}
                transition={{ ...SPRING, delay: i * 0.05 }}
                whileHover={{ y: -3, scale: 1.01 }}
                className="rounded-3xl bg-white p-6 md:p-7 shadow-sm ring-1 ring-[#1A1C1A]/5 transition-shadow hover:shadow-md"
              >
                <div className="text-3xl md:text-[2.4rem] font-bold tracking-tight mb-2 leading-none">{n.value}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6B8070]">{n.sub}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="border-t border-[#1A1C1A]/10 pt-10">
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#059669]">proof</span>
            <span className="text-[13px] text-[#6B8070]">public &amp; verifiable right now</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
            <div>
              <div className="text-3xl md:text-4xl font-bold tracking-tight leading-none mb-1">
                <CountUp to={stats.tasks} />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6B8070]">jobs</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold tracking-tight leading-none mb-1">
                <CountUp to={stats.reviews} />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6B8070]">reviews</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold tracking-tight leading-none mb-1 flex items-center gap-2">
                <CountUp to={5} decimals={1} />
                <Stars />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6B8070]">rating</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold tracking-tight leading-none mb-1">
                <CountUp to={100} suffix="%" />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6B8070]">completion</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-medium text-[#6B8070] mr-1">Verify before you even message:</span>
            {PUBLIC_LINKS.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 350, damping: 17 }}
                className="rounded-full bg-white px-3.5 py-1.5 text-[12px] font-semibold ring-1 ring-[#1A1C1A]/10 shadow-sm hover:text-[#059669] transition-colors"
              >
                {link.label} ↗
              </motion.a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ============ 3 · WHY IT'S FOR SALE ============ */}
      <section id="why" className="max-w-5xl mx-auto px-6 py-20 md:py-28">
        <motion.h2 {...fadeUp} className="text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.05] mb-10">
          Why it&rsquo;s for sale.
        </motion.h2>

        <div className="relative grid md:grid-cols-3 gap-10 md:gap-8 mb-12">
          <div
            aria-hidden
            className="hidden md:block absolute top-[7px] left-3 right-3 h-px bg-gradient-to-r from-transparent via-[#1A1C1A]/12 to-transparent"
          />
          {STORY.map((step, i) => (
            <motion.div
              key={step.year}
              {...fadeUp}
              transition={{ ...SPRING, delay: i * 0.08 }}
              className="relative"
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`relative z-10 rounded-full ${
                    i === STORY.length - 1
                      ? 'w-4 h-4 bg-[#059669] ring-4 ring-[#059669]/15'
                      : 'w-3.5 h-3.5 bg-[#1A1C1A]/35 ring-4 ring-[#EDEFED]'
                  }`}
                />
                <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-[#3A4A3E]">
                  {step.year}
                </span>
              </div>
              <p className="text-[15px] text-[#3A4A3E] leading-relaxed max-w-xs">{step.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          {...fadeUp}
          transition={{ ...SPRING, delay: 0.2 }}
          className="font-serif italic text-xl md:text-2xl font-light leading-snug text-[#1A1C1A] max-w-2xl"
        >
          It didn&rsquo;t stop because it failed.
          It stopped because one person can&rsquo;t run a Sydney business from Perth.
        </motion.p>
      </section>

      {/* ============ 4 · THE DEAL (wow) ============ */}
      <section id="deal" className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(60% 55% at 50% 45%, rgba(5,150,105,0.10), transparent 70%)' }}
        />

        <div className="relative max-w-6xl mx-auto px-6 py-32 md:py-48">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ type: 'spring', stiffness: 110, damping: 22 }}
            className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#059669] flex items-center gap-3 mb-10 justify-center"
          >
            <span className="w-8 h-px bg-[#059669]/40" />
            the deal
            <span className="w-8 h-px bg-[#059669]/40" />
          </motion.div>

          <motion.h2
            {...fadeUp}
            className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] font-light italic tracking-[-0.015em] leading-[1.0] mb-8 text-center"
          >
            Three ways in.
          </motion.h2>

          <motion.p
            {...fadeUp}
            transition={{ ...SPRING, delay: 0.08 }}
            className="font-serif text-xl md:text-2xl font-light leading-[1.45] text-[#3A4A3E] text-center max-w-2xl mx-auto mb-20"
          >
            Less up front means more we share as it grows — for as long as it runs.
            <br className="hidden md:block" />
            Every path, you operate. I stay out of your way.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-5 md:gap-6 items-stretch">
            {DEALS.map((deal, i) => (
              <motion.div
                key={deal.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ ...SPRING, delay: i * 0.1 }}
                whileHover={{ y: deal.featured ? -10 : -6 }}
                className={`relative rounded-[32px] bg-white p-8 md:p-10 flex flex-col ${
                  deal.featured
                    ? 'ring-2 ring-[#059669] shadow-[0_30px_80px_-20px_rgba(5,150,105,0.45)] md:scale-[1.04] md:-my-2 z-10'
                    : 'ring-1 ring-[#1A1C1A]/8 shadow-sm hover:shadow-md transition-shadow'
                }`}
              >
                {deal.chip && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#059669] text-white px-4 py-1.5 text-[11px] font-bold shadow-md whitespace-nowrap">
                    {deal.chip}
                  </span>
                )}

                <div className="flex items-center gap-3 mb-8">
                  <span className={`text-2xl font-bold ${deal.featured ? 'text-[#059669]' : 'text-[#1A1C1A]/30'}`}>
                    {deal.badge}
                  </span>
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#3A4A3E]">
                    {deal.name}
                  </h3>
                </div>

                <div
                  className={`font-serif italic font-light tracking-tight leading-none mb-3 ${
                    deal.featured
                      ? 'text-6xl md:text-7xl text-[#059669]'
                      : 'text-5xl md:text-6xl text-[#1A1C1A]'
                  }`}
                >
                  {deal.price}
                </div>
                <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#6B8070] mb-8 leading-snug">
                  {deal.sub}
                </div>

                <p
                  className={`font-serif font-light leading-[1.55] mb-10 flex-1 ${
                    deal.featured
                      ? 'text-lg md:text-[1.15rem] text-[#1A1C1A]'
                      : 'text-[1.05rem] text-[#3A4A3E]'
                  }`}
                >
                  {deal.desc}
                </p>

                <motion.button
                  type="button"
                  onClick={() => openDialog(deal.name)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 17 }}
                  className={`block w-full text-center rounded-full px-6 py-3.5 text-sm font-semibold ${
                    deal.featured
                      ? 'bg-[#059669] text-white shadow-lg shadow-[#059669]/30'
                      : 'bg-[#EDEFED] text-[#1A1C1A] hover:bg-[#059669]/10 transition-colors'
                  }`}
                >
                  Start this conversation
                </motion.button>
              </motion.div>
            ))}
          </div>

          <motion.p
            {...fadeUp}
            transition={{ ...SPRING, delay: 0.2 }}
            className="font-serif italic text-base md:text-lg text-[#3A4A3E] text-center max-w-2xl mx-auto mt-16 leading-relaxed"
          >
            The share is calculated on the revenue you already report.
            Nothing extra to track. Every deal is confirmed in writing and legally reviewed before anything closes.
          </motion.p>
        </div>
      </section>

      {/* ============ 5 · THE HONEST PART ============ */}
      <section id="honest" className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        <motion.p {...fadeUp} className="font-serif italic text-lg md:text-xl text-[#3A4A3E] font-light mb-5 max-w-2xl leading-snug">
          Because I&rsquo;m betting on you, I won&rsquo;t hide what you&rsquo;re betting on.
        </motion.p>
        <motion.h2 {...fadeUp} className="text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.05] mb-14 max-w-2xl">
          The honest part.
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#059669] mb-6">
              What you&rsquo;ll deal with
            </h3>
            <div className="border-t border-[#1A1C1A]/10">
              {RISKS.map((risk, i) => (
                <motion.div
                  key={risk.t}
                  {...fadeUp}
                  transition={{ ...SPRING, delay: i * 0.05 }}
                  whileHover={{ x: 3 }}
                  className="py-5 border-b border-[#1A1C1A]/10"
                >
                  <h4 className="text-[15px] font-bold tracking-tight mb-1.5">{risk.t}</h4>
                  <p className="text-[14px] text-[#3A4A3E] leading-relaxed">{risk.b}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#059669] mb-6">
              What doesn&rsquo;t come with it
            </h3>
            <div className="border-t border-[#1A1C1A]/10">
              {NOT_INCLUDED.map((entry, i) => (
                <motion.div
                  key={entry.item}
                  {...fadeUp}
                  transition={{ ...SPRING, delay: i * 0.05 }}
                  whileHover={{ x: 3 }}
                  className="py-5 border-b border-[#1A1C1A]/10"
                >
                  <h4 className="text-[15px] font-bold tracking-tight mb-1.5">{entry.item}</h4>
                  <p className="text-[14px] text-[#3A4A3E] leading-relaxed">{entry.note}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-[12px] text-[#6B8070] font-medium mt-6 leading-relaxed">
              Every transfer and every record gets confirmed in due diligence before a dollar changes hands.
            </p>
          </div>
        </div>
      </section>

      {/* ============ 6 · THE FOUNDER (real photo + integrated message) ============ */}
      <section id="founder" className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-[5fr_6fr] gap-10 md:gap-14 items-start">
          {/* photo of Eduardo with the ute */}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ type: 'spring', stiffness: 95, damping: 18 }}
            className="md:sticky md:top-28"
          >
            <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden ring-1 ring-[#1A1C1A]/10 shadow-[0_30px_60px_-25px_rgba(10,18,14,0.35)]">
              <Image
                src="/images/kangaroo/kangaroo_founder.jpg"
                alt="Eduardo Díaz with the Kangaroo Cleanup ute in Sydney"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(10,18,14,0.35), transparent)' }}
              />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-90">
                  Eduardo · Sydney
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-70">
                  the founder
                </span>
              </div>
            </div>
          </motion.div>

          {/* text column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ type: 'spring', stiffness: 110, damping: 22, delay: 0.1 }}
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#059669] flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-[#059669]/40" />
              a letter from the founder
            </div>

            <p className="text-lg md:text-xl text-[#3A4A3E] leading-relaxed mb-10 max-w-xl">
              I don&rsquo;t make decisions. I don&rsquo;t run jobs. I&rsquo;m not in your inbox.
              I help you start, hand over everything I know, and step back.
              I keep a small share — because{' '}
              <span className="font-medium text-[#1A1C1A]">I only win if you win</span>.
            </p>

            <div className="font-serif italic text-xl md:text-[1.5rem] font-light leading-[1.5] text-[#1A1C1A] space-y-5 mb-10">
              <p>
                &ldquo;I showed up to a country where I knew nobody, bought a beat-up ute,
                and built this with my own hands — one honest job at a time.
                I&rsquo;m only letting it go because I had to move, not because I stopped believing in it.
              </p>
              <p>
                It&rsquo;s not easy money. It&rsquo;s early mornings, heavy lifting, and showing up
                when you said you would. If you&rsquo;re willing to graft, it pays — and it grows.
                <span className="text-[#059669] not-italic font-medium"> Take it. Make it bigger than I did.</span>&rdquo;
              </p>
            </div>

            <p className="text-[15px] font-bold tracking-tight">Eduardo Díaz</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#6B8070] mb-8">
              Founder · Sydney 2023 — Perth 2026
            </p>

            <PillButton onClick={() => openDialog('Talk to Eduardo')}>
              Leave your details for Eduardo
            </PillButton>
          </motion.div>
        </div>
      </section>

      {/* ============ 7 · NEXT STEP ============ */}
      <section className="relative max-w-6xl mx-auto px-6 py-28 md:py-40 text-center overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[420px] pointer-events-none"
          style={{ background: 'radial-gradient(60% 100% at 50% 100%, rgba(5,150,105,0.10), transparent 70%)' }}
        />
        <motion.h2 {...fadeUp} className="relative text-5xl md:text-7xl font-bold tracking-[-0.035em] leading-[1.02] mb-6">
          Take it.
          <span className="text-[#059669]"> Make it yours.</span>
        </motion.h2>
        <motion.p {...fadeUp} className="relative text-lg md:text-xl text-[#3A4A3E] max-w-xl mx-auto mb-10">
          The brand is built. The customers are still calling. It just needs someone willing to do the work.
        </motion.p>
        <motion.div {...fadeUp} className="relative">
          <PillButton onClick={() => openDialog('Open conversation')} primary>
            Take this over →
          </PillButton>
        </motion.div>
        <motion.p {...fadeUp} className="relative font-mono text-[11px] uppercase tracking-[0.22em] text-[#6B8070] mt-10">
          Financial records &amp; full playbook shared only with serious operators
        </motion.p>
      </section>

      {/* footer */}
      <footer className="max-w-6xl mx-auto px-6 pb-10">
        <div className="flex items-center justify-between flex-wrap gap-4 border-t border-[#1A1C1A]/8 pt-7">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#6B8070]">
            © 2026 Pyadra · We document. We verify. You decide.
          </span>
          <div className="flex gap-5">
            <Link href="/exhibitions/galaxy" className="text-[12px] font-medium text-[#6B8070] hover:text-[#059669] transition-colors">
              ← All projects
            </Link>
            <Link href="/" className="text-[12px] font-medium text-[#6B8070] hover:text-[#059669] transition-colors">
              Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
