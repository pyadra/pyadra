"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function EbookPlaceholder() {
  return (
    <div className="min-h-screen bg-[#02040A] text-[#E3DAC9] flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl text-center space-y-8"
      >
        {/* Badge */}
        <div className="inline-block">
          <span className="text-xs tracking-[0.3em] uppercase font-mono text-[#8B7355] border border-[#8B7355]/40 px-4 py-2 rounded-full">
            COMING Q3 2026
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-4xl md:text-5xl font-light italic tracking-tight"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          EBOK
        </h1>

        {/* Description */}
        <div className="space-y-4 text-[#C4B5A8]">
          <p className="text-lg md:text-xl font-light leading-relaxed">
            Stories and reflections printed in physical books.
          </p>
          <p className="text-base md:text-lg font-light leading-relaxed opacity-80">
            Write something that will exist beyond screens. Your words, permanent on paper, held in hands, kept on shelves.
          </p>
        </div>

        {/* Status message */}
        <div className="pt-8 pb-4">
          <p className="text-sm text-[#8B7355]/80 font-mono uppercase tracking-wide">
            Currently in development
          </p>
        </div>

        {/* Return button */}
        <Link
          href="/exhibitions/galaxy"
          className="group inline-flex items-center gap-3 px-6 py-3 bg-[#1A1410]/60 border border-white/5 rounded-full hover:bg-[#8B7355]/10 hover:border-[#8B7355]/40 transition-all duration-500 backdrop-blur-md"
        >
          <span className="text-[#8B7355]/80 group-hover:text-[#E3DAC9] text-xs tracking-wide uppercase font-mono">
            ← RETURN TO GALAXY
          </span>
        </Link>
      </motion.div>
    </div>
  );
}
