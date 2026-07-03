"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  PYADRA · CustomCursor — a quiet emerald halo that trails the       */
/*  pointer and blooms over interactive elements.                      */
/*                                                                     */
/*  Performance contract: position updates go through motion values    */
/*  (compositor only, zero React re-renders per mousemove). State is   */
/*  only touched when hover-over-interactive CHANGES.                  */
/*  Renders nothing on touch devices.                                  */
/* ------------------------------------------------------------------ */

const EMERALD = "#059669";

export default function CustomCursor() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 28, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 400, damping: 28, mass: 0.4 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setIsDesktop(true);

    let wasInteractive = false;
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement;
      const isInteractive = !!target.closest("a, button, input, textarea, [data-interactive]");
      if (isInteractive !== wasInteractive) {
        wasInteractive = isInteractive;
        setHovering(isInteractive);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  if (!isDesktop) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 rounded-full border pointer-events-none z-[9999]"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: hovering ? 44 : 14,
        height: hovering ? 44 : 14,
        borderColor: hovering ? EMERALD + "66" : EMERALD + "4D",
        backgroundColor: hovering ? EMERALD + "14" : EMERALD + "00",
      }}
      transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.5 }}
    />
  );
}
