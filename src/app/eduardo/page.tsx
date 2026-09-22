'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import SiteNav from '@/app/components/nav/SiteNav';
import BringIdeaDialog, { type DialogCopy } from '@/app/components/nav/BringIdeaDialog';
import SiteFooter from '@/app/components/nav/SiteFooter';
import MuseumAtmosphere from '@/app/components/ui/MuseumAtmosphere';

/* ------------------------------------------------------------------ */
/*  PYADRA — THE FOUNDER'S ROOM  (/eduardo)                            */
/*                                                                     */
/*  This page is reached by scanning a QR from a printed card, which   */
/*  means it serves two moments and must not confuse them:             */
/*                                                                     */
/*  1. THE SCAN (15s, standing in front of him). Nobody reads a bio    */
/*     while its author watches. The only job is capture: who he is,   */
/*     and one button that saves him to the phone. Above the fold.     */
/*  2. LATER (unhurried, alone). The procession of projects, the       */
/*     story, the ways in.                                             */
/*                                                                     */
/*  ONE mechanic, repeated: each project arrives spotlit as you scroll */
/*  — the museum walk. No curtain, no orbit, no dashboard columns:     */
/*  three competing ideas made the page forgettable.                   */
/*                                                                     */
/*  Copy Deck (Company_Master §6): project strings verbatim from       */
/*  exhibitions/galaxy/page.tsx. No valuations here (§7, §10).         */
/* ------------------------------------------------------------------ */

const SPRING = { type: 'spring' as const, stiffness: 130, damping: 18, mass: 0.9 };

/* ---- EDIT ME — the founder's own details ---------------------------
   PORTRAIT: drop a square JPG at  public/images/eduardo/eduardo.jpg
   (1000×1000 or larger). Until it exists the frame renders empty, on
   purpose — an unhung plaque, not a broken image.                    */
const PORTRAIT = '/images/eduardo/eduardo.jpg';
/* The circular frame shows the middle ~56% of a tall photo. Centring it
   strands the face near the rim, so pull the window up. Re-tune (or drop
   to '50% 50%') whenever the portrait is replaced. */
const PORTRAIT_POSITION = '50% 34%';
const LINKEDIN = 'https://www.linkedin.com/in/eduardo-diaz-41a44559/';
const INSTAGRAM = 'https://instagram.com/alfonsodcarretero';
const EMAIL = 'pyadra@pyadra.io';

const STATEMENT =
  'I build projects that can live without me, and then look for the people who carry them further.';

/* Half the road, half the person. A founder card that only lists ventures
   reads like a CV; whoever scans this just met him. Kept short — he is
   standing right there while you read it. */
const BIO = [
  'I arrived in Australia with a suitcase and not much English. The first years were night shifts — driving strangers home until sunrise. Then I started building: a cleaning business, a podcast, 3D printing, software.',
  'Away from the work I’m simple. Sport, food from anywhere I haven’t tried yet, and people who make me laugh. I build for the same reason I like all of that — none of it is any good alone.',
];

type Logo = { kind: 'image'; src: string } | { kind: 'capsule' } | { kind: 'pending' };
type Status = 'live' | 'for-sale' | 'paused' | 'soon';

type Project = {
  id: string;
  name: string;
  craft: string;
  line: string;
  status: Status;
  href?: string;
  logo: Logo;
};

/* One index, seven rows. A separate "coming soon" block diluted both
   halves — four live things beside three unlaunched ones reads stronger
   as a single body of work with an honest status column. */
const PROJECTS: Project[] = [
  {
    id: 'orbit',
    name: 'Orbit 77',
    craft: 'Podcast',
    line: '10 episodes live · Season 2 in the works',
    status: 'live',
    href: '/exhibitions/galaxy/orbit',
    logo: { kind: 'image', src: '/orbit-logo.png' },
  },
  {
    id: 'ethernicapsule',
    name: 'EterniCapsule',
    craft: 'Web software',
    line: 'Encrypted time capsules · Built & live',
    status: 'for-sale',
    href: '/exhibitions/galaxy/ethernicapsule',
    logo: { kind: 'capsule' },
  },
  {
    id: 'figuitoon',
    name: 'Figuitoon',
    craft: '3D printing',
    line: 'Custom figurines · Shopify store · Printer included',
    status: 'for-sale',
    href: '/exhibitions/galaxy/figurines',
    logo: { kind: 'image', src: '/figuitoon-logo.png' },
  },
  {
    id: 'kangaroo-cleanup',
    name: 'Kangaroo Cleanup',
    craft: 'Physical work',
    line: 'Sydney · 500+ jobs done · 5.0 reputation',
    status: 'paused',
    href: '/exhibitions/galaxy/kangaroo-cleanup',
    logo: { kind: 'image', src: '/images/kangaroo/kangaroo_logo.png' },
  },
  { id: 'soon-1', name: 'Mobile app', craft: 'Software', line: 'In documentation', status: 'soon', logo: { kind: 'pending' } },
  { id: 'soon-2', name: 'Songs for unforgettable moments', craft: 'Music', line: 'In documentation', status: 'soon', logo: { kind: 'pending' } },
  { id: 'soon-3', name: 'Gym routines', craft: 'Software', line: 'In documentation', status: 'soon', logo: { kind: 'pending' } },
];

