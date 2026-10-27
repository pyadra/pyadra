'use client';

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { useZoomDoor } from '@/app/components/ui/useZoomDoor';
import { LOTS } from './galaxy/lots';
import Guide from '@/app/components/guide/Guide';
import MuseumAtmosphere from '../components/ui/MuseumAtmosphere';
import SiteNav from '@/app/components/nav/SiteNav';
import SiteFooter from '@/app/components/nav/SiteFooter';

/* ------------------------------------------------------------------ */
/*  PYADRA — EXHIBITIONS                                               */
/*  Three rooms. One open.                                             */
/*                                                                     */
/*  Design language: family.co — springs, pills, rounded cards,        */
/*  warm direct copy. Consistent with Galaxy and the project pages.    */
/*                                                                     */
/*  Per Company_Master: this page shows exhibitions only — name,       */
/*  theme in one line, number of active projects, one action.          */
/*                                                                     */
/*  Zoom 0 of the canvas. Galaxy is the lit room in the middle; Jungle */
/*  and City sit further off, as landscape — a promise, not a locked   */
/*  door. Entering Galaxy zooms into it (useZoomDoor).                 */
/* ------------------------------------------------------------------ */

const ENTER = 0.75; // template.tsx dissolve ~1.5s — choreography starts after

const SPRING = { type: 'spring' as const, stiffness: 130, damping: 18, mass: 0.9 };

type Room = {
  name: string;
  theme: string;
  detail: string;
  href: string | null;
  open: boolean;
  orb: string;
  glow: string;
};

const ROOMS: Room[] = [
  {
    name: 'Jungle',
    theme: 'Organic growth',
    detail: 'Forming',
    href: null,
    open: false,
    orb: 'bg-[radial-gradient(circle_at_30%_30%,#E8E9E8,#D4DDD6,#B8C0BA)]',
    glow: 'bg-[#6B8070]',
  },
  {
    name: 'Galaxy',
    theme: 'Built projects, ready for their next chapter',
    detail: `${LOTS.length} active projects`,
    href: '/exhibitions/galaxy',
    open: true,
    orb: 'bg-[radial-gradient(circle_at_30%_30%,#10B981,#059669,#047857)]',
    glow: 'bg-[#059669]',
  },
  {
    name: 'City',
    theme: 'Metropolitan scale',
    detail: 'Forming',
    href: null,
    open: false,
    orb: 'bg-[radial-gradient(circle_at_30%_30%,#E8E9E8,#D4DDD6,#B8C0BA)]',
    glow: 'bg-[#6B8070]',
  },
];

/* The open room leans toward the cursor — a display case acknowledging
   the visitor. Transform-only springs; mouse events never fire on touch,
   so mobile pays nothing for this. */
