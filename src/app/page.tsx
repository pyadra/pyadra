'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import SiteNav from '@/app/components/nav/SiteNav';
import SiteFooter from '@/app/components/nav/SiteFooter';
import MuseumAtmosphere from '@/app/components/ui/MuseumAtmosphere';
import RevealText from '@/app/components/ui/RevealText';
import Magnetic from '@/app/components/ui/Magnetic';
import { TYPE } from '@/app/components/ui/type';
import { EASE, RISE } from '@/app/components/ui/motion';
import { trackPointer } from '@/app/components/ui/pointer';
import { LOTS } from '@/app/exhibitions/galaxy/lots';
import { HOME, PIECES, PLAIN, ROOM, SETS, STEPS, aud } from '@/app/house/house';
import { SAMPLE_SLUG } from '@/app/house/exhibition';
import { withVia } from '@/app/house/via';
import { useVia } from '@/app/house/useVia';

/* ------------------------------------------------------------------ */
/*  PYADRA — HOME · The house                                          */
/*                                                                     */
/*  The `rethink/exhibition-of-one` proposal (November 2026). Pyadra   */
/*  stops offering its projects to people who would have to pay to     */
/*  run them, and sells what the projects make: pieces made for one    */
/*  person, hung together in a small museum room.                      */
/*                                                                     */
/*  The projects stay where they were (Galaxy and their dashboards).   */
/*  Three of them are the workshops. The earlier Home lives at         */
/*  /museum. Every string and number comes from house/house.ts.        */
/* ------------------------------------------------------------------ */

const ENTER = 0.75; // the template dissolve (template.tsx) settles first

const CTA = 'cta-glow py-sheen inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-sans text-sm font-semibold text-white';
const GHOST =
  'inline-flex items-center gap-2 rounded-full px-5 py-3.5 font-sans text-sm font-semibold text-ink-soft ring-1 ring-ink/10 bg-white/60 hover:text-accent-deep hover:ring-accent/40 transition-colors';

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