const STATUS_LABEL: Record<Status, string> = {
  live: 'Live',
  'for-sale': 'For sale',
  paused: 'Paused',
  soon: 'Coming soon',
};

const LIVE_COUNT = PROJECTS.filter((p) => p.status !== 'soon').length;

/* Three ways in. They open the museum's own contact dialog rather than a
   mailto: — on a desktop with no mail client configured, a mailto link
   silently does nothing, which reads as a broken page. */
const DOORS: { label: string; copy: DialogCopy }[] = [
  {
    label: 'You are building something',
    copy: {
      eyebrow: 'Eduardo · Your project',
      title: 'Tell me what you’re building.',
      intro: 'Big, small, or still an idea. Tell me what it is and where it’s stuck — I read every one of these myself.',
      messageLabel: 'What you’re building',
      messagePlaceholder: 'What is it, and what’s the hard part right now?',
      submitLabel: 'Send it to Eduardo',
      model: 'Founder page · Building something',
    },
  },
  {
    label: 'You want a project of your own',
    copy: {
      eyebrow: 'Eduardo · Participation',
      title: 'Ask me anything about them.',
      intro: 'Two are open for acquisition and one is looking for a partner. The numbers, the risks and what I’d do differently are all on the table.',
      messageLabel: 'What you want to know',
      messagePlaceholder: 'Which project, and what do you want to know first?',
      submitLabel: 'Send your question',
      model: 'Founder page · Participation',
    },
  },
  {
    label: 'You are good at something',
    copy: {
      eyebrow: 'Eduardo · Your work',
      title: 'Tell me what you do.',
      intro: 'Design, sales, operations, code, or knowing the right people. Work is capital here too — you don’t need money to be part of this.',
      messageLabel: 'What you do',
      messagePlaceholder: 'What are you good at, and what would you want to work on?',
      submitLabel: 'Send it to Eduardo',
      model: 'Founder page · Skills',
    },
  },
];

const SAY_HELLO: DialogCopy = {
  eyebrow: 'Eduardo · Hello',
  title: 'Write to me.',
  intro: 'No reason needed. If we just met, this reaches me directly.',
  messageLabel: 'Your message',
  messagePlaceholder: 'Anything at all.',
  submitLabel: 'Send',
  model: 'Founder page · Hello',
};

/* EterniCapsule has no logo asset yet — the stand-in mark Galaxy uses. */
const CapsuleMark = () => (
  <svg viewBox="0 0 40 60" className="w-full h-full">
    <rect x="10" y="6" width="20" height="48" rx="10" fill="none" stroke="#C9A961" strokeWidth="2.5" />
    <circle cx="20" cy="30" r="2.6" fill="#C9A961" />
  </svg>
);

function ProjectMark({ project }: { project: Project }) {
  if (project.logo.kind === 'pending') {
    return <span className="w-7 h-7 rounded-full border border-dashed border-[#6B8070]/60" />;
  }
  if (project.logo.kind === 'capsule') {
    return (
      <span className="block w-4 h-6">
        <CapsuleMark />
      </span>
    );
  }
  return (
    <Image
      src={project.logo.src}
      alt=""
      width={80}
      height={80}
      draggable={false}
      className="w-9 h-9 object-contain pointer-events-none select-none"
    />
  );
}

/* ---------------- the portrait ---------------- */

