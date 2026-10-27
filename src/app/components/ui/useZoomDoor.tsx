'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  The zoom door — one canvas, not separate pages.                    */
/*                                                                     */
/*  Clicking a door pushes the page in toward the thing that was       */
/*  clicked (`zoomProps`, spread on the page root) while a disc of the */
/*  next room's colour grows out of it to cover the screen, then       */
/*  navigates.                                                         */
/*  The next page fades up out of that colour (template.tsx), so the   */
/*  visitor reads one continuous move inward: Home → museum → Galaxy → */
/*  dossier. Routes stay real URLs — back, share and SEO still work.   */
/* ------------------------------------------------------------------ */

type Door = { x: number; y: number; r: number; color: string; scrollY: number };

const GROW_MS = 700;

export function useZoomDoor() {
  const router = useRouter();
  const reduced = useReducedMotion() ?? false;
  const [door, setDoor] = useState<Door | null>(null);

  const zoomTo = useCallback(
    (from: Element | null, href: string, color = '#EDEFED') => {
      if (door) return;
      router.prefetch(href);
      if (reduced || !from) {
        router.push(href);
        return;
      }
      const rect = from.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      // far enough to cover the furthest corner from the click
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      setDoor({ x, y, r, color, scrollY: window.scrollY });
      setTimeout(() => router.push(href), GROW_MS);
    },
    [door, reduced, router],
  );

  const overlay = (
    <AnimatePresence>
      {door && (
        <motion.div
          aria-hidden
          className="fixed z-[90] rounded-full pointer-events-none"
          style={{
            left: door.x - door.r,
            top: door.y - door.r,
            width: door.r * 2,
            height: door.r * 2,
            // the next room's colour, with a breath of emerald at its heart —
            // the door glows a little as it opens
            background: `radial-gradient(circle, rgba(5,150,105,0.10) 0%, ${door.color} 38%)`,
          }}
          initial={{ scale: 0.02, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: GROW_MS / 1000, ease: [0.76, 0, 0.24, 1] }}
        />
      )}
    </AnimatePresence>
  );

  // the page root sits at the top of the document, so the origin is the
  // click point in page coordinates
  const zoomProps = {
    animate: door ? { scale: 2.4, opacity: 0, filter: 'blur(8px)' } : { scale: 1, opacity: 1 },
    transition: { duration: GROW_MS / 1000, ease: [0.76, 0, 0.24, 1] as const },
    style: door ? { transformOrigin: `${door.x}px ${door.y + door.scrollY}px` } : undefined,
  };

  return { zoomTo, overlay, zoomProps, zooming: door !== null };
}
