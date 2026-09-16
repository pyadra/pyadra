'use client';

import { useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useTime,
  useTransform,
} from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import SiteNav from '@/app/components/nav/SiteNav';
import SiteFooter from '@/app/components/nav/SiteFooter';
import MuseumAtmosphere from '@/app/components/ui/MuseumAtmosphere';

/* ------------------------------------------------------------------ */
/*  PYADRA — THE FOUNDER'S ROOM  (/eduardo)                            */
/*                                                                     */
/*  The one room in the museum that has a face. Reached by QR from a   */
/*  printed card, so the first screen must land before anyone scrolls. */
/*                                                                     */
/*  Division of labour — nothing is said twice:                        */
/*    the orbit  says THAT there are seven, and whose they are (logos) */
/*    the cards  say WHAT each one is, and how to get in               */
/*  So the spheres carry no text, and the cards carry no counting.     */
/*                                                                     */
/*  Copy Deck (Company_Master §6): project strings are verbatim from   */
/*  exhibitions/galaxy/page.tsx. Valuation rule (§7, §10): opportunity */
/*  lines only — prices live on the project's own page.                */
/* ------------------------------------------------------------------ */

const CURTAIN_MS = 1500;
const SPRING = { type: 'spring' as const, stiffness: 130, damping: 18, mass: 0.9 };

/* ---- EDIT ME — the founder's own details ---------------------------
   PORTRAIT: drop a square JPG at  public/images/eduardo/eduardo.jpg
   (1000×1000 or larger). Until it exists the frame renders empty, on
   purpose — an unhung plaque, not a broken image.                    */
const PORTRAIT = '/images/eduardo/eduardo.jpg';
const LINKEDIN = 'https://www.linkedin.com/in/eduardo-diaz';   // ← confirm handle
const INSTAGRAM = 'https://instagram.com/pyadra.io';
const EMAIL = 'pyadra@pyadra.io';

const STATEMENT =
  'I build projects that can live without me. Pyadra is the place where they find their people.';

const BIO =
  'Pyada is the pawn. RA is the path. The name came out of a chess game — every pawn can become a queen, and the whole point is the road it takes to get there. I came to Sydney, drove nights, cleaned houses, and built software in the hours in between. Pyadra is what I do with all of it: I build things that can outlast me, and then look for the people who will carry them further than I can alone.';

type Logo = { kind: 'image'; src: string } | { kind: 'capsule' };

type Live = {
  id: string;
  name: string;
  type: string;
  kind: string;
  proof: string;
  opportunity: string;
  href: string;
  logo: Logo;
  /** sphere skin — identical to the project's sphere in Galaxy */
  sphere: string;
  glow: string;
  /** the project's own signature colour, taken from its dashboard */
  accent: string;
  /** orbit geometry */
  speed: number;
  phase: number;
};

/* Verbatim from Galaxy v4 — same logos, same sphere skins, so a visitor
   who has seen the exhibition recognises them instantly. The `subtitle`
   field Galaxy carries is deliberately dropped here: for half the
   projects it just restates the type chip ("Local · Cleanup business"
   vs "Local cleanup business"). */
const LIVE: Live[] = [
  {
    id: 'orbit',
    name: 'Orbit 77',
    type: 'Glocal',
    kind: 'Podcast',
    proof: '10 episodes live · Season 2 in the works',
    opportunity: 'Open for support',
    href: '/exhibitions/galaxy/orbit',
    logo: { kind: 'image', src: '/orbit-logo.png' },
    sphere: 'radial-gradient(circle at 30% 30%,#F2FBF5,#CDEBD9,#A3CFB6)',
    glow: 'rgba(163,207,182,0.55)',
    accent: '#059669',
    speed: 0.11, phase: 0.4,
  },
  {
    id: 'ethernicapsule',
    name: 'EterniCapsule',
    type: 'Global',
    kind: 'Digital vault',
    proof: 'Built & live · Global product · Hosted on Pyadra',
    opportunity: 'Open for acquisition',
    href: '/exhibitions/galaxy/ethernicapsule',
    logo: { kind: 'capsule' },
    sphere: 'radial-gradient(circle at 30% 30%,#FDF6EA,#EBD8B9,#D3B58C)',
    glow: 'rgba(228,201,159,0.55)',
    accent: '#C9A961',
    speed: 0.11, phase: 1.97,
  },
  {
    id: 'figuitoon',
    name: 'Figuitoon',
    type: 'Glocal',
    kind: 'Physical product',
    proof: 'Prototype built · Shopify store · Printer included',
    opportunity: 'Available to acquire',
    href: '/exhibitions/galaxy/figurines',
    logo: { kind: 'image', src: '/figuitoon-logo.png' },
    sphere: 'radial-gradient(circle at 30% 30%,#FFFFFF,#FFFFFF,#F2F2F2)',
    glow: 'rgba(255,255,255,0.7)',
    accent: '#7C3AED',
    speed: 0.11, phase: 3.54,
  },
  {
    id: 'kangaroo-cleanup',
    name: 'Kangaroo Cleanup',
    type: 'Local',
    kind: 'Cleanup business',
    proof: 'Sydney-based · 500+ jobs done · 5.0 reputation',
    opportunity: 'Looking for a partner',
    href: '/exhibitions/galaxy/kangaroo-cleanup',
    logo: { kind: 'image', src: '/images/kangaroo/kangaroo_logo.png' },
    sphere: 'radial-gradient(circle at 30% 30%,#FFFEF9,#F3EFE2,#DCD5C2)',
    glow: 'rgba(237,232,216,0.6)',
    accent: '#047857',
    speed: 0.11, phase: 5.11,
  },
];

