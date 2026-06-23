'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GreenDust from '../components/ui/GreenDust';
import PyadraLogo from '@/app/components/brand/PyadraLogo';

/* ------------------------------------------------------------------ */
/*  PYADRA — EXHIBITIONS                                               */
/*  Three rooms. One open.                                             */
/*                                                                     */
/*  Design language: family.co — springs, pills, rounded cards,        */
/*  warm direct copy. Consistent with Galaxy and the project pages.    */
/*                                                                     */
/*  Per Company_Master: this page shows exhibitions only — name,       */
/*  theme in one line, number of active projects, one action.          */
/* ------------------------------------------------------------------ */

const ENTER = 0.75; // template.tsx dissolve ~1.5s — choreography starts after

const SPRING = { type: 'spring' as const, stiffness: 130, damping: 18, mass: 0.9 };

const ROOMS = [
  {
    name: 'Galaxy',
    theme: 'Memory, time, permanence',
    detail: '4 live projects',
    href: '/exhibitions/galaxy',
    open: true,
    orb: 'bg-[radial-gradient(circle_at_30%_30%,#10B981,#059669,#047857)]',
    glow: 'bg-[#059669]',
  },
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
    name: 'City',
    theme: 'Metropolitan scale',
    detail: 'Forming',
    href: null,
    open: false,
    orb: 'bg-[radial-gradient(circle_at_30%_30%,#E8E9E8,#D4DDD6,#B8C0BA)]',
    glow: 'bg-[#6B8070]',
  },
];

export default function ExhibitionsPage() {
  const router = useRouter();

  return (
    <div className="min-h-[100svh] bg-[#EDEFED] text-[#1A1C1A] flex flex-col relative overflow-hidden antialiased selection:bg-[#059669] selection:text-white">

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

      <GreenDust count={60} />

      {/* floating pill nav */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: ENTER, ...SPRING }}
        className="fixed top-4 inset-x-0 z-30 flex justify-center px-4"
      >
        <div className="flex items-center gap-1 rounded-full bg-white/80 backdrop-blur-md shadow-lg shadow-[#1A1C1A]/5 ring-1 ring-[#1A1C1A]/5 pl-5 pr-1.5 py-1.5">
          <Link href="/" aria-label="Pyadra · Home" className="flex items-center gap-2 mr-2 group">
            <PyadraLogo size={22} />
            <span className="text-sm font-bold tracking-tight transition-colors group-hover:text-[#059669]">
              Pyadra
            </span>
          </Link>
          <Link
            href="/"
            className="hidden sm:block rounded-full px-3.5 py-2 text-[13px] font-medium text-[#3A4A3E] hover:bg-[#EDEFED] transition-colors"
          >
            ← Home
          </Link>
          <span className="rounded-full bg-[#EDEFED] px-3.5 py-2 text-[13px] font-semibold text-[#1A1C1A]">
            Exhibitions
          </span>
        </div>
      </motion.nav>

      <main className="relative z-10 flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full px-6 pt-28 pb-16">

        {/* headline */}
        <div className="text-center mb-14 md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: ENTER + 0.1, ...SPRING }}
            className="inline-flex items-center gap-2 rounded-full bg-[#059669]/10 text-[#047857] px-4 py-2 text-[12px] font-semibold mb-7"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
            You found something
          </motion.span>

          <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.035em] leading-[1.02] mb-6">
            {['Three rooms.', 'One open.'].map((line, i) => (
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
            className="text-lg text-[#3A4A3E] font-medium max-w-md mx-auto"
          >
            Real projects, documented and verified — waiting for
            the people who make them grow.
          </motion.p>
        </div>

        {/* the rooms */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {ROOMS.map((room, i) => (
            <motion.div
              key={room.name}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: ENTER + 0.55 + i * 0.1, type: 'spring', stiffness: 110, damping: 16 }}
              whileHover={room.open ? { y: -6 } : {}}
              onClick={() => room.open && room.href && router.push(room.href)}
              className={`group relative rounded-[32px] p-8 md:p-10 flex flex-col items-center text-center ${
                room.open
                  ? 'bg-white shadow-sm ring-1 ring-[#1A1C1A]/5 hover:shadow-xl hover:shadow-[#059669]/10 transition-shadow duration-300 cursor-pointer'
                  : 'bg-white/45 ring-1 ring-[#1A1C1A]/5'
              }`}
            >
              {/* status chip */}
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold mb-8 ${
                  room.open ? 'bg-[#059669]/10 text-[#047857]' : 'bg-[#EDEFED] text-[#6B8070]'
                }`}
              >
                {room.open && <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />}
                {room.open ? 'Open' : 'Forming'}
              </span>

              {/* the orb */}
              <div className="relative mb-8">
                {room.open && (
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.3, 0.12] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className={`absolute inset-0 rounded-full blur-xl ${room.glow}`}
                  />
                )}
                <div
                  className={`relative w-24 h-24 md:w-28 md:h-28 rounded-full ${room.orb} ${
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
              </div>

              <h2 className={`text-3xl md:text-4xl font-bold tracking-[-0.03em] mb-2 ${room.open ? '' : 'text-[#1A1C1A]/40'}`}>
                {room.name}
              </h2>
              <p className={`text-[15px] font-medium mb-2 ${room.open ? 'text-[#3A4A3E]' : 'text-[#6B8070]/60'}`}>
                {room.theme}
              </p>
              <p className={`text-[13px] font-semibold mb-8 ${room.open ? 'text-[#059669]' : 'text-[#6B8070]/50'}`}>
                {room.detail}
              </p>

              {room.open ? (
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 17 }}
                  className="mt-auto inline-block rounded-full bg-[#059669] text-white px-8 py-3.5 text-sm font-semibold shadow-lg shadow-[#059669]/25"
                >
                  Enter {room.name} →
                </motion.span>
              ) : (
                <span className="mt-auto inline-block rounded-full bg-[#EDEFED] text-[#6B8070] px-8 py-3.5 text-sm font-semibold">
                  Sealed
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* placard */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: ENTER + 1.1, duration: 0.8 }}
          className="text-[13px] font-medium text-[#6B8070] text-center mt-10"
        >
          Every project here is real, documented, and verified before it&rsquo;s shown.
        </motion.p>
      </main>

      {/* footer */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full px-6 pb-6">
        <div className="flex justify-between items-center">
          <span className="text-[12px] font-medium text-[#6B8070]">
            © 2026 Pyadra · We document. We verify. You decide.
          </span>
          <span className="hidden md:block text-[12px] font-medium text-[#6B8070]">pyadra.io</span>
        </div>
      </footer>
    </div>
  );
}