function Portrait({ className }: { className?: string }) {
  const [broken, setBroken] = useState(false);

  return (
    <div
      className={`relative rounded-full overflow-hidden ring-1 ring-[#1A1C1A]/10 shadow-[0_24px_60px_-20px_rgba(10,18,14,0.45)] bg-[#D9DBD9] ${className ?? ''}`}
    >
      {!broken ? (
        <Image
          src={PORTRAIT}
          alt="Eduardo Díaz"
          width={720}
          height={720}
          priority
          onError={() => setBroken(true)}
          style={{ objectPosition: PORTRAIT_POSITION }}
          className="w-full h-full object-cover"
        />
      ) : (
        /* the plaque before the work is hung */
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-center px-5">
          <span aria-hidden className="text-[#6B8070]/50 text-2xl">✦</span>
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

/* ---------------- one room of the procession ----------------
   The single mechanic: each project is dim until the scroll brings it
   into the light, then stays lit. Identical at 390px and 1440px. */

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const soon = project.status === 'soon';

  const body = (
    <>
      <span className="w-10 h-10 shrink-0 flex items-center justify-center">
        <ProjectMark project={project} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2 flex-wrap">
          <span className="font-serif font-semibold text-[#1A1C1A] text-lg leading-tight">
            {project.name}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#5B50CE]">
            {project.craft}
          </span>
        </span>
        <span className="block t-d5 text-[#6B8070] mt-0.5">{project.line}</span>
      </span>

      <span
        className={`hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] ${
          soon || project.status === 'paused'
            ? 'bg-[#1A1C1A]/5 text-[#6B8070]'
            : 'bg-[#059669]/10 text-[#047857]'
        }`}
      >
        {project.status === 'live' && (
          <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
        )}
        {STATUS_LABEL[project.status]}
      </span>

      {!soon && (
        <span
          aria-hidden
          className="shrink-0 text-[#6B8070] group-hover:text-[#059669] group-hover:translate-x-0.5 transition-all"
        >
          →
        </span>
      )}
    </>
  );

  const shell =
    'group flex items-center gap-4 px-4 sm:px-5 py-4 rounded-2xl transition-all duration-200';

  return (
    <motion.div
      initial={{ opacity: 0.25, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
      transition={{ ...SPRING, delay: index * 0.04 }}
    >
      {project.href ? (
        <Link href={project.href} className={`${shell} bg-white/50 border border-white/40 hover:bg-white hover:shadow-sm`}>
          {body}
        </Link>
      ) : (
        <div className={`${shell} border border-dashed border-[#1A1C1A]/12`}>{body}</div>
      )}
    </motion.div>
  );
}

/* ---------------- the page ---------------- */

export default function FoundersRoom() {
  const [observerId, setObserverId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogCopy | null>(null);
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
        // Same rule as the home: no id, no invented number.
        if (typeof data?.id !== 'number') return;
        const formatted = `#${String(data.id).padStart(4, '0')}`;
        window.localStorage.setItem('pyadra_observer_id', formatted);
        window.localStorage.setItem('pyadra_observer_num', String(data.id));
        setObserverId(formatted);
        window.dispatchEvent(new Event('pyadra:observer'));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-[#EDEFED] text-[#1A1C1A] font-sans overflow-x-clip antialiased selection:bg-[#059669] selection:text-white min-h-screen">

      {/* Ambient light — the two emerald pools the dashboards sit in. */}
      <div aria-hidden className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full opacity-35"
          style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.12), transparent 70%)' }}
        />
        <div
          className="absolute -bottom-56 -right-32 w-[720px] h-[720px] rounded-full opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.10), transparent 70%)' }}
        />
      </div>

      <BringIdeaDialog open={dialog !== null} onClose={() => setDialog(null)} copy={dialog ?? undefined} />

      <MuseumAtmosphere fixed />
      <SiteNav crumbs={[{ label: 'Eduardo Díaz' }]} status={{ label: `${LIVE_COUNT} live projects`, live: true }} />

      {/* ============ ACT 1 · THE CARD ============
          Everything the 15-second moment needs, above the fold. Split on
          desktop so it uses the width; stacked and thumb-reachable on a
          phone, which is where it will actually be read. */}
      <section className="relative px-6 pt-32 pb-16 md:pt-36 md:pb-20">
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center gap-8 sm:gap-10 md:gap-14">

          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={SPRING}
            className="shrink-0 mx-auto sm:mx-0"
          >
            <Portrait className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52" />
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.1 }}
            className="min-w-0 text-center sm:text-left"
          >
            <h1 className="t-d1">Eduardo Díaz</h1>

            <p className="t-d6 text-[#6B8070] mt-3">
              Founder · Pyadra LLC · Perth, Australia
            </p>

            <p className="font-serif italic text-[#1A1C1A] text-lg sm:text-xl leading-[1.45] mt-4 max-w-md mx-auto sm:mx-0">
              {STATEMENT}
            </p>

            {/* The one action the scan moment is actually for. */}
            <div className="mt-7 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <a
                href="/api/vcard"
                download="eduardo-diaz.vcf"
                className="cta-glow w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#1A1C1A] text-white px-8 py-3.5 t-d5 font-semibold hover:bg-[#059669] transition-colors"
              >
                Save my contact
              </a>
              <button
                type="button"
                onClick={() => setDialog(SAY_HELLO)}
                className="t-d5 font-semibold text-[#047857] hover:text-[#059669] transition-colors"
              >
                or write to me →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ ACT 2 · THE PROCESSION ============ */}
      <section className="relative px-6 pb-16 md:pb-24">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex justify-between items-baseline mb-5 px-1">
            <h2 className="font-mono text-[13px] font-bold uppercase tracking-[0.18em] text-[#6B8070]">
              What I make
            </h2>
            <span className="font-mono text-[11px] text-[#6B8070]">
              {PROJECTS.length} projects · {LIVE_COUNT} live
            </span>
          </div>

          <div className="space-y-2.5">
            {PROJECTS.map((p, i) => (
              <ProjectRow key={p.id} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ ACT 3 · THE CLOSE ============ */}
      <section className="relative px-6 pb-20 md:pb-28">
        <div className="relative z-10 max-w-4xl mx-auto grid md:grid-cols-2 gap-5 md:gap-6 items-start">

          {/* who he is — 58 words */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={SPRING}
            className="panel-lift rounded-3xl bg-white/70 backdrop-blur-md ring-1 ring-black/5 shadow-sm p-6 md:p-7"
          >
            <h2 className="font-mono text-[13px] font-bold uppercase tracking-[0.18em] text-[#6B8070] mb-3.5">
              The short version
            </h2>
            <div className="flex flex-col gap-3">
              {BIO.map((para, i) => (
                <p key={i} className="t-d5 text-[#3A4A3E] leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
            <Link
              href="/"
              className="cta-glow mt-6 inline-flex items-center justify-center rounded-full bg-[#1A1C1A] text-white px-6 py-2.5 t-d5 font-semibold hover:bg-[#059669] transition-colors"
            >
              This is Pyadra →
            </Link>
          </motion.div>

          {/* the ways in + the number they leave with */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.08 }}
            className="panel-lift rounded-3xl bg-white/70 backdrop-blur-md ring-1 ring-black/5 shadow-sm p-6 md:p-7"
          >
            <h2 className="font-mono text-[13px] font-bold uppercase tracking-[0.18em] text-[#6B8070] mb-1.5">
              If we just met
            </h2>
            <p className="t-d5 text-[#6B8070] mb-4">You don&rsquo;t need to bring anything.</p>

            <div className="space-y-2">
              {DOORS.map((d) => (
                <button
                  key={d.label}
                  type="button"
                  onClick={() => setDialog(d.copy)}
                  className="group w-full text-left flex items-center gap-3 p-3 rounded-2xl bg-white/50 border border-white/40 hover:bg-white hover:shadow-sm transition-all duration-200"
                >
                  <span className="min-w-0 flex-1 t-d5 font-semibold text-[#1A1C1A]">{d.label}</span>
                  <span
                    aria-hidden
                    className="shrink-0 text-[#6B8070] group-hover:text-[#059669] group-hover:translate-x-0.5 transition-all"
                  >
                    →
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-[#1A1C1A]/8 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#6B8070]">
                  Your admission
                </span>
                <p className="font-mono text-[#1A1C1A] text-2xl leading-none mt-1.5">
                  {observerId ? `№ ${observerId.replace('#', '')}` : '№ ————'}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <a href={`mailto:${EMAIL}`} className="t-d5 text-[#6B8070] hover:text-[#059669] transition-colors">
                  {EMAIL}
                </a>
                <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="t-d5 text-[#6B8070] hover:text-[#059669] transition-colors">
                  LinkedIn ↗
                </a>
                <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="t-d5 text-[#6B8070] hover:text-[#059669] transition-colors">
                  Instagram ↗
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
