/* ------------------------------------------------------------------ */
/*  PYADRA · GreenDust — the emerald motes rising through every room.  */
/*                                                                     */
/*  CSS keyframes only (globals.css, `.py-dust`): the compositor moves */
/*  them, so the dust never competes with the page for the main thread */
/*  — it used to be hundreds of JS-driven nodes, and the museum        */
/*  stuttered whenever something else moved. Positions come from a    */
/*  seeded generator, so the server and the browser print the same    */
/*  dust and nothing waits for an effect to appear.                    */
/* ------------------------------------------------------------------ */

/** Beyond this the eye stops counting and the GPU starts. */
const MAX = 72;

/** mulberry32 — a tiny seeded PRNG. */
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r2 = (v: number) => Math.round(v * 100) / 100;

export default function GreenDust({ count = 30 }: { count?: number }) {
  const rand = seeded(77);
  const motes = Array.from({ length: Math.min(count, MAX) }, (_, i) => {
    const duration = 16 + rand() * 22;
    return {
      id: i,
      left: r2(rand() * 100),
      size: r2(3 + rand() * 6), // the glow is drawn inside the box
      duration: r2(duration),
      // negative: the dust is already mid-air when the page appears
      delay: r2(-rand() * duration),
      drift: Math.round(rand() * 80 - 40),
    };
  });

  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {motes.map((m) => (
        <span
          key={m.id}
          className={`py-dust ${m.id % 2 ? 'hidden md:block' : ''}`}
          style={
            {
              left: `${m.left}%`,
              width: m.size,
              height: m.size,
              animationDuration: `${m.duration}s`,
              animationDelay: `${m.delay}s`,
              '--drift': `${m.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
