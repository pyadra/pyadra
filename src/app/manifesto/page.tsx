'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import SiteNav from '@/app/components/nav/SiteNav';
import SiteFooter from '@/app/components/nav/SiteFooter';

/* ------------------------------------------------------------------ */
/*  PYADRA — THE MANIFESTO                                             */
/*  Why Pyadra exists, in Pyadra's own voice.                          */
/*                                                                     */
/*  Copy sourced from Company_Master §1–§3 (single source of truth).   */
/*  Light museum page — dark backgrounds belong inside project         */
/*  experiences only (Company_Master rule 12).                         */
/* ------------------------------------------------------------------ */

const SPRING = { type: 'spring' as const, stiffness: 130, damping: 18, mass: 0.9 };
const pop = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: SPRING,
};

const SECTIONS: { n: string; title: string; body: React.ReactNode }[] = [
  {
    n: '01',
    title: 'What Pyadra is',
    body: (
      <>
        Pyadra is where projects and ideas find the people who make them real.
        A museum of living projects — documented, verified, and open to walk
        into. Contribute with money, work, or skills. Own a part of something
        that matters. Grow together.
      </>
    ),
  },
  {
    n: '02',
    title: 'Why it exists',
    body: (
      <>
        Most platforms only understand money. Pyadra understands that work,
        skills, and belief in a project are also capital. That changes who can
        participate — and how far a project can go. You don&rsquo;t need to be
        a developer. You don&rsquo;t need to be an investor. You need belief
        and something to contribute.
      </>
    ),
  },
  {
    n: '03',
    title: 'Who it’s for',
    body: (
      <>
        <strong className="font-semibold text-[#1A1C1A]">The founder</strong>,
        who built something real and needs believers, not just buyers.{' '}
        <strong className="font-semibold text-[#1A1C1A]">The builder</strong>,
        whose work is their capital — no money needed to enter.{' '}
        <strong className="font-semibold text-[#1A1C1A]">The investor</strong>,
        who wants proof, history, and a person behind the project — not
        mockups.
      </>
    ),
  },
  {
    n: '04',
    title: 'How it works',
    body: (
      <>
        Every project is exhibited with its proof, its numbers, and its risks —
        nothing hidden. A project that isn&rsquo;t real and documented is not
        shown. You see everything, then you decide how to enter: with money,
        with work, or with skills.
      </>
    ),
  },
  {
    n: '05',
    title: 'The name',
    body: (
      <>
        <em className="font-serif italic">Pyada</em> — pawn, in Hindi.{' '}
        <em className="font-serif italic">Ra</em> — path, in Latin. Born from a
        chess game and a moment of clarity: every person is a pawn that can
        become a queen. The path is Pyadra.
      </>
    ),
  },
];

export default function Manifesto() {
  return (
    <div className="min-h-[100svh] bg-[#EDEFED] text-[#1A1C1A] flex flex-col relative overflow-hidden antialiased selection:bg-[#059669] selection:text-white">

      {/* soft color field */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-48 right-1/4 w-[640px] h-[640px] rounded-full opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.08), transparent 65%)' }}
        />
      </div>

      <SiteNav crumbs={[{ label: 'Manifesto' }]} />

      <main className="relative z-10 flex-1 w-full max-w-2xl mx-auto px-6 pt-32 md:pt-40 pb-24">

        {/* headline */}
        <motion.span
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, ...SPRING }}
          className="inline-flex items-center gap-2 rounded-full bg-[#059669]/10 text-[#047857] px-4 py-2 t-d6 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
          Why Pyadra exists
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, ...SPRING }}
          className="t-d1 font-serif mb-14 md:mb-20"
        >
          The Manifesto
        </motion.h1>

        {/* the five statements */}
        <div className="space-y-12 md:space-y-16">
          {SECTIONS.map((s) => (
            <motion.section key={s.n} {...pop}>
              <h2 className="t-d6 text-[#059669] mb-3">
                {s.n} · {s.title}
              </h2>
              <p className="t-d4 text-[#3A4A3E] leading-relaxed">{s.body}</p>
            </motion.section>
          ))}
        </div>

        {/* the plaque */}
        <motion.div
          {...pop}
          className="mt-16 md:mt-24 rounded-[32px] bg-white shadow-sm ring-1 ring-[#1A1C1A]/5 p-8 md:p-12 text-center"
        >
          <p className="font-serif italic text-2xl md:text-3xl leading-snug mb-3">
            Lo que dejas importa.
          </p>
          <p className="t-d5 text-[#6B8070] mb-8">What you leave behind matters.</p>
          <motion.span
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 350, damping: 17 }}
            className="inline-block"
          >
            <Link
              href="/exhibitions"
              className="block rounded-full bg-[#1A1C1A] text-white px-8 py-3.5 t-d5 font-semibold shadow-lg shadow-[#1A1C1A]/20"
            >
              Enter the exhibition →
            </Link>
          </motion.span>
        </motion.div>
      </main>

      <SiteFooter />
    </div>
  );
}
