'use client';

/* ------------------------------------------------------------------ */
/*  PYADRA · MuseumAtmosphere — the Galaxy background, shared.         */
/*  Three layers: blueprint grid + film grain + rising green dust.     */
/*  `fixed` pins it to the viewport for long scrolling pages.          */
/* ------------------------------------------------------------------ */

import GreenDust from './GreenDust';

export default function MuseumAtmosphere({
  dust = 280,
  fixed = false,
}: {
  dust?: number;
  fixed?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={`${fixed ? 'fixed' : 'absolute'} inset-0 pointer-events-none z-0 overflow-hidden`}
    >
      {/* blueprint grid */}
      <div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #D4DDD6 1px, transparent 1px),
            linear-gradient(to bottom, #D4DDD6 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* grain */}
      <div className="absolute inset-0 mix-blend-multiply opacity-[0.4]">
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-60" preserveAspectRatio="none">
          <filter id="museumNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#museumNoise)" />
        </svg>
      </div>

      <GreenDust count={dust} />
    </div>
  );
}
