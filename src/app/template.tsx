"use client";
import { motion } from "framer-motion";

/* Museum-room transition: each page fades up into place.
   Opacity + transform only — both compositor-cheap. The previous
   full-page blur() forced main-thread repaints on mobile.
   Pages time their choreography with ENTER ≈ 0.75s, which still
   lands right as this settles. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full relative"
    >
      {children}
    </motion.div>
  );
}
