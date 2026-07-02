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

type LogoRef = { kind: 'image'; src: string } | { kind: 'inline-capsule' };

type Project = {
  id: string;
  name: string;
  type: string;
  kind: string;
  logo: LogoRef;
  subtitle: string;
  proof: string;
  opportunity: string;
  enter_url: string;
  sphereClass: string;
  glow: string;
  position: string;
};

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
    position: 'md:-translate-x-6 md:-translate-y-6 lg:-translate-x-8 lg:-translate-y-8',
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
    proof: 'Built & live · Global product · Hosted on Pyadra',
    opportunity: 'Open for acquisition',
    enter_url: '/exhibitions/galaxy/ethernicapsule',
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#FDF6EA,#EBD8B9,#D3B58C)] shadow-[-10px_10px_20px_rgba(0,0,0,0.1)]',
    glow: 'bg-[#E4C99F]',
    position: 'md:translate-x-6 md:-translate-y-6 lg:translate-x-8 lg:-translate-y-8',
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
    position: 'md:-translate-x-6 md:translate-y-6 lg:-translate-x-8 lg:translate-y-8',
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
    position: 'md:translate-x-6 md:translate-y-6 lg:translate-x-8 lg:translate-y-8',
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
      {project.logo.kind === 'image' ? (
        <Image
          src={project.logo.src}
          alt={project.name}
          width={80}
          height={80}
          className="relative w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain opacity-70 pointer-events-none select-none"
          draggable={false}
        />
      ) : (
        <div className="relative w-10 h-14 md:w-11 md:h-16 lg:w-12 lg:h-18 opacity-80 pointer-events-none">
          <CapsuleMark />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 rounded-full pointer-events-none" />
    </div>
  );
}

function MagneticSphere({ children, href }: { children: React.ReactNode; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { damping: 15, stiffness: 150, mass: 0.1 });
  const mouseY = useSpring(y, { damping: 15, stiffness: 150, mass: 0.1 });

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) / 4);
    y.set((e.clientY - (rect.top + rect.height / 2)) / 4);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileTap={{ scale: 0.97 }}
      style={{ x: mouseX, y: mouseY }}
      className="relative flex flex-col items-center justify-center cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#059669] rounded-3xl"
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

      <GreenDust count={250} />

      {/* shared nav */}
      <SiteNav
        crumbs={[
          { label: 'Exhibitions', href: '/exhibitions' },
          { label: 'Galaxy' },
        ]}
        status={{ label: '4 live projects', live: true }}
      />

      {/* ============ HEADLINE ============ */}
      <div className="relative z-10 text-center px-6 pt-24 md:pt-28">
        <h1 className="text-3xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.05]">
          {['Four projects.', 'Already alive.'].map((line, i) => (
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

          {/* orbital rings */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 md:opacity-15"
            style={{ x: ringsX, y: ringsY }}
          >
            <svg viewBox="0 0 800 800" className="w-full h-full text-[#059669]">
              <circle cx="400" cy="400" r="140" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="400" cy="400" r="260" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="400" cy="400" r="380" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" />
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

          {/* the four spheres */}
          <div className="grid grid-cols-2 gap-4 md:gap-8 lg:gap-12 p-4 md:p-6 lg:p-8">
            {PROJECTS.map((project, index) => (
              <Fragment key={project.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.7, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: ENTER + 0.5 + index * 0.12, type: 'spring', stiffness: 120, damping: 16 }}
                className={`transform ${project.position} transition-transform duration-500`}
              >
                <MagneticSphere href={project.enter_url}>
                  {/* type chip */}
                  <span className="rounded-full bg-white/70 backdrop-blur-sm ring-1 ring-[#1A1C1A]/8 px-3 py-1 text-[10px] font-bold text-[#3A4A3E] mb-3">
                    {project.type} · {project.kind}
                  </span>

                  {/* sphere — untouched */}
                  <div className="relative mb-4">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
                      className={`absolute inset-0 rounded-full blur-xl ${project.glow}`}
                    />
                    <div
                      className={`relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full ${project.sphereClass} transition-transform duration-500 group-hover:scale-105 group-hover:shadow-2xl overflow-hidden`}
                    >
                      <LogoSlot project={project} />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 opacity-30 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_180deg,rgba(255,255,255,0.2)_270deg,transparent_360deg)]"
                      />
                    </div>
                  </div>

                  {/* 4-line copy per sphere */}
                  <h3 className="text-lg md:text-2xl font-bold tracking-[-0.02em] text-center mb-1 transition-colors duration-300 group-hover:text-[#059669]">
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