export default function PyadraHome() {
  const reduced = useReducedMotion() ?? false;
  const via = useVia();
  const commission = (piece?: string) => withVia(piece ? `/commission?piece=${piece}` : '/commission', via);
  const sample = withVia(`/for/${SAMPLE_SLUG}`, via);
  const workshop = (id: string) => LOTS.find((l) => l.id === id);

  const rise = (delay: number) => ({
    initial: reduced ? false : ({ opacity: 0, y: 12 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { delay: ENTER + delay, duration: 0.7, ease: EASE.out },
  });

  return (
    <main className="relative min-h-screen overflow-x-clip bg-paper text-ink">
      <MuseumAtmosphere dust={28} fixed />
      <SiteNav actions={[{ label: 'Workshops', href: '/exhibitions/galaxy' }]} />

      {/* ---------------------------------------------------------- */}
      {/*  Opening — what it is, and the door to a sample             */}
      {/* ---------------------------------------------------------- */}
      <section className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pb-28 lg:pt-44">
        <div>
          <motion.div {...rise(0)} className={`${TYPE.label} !text-accent-deep mb-5 flex items-center gap-2`}>
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
            {HOME.label}
          </motion.div>
          <RevealText as="h1" text={HOME.headline} className="t-d1 text-balance text-ink" delay={ENTER + 0.1} after={<span className="text-accent">.</span>} />
          <motion.p {...rise(0.55)} className={`${TYPE.lead} mt-6 max-w-xl`}>
            {HOME.lead}
          </motion.p>
          <motion.div {...rise(0.7)} className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link href={commission()} className={CTA}>
                {HOME.cta} <span aria-hidden>→</span>
              </Link>
            </Magnetic>
            <Link href={sample} className={GHOST}>
              {HOME.sample}
            </Link>
          </motion.div>
          <motion.p {...rise(0.9)} className={`${TYPE.small} mt-5 !text-ink-mute`}>
            {HOME.note}
          </motion.p>
        </div>

        {/* the doorway: a real room, one click away */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: ENTER + 0.45, duration: 0.9, ease: EASE.out }}
        >
          <Link
            href={sample}
            onPointerMove={trackPointer}
            className="py-spot panel-lift block rounded-[28px] bg-white/85 p-6 shadow-xl shadow-ink/5 ring-1 ring-ink/5 backdrop-blur-md sm:p-8"
          >
            <div className="flex items-baseline justify-between">
              <div className={TYPE.label}>Sample room</div>
              <div className={`${TYPE.label} !text-accent-deep`}>Admit one</div>
            </div>
            <div className={`${TYPE.display} mt-6`}>La doctora</div>
            <p className={`${TYPE.statement} mt-2`}>A birthday, kept.</p>
            <ul className="mt-7 divide-y divide-ink/8 border-y border-ink/8">
              {PIECES.map((p) => (
                <li key={p.id} className="flex items-baseline gap-4 py-3.5">
                  <span className={`${TYPE.label} w-6 !text-accent-deep`}>{p.numeral}</span>
                  <span className={`${TYPE.lead} !text-ink`}>{p.name}</span>
                  <span className={`${TYPE.small} ml-auto text-right !text-ink-mute`}>
                    {p.id === 'song' ? 'Plays in the room' : p.id === 'letter' ? 'Sealed until its day' : 'Arrives by post'}
                  </span>
                </li>
              ))}
            </ul>
            <div className={`${TYPE.small} mt-6 inline-flex items-center gap-2 !text-accent-deep`}>
              Walk in <span aria-hidden>→</span>
            </div>
          </Link>
        </motion.div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/*  The pieces — each made by one of Pyadra's own projects     */}
      {/* ---------------------------------------------------------- */}
      <Section id="pieces" className="pb-24 lg:pb-32">
        <Heading label="The pieces" title="Three workshops, one room." lead={ROOM.line} />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {PIECES.map((p) => {
            const lot = workshop(p.workshop);
            return (
              <motion.div key={p.id} variants={RISE} onPointerMove={trackPointer} className="py-spot panel-lift flex flex-col rounded-[28px] bg-white/75 p-7 ring-1 ring-ink/5">
                <div className={`${TYPE.label} !text-accent-deep`}>{p.numeral}</div>
                <h3 className={`${TYPE.title} mt-2`}>{p.name}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className={TYPE.display}>{aud(p.price)}</span>
                </div>
                <div className={`${TYPE.label} mt-2 !text-accent-deep`}>{p.time}</div>
                <p className={`${TYPE.body} mt-4 !text-ink-soft`}>{p.line}</p>
                <p className={`${TYPE.small} mt-3 !text-ink-mute`}>{p.made}</p>
                {p.fine && <p className={`${TYPE.small} mt-2 !text-ink-mute`}>{p.fine}</p>}
                <div className="mt-auto pt-7">
                  <Link href={commission(p.id)} className={`${GHOST} w-full justify-center`}>
                    Start with {p.name.toLowerCase()}
                  </Link>
                  {lot?.enter_url && (
                    <Link href={lot.enter_url} className={`${TYPE.small} mt-3 block text-center !text-ink-mute hover:!text-accent-deep transition-colors`}>
                      Made by {lot.name} →
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        <motion.p variants={RISE} className={`${TYPE.small} mt-5 !text-ink-mute`}>
          Together they cost less: {SETS.map((s) => `${s.name.toLowerCase()} ${aud(s.price)}`).join(', ')}. The room itself is on the house. {ROOM.keep}
        </motion.p>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  How it goes                                                */}
      {/* ---------------------------------------------------------- */}
      <Section id="how" className="pb-24 lg:pb-32">
        <Heading label="How it goes" title="Five minutes from you. The rest is ours." />
        <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <motion.div key={s.n} variants={RISE} className="border-t border-ink/10 pt-5">
              <div className={`${TYPE.label} !text-accent-deep`}>{s.n}</div>
              <h3 className={`${TYPE.title} mt-3`}>{s.title}</h3>
              <p className={`${TYPE.body} mt-3 !text-ink-soft`}>{s.text}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  Said plainly                                               */}
      {/* ---------------------------------------------------------- */}
      <Section className="pb-24 lg:pb-32">
        <Heading label="Said plainly" title="What you should know before you give one." />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {PLAIN.map((p) => (
            <motion.div key={p.title} variants={RISE} className="rounded-[28px] bg-ink/[0.035] p-7">
              <h3 className={TYPE.title}>{p.title}</h3>
              <p className={`${TYPE.body} mt-3 !text-ink-soft`}>{p.text}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  The ask, once more                                         */}
      {/* ---------------------------------------------------------- */}
      <Section className="pb-20">
        <motion.div variants={RISE} className="relative overflow-hidden rounded-[32px] bg-white px-6 py-14 text-center ring-1 ring-ink/5 sm:px-12 sm:py-20">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-64 w-[36rem] max-w-full rounded-full bg-accent/15 blur-3xl" />
          <div className="relative">
            <h2 className={`${TYPE.display} text-balance`}>Who would you make one for?</h2>
            <p className={`${TYPE.lead} mx-auto mt-4 max-w-md`}>Tell us about them. A person reads it and answers with the price and the day it will be ready.</p>
            <div className="mt-8 flex justify-center">
              <Link href={commission()} className={CTA}>
                {HOME.cta} <span aria-hidden>→</span>
              </Link>
            </div>
            <p className={`${TYPE.small} mt-5 !text-ink-mute`}>
              Pyadra’s projects are its workshops:{' '}
              <Link href="/exhibitions/galaxy" className="!text-accent-deep underline-offset-4 hover:underline">
                see them in Galaxy
              </Link>
              . Know people who would give one?{' '}
              <Link href="/carry" className="!text-accent-deep underline-offset-4 hover:underline">
                Carry it
              </Link>
              .
            </p>
          </div>
        </motion.div>
      </Section>

      <SiteFooter />
    </main>
  );
}
