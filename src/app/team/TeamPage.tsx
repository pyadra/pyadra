'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import SiteNav from '@/app/components/nav/SiteNav';
import BringIdeaDialog, { type DialogCopy } from '@/app/components/nav/BringIdeaDialog';
import SiteFooter from '@/app/components/nav/SiteFooter';
import MuseumAtmosphere from '@/app/components/ui/MuseumAtmosphere';
import TeamDeck from './TeamDeck';
import { PEOPLE, type Person } from './people';

/* ------------------------------------------------------------------ */
/*  PYADRA — THE TEAM ROOM  (/team, /team/<name>)          */
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

/* The roster — who is on the deck, their photos, links and words —
   lives in ./people.ts. That is the only file to edit to add someone. */

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

/* The one way in. It opens the museum's own contact dialog rather than a
   mailto: — with no mail client configured a mailto silently does nothing,
   which reads as a broken page. Each card personalises the copy. */
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

export default function TeamPage({ initial }: { initial?: string }) {
  const [dialog, setDialog] = useState<DialogCopy | null>(null);

  /* Whoever's card is on screen is who the message should reach. */
  const sayHelloTo = (person: Person) =>
    setDialog({
      ...SAY_HELLO,
      eyebrow: `${person.firstName} · Hello`,
      intro: `No reason needed. If you just met ${person.firstName}, this reaches the Pyadra inbox directly.`,
      model: `Founder page · Hello · ${person.name}`,
    });
  /* Arriving by QR is an arrival like any other, so a first-time visitor
     is registered here too — otherwise someone who only ever scans a card
     never gets a number. The footer renders it; this page just records it,
     which is why nothing here holds it in state. */
  useEffect(() => {
    if (window.localStorage.getItem('pyadra_observer_id')) return;
    fetch('/api/observer')
      .then((r) => r.json())
      .then((data) => {
        // Same rule as the home: no id, no invented number.
        if (typeof data?.id !== 'number') return;
        window.localStorage.setItem('pyadra_observer_id', `#${String(data.id).padStart(4, '0')}`);
        window.localStorage.setItem('pyadra_observer_num', String(data.id));
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
      <SiteNav crumbs={[{ label: PEOPLE.length > 1 ? 'The team' : 'Eduardo Díaz' }]} status={{ label: `${LIVE_COUNT} live projects`, live: true }} />

      {/* ============ ACT 1 · THE DECK ============
          The team as cards you swipe, iPhone-home-screen style. The
          projects and the ways in stay below, shared: they belong to
          Pyadra, not to one person, and repeating them per card would
          triple the page for nothing. */}
      <TeamDeck initial={initial} onSayHello={sayHelloTo} />

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

      {/* No third act. The cards carry the person and the way to reach
          them; the footer already signs every page with the visitor's
          Observer №. A panel repeating both was the page's own echo. */}

      <SiteFooter />
    </div>
  );
}
