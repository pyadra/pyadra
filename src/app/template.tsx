"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getFlight } from "@/app/components/flight/flight";
import { EASE } from "@/app/components/ui/motion";

/* Museum-room transition: each room settles into place as you arrive.
   The zoom door (useZoomDoor) pushes the old room toward the visitor;
   the new one picks the move up — a touch small and soft, then sharp
   and still — so the two read as one step inward.
   Opacity, scale and a short blur on one layer — compositor work.
   Pages time their choreography with ENTER ≈ 0.75s, which still
   lands right as this settles.
   A room reached by the flight (components/flight) skips it: the
   spheres are already travelling into it, and they are the move. */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion() ?? false;
  const [inFlight] = useState(() => getFlight() !== null);
  return (
    <motion.div
      initial={inFlight ? false : reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, filter: "blur(6px)" }}
      // a filter left on (even blur(0)) would trap every fixed element of the
      // page inside this layer — it is cleared the moment the room settles
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      transition={{ duration: 0.7, ease: EASE.out }}
      style={{ transformOrigin: "50% 40vh" }}
      className="w-full relative"
    >
      {children}
    </motion.div>
  );
}