/* Three more in documentation, deliberately unnamed — they exist only as
   the outer specks in the orbit. A project earns a name once it can be
   handed to someone else (non-negotiable #13). */
const FORMING: { phase: number }[] = [{ phase: 0.9 }, { phase: 2.9 }, { phase: 4.9 }];

/* EterniCapsule has no logo asset yet — same stand-in mark Galaxy uses. */
const CapsuleMark = () => (
  <svg viewBox="0 0 40 60" className="w-full h-full">
    <rect x="10" y="6" width="20" height="48" rx="10" fill="none" stroke="#C9A961" strokeWidth="2.5" />
    <circle cx="20" cy="30" r="2.6" fill="#C9A961" />
  </svg>
);

/** A project's sphere: its Galaxy skin with its real logo inside. */
function ProjectSphere({ project, size }: { project: Live; size: number }) {
  return (
    <div
      className="relative rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        background: project.sphere,
        boxShadow: `-8px 8px 18px rgba(10,18,14,0.18), 0 0 26px ${project.glow}`,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {project.logo.kind === 'image' ? (
          <Image
            src={project.logo.src}
            alt=""
            width={80}
            height={80}
            draggable={false}
            className="object-contain opacity-75 pointer-events-none select-none"
            style={{ width: size * 0.62, height: size * 0.62 }}
          />
        ) : (
          <div
            className="opacity-85 pointer-events-none"
            style={{ width: size * 0.3, height: size * 0.45 }}
          >
            <CapsuleMark />
          </div>
        )}
      </div>
      <div
        aria-hidden
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.16))' }}
      />
    </div>
  );
}

/* ---------------- the portrait ---------------- */

