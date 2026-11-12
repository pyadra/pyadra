'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import SiteNav from '@/app/components/nav/SiteNav';
import SiteFooter from '@/app/components/nav/SiteFooter';
import MuseumAtmosphere from '@/app/components/ui/MuseumAtmosphere';
import RevealText from '@/app/components/ui/RevealText';
import { TYPE } from '@/app/components/ui/type';
import { EASE, RISE } from '@/app/components/ui/motion';
import { trackPointer } from '@/app/components/ui/pointer';
import { LOTS } from '@/app/exhibitions/galaxy/lots';
import { Sphere } from '@/app/exhibitions/galaxy/Sphere';
import { PIECES, aud, pieceById } from '@/app/house/house';
import { daysUntil, longDate, shortDate, type Exhibition, type FigurinePiece, type LetterPiece, type SongPiece } from '@/app/house/exhibition';
import { withVia } from '@/app/house/via';
import { useVia } from '@/app/house/useVia';

/* ------------------------------------------------------------------ */
/*  PYADRA — AN EXHIBITION OF ONE · the room                           */
/*                                                                     */
/*  What the person receives: a small museum room with their name on   */
/*  the wall. A ticket at the door, then the pieces, each with its     */
/*  wall label the way a museum hangs a work: what it is, how it was   */
/*  made, which workshop made it.                                      */
/*                                                                     */
/*  The museum layer Pyadra already built (the light wall, the labels, */
/*  the dissolve between rooms) is the wrapping. The one dark thing in */
/*  the room is the letter's case: it belongs to EterniCapsule's own   */
/*  world, and black stays inside a project that chose it (rule #12).  */
/* ------------------------------------------------------------------ */

const ENTER = 0.75; // the template dissolve settles first (template.tsx)

const NUMERAL = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
const COUNT_WORD = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'];

const lotOf = (kind: string) => LOTS.find((l) => l.id === pieceById(kind)?.workshop);

/* ---------- the wall label beside each piece ---------- */

function WallLabel({ numeral, kind, title, lines }: { numeral: string; kind: 'song' | 'letter' | 'figurine'; title: string; lines: string[] }) {
  const offer = pieceById(kind)!;
  const lot = lotOf(kind);
  return (
    <motion.div variants={RISE} className="lg:sticky lg:top-28 lg:self-start">
      <div className={`${TYPE.label} !text-accent-deep`}>{numeral}</div>
      <h2 className={`${TYPE.title} mt-2`}>{offer.name}</h2>
      <p className={`${TYPE.lead} mt-1`}>{title}</p>
      <div className="mt-4 space-y-1.5 border-l border-ink/12 pl-3.5">
        {lines.filter(Boolean).map((l) => (
          <p key={l} className={TYPE.small}>
            {l}
          </p>
        ))}
        <p className={`${TYPE.small} !text-ink-mute`}>{offer.made}</p>
      </div>
      {lot?.enter_url && (
        <Link href={lot.enter_url} className={`${TYPE.small} mt-4 inline-flex items-center gap-1.5 !text-ink-mute hover:!text-accent-deep transition-colors`}>
          Made by {lot.name} <span aria-hidden>→</span>
        </Link>
      )}
    </motion.div>
  );
}

function Exhibit({ id, label, children }: { id: string; label: React.ReactNode; children: React.ReactNode }) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.section
      id={id}
      initial={reduced ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '-15% 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
      className="relative z-10 mx-auto grid w-full max-w-5xl scroll-mt-28 gap-8 px-5 pb-24 sm:px-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14 lg:pb-36"
    >
      {label}
      <motion.div variants={RISE}>{children}</motion.div>
    </motion.section>
  );
}

/* ---------- the ticket at the door ---------- */

