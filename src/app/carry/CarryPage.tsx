'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import SiteNav from '@/app/components/nav/SiteNav';
import SiteFooter from '@/app/components/nav/SiteFooter';
import BringIdeaDialog from '@/app/components/nav/BringIdeaDialog';
import MuseumAtmosphere from '@/app/components/ui/MuseumAtmosphere';
import RevealText from '@/app/components/ui/RevealText';
import { TYPE } from '@/app/components/ui/type';
import { EASE, RISE } from '@/app/components/ui/motion';
import { trackPointer } from '@/app/components/ui/pointer';
import { LOTS } from '@/app/exhibitions/galaxy/lots';
import { Sphere } from '@/app/exhibitions/galaxy/Sphere';
import { CARRY, CARRY_OFFERS, CARRY_STEPS, CARRY_SUITS, REPLY_WINDOW, SPLIT, WORKSHOP_DOOR, aud, pieceById } from '@/app/house/house';

/* ------------------------------------------------------------------ */
/*  PYADRA · /carry — the people who bring it to others.               */
/*                                                                     */
/*  Until now every door into a project had a price on it. This one    */
/*  has none: a carrier brings the house to people they know and keeps */
/*  a share of what they bring. The projects stay with Pyadra.         */
/*                                                                     */
/*  Codes are handed out by hand: this page sends the request to       */
/*  pyadra@pyadra.io (through /api/contact) and a person answers.      */
/* ------------------------------------------------------------------ */

const ENTER = 0.75;

const CTA = 'cta-glow py-sheen inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-sans text-sm font-semibold text-white';
const GHOST =
  'inline-flex items-center gap-2 rounded-full px-5 py-3.5 font-sans text-sm font-semibold text-ink-soft ring-1 ring-ink/10 bg-white/60 hover:text-accent-deep hover:ring-accent/40 transition-colors';
const input =
  'w-full rounded-2xl bg-white/80 px-4 py-3 font-sans text-base text-ink ring-1 ring-ink/10 placeholder:text-ink-mute/60 focus:outline-none focus:ring-2 focus:ring-accent/60 transition-shadow';

/** The split, drawn on one real piece so the shares read as money. */
const EXAMPLE = pieceById('song')!;
const PARTS: { key: keyof typeof SPLIT; who: string; tone: string }[] = [
  { key: 'workshop', who: 'The workshop that makes it', tone: 'bg-ink/80' },
  { key: 'carrier', who: 'You, for bringing it', tone: 'bg-accent' },
  { key: 'house', who: 'The house', tone: 'bg-ink/25' },
];