function RoomCard({
  active,
  className,
  onClick,
  entrance,
  children,
}: {
  active: boolean;
  className: string;
  onClick: () => void;
  entrance: { delay: number };
  children: React.ReactNode;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [3.5, -3.5]), { stiffness: 160, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-3.5, 3.5]), { stiffness: 160, damping: 20 });
  const reduced = useReducedMotion() ?? false;
  const tilt = active && !reduced;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: entrance.delay, type: 'spring', stiffness: 110, damping: 16 }}
      whileHover={active ? { y: -6 } : {}}
      onClick={onClick}
      onMouseMove={
        tilt
          ? (e) => {
              const r = e.currentTarget.getBoundingClientRect();
              mx.set((e.clientX - r.left) / r.width - 0.5);
              my.set((e.clientY - r.top) / r.height - 0.5);
            }
          : undefined
      }
      onMouseLeave={tilt ? () => { mx.set(0); my.set(0); } : undefined}
      style={tilt ? { rotateX, rotateY, transformPerspective: 1100 } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* The open room's projects, as unnamed lights circling its orb — enough
   to say "there is a lot in here" without showing a project outside its
   exhibition (Company_Master §7). */
function OrbitLights() {
  return (
    <motion.div
      aria-hidden
      className="absolute -inset-7 pointer-events-none"
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
    >
      {LOTS.map((l, i) => {
        const t = (i / LOTS.length) * 2 * Math.PI;
        const r = l.stage === 'ready' ? 44 : 50;
        return (
          <span
            key={l.id}
            className={`absolute w-2 h-2 -ml-1 -mt-1 rounded-full ${l.stage === 'ready' ? 'bg-[#059669]/70' : 'bg-[#6B8070]/40'}`}
            style={{ left: `${(50 + r * Math.sin(t)).toFixed(2)}%`, top: `${(50 - r * Math.cos(t)).toFixed(2)}%` }}
          />
        );
      })}
    </motion.div>
  );
}

export default function ExhibitionsPage() {
  const { zoomTo, overlay, zoomProps } = useZoomDoor();
  const galaxyOrb = useRef<HTMLDivElement>(null);

  return (
    <>
    <motion.div
      {...zoomProps}
      className="min-h-[100svh] bg-[#EDEFED] text-[#1A1C1A] flex flex-col relative overflow-hidden antialiased selection:bg-[#059669] selection:text-white">

      {/* soft color field */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-48 left-1/4 w-[640px] h-[640px] rounded-full opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.08), transparent 65%)' }}
        />
        <div
          className="absolute -bottom-56 right-0 w-[720px] h-[720px] rounded-full opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08), transparent 65%)' }}
        />
      </div>

      <MuseumAtmosphere />

      {/* shared nav */}
      <SiteNav crumbs={[{ label: 'Exhibitions' }]} />

      <main className="relative z-10 flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full px-6 pt-28 pb-28">

        {/* headline */}
        <div className="text-center mb-14 md:mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.035em] leading-[1.02] mb-6 uppercase">
            {['Welcome to', 'Pyadra.'].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: ENTER + 0.2 + i * 0.09, type: 'spring', stiffness: 110, damping: 20 }}
                >
                  {i === 1 ? <span className="text-[#059669]">{line}</span> : line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ENTER + 0.5, ...SPRING }}
            className="text-lg text-[#3A4A3E] font-medium max-w-xl mx-auto leading-relaxed"
          >
            Pyadra is a startup where you can discover, meet, build, buy, and
            support new projects through exhibitions — like walking through a
            museum of ideas, businesses, and opportunities.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ENTER + 0.65, ...SPRING }}
            className="mt-8 text-[13px] font-semibold text-[#047857]"
          >
            Explore the exhibitions currently open:
          </motion.p>
        </div>

        {/* the rooms */}
        <div className="grid grid-cols-2 md:grid-cols-[1fr_1.35fr_1fr] items-start md:items-center gap-4 md:gap-5">
          {ROOMS.map((room, i) => (
            <RoomCard
              key={room.name}
              active={room.open}
              entrance={{ delay: ENTER + 0.55 + i * 0.1 }}
              onClick={() => room.open && room.href && zoomTo(galaxyOrb.current, room.href)}
              className={`group relative rounded-[32px] flex flex-col items-center text-center ${
                room.open
                  ? 'col-span-2 md:col-span-1 order-first md:order-none p-8 md:p-10 bg-white shadow-sm ring-1 ring-[#1A1C1A]/5 hover:shadow-xl hover:shadow-[#059669]/10 transition-shadow duration-300 cursor-pointer md:py-14'
                  : 'p-3 md:p-10 opacity-45 saturate-50 md:scale-[0.86] md:blur-[0.4px]'
              }`}
            >
              {/* status chip */}
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold ${room.open ? 'mb-8' : 'mb-4 md:mb-8'} ${
                  room.open ? 'bg-[#059669]/10 text-[#047857]' : 'bg-[#EDEFED] text-[#6B8070]'
                }`}
              >
                {room.open && <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />}
                {room.open ? 'Open' : 'Forming'}
              </span>

              {/* the orb — floats while it waits, like it's suspended in the case */}
              <motion.div
                className={`relative ${room.open ? 'mb-8' : 'mb-4 md:mb-8'}`}
                animate={room.open ? { y: [0, -6, 0] } : undefined}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                {room.open && (
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.3, 0.12] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className={`absolute inset-0 rounded-full blur-xl ${room.glow}`}
                  />
                )}
                {room.open && <OrbitLights />}
                <div
                  ref={room.open ? galaxyOrb : undefined}
                  className={`relative ${room.open ? 'w-24 h-24' : 'w-16 h-16'} md:w-28 md:h-28 rounded-full ${room.orb} ${
                    room.open
                      ? 'shadow-[-10px_10px_24px_rgba(0,0,0,0.18)] transition-transform duration-500 group-hover:scale-105'
                      : 'opacity-50 shadow-[-8px_8px_18px_rgba(0,0,0,0.08)]'
                  } overflow-hidden`}
                >
                  {room.open && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 opacity-30 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_180deg,rgba(255,255,255,0.25)_270deg,transparent_360deg)]"
                    />
                  )}
                </div>
              </motion.div>

              <h2 className={`${room.open ? 'text-3xl' : 'text-2xl'} md:text-4xl font-bold tracking-[-0.03em] mb-2 ${room.open ? '' : 'text-[#1A1C1A]/40'}`}>
                {room.name}
              </h2>
              <p className={`text-[15px] font-medium mb-2 ${room.open ? 'text-[#3A4A3E]' : 'text-[#6B8070]/60'}`}>
                {room.theme}
              </p>
              <p className={`text-[13px] font-semibold mb-6 ${room.open ? 'text-[#059669]' : 'text-[#6B8070]/50'}`}>
                {room.detail}
              </p>

              {room.open && (
                <span className="cta-glow mt-auto inline-block rounded-full bg-[#059669] text-white px-8 py-3.5 text-sm font-semibold shadow-lg shadow-[#059669]/25">
                  Enter {room.name} →
                </span>
              )}
            </RoomCard>
          ))}
        </div>

      </main>

      <SiteFooter />
    </motion.div>
    <Guide
      path={['Pyadra', 'Exhibitions']}
      line={`This is the museum. Galaxy is open, with ${LOTS.length} real projects inside — Jungle and City are still forming.`}
    />
    {overlay}
    </>
  );
}
