'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import GreenDust from '../../components/ui/GreenDust';
import PyadraLogo from '@/app/components/brand/PyadraLogo';

/* ------------------------------------------------------------------ */
/*  PYADRA — GALAXY                                                    */
/*  The orbital field of live projects.                                */
/*                                                                     */
/*  Design language: family.co (springs, pills, rounded trays, warm    */
/*  direct copy) — the spheres and orbital scene stay as they were.    */
/*                                                                     */
/*  Per Company_Master (June 2026): a project card here shows ONLY     */
/*  the hook — name, type, one line, valuation, availability, one      */
/*  action. Everything else lives inside each project's own page.     */
/*  Galaxy is the hook; the project is the story.                      */
/* ------------------------------------------------------------------ */

const ENTER = 0.75; // template.tsx dissolve ~1.5s — choreography starts after

const SPRING = { type: 'spring' as const, stiffness: 130, damping: 18, mass: 0.9 };

const PROJECTS = [
  {
    id: 'orbit',
    name: 'Orbit 77',
    type: 'Glocal',
    kind: 'Podcast',
    logo: '/orbit-logo.png',
    oneLiner: 'A podcast recorded from Australia exploring life, creation and identity.',
    stats: [
      { value: '10', label: 'episodes live' },
      { value: '12', label: 'supporters' },
    ],
    valuation: '$12,000',
    available: '49%',
    enter_url: '/exhibitions/galaxy/orbit',
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#FFFFFF,#E8E9E8,#C8C9C8)] shadow-[-10px_10px_20px_rgba(0,0,0,0.15)]',
    glow: 'bg-[#6B8070]',
    position: 'md:-translate-x-6 md:-translate-y-6 lg:-translate-x-8 lg:-translate-y-8',
  },
  {
    id: 'ethernicapsule',
    name: 'EterniCapsule',
    type: 'Global',
    kind: 'Digital vault',
    logo: null,
    oneLiner: 'A vault for words you can’t say today. Seal them — choose when they open.',
    stats: [
      { value: 'Live', label: 'and operational' },
      { value: '$9', label: 'per capsule' },
    ],
    valuation: '$4,000',
    available: '100%',
    enter_url: '/exhibitions/galaxy/ethernicapsule',
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#FFFFFF,#D4DDD6,#A0A0A0)] shadow-[-10px_10px_20px_rgba(0,0,0,0.1)]',
    glow: 'bg-white',
    position: 'md:translate-x-6 md:-translate-y-6 lg:translate-x-8 lg:-translate-y-8',
  },
  {
    id: 'figuitoon',
    name: 'Figuitoon',
    type: 'Glocal',
    kind: 'Physical product',
    logo: null,
    oneLiner: 'A collectible version of yourself — AI-designed, 3D printed, shipped to your door.',
    stats: [
      { value: '2', label: 'prototypes made' },
      { value: '$99', label: 'per figurine' },
    ],
    valuation: '$5,000',
    available: '100%',
    enter_url: '/exhibitions/galaxy/figurines',
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#3A4A3E,#1A1C1A,#050A07)] shadow-[-10px_10px_20px_rgba(0,0,0,0.25)]',
    glow: 'bg-[#3A4A3E]',
    position: 'md:-translate-x-6 md:translate-y-6 lg:-translate-x-8 lg:translate-y-8',
  },
  {
    id: 'kangaroo-cleanup',
    name: 'Kangaroo Cleanup',
    type: 'Local',
    kind: 'Service business',
    logo: null,
    oneLiner: 'A Sydney cleanup business with a 5.0 reputation — for sale to the right operator.',
    stats: [
      { value: '248', label: 'tasks completed' },
      { value: '5.0 ★', label: '213 reviews' },
    ],
    valuation: '$15,000',
    available: '95%',
    enter_url: '/exhibitions/galaxy/kangaroo-cleanup',
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#10B981,#059669,#047857,#EDEFED)] shadow-[-10px_10px_20px_rgba(0,0,0,0.15)]',
    glow: 'bg-[#059669]',
    position: 'md:translate-x-6 md:translate-y-6 lg:translate-x-8 lg:translate-y-8',
  },
];