function Portrait({ size }: { size: number }) {
  const [broken, setBroken] = useState(false);

  return (
    <div
      className="relative rounded-full overflow-hidden ring-1 ring-[#1A1C1A]/10 shadow-[0_24px_60px_-20px_rgba(10,18,14,0.45)] bg-[#D9DBD9]"
      style={{ width: size, height: size }}
    >
      {!broken ? (
        <Image
          src={PORTRAIT}
          alt="Eduardo Díaz"
          width={720}
          height={720}
          priority
          onError={() => setBroken(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        /* the plaque before the work is hung */
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-center px-6">
          <span aria-hidden className="text-[#6B8070]/50 text-3xl">✦</span>
          <span className="t-d6 text-[#6B8070]">Portrait pending</span>
        </div>
      )}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(120% 90% at 50% 0%, rgba(255,255,255,0.22), transparent 55%)' }}
      />
    </div>
  );
}

/* ---------------- one orbiting project ----------------
   No label. The sphere carries the logo; the name only appears on
   hover. Everything the reader needs in words is in the cards below,
   said once. */

function OrbitSphere({
  project,
  radius,
  size,
  reduced,
}: {
  project: Live;
  radius: number;
  size: number;
  reduced: boolean;
}) {
  const time = useTime();
  const v = reduced ? 0 : project.speed;
  const x = useTransform(time, (t) => Math.cos(project.phase + (t / 1000) * v) * radius);
  const y = useTransform(time, (t) => Math.sin(project.phase + (t / 1000) * v) * radius * 0.42);

  return (
    <motion.div
      style={{ x, y }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
    >
      <Link
        href={project.href}
        aria-label={`${project.name} — ${project.opportunity}`}
        className="group relative block rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#059669]"
      >
        <motion.div
          whileHover={reduced ? undefined : { scale: 1.14 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        >
          <ProjectSphere project={project} size={size} />
        </motion.div>

        {/* the name, only when asked for */}
        <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap t-d6 text-[#1A1C1A] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
          {project.name}
        </span>
      </Link>
    </motion.div>
  );
}

/* a forming project — a sphere that hasn't arrived yet */
function FormingSpeck({
  item,
  radius,
  reduced,
}: {
  item: { phase: number };
  radius: number;
  reduced: boolean;
}) {
  const time = useTime();
  const v = reduced ? 0 : 0.055;
  const x = useTransform(time, (t) => Math.cos(item.phase + (t / 1000) * v) * radius);
  const y = useTransform(time, (t) => Math.sin(item.phase + (t / 1000) * v) * radius * 0.42);

  return (
    <motion.div
      aria-hidden
      style={{ x, y }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
    >
      <motion.div
        animate={reduced ? undefined : { opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-3.5 h-3.5 rounded-full border border-dashed border-[#6B8070]/70"
      />
    </motion.div>
  );
}

/* ---------------- the orbital hero ---------------- */

function OrbitField({ reduced }: { reduced: boolean }) {
  // radius follows the viewport so the ellipse never clips on a phone
  const [w, setW] = useState(1200);
  useEffect(() => {
    const read = () => setW(window.innerWidth);
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, []);

  const inner = Math.max(142, Math.min(320, w * 0.32));
  const outer = inner * 1.44;
  const portrait = Math.max(112, Math.min(200, w * 0.23));
  const sphere = Math.max(46, Math.min(82, w * 0.085));

  return (
    <div className="relative w-full flex items-center justify-center" style={{ height: outer * 1.0 + 70 }}>
      {/* the orbit rings — faint, so the motion reads as a system */}
      {[inner, outer].map((r, i) => (
        <div
          key={i}
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-[#1A1C1A]/[0.07] pointer-events-none"
          style={{ width: r * 2, height: r * 0.84 }}
        />
      ))}

      {/* the halo behind the face */}
      <motion.div
        aria-hidden
        animate={reduced ? undefined : { scale: [1, 1.14, 1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: portrait * 2.4,
          height: portrait * 2.4,
          background: 'radial-gradient(circle, rgba(5,150,105,0.18), transparent 65%)',
          filter: 'blur(18px)',
        }}
      />

      {/* the face at the centre */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...SPRING, delay: 0.1 }}
        className="relative z-30"
      >
        <Portrait size={portrait} />
      </motion.div>

      {FORMING.map((f, i) => (
        <FormingSpeck key={i} item={f} radius={outer} reduced={reduced} />
      ))}

      {LIVE.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 + i * 0.12 }}
          className="absolute inset-0"
        >
          <OrbitSphere project={p} radius={inner} size={sphere} reduced={reduced} />
        </motion.div>
      ))}
    </div>
  );
}

/* ---------------- a project, laid out for reading ---------------- */

function ProjectCard({ project, index }: { project: Live; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ ...SPRING, delay: index * 0.06 }}
      className="group relative rounded-[28px] bg-white shadow-sm ring-1 ring-[#1A1C1A]/5 p-7 md:p-8 flex flex-col items-center text-center transition-shadow hover:shadow-md"
    >
      {/* the project's own signature, as a hairline at the top of its card */}
      <span
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-16 rounded-full opacity-70"
        style={{ background: project.accent }}
      />

      <ProjectSphere project={project} size={76} />

      <span className="t-d6 text-[#6B8070] mt-5">{project.type} · {project.kind}</span>
      <h3 className="t-d3 font-bold mt-1.5">{project.name}</h3>
      <p className="t-d5 text-[#3A4A3E] mt-2.5 max-w-[26ch]">{project.proof}</p>

      <span
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 t-d6 mt-5"
        style={{ background: `${project.accent}14`, color: project.accent }}
      >
        <span aria-hidden className="w-1.5 h-1.5 rounded-full" style={{ background: project.accent }} />
        {project.opportunity}
      </span>

      <Link
        href={project.href}
        className="cta-glow mt-5 rounded-full bg-[#1A1C1A] text-white px-6 py-2.5 t-d5 font-semibold hover:bg-[#059669] transition-colors"
      >
        Enter →
      </Link>
    </motion.div>
  );
}

/* ---------------- the page ---------------- */

export default function FoundersRoom() {
  const [curtainUp, setCurtainUp] = useState(false);
  const [observerId, setObserverId] = useState<string | null>(null);
  const reduced = useReducedMotion() ?? false;

  // Arriving by QR is an arrival like any other — the visitor gets their
  // number here too, not only on the home. Same storage key, same rules.
  useEffect(() => {
    const stored = window.localStorage.getItem('pyadra_observer_id');
    if (stored) {
      setObserverId(stored);
      return;
    }
    fetch('/api/observer')
      .then((r) => r.json())
      .then((data) => {
        const formatted = `#${String(data.id).padStart(4, '0')}`;
        window.localStorage.setItem('pyadra_observer_id', formatted);
        window.localStorage.setItem('pyadra_observer_num', String(data.id));
        setObserverId(formatted);
        window.dispatchEvent(new Event('pyadra:observer'));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setCurtainUp(true), reduced ? 200 : CURTAIN_MS);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <div className="bg-[#EDEFED] text-[#1A1C1A] font-sans overflow-x-clip antialiased selection:bg-[#059669] selection:text-white min-h-screen">

      {/* ============ THE CURTAIN ============ */}
      <AnimatePresence>
        {!curtainUp && (
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] bg-[#0A120E] flex flex-col items-center justify-center"
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(55% 45% at 50% 55%, rgba(5,150,105,0.14), transparent 70%)' }}
            />
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.5em' }}
              animate={{ opacity: 1, letterSpacing: '0.42em' }}
              transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
              className="relative text-[#EDEFED] text-lg md:text-2xl font-bold uppercase mb-6"
            >
              Pyadra
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-px w-40 md:w-56 bg-[#10B981] origin-center mb-6"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.75 }}
              className="relative font-serif italic text-[#EDEFED]/60 text-sm md:text-base"
            >
              Lo que dejas importa.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <MuseumAtmosphere fixed />
      <SiteNav crumbs={[{ label: 'Eduardo Díaz' }]} status={{ label: '4 live projects', live: true }} />

      {/* ============ 1 · THE ROOM — lands before any scroll ============ */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 pt-28 pb-12">
        <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center">

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="t-d6 text-[#6B8070] mb-5"
          >
            The founder&rsquo;s room
          </motion.span>

          {/* the wow — the face with everything he built in orbit */}
          {curtainUp && <OrbitField reduced={reduced} />}

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.75 }}
            className="t-d1 mt-1"
          >
            Eduardo Díaz
          </motion.h1>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="t-d6 text-[#6B8070] mt-3.5"
          >
            Founder · Pyadra LLC · Sydney
          </motion.span>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 1.0 }}
            className="font-serif italic text-[#1A1C1A] max-w-xl mt-6 text-xl sm:text-2xl leading-[1.4]"
          >
            {STATEMENT}
          </motion.p>
        </div>

        {/* the invitation to go down — a mark, not a sentence */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 7, 0] }}
          transition={{ opacity: { delay: 1.4, duration: 0.6 }, y: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } }}
          className="relative z-10 mt-10 text-[#6B8070] text-xl"
        >
          ↓
        </motion.div>
      </section>

      {/* ============ 2 · IN EXHIBITION ============ */}
      <section className="relative px-6 py-16 md:py-24">
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={SPRING}
            className="flex flex-col items-center text-center mb-10"
          >
            <span className="t-d6 text-[#6B8070]">In exhibition</span>
            <h2 className="t-d2 mt-2">Four projects, open in different ways</h2>
            <p className="t-d4 text-[#3A4A3E] mt-3 max-w-xl">
              Each one is documented in full — what it earns, what it needs, and what could go wrong.
              The numbers, the risks and the terms live inside.
            </p>
            {/* The weakness, stated first. It is what makes the rest credible. */}
            <p className="t-d5 text-[#3A4A3E] mt-6 max-w-xl border-t border-[#059669]/25 pt-4">
              Kangaroo Cleanup is paused today — the history is real, the operation is not running.
              I would rather you hear that from me than find it yourself.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {LIVE.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ 3 · THE PERSON ============ */}
      <section className="relative px-6 py-14 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={SPRING}
          className="relative z-10 max-w-3xl mx-auto rounded-[32px] bg-white shadow-sm ring-1 ring-[#1A1C1A]/5 p-8 md:p-12 flex flex-col items-center text-center"
        >
          <span className="t-d6 text-[#6B8070]">The name, and the person behind it</span>
          <p className="t-d4 text-[#3A4A3E] leading-relaxed mt-4">{BIO}</p>
          <Link
            href="/exhibitions"
            className="cta-glow inline-block mt-7 rounded-full bg-[#1A1C1A] text-white px-7 py-3 t-d5 font-semibold hover:bg-[#059669] transition-colors"
          >
            Walk through the museum →
          </Link>
        </motion.div>
      </section>

      {/* ============ 4 · THE ASK ============ */}
      <section className="relative px-6 py-16 md:py-24">
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={SPRING}
            className="t-d2 text-center max-w-2xl"
          >
            If we just met, here is what I am looking for
          </motion.h2>

          <div className="grid gap-5 sm:grid-cols-3 mt-10 w-full">
            {[
              {
                label: 'You have a project',
                body: 'Something real that deserves the right people. I document it to the Pyadra standard and exhibit it.',
                cta: 'Bring it to Pyadra',
                href: `mailto:${EMAIL}?subject=${encodeURIComponent('I have a project')}`,
              },
              {
                label: 'You want to participate',
                body: 'Two are open for acquisition, one is looking for a partner. Full numbers and risks in due diligence.',
                cta: 'Talk about a deal',
                href: `mailto:${EMAIL}?subject=${encodeURIComponent('Participation — let’s talk')}`,
              },
              {
                label: 'You want to operate',
                body: 'You bring the work, not the capital. That is a valid way in — your work is your stake.',
                cta: 'Tell me what you do',
                href: `mailto:${EMAIL}?subject=${encodeURIComponent('I want to operate a project')}`,
              },
            ].map((a, i) => (
              <motion.a
                key={a.label}
                href={a.href}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, delay: i * 0.08 }}
                className="group rounded-[24px] bg-white shadow-sm ring-1 ring-[#1A1C1A]/5 p-7 flex flex-col items-center text-center hover:ring-[#059669]/30 transition-all"
              >
                <span className="t-d6 text-[#6B8070]">{a.label}</span>
                <p className="t-d5 text-[#3A4A3E] leading-relaxed mt-3 flex-1">{a.body}</p>
                <span className="t-d5 font-semibold text-[#047857] mt-5 group-hover:text-[#059669]">
                  {a.cta} →
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 5 · THE CONTACT ============ */}
      <section className="relative px-6 pb-20 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={SPRING}
          className="relative z-10 max-w-3xl mx-auto rounded-[32px] bg-white shadow-sm ring-1 ring-[#1A1C1A]/5 p-8 md:p-12 grid sm:grid-cols-2 gap-10 items-center"
        >
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="t-d6 text-[#6B8070]">Keep me</span>
            <h3 className="t-d3 font-bold mt-2">Eduardo Díaz</h3>
            <div className="flex flex-col gap-2 mt-4">
              <a href={`mailto:${EMAIL}`} className="t-d4 text-[#3A4A3E] hover:text-[#059669] transition-colors">
                {EMAIL}
              </a>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="t-d4 text-[#3A4A3E] hover:text-[#059669] transition-colors">
                LinkedIn ↗
              </a>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="t-d4 text-[#3A4A3E] hover:text-[#059669] transition-colors">
                Instagram ↗
              </a>
            </div>

            {/* the universal save — a vCard, not a wallet pass */}
            <a
              href="/api/vcard"
              download="eduardo-diaz.vcf"
              className="cta-glow inline-block mt-7 rounded-full bg-[#1A1C1A] text-white px-7 py-3 t-d5 font-semibold hover:bg-[#059669] transition-colors"
            >
              Save to contacts
            </a>
          </div>

          {/* the number they leave with */}
          <div className="flex flex-col items-center text-center sm:border-l sm:border-[#1A1C1A]/8 sm:pl-10">
            <span className="t-d6 text-[#6B8070]">Your admission</span>
            <p className="font-mono text-[#1A1C1A] mt-2.5 text-3xl sm:text-[38px] leading-none">
              {observerId ? `№ ${observerId.replace('#', '')}` : '№ ————'}
            </p>
            <p className="t-d5 text-[#6B8070] mt-3.5 leading-relaxed max-w-[28ch]">
              That number is yours now, and nobody else will ever have it.
            </p>
          </div>
        </motion.div>
      </section>

      <SiteFooter />
    </div>
  );
}
