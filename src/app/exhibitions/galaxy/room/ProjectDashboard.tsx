'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import SiteNav from '@/app/components/nav/SiteNav';
import SiteFooter from '@/app/components/nav/SiteFooter';
import MuseumAtmosphere from '@/app/components/ui/MuseumAtmosphere';
import CountUp from '@/app/components/ui/CountUp';
import { TYPE } from '@/app/components/ui/type';
import { EASE, SPRING } from '@/app/components/ui/motion';
import { LOTS, type Lot, type LotNumber } from '../lots';
import { layoutOrbit } from '../orbit';
import { Sphere } from '../Sphere';
import { ROOMS, DEAL_STEPS, type Option, type Room } from '../rooms';
import { useLiveNumbers, progressOf } from '../live';
import { InterestDialog, SupportDialog } from './dialogs';

/* ------------------------------------------------------------------ */
/*  PYADRA — the project dashboard                                     */
/*  One template for every project; only the data and the colour       */
/*  change (lots.ts + rooms.ts).                                       */
/*                                                                     */
/*  The first screen decides: who it is (the same sphere as in         */
/*  Galaxy), the proof in numbers, who it suits, and — beside it —     */
/*  the ways in, with one button. The detail waits below, one tab at a */
/*  time, so nothing is cut off and nothing competes. The project's    */
/*  own product is sold on its own site; this page sells the project.  */
/* ------------------------------------------------------------------ */

/** Ring order, so "next in the orbit" walks the ring the visitor saw. */
const ORDER = layoutOrbit(LOTS).placed.map((p) => p.lot);

const SUPPORT_STEPS = [
  { title: 'Pick a layer', detail: 'Any size you choose. Every one moves the Season 2 bar.' },
  { title: 'Pay with Stripe', detail: 'A secure checkout; nothing is stored on this page.' },
  { title: 'Get your credential', detail: 'A permanent code (O77-S1-XXXXXX) arrives by email.' },
  { title: 'Stay in the archive', detail: 'Your name, or your choice to stay anonymous, is kept for good.' },
];

const isTalk = (o: Option) => o.price === 'Let’s talk';

function Evidence({ label }: { label?: string }) {
  if (!label) return null;
  const open = /^(public|live)/i.test(label);
  return (
    <span className={`mt-2 inline-flex items-center gap-1.5 font-mono font-bold text-[10px] uppercase tracking-[0.12em] ${open ? 'text-accent-deep' : 'text-ink-mute'}`}>
      <span aria-hidden className={`w-1.5 h-1.5 rounded-full border border-current ${open ? 'bg-current' : ''}`} />
      {label}
    </span>
  );
}

function Numbers({ numbers }: { numbers: LotNumber[] }) {
  if (!numbers.length) return null;
  const cols = numbers.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3';
  return (
    <div className={`mt-4 grid grid-cols-2 ${cols} gap-2.5`}>
      {numbers.map((n) => (
        <div key={n.label} className="rounded-[18px] bg-white/85 ring-1 ring-ink/6 px-4 py-3.5 min-w-0">
          <p className="font-serif font-semibold text-2xl leading-tight text-ink tabular-nums"><CountUp value={n.value} /></p>
          <p className={`mt-1 ${TYPE.small}`}>{n.label}</p>
          <Evidence label={n.evidence} />
        </div>
      ))}
    </div>
  );
}

/* ---------- the ways in ---------- */

