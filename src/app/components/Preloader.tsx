"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  
  // Theme dictates the boot-up loading light line color
  const isOrbit = pathname?.includes("/orbit");
  const color = isOrbit ? "from-transparent via-[#39FF14] to-transparent" : "from-transparent via-[#DCA88F] to-transparent";

  useEffect(() => {
    // 1.5s lock guarantees DOM WebGL elements and heavy custom typography load before user visibility
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] bg-[#0A0A0A] flex items-center justify-center pointer-events-none"
        >
          {/* Minimalist Active Theory style single breathing line */}
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "300px", opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className={`h-[1px] bg-gradient-to-r ${color}`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
