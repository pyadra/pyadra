"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const pathname = usePathname();
  
  // High-End Detail: Cursor adapts color perfectly to the Alien Orbit or the Warm Incubator
  const isOrbit = pathname?.includes("/orbit");
  const color = isOrbit ? "#39FF14" : "#DCA88F";

  useEffect(() => {
    // Media query to ensure mobile touch devices do not render the custom cursor overlay
    if (window.matchMedia("(pointer: fine)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDesktop(true);
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      // Sniff out interactive components like links, iframes, buttons to trigger expansion
      const isInteractive = !!target.closest("a, button, input, iframe, [data-interactive]");
      setIsHovering(isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!isDesktop) return null;

  return (
    <motion.div 
      className="fixed top-0 left-0 rounded-full border pointer-events-none z-[9999] mix-blend-screen"
      animate={{ 
        x: mousePos.x - (isHovering ? 24 : 8), 
        y: mousePos.y - (isHovering ? 24 : 8),
        width: isHovering ? 48 : 16,
        height: isHovering ? 48 : 16,
        borderColor: isHovering ? color + "80" : color + "60",
        backgroundColor: isHovering ? color + "10" : "transparent"
      }}
      transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.5 }}
    />
  );
}
