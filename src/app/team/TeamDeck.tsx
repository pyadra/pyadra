'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { PEOPLE, personIndex, type Person } from './people';

/* ------------------------------------------------------------------ */
/*  PYADRA · TeamDeck — the team as a deck of cards you swipe.         */
/*                                                                     */
/*  One page, one card on screen: /team/<slug> decides which.    */
/*  A single optional catch-all route serves every name, so a new      */
/*  teammate stays one object in people.ts — no route to add.          */
/*                                                                     */
/*  The paging is native CSS scroll-snap, not a drag library: it gets  */
/*  the iOS home-screen feel — thumb, momentum, snap — for free, and   */
/*  keeps working with a trackpad, a keyboard and a screen reader.     */
/* ------------------------------------------------------------------ */

const SPRING = { type: 'spring' as const, stiffness: 130, damping: 18, mass: 0.9 };

function Portrait({
  person,
  eager,
  className,
}: {
  person: Person;
  /** only the card the QR opened on preloads; the rest would compete */
  eager: boolean;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  const show = person.photo && !broken;

  return (
    <div
      className={`relative rounded-full overflow-hidden ring-1 ring-[#1A1C1A]/10 shadow-[0_24px_60px_-20px_rgba(10,18,14,0.45)] bg-[#D9DBD9] ${className ?? ''}`}
    >
      {show ? (
        <Image
          src={person.photo as string}
          alt={person.name}
          width={720}
          height={720}
          priority={eager}
          loading={eager ? undefined : 'lazy'}
          onError={() => setBroken(true)}
          style={{ objectPosition: person.photoPosition }}
          className="w-full h-full object-cover"
        />
      ) : (
        /* the plaque before the work is hung — never a broken image */
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

function Card({
  person,
  active,
  eager,
  onSayHello,
}: {
  person: Person;
  active: boolean;
  eager: boolean;
  onSayHello: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const vcard = `/api/vcard?c=${person.slug}`;

  return (
    <div
      className="snap-center shrink-0 w-full px-6"
      /* an off-screen card must not be reachable by tab or screen reader */
      aria-hidden={!active}
      inert={!active}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center gap-8 sm:gap-10 md:gap-14">
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={SPRING}
          className="shrink-0 mx-auto sm:mx-0"
        >
          <Portrait person={person} eager={eager} className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52" />
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.1 }}
          className="min-w-0 text-center sm:text-left"
        >
          <h1 className="t-d1">{person.name}</h1>

          <p className="t-d6 text-[#6B8070] mt-3">
            {[person.role, 'Pyadra LLC', person.location].filter(Boolean).join(' · ')}
          </p>

          {person.statement ? (
            <p className="font-serif italic text-[#1A1C1A] text-lg sm:text-xl leading-[1.45] mt-4 max-w-md mx-auto sm:mx-0">
              {person.statement}
            </p>
          ) : (
            <p className="t-d5 text-[#6B8070] mt-4 max-w-md mx-auto sm:mx-0">
              This side of the room is still being written.
            </p>
          )}

          {person.bio.length > 0 && (
            <div className="flex flex-col gap-2.5 mt-4 max-w-md mx-auto sm:mx-0">
              {person.bio.map((para, i) => (
                <p key={i} className="t-d5 text-[#3A4A3E] leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          )}

          {/* The one action the scan moment is actually for. */}
          <div className="mt-7 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <a
              href={vcard}
              download={`${person.slug}.vcf`}
              className="cta-glow w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#1A1C1A] text-white px-8 py-3.5 t-d5 font-semibold hover:bg-[#059669] transition-colors"
            >
              Save my contact
            </a>
            <button
              type="button"
              onClick={onSayHello}
              className="t-d5 font-semibold text-[#047857] hover:text-[#059669] transition-colors"
            >
              or write to me →
            </button>
          </div>

          {(person.linkedin || person.instagram) && (
            <div className="mt-5 flex items-center justify-center sm:justify-start gap-4">
              {person.linkedin && (
                <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="t-d5 text-[#6B8070] hover:text-[#059669] transition-colors">
                  LinkedIn ↗
                </a>
              )}
              {person.instagram && (
                <a href={person.instagram} target="_blank" rel="noopener noreferrer" className="t-d5 text-[#6B8070] hover:text-[#059669] transition-colors">
                  Instagram ↗
                </a>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function TeamDeck({
  initial,
  onSayHello,
}: {
  initial?: string;
  onSayHello: (person: Person) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const start = Math.max(0, personIndex(initial));
  const [index, setIndex] = useState(start);
  const single = PEOPLE.length < 2;

  /* Jump to the card the QR asked for without an animation — it should
     already be there when the page paints. */
  useEffect(() => {
    if (start > 0 && railRef.current) {
      railRef.current.scrollTo({ left: railRef.current.clientWidth * start, behavior: 'auto' });
    }
  }, [start]);

  /* Track which card is centred, and keep the URL honest so the visitor
     can copy the link to whoever they are looking at. */
  const onScroll = useCallback(() => {
    const rail = railRef.current;
    if (!rail || rail.clientWidth === 0) return;
    const next = Math.round(rail.scrollLeft / rail.clientWidth);
    if (PEOPLE[next]) setIndex(next);
  }, []);

  /* Keep the address bar on whoever is on screen, so the visitor can copy
     the link to the person they are actually looking at. In an effect,
     never in the state updater: React runs updaters during render. */
  useEffect(() => {
    const person = PEOPLE[index];
    if (!person) return;
    window.history.replaceState(null, '', `/team/${person.slug}`);
  }, [index]);

  const goTo = useCallback((i: number) => {
    const rail = railRef.current;
    if (!rail || i < 0 || i >= PEOPLE.length) return;
    rail.scrollTo({ left: rail.clientWidth * i, behavior: 'smooth' });
  }, []);

  /* A trackpad cannot swipe a horizontal rail comfortably, so the arrow
     keys page it once the deck has focus. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const rail = railRef.current;
      if (!rail?.contains(document.activeElement) && document.activeElement !== document.body) return;
      e.preventDefault();
      goTo(index + (e.key === 'ArrowRight' ? 1 : -1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, goTo]);

  return (
    <section className="relative pt-32 pb-12 md:pt-36 md:pb-16">
      <div className="relative z-10">
        <div
          ref={railRef}
          onScroll={onScroll}
          role="group"
          aria-label="Pyadra team"
          className="flex overflow-x-auto snap-x snap-mandatory overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {PEOPLE.map((p, i) => (
            <Card
              key={p.slug}
              person={p}
              active={i === index}
              eager={i === start}
              onSayHello={() => onSayHello(p)}
            />
          ))}
        </div>

        {/* The team, as faces. Dots would hide who these people are
            behind an abstract gesture; this page exists to show them. */}
        {!single && (
          <div className="mt-10 flex flex-col items-center gap-2.5">
            <div className="flex items-end justify-center gap-5 sm:gap-7">
              {PEOPLE.map((p, i) => {
                const on = i === index;
                return (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Show ${p.name}`}
                    aria-current={on}
                    className="group flex flex-col items-center gap-2 rounded-2xl p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#059669]"
                  >
                    <span
                      className={`relative block rounded-full overflow-hidden transition-all duration-300 ring-2 ring-offset-2 ring-offset-[#EDEFED] ${
                        on
                          ? 'w-14 h-14 ring-[#059669]'
                          : 'w-11 h-11 ring-transparent opacity-55 group-hover:opacity-100'
                      }`}
                    >
                      {p.photo ? (
                        <Image
                          src={p.photo}
                          alt=""
                          width={120}
                          height={120}
                          style={{ objectPosition: p.photoPosition }}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="flex w-full h-full items-center justify-center bg-[#D9DBD9] font-serif font-semibold text-[#6B8070] text-sm">
                          {p.shortName.slice(0, 2)}
                        </span>
                      )}
                    </span>
                    <span
                      className={`t-d6 transition-colors ${
                        on ? 'text-[#1A1C1A]' : 'text-[#6B8070]'
                      }`}
                    >
                      {p.shortName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