function Ticket({ exhibition }: { exhibition: Exhibition }) {
  const n = exhibition.pieces.length;
  return (
    <div
      onPointerMove={trackPointer}
      className="py-spot relative mx-auto flex w-full max-w-[26rem] -rotate-2 items-stretch rounded-2xl bg-white text-left shadow-[0_30px_60px_-30px_rgba(26,28,26,0.45)] ring-1 ring-ink/5"
    >
      <div className="min-w-0 flex-1 p-5">
        <div className={`${TYPE.label} !text-accent-deep`}>Admit one</div>
        <div className={`${TYPE.title} mt-2 truncate`}>{exhibition.forName}</div>
        <div className={`${TYPE.small} mt-1`}>
          An exhibition of one · {(COUNT_WORD[n] ?? String(n)).toLowerCase()} {n === 1 ? 'piece' : 'pieces'}
        </div>
        <div
          aria-hidden
          className="mt-4 h-7 w-44 max-w-full opacity-70 [background:repeating-linear-gradient(90deg,var(--color-ink)_0_2px,transparent_2px_5px,var(--color-ink)_5px_6px,transparent_6px_10px,var(--color-ink)_10px_13px,transparent_13px_15px)]"
        />
      </div>
      <div aria-hidden className="py-perf w-3 shrink-0" />
      <div className="flex w-[6.5rem] shrink-0 flex-col justify-between p-5 text-right">
        <div>
          <div className={TYPE.label}>Ticket</div>
          <div className="mt-1 font-mono text-lg font-medium text-ink">{String(exhibition.number).padStart(4, '0')}</div>
        </div>
        <div>
          <div className={TYPE.label}>Opened</div>
          <div className={`${TYPE.small} mt-1 whitespace-nowrap !text-ink`}>{shortDate(exhibition.openedOn)}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- I · the song ---------- */

const BARS = Array.from({ length: 56 }, (_, i) => {
  const r = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
  // quieter at both ends, like a song that comes in and goes out
  const envelope = Math.sin((Math.PI * (i + 0.5)) / 56);
  return Math.round(22 + 78 * (0.35 + 0.65 * r) * (0.45 + 0.55 * envelope));
});

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const seconds = (mmss: string) => {
  const [m, s] = mmss.split(':').map(Number);
  return Number.isFinite(m) && Number.isFinite(s) ? m * 60 + s : 0;
};

function SongExhibit({ piece }: { piece: SongPiece }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'error'>('idle');
  const [at, setAt] = useState(0);
  const [length, setLength] = useState(seconds(piece.duration));
  const progress = length > 0 ? Math.min(at / length, 1) : 0;
  const playing = state === 'playing';

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      setState('loading');
      a.play().then(() => setState('playing')).catch(() => setState('error'));
    } else {
      a.pause();
      setState('paused');
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audio.current;
    if (!a || !Number.isFinite(a.duration) || a.duration <= 0) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * a.duration;
  };

  return (
    <div className="rounded-[28px] bg-white/85 p-6 shadow-xl shadow-ink/5 ring-1 ring-ink/5 backdrop-blur-sm sm:p-9">
      <audio
        ref={audio}
        src={piece.src}
        preload="none"
        onTimeUpdate={(e) => setAt(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => Number.isFinite(e.currentTarget.duration) && setLength(e.currentTarget.duration)}
        // the element is the truth: a pause from the keyboard or the system counts too
        onPlay={() => setState('playing')}
        onPause={() => setState((was) => (was === 'error' ? was : 'paused'))}
        onEnded={() => {
          setState('paused');
          setAt(0);
        }}
        onError={() => setState('error')}
      />

      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pause the song' : 'Play the song'}
          className="cta-glow flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/30"
        >
          {state === 'loading' ? (
            <span aria-hidden className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : playing ? (
            <span aria-hidden className="flex gap-1.5">
              <span className="h-5 w-1.5 rounded-sm bg-white" />
              <span className="h-5 w-1.5 rounded-sm bg-white" />
            </span>
          ) : (
            <span aria-hidden className="ml-1 border-y-[10px] border-l-[16px] border-y-transparent border-l-white" />
          )}
        </button>
        <div className="min-w-0">
          <div className={TYPE.title}>{piece.title}</div>
          {piece.note && <p className={`${TYPE.small} mt-1`}>{piece.note}</p>}
        </div>
      </div>

      {/* the song, drawn: click anywhere along it to move */}
      <div
        onClick={seek}
        data-playing={playing}
        aria-hidden
        className="py-eq mt-8 flex h-24 cursor-pointer items-end gap-[3px] sm:gap-1"
      >
        {BARS.map((h, i) => (
          <span
            key={i}
            style={{ height: `${h}%`, ['--d' as string]: `${(i % 7) * -0.16}s` }}
            className={`flex-1 rounded-full ${i / BARS.length < progress ? 'bg-accent' : 'bg-ink/12'}`}
          />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-[11px] tracking-[0.12em] text-ink-mute">
        <span>{clock(at)}</span>
        <span>{length > 0 ? clock(length) : piece.duration}</span>
      </div>

      {state === 'error' && (
        <p role="alert" className={`${TYPE.small} mt-4`}>
          The song did not load here.{' '}
          <a href={piece.src} target="_blank" rel="noopener noreferrer" className="!text-accent-deep underline underline-offset-4">
            Open it on its own
          </a>
          .
        </p>
      )}
    </div>
  );
}

/* ---------- II · the letter ---------- */

function Seal() {
  return (
    <span className="py-seal flex h-16 w-16 items-center justify-center rounded-full bg-[radial-gradient(circle_at_32%_28%,var(--etn-bronze-bright),var(--etn-copper))]">
      <svg viewBox="0 0 40 60" className="h-8 w-6" aria-hidden>
        <rect x="10" y="6" width="20" height="48" rx="10" fill="none" stroke="var(--etn-earth)" strokeWidth="3" opacity="0.75" />
        <circle cx="20" cy="30" r="3" fill="var(--etn-earth)" opacity="0.75" />
      </svg>
    </span>
  );
}

function LetterExhibit({ piece, today, sample }: { piece: LetterPiece; today: string; sample: boolean }) {
  const [broken, setBroken] = useState(false);
  const days = daysUntil(piece.opensAt, new Date(`${today}T00:00:00Z`));
  const words = piece.sealed ? (broken ? piece.preview ?? null : null) : piece.body;

  return (
    <div className="overflow-hidden rounded-[28px] bg-[var(--etn-earth)] p-6 text-[var(--etn-parchment)] shadow-2xl shadow-ink/25 sm:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {words ? (
          <motion.div
            key="open"
            initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: EASE.out }}
          >
            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--etn-bronze)]">
              {piece.sealed ? 'Sample only · this is how it opens' : `Opened ${longDate(piece.opensAt)}`}
            </div>
            <div className="mt-6 rounded-2xl bg-[var(--etn-parchment)] px-6 py-8 text-[var(--etn-earth)] sm:px-10 sm:py-10">
              {words.split(/\n{2,}/).map((para, i) => (
                <p key={i} className="mb-4 whitespace-pre-line font-serif text-[17px] leading-relaxed last:mb-0">
                  {para}
                </p>
              ))}
            </div>
            {piece.sealed && (
              <button
                type="button"
                onClick={() => setBroken(false)}
                className="mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--etn-ash)] underline-offset-4 hover:underline"
              >
                Seal it again
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="sealed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="grid items-center gap-8 sm:grid-cols-[auto_1fr] sm:gap-10"
          >
            {/* the envelope, shut */}
            <div className="relative mx-auto h-40 w-60 max-w-full rounded-xl bg-[var(--etn-soil)] ring-1 ring-[var(--etn-bronze)]/25">
              <span aria-hidden className="absolute inset-x-0 top-0 h-1/2 rounded-t-xl bg-[var(--etn-charcoal)] [clip-path:polygon(0_0,100%_0,50%_100%)]" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Seal />
              </span>
            </div>

            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--etn-bronze)]">Sealed until</div>
              <div className="mt-2 font-serif text-[30px] font-semibold leading-none tracking-[-0.01em] text-[var(--etn-cream)] lg:text-[36px]">
                {longDate(piece.opensAt)}
              </div>
              <div className="mt-5 flex items-baseline gap-2.5">
                <span className="font-serif text-2xl font-semibold text-[var(--etn-bronze-bright)]">{days.toLocaleString('en-AU')}</span>
                <span className="font-sans text-[13px] font-medium text-[var(--etn-ash)]">{days === 1 ? 'day to go' : 'days to go'}</span>
              </div>
              <p className="mt-4 max-w-sm font-sans text-sm leading-relaxed text-[var(--etn-ash)]">
                {piece.from ? `Left by ${piece.from.charAt(0).toLowerCase()}${piece.from.slice(1)}. ` : ''}
                The room will not show these words before that day.
              </p>
              {sample && piece.preview && (
                <button
                  type="button"
                  onClick={() => setBroken(true)}
                  className="mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-sans text-[13px] font-semibold text-[var(--etn-bronze-bright)] ring-1 ring-[var(--etn-bronze)]/45 transition-colors hover:bg-[var(--etn-bronze)]/10"
                >
                  Sample only: see how it opens <span aria-hidden>→</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- III · the figurine ---------- */

function FigurineExhibit({ piece, name }: { piece: FigurinePiece; name: string }) {
  return (
    <figure className="panel-lift py-sheen overflow-hidden rounded-[28px] bg-white shadow-xl shadow-ink/5 ring-1 ring-ink/5">
      <div className="relative mx-auto aspect-[3/4] w-full max-w-sm">
        {piece.image.startsWith('/') ? (
          <Image src={piece.image} alt={`The figurine made for ${name}`} fill sizes="(min-width: 640px) 24rem, 90vw" className="object-contain" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- a room's own file, from the house's storage
          <img src={piece.image} alt={`The figurine made for ${name}`} className="absolute inset-0 h-full w-full object-contain" />
        )}
      </div>
      {piece.caption && <figcaption className={`${TYPE.small} border-t border-ink/6 px-6 py-4 !text-ink-mute`}>{piece.caption}</figcaption>}
    </figure>
  );
}

/* ---------- the room ---------- */

export default function ExhibitionRoom({ exhibition, today }: { exhibition: Exhibition; today: string }) {
  const reduced = useReducedMotion() ?? false;
  const via = useVia();
  const { pieces, sample } = exhibition;
  const workshops = [...new Set(pieces.map((p) => p.kind))].map(lotOf).filter((l): l is NonNullable<typeof l> => !!l);
  const makeOne = withVia('/commission', exhibition.carriedBy ?? via);
  const letter = pieceById('letter')!;

  const rise = (delay: number) => ({
    initial: reduced ? false : ({ opacity: 0, y: 14 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { delay: ENTER + delay, duration: 0.7, ease: EASE.out },
  });

  return (
    <main className="relative min-h-screen overflow-x-clip bg-paper text-ink">
      <MuseumAtmosphere dust={24} fixed />
      <SiteNav crumbs={[{ label: `For ${exhibition.forName}` }]} actions={[]} />

      {/* ---------------------------------------------------------- */}
      {/*  The door: whose room this is, and the ticket               */}
      {/* ---------------------------------------------------------- */}
      <section className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-3xl flex-col items-center justify-center px-5 pb-16 pt-28 text-center sm:px-8">
        {sample && (
          <motion.div {...rise(0)} className={`${TYPE.label} mb-6 rounded-full bg-accent/10 px-3.5 py-1.5 !text-accent-deep`}>
            Sample room · made by our own workshops
          </motion.div>
        )}
        <motion.div {...rise(0.05)} className={`${TYPE.label} mb-5`}>
          Pyadra · An exhibition of one
        </motion.div>

        <RevealText as="h1" text={exhibition.forName} className="t-d1 text-balance text-ink" delay={ENTER + 0.15} after={<span className="text-accent">.</span>} />

        {exhibition.dedication && (
          <motion.p {...rise(0.55)} className={`${TYPE.statement} mt-5 !text-ink`}>
            {exhibition.dedication}
          </motion.p>
        )}
        {exhibition.from && (
          <motion.p {...rise(0.65)} className={`${TYPE.small} mt-2`}>
            From {exhibition.from.charAt(0).toLowerCase()}
            {exhibition.from.slice(1)}
          </motion.p>
        )}

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 30, rotate: 3 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ delay: ENTER + 0.85, duration: 0.9, ease: EASE.out }}
          className="mt-12 w-full"
        >
          <Ticket exhibition={exhibition} />
        </motion.div>

        {pieces.length > 0 && (
          <motion.a
            {...rise(1.3)}
            href="#piece-1"
            className={`${TYPE.small} mt-12 inline-flex items-center gap-2 !text-ink-mute hover:!text-accent-deep transition-colors`}
          >
            {COUNT_WORD[pieces.length] ?? pieces.length} {pieces.length === 1 ? 'piece is' : 'pieces are'} waiting <span aria-hidden>↓</span>
          </motion.a>
        )}
      </section>

      {/* ---------------------------------------------------------- */}
      {/*  The pieces, each beside its wall label                     */}
      {/* ---------------------------------------------------------- */}
      {pieces.map((piece, i) => {
        const numeral = NUMERAL[i] ?? String(i + 1);
        const id = `piece-${i + 1}`;
        if (piece.kind === 'song') {
          return (
            <Exhibit key={id} id={id} label={<WallLabel numeral={numeral} kind="song" title={piece.title} lines={[piece.duration]} />}>
              <SongExhibit piece={piece} />
            </Exhibit>
          );
        }
        if (piece.kind === 'letter') {
          return (
            <Exhibit
              key={id}
              id={id}
              label={
                <WallLabel
                  numeral={numeral}
                  kind="letter"
                  title={piece.sealed ? 'Shut until its day' : 'Open'}
                  lines={[piece.sealed ? `Opens ${longDate(piece.opensAt)}` : `Opened ${longDate(piece.opensAt)}`]}
                />
              }
            >
              <LetterExhibit piece={piece} today={today} sample={sample} />
            </Exhibit>
          );
        }
        return (
          <Exhibit key={id} id={id} label={<WallLabel numeral={numeral} kind="figurine" title="A mini of them, to hold" lines={['15 cm · printed in Perth']} />}>
            <FigurineExhibit piece={piece} name={exhibition.forName} />
          </Exhibit>
        );
      })}

      {/* ---------------------------------------------------------- */}
      {/*  The wall has room                                          */}
      {/* ---------------------------------------------------------- */}
      <section className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-24 sm:px-8 lg:pb-32">
        <div className="rounded-[28px] border border-dashed border-ink/15 px-6 py-10 text-center sm:px-10">
          <div className={`${TYPE.label} !text-accent-deep`}>This wall has room</div>
          <p className={`${TYPE.statement} mx-auto mt-3 max-w-xl !text-ink`}>
            Anyone who loves {sample ? 'her' : exhibition.forName} can leave a sealed letter of their own here.
          </p>
          <p className={`${TYPE.small} mt-3`}>
            {aud(letter.price)} each. Each one opens on the day its writer chooses.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/*  Who made it, and the way back out                          */}
      {/* ---------------------------------------------------------- */}
      <section className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-20 sm:px-8">
        <div className="relative overflow-hidden rounded-[32px] bg-white px-6 py-12 ring-1 ring-ink/5 sm:px-12 sm:py-16">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-64 w-[36rem] max-w-full rounded-full bg-accent/15 blur-3xl" />
          <div className="relative text-center">
            <div className={TYPE.label}>This room was made by</div>
            <div className="mt-6 flex flex-wrap items-start justify-center gap-x-10 gap-y-6">
              {workshops.map((lot) => {
                const body = (
                  <>
                    <Sphere lot={lot} className="h-16 w-16" />
                    <span className={`${TYPE.small} mt-3 block !text-ink`}>{lot.name}</span>
                    <span className={`${TYPE.small} block !text-ink-mute`}>{PIECES.find((p) => p.workshop === lot.id)?.name.replace('The ', 'the ')}</span>
                  </>
                );
                return lot.enter_url ? (
                  <Link key={lot.id} href={lot.enter_url} className="flex w-28 flex-col items-center transition-transform hover:-translate-y-0.5">
                    {body}
                  </Link>
                ) : (
                  <div key={lot.id} className="flex w-28 flex-col items-center">
                    {body}
                  </div>
                );
              })}
            </div>
            {exhibition.carriedBy && <p className={`${TYPE.small} mt-6 !text-ink-mute`}>Carried by {exhibition.carriedBy}</p>}

            <h2 className={`${TYPE.display} mt-12 text-balance`}>
              {sample ? 'Someone you love could walk into one of these.' : `Someone made this for ${exhibition.forName}.`}
            </h2>
            <p className={`${TYPE.lead} mx-auto mt-4 max-w-md`}>
              {sample
                ? 'Tell us about them. A person reads it and answers with the price and the day it will be ready.'
                : 'Who would you make one for? Tell us about them, and a person answers with the price and the day it will be ready.'}
            </p>
            <div className="mt-8 flex justify-center">
              <Link href={makeOne} className="cta-glow py-sheen inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-sans text-sm font-semibold text-white">
                Make one for someone <span aria-hidden>→</span>
              </Link>
            </div>
            {sample && (
              <p className={`${TYPE.small} mx-auto mt-6 max-w-md !text-ink-mute`}>
                This is a sample. The song and the figurine are the workshops’ own examples, and the letter was written for this page.
              </p>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