function Ways({
  lot, room, numbers, choice, onChoose, onAct,
}: {
  lot: Lot;
  room: Room;
  numbers: LotNumber[];
  choice: number;
  onChoose: (i: number) => void;
  onAct: () => void;
}) {
  const { ways } = room;
  const chosen = ways.options[choice];
  const progress = ways.kind === 'support' ? progressOf(numbers) : null;
  const heading = { acquire: 'Ways in', operate: 'Ways in', support: 'Back it', forming: 'Follow it' }[ways.kind];
  const cta =
    ways.kind === 'support' ? (chosen.checkout ? `Lock in ${chosen.price} AUD →` : `Talk to ${room.person?.name.split(' ')[0] ?? 'us'} →`)
    : ways.kind === 'forming' ? (isTalk(chosen) ? 'Tell us how →' : `Follow ${lot.name} →`)
    : isTalk(chosen) ? 'Make an offer →' : `Ask about ${chosen.name} →`;
  const foot =
    ways.kind === 'support' ? 'Secure payment via Stripe · a contribution, never ownership.'
    : ways.kind === 'forming' ? 'No payment. Just a note when it opens.'
    : 'Introductory prices. Every deal starts as a conversation, with no checkout.';

  return (
    <aside id="ways" className="lg:sticky lg:top-24 relative overflow-hidden rounded-[28px] bg-white p-5 lg:p-6 ring-1 ring-ink/6 shadow-[0_30px_70px_-34px_rgba(26,28,26,0.35)] scroll-mt-24">
      <span aria-hidden className={`absolute -top-24 -right-16 w-56 h-56 rounded-full blur-3xl opacity-60 ${lot.glow}`} />
      <div className="relative">
        <p className={TYPE.label}>{heading}</p>

        {ways.anchor && (
          <div className="mt-2.5 mb-3.5 pb-3.5 border-b border-ink/6">
            <p className={TYPE.small}>{ways.anchor.label}</p>
            <p className="mt-0.5 font-serif font-semibold text-2xl leading-tight text-ink">{ways.anchor.value}</p>
            <p className={TYPE.small}>{ways.anchor.note}</p>
          </div>
        )}

        {progress !== null && (
          <div className="mt-2.5 mb-3.5 pb-3.5 border-b border-ink/6">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-serif font-semibold text-2xl leading-tight text-ink">{Math.round(progress * 100)}%</p>
              <p className={TYPE.small}>{numbers.find((n) => n.live === 'orbit.raised')?.value} of {numbers.find((n) => n.live === 'orbit.goal')?.value} AUD</p>
            </div>
            <div className="mt-2 h-2 rounded-full bg-paper overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-label="Season 2 funded">
              <motion.div className="h-full rounded-full bg-accent" initial={{ width: 0 }} animate={{ width: `${Math.max(progress * 100, 1.5)}%` }} transition={{ duration: 1.1, ease: EASE.out, delay: 0.3 }} />
            </div>
          </div>
        )}

        <div className={`flex flex-col gap-2 ${!ways.anchor && progress === null ? 'mt-3' : ''}`}>
          {ways.options.map((o, i) => (
            <button
              key={o.name}
              type="button"
              aria-pressed={i === choice}
              onClick={() => onChoose(i)}
              className={`grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-0.5 w-full text-left rounded-2xl px-3.5 py-3 border-0 cursor-pointer transition-[background-color,box-shadow] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                i === choice ? 'bg-white shadow-[inset_0_0_0_2px_#059669]' : 'bg-paper hover:bg-[#E5E9E5]'
              }`}
            >
              <span className="font-sans text-sm font-semibold text-ink">
                {o.name}
                {o.pick && <span className="ml-1.5 align-[2px] rounded-full bg-accent px-1.5 py-0.5 font-mono font-bold text-[10px] uppercase tracking-[0.12em] text-white">Pick</span>}
              </span>
              <span className="row-span-2 font-mono font-bold text-[13px] text-accent-deep whitespace-nowrap">{o.price}</span>
              <span className="font-sans text-xs leading-snug text-ink-soft">{o.terms}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={chosen.name}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className={`mt-3 min-h-[2.9em] ${TYPE.small}`}
          >
            {chosen.detail}
          </motion.p>
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={onAct}
          whileTap={{ scale: 0.98 }}
          className="py-sheen mt-3 w-full rounded-full bg-ink px-5 py-3.5 font-sans text-sm font-semibold text-white border-0 cursor-pointer transition-colors hover:bg-accent-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          {cta}
        </motion.button>
        <p className="mt-2 text-center font-sans text-xs text-ink-mute">{foot}</p>

        {ways.after.length > 0 && (
          <div className="mt-4 pt-3.5 border-t border-ink/6 flex flex-col gap-2">
            <p className={TYPE.label}>After the deal</p>
            {ways.after.map((a) => (
              <div key={a.who} className="grid grid-cols-[68px_1fr] gap-2">
                <span className="font-sans text-[13px] font-semibold text-ink">{a.who}</span>
                <span className={TYPE.small}>{a.what}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

/* ---------- the detail, one tab at a time ---------- */

type Tab = 'take' | 'how' | 'know' | 'person' | 'faq';

function tabsOf(room: Room): { key: Tab; label: string; count?: number }[] {
  const support = room.ways.kind === 'support';
  const tabs: { key: Tab; label: string; count?: number }[] = [];
  if (room.take.length) tabs.push({ key: 'take', label: support ? 'What your support builds' : 'What you’d take', count: room.take.length });
  if (room.ways.kind !== 'forming') tabs.push({ key: 'how', label: support ? 'How backing works' : 'How a deal works' });
  if (room.risks.length) tabs.push({ key: 'know', label: 'Before you decide', count: room.risks.length });
  if (room.person) tabs.push({ key: 'person', label: 'The person' });
  if (room.faq?.length) tabs.push({ key: 'faq', label: 'Questions', count: room.faq.length });
  return tabs;
}

function Panel({ tab, lot, room }: { tab: Tab; lot: Lot; room: Room }) {
  const support = room.ways.kind === 'support';
  if (tab === 'take') {
    return (
      <>
        <PanelHead title={support ? 'What your support builds' : 'What you’d take'} note={support ? 'Where the money goes' : 'Everything here changes hands'} />
        <p className={`mt-1.5 mb-5 max-w-[70ch] ${TYPE.small}`}>
          {support ? 'Season 2 first, then what the show grows into.' : 'Real parts of a working project. Nothing on this list is a promise of what it could become.'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {room.take.map((t) => (
            <div key={t.title} className="rounded-[18px] bg-white ring-1 ring-ink/6 p-4">
              <p className="flex items-start gap-2 font-sans text-sm font-semibold text-ink">
                <span aria-hidden className={`mt-0.5 flex w-[18px] h-[18px] shrink-0 items-center justify-center rounded-full ${lot.glow}`}>
                  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="#1A1C1A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12.5l4 4 8-9" /></svg>
                </span>
                {t.title}
              </p>
              <p className={`mt-1 pl-[26px] ${TYPE.small}`}>{t.detail}</p>
            </div>
          ))}
        </div>
        {room.notIncluded?.length ? (
          <div className="mt-4 pt-4 border-t border-dashed border-ink/15 flex flex-wrap gap-x-6 gap-y-1.5">
            <p className={`w-full ${TYPE.label}`}>{support ? 'What you don’t get' : 'Not included'}</p>
            {room.notIncluded.map((n) => (
              <p key={n.item} className={TYPE.small}><span className="font-semibold text-ink">{n.item}:</span> {n.note}</p>
            ))}
          </div>
        ) : null}
        {room.proofNote && <p className={`mt-4 max-w-[70ch] ${TYPE.small}`}>{room.proofNote}</p>}
        {room.verify?.length ? (
          <div className="mt-3.5 flex flex-wrap gap-2">
            {room.verify.map((v) => (
              <a key={v.href} href={v.href} target="_blank" rel="noopener noreferrer" className="rounded-full bg-accent/8 px-3 py-1.5 font-sans text-[13px] font-semibold text-accent-deep no-underline hover:bg-accent/15 transition-colors">
                {v.label} ↗
              </a>
            ))}
          </div>
        ) : null}
      </>
    );
  }
  if (tab === 'how') {
    const steps = support ? SUPPORT_STEPS : DEAL_STEPS;
    return (
      <>
        <PanelHead title={support ? 'How backing works' : 'From a question to a handover'} note={support ? 'A few minutes' : 'The same for every project'} />
        <p className={`mt-1.5 mb-5 max-w-[70ch] ${TYPE.small}`}>
          {room.handover ?? (support ? 'A contribution, not an investment: it funds the next season and gives you a place in the archive.' : 'Nothing is sold on this page. A deal is a conversation that ends in a signed agreement.')}
        </p>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 list-none p-0 m-0">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-[18px] bg-white ring-1 ring-ink/6 p-4">
              <span className="flex w-6 h-6 items-center justify-center rounded-full bg-accent/10 font-mono font-bold text-xs text-accent-deep">{i + 1}</span>
              <p className="mt-2 font-sans text-sm font-semibold text-ink">{s.title}</p>
              <p className={`mt-0.5 ${TYPE.small}`}>{s.detail}</p>
            </li>
          ))}
        </ol>
      </>
    );
  }
  if (tab === 'know') {
    return (
      <>
        <PanelHead title="Before you decide" note="Said plainly" />
        <p className={`mt-1.5 mb-5 max-w-[70ch] ${TYPE.small}`}>What could go wrong, written down before you have to ask.</p>
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-2.5 list-none p-0 m-0">
          {room.risks.map((r, i) => (
            <li key={r.title} className="rounded-[18px] bg-white ring-1 ring-ink/6 p-4">
              <span className="font-mono font-bold text-xs text-[#B45309]">{String(i + 1).padStart(2, '0')}</span>
              <p className="mt-1 font-sans text-sm font-semibold text-ink">{r.title}</p>
              <p className={`mt-0.5 ${TYPE.small}`}>{r.detail}</p>
            </li>
          ))}
        </ol>
      </>
    );
  }
  if (tab === 'person' && room.person) {
    const p = room.person;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-[132px_1fr] gap-5 sm:gap-7 items-center">
        <div className="relative w-28 sm:w-[132px] aspect-square rounded-[24px] overflow-hidden ring-1 ring-ink/8 bg-paper">
          <Image src={p.photo} alt={`${p.name}`} fill sizes="132px" className="object-cover" />
        </div>
        <div>
          <p className={TYPE.label}>The person behind it</p>
          <p className="mt-2 max-w-[60ch] font-serif font-semibold text-lg leading-relaxed text-ink">“{p.quote}”</p>
          <p className={`mt-2.5 ${TYPE.small}`}><span className="font-semibold text-ink">{p.name}</span> · {p.role}</p>
        </div>
      </div>
    );
  }
  if (tab === 'faq' && room.faq) {
    return (
      <>
        <PanelHead title="Questions" />
        <div className="mt-3">
          {room.faq.map((f, i) => (
            <details key={f.q} className={`group py-3.5 ${i ? 'border-t border-ink/6' : ''}`}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-sans text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden className="font-mono text-base text-ink-mute group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className={`mt-2 max-w-[70ch] ${TYPE.small}`}>{f.a}</p>
            </details>
          ))}
        </div>
      </>
    );
  }
  return null;
}

function PanelHead({ title, note }: { title: string; note?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3">
      <h2 className={TYPE.title}>{title}</h2>
      {note && <span className={TYPE.label}>{note}</span>}
    </div>
  );
}

/* ---------- the page ---------- */

export default function ProjectDashboard({ id }: { id: string }) {
  const lot = LOTS.find((l) => l.id === id)!;
  const room = ROOMS[id];
  const sheet = lot.sheet ?? {};
  const reduced = useReducedMotion() ?? false;
  const numbers = useLiveNumbers(sheet.numbers);

  const [choice, setChoice] = useState(Math.max(0, room.ways.options.findIndex((o) => o.pick)));
  const tabs = tabsOf(room);
  const [tab, setTab] = useState<Tab | null>(tabs[0]?.key ?? null);
  const [dialog, setDialog] = useState<'interest' | 'support' | null>(null);
  const chosen = room.ways.options[choice];
  const act = () => setDialog(room.ways.kind === 'support' ? 'support' : 'interest');

  // next and previous along the ring, as the visitor saw it
  const at = ORDER.findIndex((l) => l.id === id);
  const prev = ORDER[(at - 1 + ORDER.length) % ORDER.length];
  const next = ORDER[(at + 1) % ORDER.length];

  // arriving from another room lands at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const status = room.status;
  const enter = { initial: reduced ? false : { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 } } as const;

  return (
    <div className="bg-paper text-ink relative min-h-screen overflow-x-clip antialiased selection:bg-accent selection:text-white">
      <div aria-hidden className="absolute inset-x-0 top-0 h-[60vh] pointer-events-none bg-gradient-to-b from-white/50 to-transparent" />
      <MuseumAtmosphere dust={16} />
      <SiteNav crumbs={[{ label: 'Galaxy', href: '/exhibitions/galaxy' }, { label: lot.name }]} status={{ label: status, live: lot.stage === 'ready' }} />

      <main className="relative z-10 mx-auto w-full max-w-[1180px] px-4 md:px-6 pt-24 pb-32 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-4 items-start">
          <div>
            {/* who it is — the sphere from Galaxy, come closer */}
            <motion.section {...enter} transition={{ duration: 0.6, ease: EASE.out }} className="rounded-[28px] bg-white/75 backdrop-blur-sm ring-1 ring-ink/6 p-5 md:p-7">
              <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-4 sm:gap-7 items-center">
                <div aria-hidden className="relative flex flex-col items-start sm:items-center">
                  <span className={`absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-0 w-28 sm:w-[150px] aspect-square rounded-full blur-2xl opacity-60 ${lot.glow}`} />
                  <motion.div
                    className="relative w-24 sm:w-[150px] aspect-square"
                    animate={reduced ? undefined : { y: [0, -8, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Sphere lot={lot} className="w-full h-full shadow-[-14px_20px_36px_rgba(26,28,26,0.2)]" />
                  </motion.div>
                  <span className="mt-3 ml-3 sm:ml-0 block w-14 sm:w-20 h-2.5 rounded-[50%] bg-ink/15 blur-[5px]" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="rounded-full bg-white px-2.5 py-1 font-mono font-bold text-[11px] uppercase tracking-[0.14em] text-ink-mute ring-1 ring-ink/8">{lot.type} · {lot.kind}</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 font-mono font-bold text-[11px] uppercase tracking-[0.14em] text-accent-deep">
                      <span aria-hidden className={`w-1.5 h-1.5 rounded-full ${lot.stage === 'ready' ? 'bg-accent' : 'border border-accent'}`} />
                      {status}
                    </span>
                  </div>
                  <h1 className={TYPE.display}>{lot.name}</h1>
                  <p className={`mt-3 ${TYPE.title}`}>{sheet.hook ?? lot.subtitle}</p>
                </div>
              </div>
              {sheet.summary && <p className={`mt-5 max-w-[64ch] ${TYPE.lead}`}>{sheet.summary}</p>}
              {sheet.live && (
                <a
                  href={sheet.live.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex flex-wrap items-center gap-x-2 rounded-full bg-white px-4 py-2.5 font-sans text-sm font-semibold text-accent-deep no-underline ring-1 ring-accent/25 transition-colors hover:bg-accent/8"
                >
                  Visit {sheet.live.label} <span aria-hidden>↗</span>
                  {sheet.live.note && <span className="font-medium text-ink-mute">· {sheet.live.note}</span>}
                </a>
              )}
            </motion.section>

            <motion.div {...enter} transition={{ duration: 0.6, ease: EASE.out, delay: 0.08 }}>
              <Numbers numbers={numbers} />
            </motion.div>

            {sheet.idealFor?.length ? (
              <motion.div {...enter} transition={{ duration: 0.6, ease: EASE.out, delay: 0.14 }} className="mt-3.5 flex flex-wrap items-center gap-1.5">
                <span className={`mr-1 ${TYPE.label}`}>Ideal for</span>
                {sheet.idealFor.map((x) => (
                  <span key={x} className="rounded-full bg-white/70 px-3 py-1 font-sans text-[13px] font-medium text-ink-soft ring-1 ring-ink/6">{x}</span>
                ))}
              </motion.div>
            ) : null}
          </div>

          <motion.div {...enter} transition={{ ...SPRING.glide, delay: 0.1 }}>
            <Ways lot={lot} room={room} numbers={numbers} choice={choice} onChoose={setChoice} onAct={act} />
          </motion.div>
        </div>

        {tab && (
          <motion.section {...enter} transition={{ duration: 0.6, ease: EASE.out, delay: 0.2 }} className="mt-4 rounded-[28px] bg-white/75 backdrop-blur-sm ring-1 ring-ink/6 p-4 md:p-6">
            <div role="tablist" aria-label={`About ${lot.name}`} className="flex max-w-full w-max gap-0.5 overflow-x-auto rounded-full bg-white p-1 ring-1 ring-ink/6 [scrollbar-width:none]">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.key}
                  onClick={() => setTab(t.key)}
                  className={`whitespace-nowrap rounded-full px-3.5 py-2 font-sans text-[13px] font-medium border-0 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    tab === t.key ? 'bg-ink text-white' : 'bg-transparent text-ink-soft hover:bg-paper hover:text-ink'
                  }`}
                >
                  {t.label}
                  {t.count ? <span className={`ml-1.5 font-mono text-[11px] ${tab === t.key ? 'text-white/60' : 'text-ink-mute'}`}>{t.count}</span> : null}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                role="tabpanel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: EASE.out }}
                className="mt-5 px-1"
              >
                <Panel tab={tab} lot={lot} room={room} />
              </motion.div>
            </AnimatePresence>
          </motion.section>
        )}

        {/* along the ring */}
        <nav aria-label="Other projects" className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[24px] bg-white/55 ring-1 ring-ink/6 px-5 py-4">
          {[{ l: prev, label: 'Before it in the orbit', end: false }, { l: next, label: 'Next in the orbit', end: true }].map(({ l, label, end }) => (
            <Link key={label} href={l.enter_url ?? '/exhibitions/galaxy'} className={`group flex items-center gap-3 no-underline ${end ? 'flex-row-reverse text-right' : ''}`}>
              <Sphere lot={l} className="w-10 h-10 shrink-0 shadow-[-4px_6px_12px_rgba(26,28,26,0.15)] transition-transform group-hover:scale-110" />
              <span>
                <span className={`block ${TYPE.label}`}>{label}</span>
                <span className="block font-sans text-sm font-semibold text-ink group-hover:text-accent-deep transition-colors">{l.name}</span>
              </span>
            </Link>
          ))}
        </nav>
      </main>

      <SiteFooter />

      {/* phones: the ask stays in reach */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 bg-white/92 backdrop-blur-xl px-4 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom,0px))] shadow-[0_-1px_0_rgba(26,28,26,0.08)]">
        <div className="min-w-0">
          <p className={`truncate ${TYPE.label}`}>{chosen.name}</p>
          <p className="font-serif font-semibold text-lg leading-tight text-ink">{chosen.price}</p>
        </div>
        <button type="button" onClick={act} className="shrink-0 rounded-full bg-ink px-5 py-3 font-sans text-sm font-semibold text-white border-0 cursor-pointer">
          {room.ways.kind === 'forming' ? 'Follow' : room.ways.kind === 'support' ? 'Back it' : 'Ask about it'}
        </button>
      </div>

      <InterestDialog
        open={dialog === 'interest'}
        onClose={() => setDialog(null)}
        project={lot.name}
        option={chosen}
        kind={room.ways.kind}
        person={room.person?.name.split(' ')[0] ?? null}
      />
      <SupportDialog open={dialog === 'support'} onClose={() => setDialog(null)} option={chosen} />
    </div>
  );
}
