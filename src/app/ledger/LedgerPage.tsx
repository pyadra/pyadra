'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import SiteNav from '@/app/components/nav/SiteNav';
import SiteFooter from '@/app/components/nav/SiteFooter';
import MuseumAtmosphere from '@/app/components/ui/MuseumAtmosphere';
import RevealText from '@/app/components/ui/RevealText';
import { TYPE } from '@/app/components/ui/type';
import { EASE, RISE } from '@/app/components/ui/motion';
import { trackPointer } from '@/app/components/ui/pointer';
import { LOTS } from '@/app/exhibitions/galaxy/lots';
import { Sphere } from '@/app/exhibitions/galaxy/Sphere';
import { useLiveLots } from '@/app/exhibitions/galaxy/live';
import { LEDGER, PIECES, SPLIT } from '@/app/house/house';

/* ------------------------------------------------------------------ */
/*  PYADRA · /ledger — the open book.                                  */
/*                                                                     */
/*  The house's honesty rules (the page never claims what the code     */
/*  does not do; every number says where it comes from) turned into a  */
/*  page. Nothing is written here: every figure is a project's own     */
/*  number from galaxy/lots.ts, read live where it can be (live.ts),   */
/*  and the rooms count comes from /api/stats/house.                   */
/* ------------------------------------------------------------------ */

const ENTER = 0.75;

const PARTS: { key: keyof typeof SPLIT; who: string; tone: string }[] = [
  { key: 'workshop', who: 'The workshop that makes it', tone: 'bg-ink/80' },
  { key: 'carrier', who: 'Whoever carried it', tone: 'bg-accent' },
  { key: 'house', who: 'The house', tone: 'bg-ink/25' },
];

export default function LedgerPage() {
  const reduced = useReducedMotion() ?? false;
  const live = useLiveLots(LOTS);
  const [rooms, setRooms] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/stats/house')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { rooms?: number } | null) => !cancelled && setRooms(typeof d?.rooms === 'number' ? d.rooms : null))
      .catch(() => !cancelled && setRooms(null));
    return () => {
      cancelled = true;
    };
  }, []);

  const rise = (delay: number) => ({
    initial: reduced ? false : ({ opacity: 0, y: 12 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { delay: ENTER + delay, duration: 0.7, ease: EASE.out },
  });

  return (
    <main className="relative min-h-screen overflow-x-clip bg-paper text-ink">
      <MuseumAtmosphere dust={20} fixed />
      <SiteNav crumbs={[{ label: 'The open book' }]} actions={[{ label: 'Workshops', href: '/exhibitions/galaxy' }]} />

      <section className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-14 pt-32 sm:px-8 lg:pt-44">
        <motion.div {...rise(0)} className={`${TYPE.label} !text-accent-deep mb-5 flex items-center gap-2`}>
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
          {LEDGER.label}
        </motion.div>
        <RevealText as="h1" text={LEDGER.headline} className="t-d1 text-ink" delay={ENTER + 0.1} after={<span className="text-accent">.</span>} />
        <motion.p {...rise(0.5)} className={`${TYPE.lead} mt-6 max-w-2xl`}>
          {LEDGER.lead}
        </motion.p>

        {/* the house's own line in the book */}
        <motion.div {...rise(0.7)} className="mt-10 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[28px] bg-white/80 p-7 ring-1 ring-ink/5">
            <div className={TYPE.label}>The house</div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="t-d1 text-ink">{rooms === null ? '·' : rooms.toLocaleString('en-AU')}</span>
              <span className={TYPE.lead}>{rooms === 1 ? LEDGER.rooms.one : LEDGER.rooms.many}</span>
            </div>
            <p className={`${TYPE.small} mt-4 !text-ink-mute`}>{LEDGER.roomsNote}</p>
          </div>

          <div className="rounded-[28px] bg-white/80 p-7 ring-1 ring-ink/5">
            <div className={TYPE.label}>{LEDGER.splitTitle}</div>
            <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full" role="img" aria-label={PARTS.map((p) => `${p.who}: ${SPLIT[p.key]} percent`).join('. ')}>
              {PARTS.map((p) => (
                <span key={p.key} className={p.tone} style={{ width: `${SPLIT[p.key]}%` }} />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {PARTS.map((p) => (
                <span key={p.key} className={`${TYPE.small} inline-flex items-center gap-2`}>
                  <span aria-hidden className={`h-2 w-2 rounded-full ${p.tone}`} />
                  {SPLIT[p.key]}% · {p.who.toLowerCase()}
                </span>
              ))}
            </div>
            <p className={`${TYPE.small} mt-4 !text-ink-mute`}>{LEDGER.splitNote}</p>
          </div>
        </motion.div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/*  Every project, with its own numbers                        */}
      {/* ---------------------------------------------------------- */}
      <motion.section
        initial={reduced ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, margin: '-8% 0px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8"
      >
        <motion.div variants={RISE} className={`${TYPE.label} mb-4`}>
          {LOTS.length} projects · each number says where it comes from
        </motion.div>
        <ul className="overflow-hidden rounded-[28px] bg-white/70 ring-1 ring-ink/5 backdrop-blur-sm">
          {LOTS.map((lot, i) => {
            const numbers = live[lot.id] ?? [];
            const makes = PIECES.find((p) => p.workshop === lot.id);
            return (
              <motion.li
                key={lot.id}
                variants={RISE}
                onPointerMove={trackPointer}
                className={`py-spot grid gap-x-8 gap-y-4 px-5 py-6 sm:px-7 lg:grid-cols-[16rem_minmax(0,1fr)] ${i > 0 ? 'border-t border-ink/6' : ''}`}
              >
                <div className="flex min-w-0 items-start gap-3.5">
                  <Sphere lot={lot} className="h-11 w-11 shrink-0" />
                  <div className="min-w-0">
                    <div className={TYPE.label}>{lot.kind}</div>
                    {lot.enter_url ? (
                      <Link href={lot.enter_url} className={`${TYPE.title} block hover:!text-accent-deep transition-colors`}>
                        {lot.name}
                      </Link>
                    ) : (
                      <div className={TYPE.title}>{lot.name}</div>
                    )}
                    <p className={`${TYPE.small} mt-1 !text-ink-mute`}>{lot.proof}</p>
                    {makes && <p className={`${TYPE.small} mt-2 !text-accent-deep`}>Workshop · makes {makes.name.toLowerCase()}</p>}
                  </div>
                </div>

                {numbers.length > 0 ? (
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                    {numbers.map((n) => (
                      <div key={n.label} className="min-w-0">
                        <dt className="font-serif text-2xl font-semibold leading-tight text-ink">{n.value}</dt>
                        <dd className={`${TYPE.small} mt-1`}>{n.label}</dd>
                        {n.evidence && <dd className={`${TYPE.label} mt-1.5 !text-[10px] !tracking-[0.12em]`}>{n.evidence}</dd>}
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className={`${TYPE.small} self-center !text-ink-mute`}>No numbers yet. It is still forming.</p>
                )}
              </motion.li>
            );
          })}
        </ul>
        <motion.p variants={RISE} className={`${TYPE.small} mt-5 !text-ink-mute`}>
          Want to move one of these numbers?{' '}
          <Link href="/carry" className="!text-accent-deep underline-offset-4 hover:underline">
            Carry it
          </Link>
          .
        </motion.p>
      </motion.section>

      <SiteFooter />
    </main>
  );
}
