'use client';

import { Fragment, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import GreenDust from '../../components/ui/GreenDust';
import SiteNav from '@/app/components/nav/SiteNav';
import SiteFooter from '@/app/components/nav/SiteFooter';

/* ------------------------------------------------------------------ */
/*  PYADRA — GALAXY                                                    */
/*  The orbital field of live projects.                                */
/*                                                                     */
/*  One click on a sphere = straight into the project's page.          */
/*  Galaxy is the hook; the project's page is the story.               */
/* ------------------------------------------------------------------ */

const ENTER = 0.75; // template.tsx dissolve ~1.5s — choreography starts after
const SPRING = { type: 'spring' as const, stiffness: 130, damping: 18, mass: 0.9 };

type LogoRef = { kind: 'image'; src: string } | { kind: 'inline-capsule' } | { kind: 'pending' };

type Project = {
  id: string;
  name: string;
  type: string;
  kind: string;
  logo: LogoRef;
  subtitle: string;
  proof: string;
  opportunity: string;
  /** null until the project has a page — the sphere shows, it just isn't a door yet. */
  enter_url: string | null;
  sphereClass: string;
  glow: string;
  /** Column placement in the 6-col desktop grid: rows of 3 · 2 · 2 around the gem. */
  slot: string;
  position: string;
};

/* Seven spheres, one field. The desktop grid is six columns and each sphere
   spans two, which gives rows of 3 · 2 · 2: the middle row leaves the two
   centre columns empty, and the gem (absolutely centred) sits in that gap.
   The bottom pair is offset by one column so it reads centred under the gem. */
const PROJECTS: Project[] = [
  {
    id: 'orbit',
    name: 'Orbit 77',
    type: 'Glocal',
    kind: 'Podcast',
    logo: { kind: 'image', src: '/orbit-logo.png' },
    subtitle: 'Podcast · real conversations',
    proof: '10 episodes live · Season 2 in the works',
    opportunity: 'Open for support',
    enter_url: '/exhibitions/galaxy/orbit',
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#F2FBF5,#CDEBD9,#A3CFB6)] shadow-[-10px_10px_20px_rgba(0,0,0,0.12)]',
    glow: 'bg-[#A3CFB6]',
    slot: 'md:col-start-1',
    position: 'md:-translate-x-4 md:-translate-y-5 lg:-translate-x-6 lg:-translate-y-7',
  },
  {
    id: 'ethernicapsule',
    name: 'EterniCapsule',
    type: 'Global',
    kind: 'Digital vault',
    /* TODO: no dedicated logo asset for EterniCapsule yet — using an inline
       gold capsule mark as a stand-in. Replace with a real logo when available. */
    logo: { kind: 'inline-capsule' },
    subtitle: 'Encrypted time capsules',
    proof: 'Built & live · Global product · Independently deployed (eternicapsule.com)',
    opportunity: 'Open for acquisition',
    enter_url: '/exhibitions/galaxy/ethernicapsule',
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#FDF6EA,#EBD8B9,#D3B58C)] shadow-[-10px_10px_20px_rgba(0,0,0,0.1)]',
    glow: 'bg-[#E4C99F]',
    slot: 'md:col-start-3',
    position: 'md:-translate-y-8 lg:-translate-y-10',
  },
  {
    id: 'figuitoon',
    name: 'Figuitoon',
    type: 'Glocal',
    kind: 'Physical product',
    logo: { kind: 'image', src: '/figuitoon-logo.png' },
    subtitle: 'Custom 3D figurines',
    proof: 'Prototype built · Shopify store · Printer included',
    opportunity: 'Available to acquire',
    enter_url: '/exhibitions/galaxy/figurines',
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#FFFFFF,#FFFFFF,#F2F2F2)] shadow-[-10px_10px_20px_rgba(0,0,0,0.12)]',
    glow: 'bg-white',
    slot: 'md:col-start-5',
    position: 'md:translate-x-4 md:-translate-y-5 lg:translate-x-6 lg:-translate-y-7',
  },
  {
    id: 'kangaroo-cleanup',
    name: 'Kangaroo Cleanup',
    type: 'Local',
    kind: 'Cleanup business',
    logo: { kind: 'image', src: '/images/kangaroo/kangaroo_logo.png' },
    subtitle: 'Local cleanup business',
    proof: 'Sydney-based · 500+ jobs done · 5.0 reputation',
    opportunity: 'Looking for a partner',
    enter_url: '/exhibitions/galaxy/kangaroo-cleanup',
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#FFFEF9,#F3EFE2,#DCD5C2)] shadow-[-10px_10px_20px_rgba(0,0,0,0.12)]',
    glow: 'bg-[#EDE8D8]',
    slot: 'md:col-start-1',
    position: 'md:-translate-x-5 lg:-translate-x-7',
  },
  /* ------------------------------------------------------------------ */
  /*  The three new projects.                                            */
  /*                                                                     */
  /*  ⚠ TODO (owner) — each one still needs three true strings and a     */
  /*  door, taken from its own live site, before this page is deployed:  */
  /*    · subtitle    what it is, one line                               */
  /*    · proof       what anyone can verify today                       */
  /*    · opportunity acquire / operate / support / partner              */
  /*    · enter_url   its Pyadra page, or its own site                   */
  /*  Until then the spheres show with provisional copy and no link —    */
  /*  never a claim the code can't keep (Company_Master #13).            */
  /* ------------------------------------------------------------------ */
  {
    id: 'byndi',
    name: 'Byndi',
    type: 'Global',
    kind: 'Mobile app',
    logo: { kind: 'pending' },
    // The in-app tagline, verified in the Byndi repo.
    subtitle: 'Understand her cycle. Care for the relationship.',
    proof: 'Built & in testing',
    opportunity: 'Opening soon',
    enter_url: null,
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#FFF6F8,#F4DAE2,#DFB3C3)] shadow-[-10px_10px_20px_rgba(0,0,0,0.1)]',
    glow: 'bg-[#EFC7D3]',
    slot: 'md:col-start-5',
    position: 'md:translate-x-5 lg:translate-x-7',
  },
  {
    id: 'momentos-inolvidables',
    name: 'Momentos Inolvidables',
    type: 'Glocal',
    kind: 'Custom songs',
    logo: { kind: 'pending' },
    subtitle: 'Songs made for one moment',
    proof: 'Details to confirm',
    opportunity: 'Opening soon',
    enter_url: null,
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#FAF8FF,#E4DCF7,#C5B8E8)] shadow-[-10px_10px_20px_rgba(0,0,0,0.1)]',
    glow: 'bg-[#D6CBF0]',
    slot: 'md:col-start-2',
    position: 'md:-translate-x-2 md:translate-y-5 lg:translate-y-7',
  },
  {
    id: 'gym',
    name: 'Gym routines',
    type: 'Global',
    kind: 'Fitness app',
    logo: { kind: 'pending' },
    subtitle: 'Training routines, guided',
    proof: 'Details to confirm',
    opportunity: 'Opening soon',
    enter_url: null,
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#F6FBFF,#D9E8F4,#B4CADE)] shadow-[-10px_10px_20px_rgba(0,0,0,0.1)]',
    glow: 'bg-[#CBDDEB]',
    slot: 'md:col-start-4',
    position: 'md:translate-x-2 md:translate-y-5 lg:translate-y-7',
  },
];

/* ---------- pieces ---------- */

const GemIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-[#059669] drop-shadow-md">
    <polygon points="50 5, 95 27.5, 95 72.5, 50 95, 5 72.5, 5 27.5" fill="currentColor" opacity="0.8" />
    <polygon points="50 20, 75 35, 75 65, 50 80, 25 65, 25 35" fill="white" opacity="0.2" />
    <polygon points="50 5, 95 27.5, 50 50, 5 27.5" fill="white" opacity="0.4" />
    <polygon points="95 27.5, 95 72.5, 50 50" fill="black" opacity="0.1" />
    <polygon points="5 27.5, 5 72.5, 50 50" fill="white" opacity="0.1" />
  </svg>
);

/** Inline stand-in mark used until EterniCapsule has a real logo asset. */
const CapsuleMark = () => (
  <svg viewBox="0 0 40 60" className="w-full h-full">
    <rect x="10" y="6" width="20" height="48" rx="10" fill="none" stroke="#C9A961" strokeWidth="2.5" />
    <circle cx="20" cy="30" r="2.6" fill="#C9A961" />
  </svg>
);

function LogoSlot({ project }: { project: Project }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute w-16 h-16 md:w-18 md:h-18 lg:w-22 lg:h-22 rounded-full bg-white/20 blur-sm" />
      {project.logo.kind === 'image' && (
        <Image
          src={project.logo.src}
          alt={project.name}
          width={80}
          height={80}
          className="relative w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain opacity-70 pointer-events-none select-none"
          draggable={false}
        />
      )}
      {project.logo.kind === 'inline-capsule' && (
        <div className="relative w-10 h-14 md:w-11 md:h-16 lg:w-12 lg:h-18 opacity-80 pointer-events-none">
          <CapsuleMark />
        </div>
      )}
      {/* No logo asset yet — the dashed ring the team index already uses for
          a project whose mark hasn't been made. */}
      {project.logo.kind === 'pending' && (
        <span className="relative w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full border border-dashed border-[#1A1C1A]/25 pointer-events-none" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 rounded-full pointer-events-none" />
    </div>
  );
}

/** The sphere follows the cursor. With no href it still breathes and tilts —
 *  it just isn't a door, so it never promises a page that doesn't exist. */
function MagneticSphere({ children, href }: { children: React.ReactNode; href: string | null }) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { damping: 15, stiffness: 150, mass: 0.1 });
  const mouseY = useSpring(y, { damping: 15, stiffness: 150, mass: 0.1 });

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) / 4);
    y.set((e.clientY - (rect.top + rect.height / 2)) / 4);
  };

  const shared = {
    onMouseMove: onMove,
    onMouseLeave: () => { x.set(0); y.set(0); },
    style: { x: mouseX, y: mouseY },
    className:
      'relative flex flex-col items-center justify-center group rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#059669] ' +
      (href ? 'cursor-pointer' : 'cursor-default'),
  };

  if (!href) {
    return (
      <motion.div ref={ref as React.Ref<HTMLDivElement>} {...shared}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.a
      ref={ref as React.Ref<HTMLAnchorElement>}
      href={href}
      whileTap={{ scale: 0.97 }}
      {...shared}
    >
      {children}
    </motion.a>
  );
}

