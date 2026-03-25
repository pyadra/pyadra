"use client";
import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  // Using a Next.js template to trigger cinematic dissolve transitions recursively across the layout
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="w-full relative"
    >
      {children}
    </motion.div>
  );
}