function Section({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.section
      id={id}
      initial={reduced ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '-12% 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
      className={`relative z-10 mx-auto w-full max-w-6xl scroll-mt-24 px-5 sm:px-8 ${className}`}
    >
      {children}
    </motion.section>
  );
}

function Heading({ label, title, lead }: { label: string; title: string; lead?: string }) {
  return (
    <motion.div variants={RISE} className="max-w-2xl">
      <div className={`${TYPE.label} !text-accent-deep mb-3`}>{label}</div>
      <h2 className={TYPE.display}>{title}</h2>
      {lead && <p className={`${TYPE.lead} mt-4`}>{lead}</p>}
    </motion.div>
  );
}

export default function CarryPage() {
  const reduced = useReducedMotion() ?? false;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [where, setWhere] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [workshopDoor, setWorkshopDoor] = useState(false);
  const ready = name.trim() && email.includes('@') && where.trim().length >= 10;

  const rise = (delay: number) => ({
    initial: reduced ? false : ({ opacity: 0, y: 12 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { delay: ENTER + delay, duration: 0.7, ease: EASE.out },
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'carry-application',
          project: name.trim(),
          model: 'The house',
          name: name.trim(),
          email: email.trim(),
          message: where.trim(),
        }),
      });
      if (!res.ok) throw new Error('send failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-clip bg-paper text-ink">
      <MuseumAtmosphere dust={24} fixed />
      <SiteNav crumbs={[{ label: 'Carry it' }]} actions={[{ label: 'Workshops', href: '/exhibitions/galaxy' }]} />

      {/* ---------------------------------------------------------- */}
      {/*  Opening                                                    */}
      {/* ---------------------------------------------------------- */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-20 pt-32 sm:px-8 lg:pb-28 lg:pt-44">
        <motion.div {...rise(0)} className={`${TYPE.label} !text-accent-deep mb-5 flex items-center gap-2`}>
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
          {CARRY.label}
        </motion.div>
        <RevealText as="h1" text={CARRY.headline} className="t-d1 text-ink" delay={ENTER + 0.1} after={<span className="text-accent">.</span>} />
        <motion.p {...rise(0.5)} className={`${TYPE.lead} mt-6 max-w-2xl`}>
          {CARRY.lead}
        </motion.p>
        <motion.div {...rise(0.65)} className="mt-8 flex flex-wrap items-center gap-3">
          <a href="#ask" className={CTA}>
            {CARRY.cta} <span aria-hidden>→</span>
          </a>
          <Link href="/for/la-doctora" className={GHOST}>
            See what you would carry
          </Link>
        </motion.div>
        <motion.p {...rise(0.85)} className={`${TYPE.small} mt-5 !text-ink-mute`}>
          {CARRY.note}
        </motion.p>
      </section>

      {/* ---------------------------------------------------------- */}
      {/*  How it goes                                                */}
      {/* ---------------------------------------------------------- */}
      <Section className="pb-24 lg:pb-32">
        <Heading label="How it goes" title="You bring people. The workshops do the rest." />
        <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {CARRY_STEPS.map((s) => (
            <motion.div key={s.n} variants={RISE} className="border-t border-ink/10 pt-5">
              <div className={`${TYPE.label} !text-accent-deep`}>{s.n}</div>
              <h3 className={`${TYPE.title} mt-3`}>{s.title}</h3>
              <p className={`${TYPE.body} mt-3 !text-ink-soft`}>{s.text}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  The split, on one real piece                               */}
      {/* ---------------------------------------------------------- */}
      <Section id="split" className="pb-24 lg:pb-32">
        <Heading
          label="The split"
          title={`Where the ${aud(EXAMPLE.price)} of a song goes.`}
          lead="The same shares on every piece, written down before the first one is paid for."
        />
        <motion.div variants={RISE} className="mt-10 rounded-[28px] bg-white/75 p-6 ring-1 ring-ink/5 sm:p-9">
          <div className="flex h-4 w-full overflow-hidden rounded-full" role="img" aria-label={PARTS.map((p) => `${p.who}: ${SPLIT[p.key]} percent`).join('. ')}>
            {PARTS.map((p) => (
              <span key={p.key} className={p.tone} style={{ width: `${SPLIT[p.key]}%` }} />
            ))}
          </div>
          <div className="mt-7 grid gap-6 sm:grid-cols-3">
            {PARTS.map((p) => (
              <div key={p.key}>
                <div className="flex items-center gap-2">
                  <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${p.tone}`} />
                  <span className={TYPE.label}>{SPLIT[p.key]}%</span>
                </div>
                <div className={`${TYPE.title} mt-2`}>{aud(Math.round(EXAMPLE.price * SPLIT[p.key]) / 100)}</div>
                <div className={`${TYPE.small} mt-1`}>{p.who}</div>
              </div>
            ))}
          </div>
          <p className={`${TYPE.small} mt-7 border-t border-ink/8 pt-5 !text-ink-mute`}>
            After payment fees. When a piece arrives without a code, your share stays with the house and pays for finding people.
          </p>
        </motion.div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  Who it suits                                               */}
      {/* ---------------------------------------------------------- */}
      <Section className="pb-24 lg:pb-32">
        <Heading label="Who it suits" title="Anyone people already listen to." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {CARRY_SUITS.map((s) => (
            <motion.div key={s.title} variants={RISE} className="rounded-[28px] bg-ink/[0.035] p-7">
              <h3 className={TYPE.title}>{s.title}</h3>
              <p className={`${TYPE.body} mt-3 !text-ink-soft`}>{s.text}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  What carrying each project means today                     */}
      {/* ---------------------------------------------------------- */}
      <Section id="projects" className="pb-24 lg:pb-32">
        <Heading
          label="Project by project"
          title="What there is to carry today."
          lead="Where a project earns nothing yet, there is nothing to share yet, and we say so."
        />
        <motion.ul variants={RISE} className="mt-10 overflow-hidden rounded-[28px] bg-white/70 ring-1 ring-ink/5 backdrop-blur-sm">
          {CARRY_OFFERS.map((o, i) => {
            const lot = LOTS.find((l) => l.id === o.lot)!;
            return (
              <li
                key={o.lot}
                onPointerMove={trackPointer}
                className={`py-spot grid items-center gap-x-6 gap-y-3 px-5 py-5 sm:px-7 md:grid-cols-[15rem_minmax(0,1fr)_auto] ${i > 0 ? 'border-t border-ink/6' : ''}`}
              >
                <Link href={lot.enter_url ?? '/exhibitions/galaxy'} className="flex min-w-0 items-center gap-3.5">
                  <Sphere lot={lot} className="h-11 w-11 shrink-0" />
                  <span className="min-w-0">
                    <span className={`${TYPE.label} block`}>{lot.kind}</span>
                    <span className={`${TYPE.lead} block truncate !text-ink`}>{lot.name}</span>
                  </span>
                </Link>
                <p className={`${TYPE.body} !text-ink-soft`}>{o.what}</p>
                <span
                  className={`${TYPE.small} justify-self-start rounded-full px-3.5 py-2 md:justify-self-end ${
                    o.earning ? 'bg-accent/10 !text-accent-deep' : 'bg-paper !text-ink-mute'
                  }`}
                >
                  {o.share}
                </span>
              </li>
            );
          })}
        </motion.ul>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  Ask for a code                                             */}
      {/* ---------------------------------------------------------- */}
      <Section id="ask" className="pb-24 lg:pb-32">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Heading label="Ask for your code" title="Tell us who you would bring it to." lead={`A person reads it and answers within ${REPLY_WINDOW} with your code and your link.`} />
          <motion.div variants={RISE}>
            {status === 'success' ? (
              <div className="rounded-[28px] bg-white/80 p-8 text-center ring-1 ring-ink/5 sm:p-10">
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent-deep">✓</div>
                <h3 className={TYPE.title}>We have it.</h3>
                <p className={`${TYPE.lead} mx-auto mt-3 max-w-sm`}>
                  We answer within {REPLY_WINDOW}, from pyadra@pyadra.io, with your code.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className={`${TYPE.label} mb-2.5 block`}>Your name</span>
                    <input type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} className={input} />
                  </label>
                  <label className="block">
                    <span className={`${TYPE.label} mb-2.5 block`}>Email to answer you</span>
                    <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
                  </label>
                </div>
                <label className="block">
                  <span className={`${TYPE.label} mb-2.5 block`}>Where your people are</span>
                  <textarea
                    rows={4}
                    maxLength={1200}
                    value={where}
                    onChange={(e) => setWhere(e.target.value)}
                    placeholder="A counter, a group, an audience, a profession. And which project you would carry."
                    className={`${input} resize-y`}
                  />
                </label>
                {status === 'error' && (
                  <p role="alert" className={`${TYPE.small} !text-red-700`}>
                    It did not send. Write to{' '}
                    <a href="mailto:pyadra@pyadra.io" className="font-semibold underline">
                      pyadra@pyadra.io
                    </a>{' '}
                    and we will pick it up there.
                  </p>
                )}
                <button type="submit" disabled={!ready || status === 'sending'} className={`${CTA} disabled:pointer-events-none disabled:opacity-40`}>
                  {status === 'sending' ? 'Sending…' : CARRY.cta} <span aria-hidden>→</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  The other door: bring a workshop                           */}
      {/* ---------------------------------------------------------- */}
      <Section className="pb-20">
        <motion.div variants={RISE} className="rounded-[32px] border border-dashed border-ink/15 px-6 py-12 text-center sm:px-12">
          <div className={`${TYPE.label} !text-accent-deep`}>{WORKSHOP_DOOR.label}</div>
          <h2 className={`${TYPE.display} mx-auto mt-3 max-w-xl text-balance`}>{WORKSHOP_DOOR.title}</h2>
          <p className={`${TYPE.lead} mx-auto mt-4 max-w-xl`}>{WORKSHOP_DOOR.text}</p>
          <button type="button" onClick={() => setWorkshopDoor(true)} className={`${GHOST} mt-7`}>
            {WORKSHOP_DOOR.cta} <span aria-hidden>→</span>
          </button>
        </motion.div>
      </Section>

      <BringIdeaDialog open={workshopDoor} onClose={() => setWorkshopDoor(false)} copy={WORKSHOP_DOOR.dialog} />
      <SiteFooter />
    </main>
  );
}