/* ---------- the page ---------- */

export default function GalaxyExhibition() {
  // parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gridX = useTransform(mouseX, (v) => v * 0.2);
  const gridY = useTransform(mouseY, (v) => v * 0.2);
  const ringsX = useTransform(mouseX, (v) => v * 0.5);
  const ringsY = useTransform(mouseY, (v) => v * 0.5);
  const gemX = useTransform(mouseX, (v) => -v * 0.3);
  const gemY = useTransform(mouseY, (v) => -v * 0.3);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { innerWidth, innerHeight } = window;
    mouseX.set(((e.clientX - innerWidth / 2) / innerWidth) * 20);
    mouseY.set(((e.clientY - innerHeight / 2) / innerHeight) * 20);
  };

  return (
    <div
      className="min-h-[100svh] bg-[#EDEFED] text-[#1A1C1A] flex flex-col relative overflow-hidden antialiased selection:bg-[#059669] selection:text-white"
      onMouseMove={handleMouseMove}
    >

      {/* ambient vignette */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-white/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-[#D4DDD6]/40 to-transparent" />
      </div>

      {/* blueprint grid with parallax */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.25]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #D4DDD6 1px, transparent 1px),
            linear-gradient(to bottom, #D4DDD6 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          x: gridX,
          y: gridY,
        }}
      />

      {/* grain */}
      <div className="absolute inset-0 pointer-events-none z-0 mix-blend-multiply opacity-[0.4]">
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-60" preserveAspectRatio="none">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <GreenDust count={280} />

      {/* shared nav */}
      <SiteNav
        crumbs={[
          { label: 'Exhibitions', href: '/exhibitions' },
          { label: 'Galaxy' },
        ]}
        status={{ label: '7 projects', live: true }}
      />

      {/* ============ HEADLINE ============ */}
      <div className="relative z-10 text-center px-6 pt-24 md:pt-24">
        <h1 className="text-3xl md:text-4xl font-bold tracking-[-0.03em] leading-[1.05]">
          {['Seven projects.', 'Already alive.'].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: ENTER + 0.15 + i * 0.09, type: 'spring', stiffness: 110, damping: 20 }}
              >
                {i === 1 ? <span className="text-[#059669]">{line}</span> : line}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: ENTER + 0.45, ...SPRING }}
          className="text-[15px] md:text-base text-[#3A4A3E] font-medium mt-4 max-w-sm mx-auto"
        >
          Step into any one of them. Take it further.
        </motion.p>
      </div>

      {/* ============ THE ORBITAL FIELD ============ */}
      <main className="relative z-10 flex-1 w-full px-4 md:px-8 lg:px-12 py-4 md:py-6 flex items-center justify-center">
        <div className="w-full max-w-[1100px] relative">

          {/* orbital rings — the dashed ones drift, so the field is never still */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 md:opacity-15"
            style={{ x: ringsX, y: ringsY }}
          >
            <svg viewBox="0 0 800 800" className="w-full h-full text-[#059669]">
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 240, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '400px 400px' }}
              >
                <circle cx="400" cy="400" r="140" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
              </motion.g>
              <circle cx="400" cy="400" r="260" fill="none" stroke="currentColor" strokeWidth="1" />
              <motion.g
                animate={{ rotate: -360 }}
                transition={{ duration: 360, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '400px 400px' }}
              >
                <circle cx="400" cy="400" r="380" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" />
              </motion.g>
            </svg>
          </motion.div>

          {/* central gem — the door to the museum shop (desktop; mobile gets an inline row) */}
          <motion.div
            className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-16 md:h-16 lg:w-20 lg:h-20 z-20"
            style={{ x: gemX, y: gemY }}
          >
            <Link href="/store" className="group relative block w-full h-full" aria-label="The museum shop">
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="relative w-full h-full cursor-pointer"
              >
                <motion.div
                  animate={{ opacity: [0.2, 0.45, 0.2] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-[#059669] blur-xl rounded-full"
                />
                <GemIcon />
              </motion.div>
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-3.5 py-1.5 text-[11px] font-semibold text-[#1A1C1A] shadow-md ring-1 ring-[#1A1C1A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                The museum shop →
              </span>
            </Link>
          </motion.div>

          {/* the seven spheres — 2 per row on phones, rows of 3 · 2 · 2 from md up */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-5 md:gap-4 lg:gap-6 p-2 md:p-4">
            {PROJECTS.map((project, index) => (
              <Fragment key={project.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.7, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: ENTER + 0.5 + index * 0.1, type: 'spring', stiffness: 120, damping: 16 }}
                /* An odd count leaves the last sphere alone on the phone row,
                   so it takes the full width and centres itself. */
                className={`${index === PROJECTS.length - 1 ? 'col-span-2' : ''} md:col-span-2 ${project.slot} transform ${project.position} transition-transform duration-500`}
              >
                <MagneticSphere href={project.enter_url}>
                  {/* type chip */}
                  <span className="rounded-full bg-white/70 backdrop-blur-sm ring-1 ring-[#1A1C1A]/8 px-3 py-1 text-[10px] font-bold text-[#3A4A3E] mb-3">
                    {project.type} · {project.kind}
                  </span>

                  {/* sphere — floats in place, each on its own rhythm,
                      so the field breathes even without a cursor */}
                  <motion.div
                    className="relative mb-4"
                    animate={{ y: [0, -7, 0] }}
                    transition={{
                      duration: 5 + index * 0.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * 0.9,
                    }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
                      className={`absolute inset-0 rounded-full blur-xl ${project.glow}`}
                    />
                    <div
                      className={`relative w-24 h-24 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full ${project.sphereClass} transition-transform duration-500 group-hover:scale-105 group-hover:shadow-2xl overflow-hidden`}
                    >
                      <LogoSlot project={project} />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 opacity-30 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_180deg,rgba(255,255,255,0.2)_270deg,transparent_360deg)]"
                      />
                    </div>
                  </motion.div>

                  {/* 4-line copy per sphere */}
                  <h3 className="text-lg md:text-xl font-bold tracking-[-0.02em] text-center mb-1 transition-colors duration-300 group-hover:text-[#059669]">
                    {project.name}
                  </h3>
                  <div className="text-[12px] md:text-[13px] font-semibold text-[#3A4A3E] text-center leading-snug">
                    {project.subtitle}
                  </div>
                  <div className="text-[11px] md:text-[12px] font-medium text-[#6B8070] text-center mt-0.5 leading-snug">
                    {project.proof}
                  </div>
                  <div className="text-[11px] md:text-[12px] font-semibold text-[#059669] text-center mt-1 leading-snug">
                    {project.opportunity}
                  </div>
                </MagneticSphere>
              </motion.div>

              {/* mobile shop entrance — its own row between the spheres,
                  so it never overlaps project copy */}
              {index === 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: ENTER + 0.75, ...SPRING }}
                  className="col-span-2 flex justify-center py-1 md:hidden"
                >
                  <Link
                    href="/store"
                    className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm ring-1 ring-[#1A1C1A]/8 shadow-sm px-4 py-2"
                  >
                    <span className="w-5 h-5 shrink-0">
                      <GemIcon />
                    </span>
                    <span className="text-[12px] font-semibold text-[#1A1C1A]">
                      The museum shop →
                    </span>
                  </Link>
                </motion.div>
              )}
              </Fragment>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
