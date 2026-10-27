import Image from 'next/image';
import type { Lot } from './lots';

/* ------------------------------------------------------------------ */
/*  A project as a sphere — the one object a visitor follows from the  */
/*  Home's orbit into Galaxy's ring (and the flight between them), so  */
/*  it is drawn in one place.                                          */
/* ------------------------------------------------------------------ */

/** The museum shop's gem, at the heart of Galaxy's ring. */
export const GemIcon = () => (
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

/** The logo inside a sphere, sized as a share of the sphere so the same
 *  piece works at 44px in a list and 80px on the canvas. */
function LogoSlot({ lot }: { lot: Lot }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {lot.logo.kind === 'image' && (
        <Image
          src={lot.logo.src}
          alt=""
          width={96}
          height={96}
          className="relative w-[64%] h-[64%] object-contain opacity-75 pointer-events-none select-none"
          draggable={false}
        />
      )}
      {lot.logo.kind === 'inline-capsule' && (
        <div className="relative w-[34%] h-[50%] opacity-80 pointer-events-none">
          <CapsuleMark />
        </div>
      )}
      {/* No logo asset yet — the project's initials, set in the museum's
          serif like a monogram, until its mark is made. */}
      {lot.logo.kind === 'pending' && (
        <span className="relative font-serif font-semibold text-[34cqw] leading-none tracking-[-0.02em] text-ink/45 pointer-events-none select-none">
          {initials(lot.name)}
        </span>
      )}
    </div>
  );
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

/** A sphere: the brand colour, the mark, and the room's light on it. */
export function Sphere({ lot, className }: { lot: Lot; className: string }) {
  return (
    <div className={`relative rounded-full overflow-hidden [container-type:inline-size] ${lot.sphereClass} ${className}`}>
      <LogoSlot lot={lot} />
      <span aria-hidden className="py-glass" />
    </div>
  );
}