type Project = (typeof PROJECTS)[number];

/* ---------- pieces ---------- */

const GemIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-[#059669] drop-shadow-md">
    <polygon points="50 5, 95 27.5, 95 72.5, 50 95, 5 72.5, 5 27.5" fill="currentColor" opacity="0.8" />
    <polygon points="50 20, 75 35, 75 65, 50 80, 25 65, 25 35" fill="white" opacity="0.2" />
    <polygon points="50 5, 95 27.5, 50 50, 5 27.5" fill="white" opacity="0.4" />
    <polygon points="95 27.5, 95 72.5, 50 50" fill="black" opacity="0.1" />
    <polygon points="5 27.5, 5 72.5, 50 50" fill="white" opacity="0.1" />
  </svg>
);

function MagneticSphere({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { damping: 15, stiffness: 150, mass: 0.1 });
  const mouseY = useSpring(y, { damping: 15, stiffness: 150, mass: 0.1 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) / 4);
    y.set((e.clientY - (rect.top + rect.height / 2)) / 4);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      style={{ x: mouseX, y: mouseY }}
      className="relative flex flex-col items-center justify-center cursor-pointer group"
    >
      {children}
    </motion.div>
  );
}

/* ---------- the hook tray (family-style) ---------- */

function ProjectTray({ project, onClose }: { project: Project; onClose: () => void }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#1A1C1A]/25 backdrop-blur-sm z-40"
      />

      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-3 md:p-6 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          className="pointer-events-auto w-full max-w-md rounded-[32px] bg-white shadow-2xl shadow-[#1A1C1A]/20 p-7 md:p-9 relative"
        >
          {/* close */}
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 350, damping: 17 }}
            aria-label="Close"
            className="absolute top-5 right-5 flex w-8 h-8 items-center justify-center rounded-full bg-[#EDEFED] text-[#3A4A3E] text-sm font-bold"
          >
            ✕
          </motion.button>

          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={SPRING}
              >
                <InterestForm project={project} onBack={() => setShowForm(false)} />
              </motion.div>
            ) : (
              <motion.div
                key="hook"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={SPRING}
              >
                {/* identity */}
                <div className="flex items-center gap-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#059669]/10 text-[#047857] px-3 py-1.5 text-[11px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                    {project.type}
                  </span>
                  <span className="rounded-full bg-[#EDEFED] text-[#3A4A3E] px-3 py-1.5 text-[11px] font-semibold">
                    {project.kind}
                  </span>
                </div>

                <h2 className="text-3xl font-bold tracking-[-0.03em] mb-3">{project.name}</h2>
                <p className="text-[15px] text-[#3A4A3E] leading-relaxed mb-6">{project.oneLiner}</p>

                {/* proof chips */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {project.stats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-[#EDEFED] px-4 py-3.5">
                      <div className="text-xl font-bold tracking-tight">{stat.value}</div>
                      <div className="text-[12px] font-medium text-[#6B8070]">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* the asset line */}
                <div className="flex items-center justify-between rounded-2xl ring-1 ring-[#1A1C1A]/8 px-4 py-3.5 mb-7">
                  <div>
                    <div className="text-[11px] font-semibold text-[#6B8070] mb-0.5">Project value</div>
                    <div className="text-lg font-bold tracking-tight">{project.valuation} <span className="text-[12px] font-semibold text-[#6B8070]">AUD</span></div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-semibold text-[#6B8070] mb-0.5">Available</div>
                    <div className="text-lg font-bold tracking-tight text-[#059669]">{project.available}</div>
                  </div>
                </div>

                {/* one action */}
                <motion.a
                  href={project.enter_url}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 17 }}
                  className="block text-center rounded-full bg-[#059669] text-white px-7 py-4 text-sm font-semibold shadow-lg shadow-[#059669]/25 mb-4"
                >
                  Enter the project →
                </motion.a>

                <button
                  onClick={() => setShowForm(true)}
                  className="block w-full text-center text-[13px] font-semibold text-[#6B8070] hover:text-[#059669] transition-colors"
                >
                  or express interest in owning it
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}

/* ---------- express interest (kept functional, family skin) ---------- */

function InterestForm({ project, onBack }: { project: Project; onBack: () => void }) {
  const [formData, setFormData] = useState({ model: '', name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.model || !formData.name || !formData.email) {
      setError('Please fill in the required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'express-interest', project: project.name, ...formData }),
      });
      if (!res.ok) throw new Error('failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 14 }}
          className="inline-flex w-14 h-14 items-center justify-center rounded-full bg-[#059669]/10 text-[#059669] text-2xl font-bold mb-5"
        >
          ✓
        </motion.div>
        <h3 className="text-2xl font-bold tracking-tight mb-2">Got it!</h3>
        <p className="text-[15px] text-[#3A4A3E] leading-relaxed mb-6">
          Eduardo will reach out personally within 48 hours to talk about{' '}
          <span className="font-semibold">{project.name}</span>.
        </p>
        <button onClick={onBack} className="text-[13px] font-semibold text-[#6B8070] hover:text-[#059669] transition-colors">
          ← Back to {project.name}
        </button>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-2xl bg-[#EDEFED] px-5 py-3.5 text-sm font-medium placeholder:text-[#6B8070]/70 focus:outline-none focus:ring-2 focus:ring-[#059669] transition-shadow';

  return (
    <div>
      <button
        onClick={onBack}
        className="text-[13px] font-semibold text-[#6B8070] hover:text-[#059669] transition-colors mb-5"
      >
        ← Back
      </button>

      <h3 className="text-2xl font-bold tracking-tight mb-1.5">Own {project.name}?</h3>
      <p className="text-[14px] text-[#3A4A3E] mb-6">Tell us what you have in mind — it starts with a conversation, not a checkout.</p>

      <form onSubmit={submit} className="space-y-3">
        {[
          { value: 'Partner — share revenue', label: 'Partner up', sub: 'acquire a share, split revenue' },
          { value: 'Own — take it completely', label: 'Take it completely', sub: '100% yours, operate it anywhere' },
          { value: 'Host — own it, Pyadra runs it', label: 'Own it, Pyadra runs it', sub: 'you own, we operate' },
        ].map((option) => (
          <label
            key={option.value}
            className={`flex items-center justify-between gap-3 rounded-2xl px-5 py-3.5 cursor-pointer transition-all ${
              formData.model === option.value
                ? 'bg-[#059669]/10 ring-2 ring-[#059669]'
                : 'bg-[#EDEFED] ring-1 ring-transparent hover:ring-[#1A1C1A]/10'
            }`}
          >
            <span>
              <span className="block text-sm font-bold">{option.label}</span>
              <span className="block text-[12px] text-[#6B8070] font-medium">{option.sub}</span>
            </span>
            <input
              type="radio"
              name="model"
              value={option.value}
              checked={formData.model === option.value}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-4 h-4 accent-[#059669]"
            />
          </label>
        ))}

        <input
          type="text"
          placeholder="Your name *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={inputClass}
          required
        />
        <input
          type="email"
          placeholder="Your email *"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={inputClass}
          required
        />
        <textarea
          placeholder="Anything you want to add (optional)"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={2}
          className={`${inputClass} resize-none`}
        />

        {error && <p className="text-[13px] font-semibold text-red-600 px-1">{error}</p>}

        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 350, damping: 17 }}
          className="w-full rounded-full bg-[#059669] text-white px-7 py-4 text-sm font-semibold shadow-lg shadow-[#059669]/25 disabled:opacity-50"
        >
          {submitting ? 'Sending…' : 'Start the conversation →'}
        </motion.button>
      </form>
    </div>
  );
}

/* ---------- the page ---------- */

export default function GalaxyExhibition() {
  const [mounted, setMounted] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gridX = useTransform(mouseX, (v) => v * 0.2);
  const gridY = useTransform(mouseY, (v) => v * 0.2);
  const ringsX = useTransform(mouseX, (v) => v * 0.5);
  const ringsY = useTransform(mouseY, (v) => v * 0.5);
  const gemX = useTransform(mouseX, (v) => -v * 0.3);
  const gemY = useTransform(mouseY, (v) => -v * 0.3);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { innerWidth, innerHeight } = window;
    mouseX.set(((e.clientX - innerWidth / 2) / innerWidth) * 20);
    mouseY.set(((e.clientY - innerHeight / 2) / innerHeight) * 20);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="min-h-[100svh] bg-[#EDEFED] text-[#1A1C1A] flex flex-col relative overflow-hidden antialiased selection:bg-[#059669] selection:text-white"
      onMouseMove={handleMouseMove}
    >

      {/* ambient vignette */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-white/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-[#D4DDD6]/40 to-transparent" />
      </div>

      {/* blueprint grid with parallax */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.25]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #D4DDD6 1px, transparent 1px),
            linear-gradient(to bottom, #D4DDD6 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          x: gridX,
          y: gridY,
        }}
      />

      {/* grain */}
      <div className="absolute inset-0 pointer-events-none z-0 mix-blend-multiply opacity-[0.4]">
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-60" preserveAspectRatio="none">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <GreenDust count={250} />

      {/* floating pill nav — same as the project pages */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: ENTER, ...SPRING }}
        className="fixed top-4 inset-x-0 z-30 flex justify-center px-4"
      >
        <div className="flex items-center gap-1 rounded-full bg-white/80 backdrop-blur-md shadow-lg shadow-[#1A1C1A]/5 ring-1 ring-[#1A1C1A]/5 pl-5 pr-1.5 py-1.5">
          <Link href="/" aria-label="Pyadra · Home" className="flex items-center gap-2 mr-2 group">
            <PyadraLogo size={22} />
            <span className="text-sm font-bold tracking-tight transition-colors group-hover:text-[#059669]">
              Pyadra
            </span>
          </Link>
          <Link
            href="/exhibitions"
            className="hidden sm:block rounded-full px-3.5 py-2 text-[13px] font-medium text-[#3A4A3E] hover:bg-[#EDEFED] transition-colors"
          >
            ← Exhibitions
          </Link>
          <span className="rounded-full px-3.5 py-2 text-[13px] font-medium text-[#6B8070]">
            Galaxy
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-[#059669]/10 text-[#047857] px-3.5 py-2 text-[12px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
            4 live projects
          </span>
        </div>
      </motion.nav>

      {/* ============ HEADLINE ============ */}
      <div className="relative z-10 text-center px-6 pt-24 md:pt-28">
        <h1 className="text-3xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.05]">
          {['Each one is alive.', 'Each one can be yours.'].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: ENTER + 0.15 + i * 0.09, type: 'spring', stiffness: 110, damping: 20 }}
              >
                {i === 1 ? <span className="text-[#059669]">{line}</span> : line}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: ENTER + 0.45, ...SPRING }}
          className="text-[15px] md:text-base text-[#3A4A3E] font-medium mt-4 max-w-sm mx-auto"
        >
          Real projects built inside Pyadra. Tap a sphere to meet one.
        </motion.p>
      </div>

      {/* ============ THE ORBITAL FIELD ============ */}
      <main className="relative z-10 flex-1 w-full px-4 md:px-8 lg:px-12 py-4 md:py-6 flex items-center justify-center">
        <div className="w-full max-w-[1100px] relative">

          {/* orbital rings */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 md:opacity-15"
            style={{ x: ringsX, y: ringsY }}
          >
            <svg viewBox="0 0 800 800" className="w-full h-full text-[#059669]">
              <circle cx="400" cy="400" r="140" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="400" cy="400" r="260" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="400" cy="400" r="380" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" />
            </svg>
          </motion.div>

          {/* central gem — the door to the museum shop */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 z-20"
            style={{ x: gemX, y: gemY }}
          >
            <Link href="/store" className="group relative block w-full h-full" aria-label="The museum shop">
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="relative w-full h-full cursor-pointer"
              >
                <motion.div
                  animate={{ opacity: [0.2, 0.45, 0.2] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-[#059669] blur-xl rounded-full"
                />
                <GemIcon />
              </motion.div>
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-3.5 py-1.5 text-[11px] font-semibold text-[#1A1C1A] shadow-md ring-1 ring-[#1A1C1A]/10 opacity-0 group-hover:opacity-100 max-md:opacity-100 transition-opacity duration-300 pointer-events-none">
                The museum shop →
              </span>
            </Link>
          </motion.div>

          {/* the four spheres */}
          <div className="grid grid-cols-2 gap-4 md:gap-8 lg:gap-12 p-4 md:p-6 lg:p-8">
            {PROJECTS.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.7, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: ENTER + 0.5 + index * 0.12, type: 'spring', stiffness: 120, damping: 16 }}
                className={`transform ${project.position} transition-transform duration-500`}
              >
                <MagneticSphere onClick={() => setActiveProject(project)}>
                  {/* type chip */}
                  <span className="rounded-full bg-white/70 backdrop-blur-sm ring-1 ring-[#1A1C1A]/8 px-3 py-1 text-[10px] font-bold text-[#3A4A3E] mb-3">
                    {project.type} · {project.kind}
                  </span>

                  {/* sphere — untouched */}
                  <div className="relative mb-4">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
                      className={`absolute inset-0 rounded-full blur-xl ${project.glow}`}
                    />
                    <div
                      className={`relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full ${project.sphereClass} transition-transform duration-500 group-hover:scale-105 group-hover:shadow-2xl overflow-hidden`}
                    >
                      {project.logo && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="absolute w-16 h-16 md:w-18 md:h-18 lg:w-22 lg:h-22 rounded-full bg-white/20 blur-sm" />
                          <img
                            src={project.logo}
                            alt={project.name}
                            className="relative w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain opacity-70"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 rounded-full pointer-events-none" />
                        </div>
                      )}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 opacity-30 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_180deg,rgba(255,255,255,0.2)_270deg,transparent_360deg)]"
                      />
                    </div>
                  </div>

                  {/* name — family bold */}
                  <h3 className="text-lg md:text-2xl font-bold tracking-[-0.02em] text-center mb-1.5 transition-colors duration-300 group-hover:text-[#059669]">
                    {project.name}
                  </h3>

                  {/* the hook line */}
                  <div className="text-[12px] md:text-[13px] font-semibold text-[#3A4A3E] text-center">
                    {project.valuation} <span className="text-[#6B8070] font-medium">AUD</span>
                    <span className="mx-1.5 text-[#6B8070]">·</span>
                    <span className="text-[#059669]">{project.available} available</span>
                  </div>
                </MagneticSphere>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* footer */}
      <footer className="relative z-10 w-full px-6 pb-5">
        <div className="flex justify-between items-center max-w-[1100px] mx-auto">
          <span className="text-[12px] font-medium text-[#6B8070]">
            © 2026 Pyadra · We document. We verify. You decide.
          </span>
          <span className="hidden md:block text-[12px] font-medium text-[#6B8070]">pyadra.io</span>
        </div>
      </footer>

      {/* the hook tray */}
      <AnimatePresence>
        {activeProject && <ProjectTray project={activeProject} onClose={() => setActiveProject(null)} />}
      </AnimatePresence>
    </div>
  );
}
