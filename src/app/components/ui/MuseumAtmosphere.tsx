/* ------------------------------------------------------------------ */
/*  PYADRA · MuseumAtmosphere — the background every room shares.      */
/*  Three layers: blueprint grid + film grain + rising green dust.     */
/*  The grid fades out toward the edges, so it reads as light on the   */
/*  floor rather than graph paper. All static or CSS-driven — nothing  */
/*  here costs the main thread a frame. `fixed` pins it to the         */
/*  viewport for long scrolling pages.                                 */
/* ------------------------------------------------------------------ */

import GreenDust from './GreenDust';

export default function MuseumAtmosphere({
  dust = 72,
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
      {/* blueprint grid, lit from the centre */}
      <div className="py-grid absolute inset-0" />

      {/* grain */}
      <div className="py-grain absolute inset-0" />

      <GreenDust count={dust} />
    </div>
  );
}
