/* ------------------------------------------------------------------ */
/*  PYADRA · pointer — where the hand is, for surfaces that answer it. */
/*  `.py-spot` (globals.css) reads --mx / --my to place its light.     */
/* ------------------------------------------------------------------ */

export function trackPointer(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}
