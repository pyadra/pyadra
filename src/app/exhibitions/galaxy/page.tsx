"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import GreenDust from "../../components/ui/GreenDust";

// -----------------------------------------------------------------------------
// DATA from Galaxy.md - Updated with realistic values (May 2026)
// -----------------------------------------------------------------------------
const PROJECTS = [
  {
    id: "orbit",
    name: "Orbit 77",
    type: "Podcast",
    founders: "Pablo & Eduardo",
    logo: "/orbit-logo.png",
    product_name: "Season 1 Credential",
    price: "From $10 AUD",
    valuation: "$12,000 AUD",
    available_pct: 49,
    pyadra_fee: "9% per credential, 3% merchandise sales",
    description: "A podcast recorded from Australia exploring questions about life, creation, and identity.",
    experience_today: "Support Season 2 production with a permanent credential. Founding member status and early access.",
    enter_url: "/exhibitions/galaxy/orbit",
    traction: [
      { label: "S2 Funding", value: "$340 / $1,000" },
      { label: "Supporters", value: "12" }
    ],
    income_potential: {
      value: "Revenue Today: Credentials ($10–50) + Merchandise",
      description: "Future Potential: YouTube AdSense, Spotify, Sponsorships, Season 2+ Credentials"
    },
    effort: {
      title: "Active podcast production.",
      description: "Lives on Pyadra infrastructure."
    },
    assets_included: [
      { name: "YouTube & Spotify", included: true, detail: "10 Episodes Published" },
      { name: "Online Store", included: true, detail: "Orbit77.shop Active" },
      { name: "Credential System", included: true, detail: "Operational Funding" },
      { name: "Brand Identity", included: true, detail: "Complete Visual System" },
      { name: "Social Media", included: true, detail: "IG, TikTok" },
      { name: "Original Songs", included: true, detail: "Pablo & Eduardo Creation" },
      { name: "Payment Integration", included: true, detail: "Stripe Live Mode" },
      { name: "Technical Infrastructure", included: true, detail: "Domains, Hosting, DB, Drive" }
    ],
    next_steps: [
      "Produce Season 2 & 3",
      "Grow Social Media (TikTok, IG, Shorts)",
      "Monetize Platforms (YouTube, Spotify, Sponsors)",
      "Grow Merch Sales (Apparel, Hats, Accessories)",
      "Open Physical Store & Studio"
    ],
    sphereClass: "bg-[radial-gradient(circle_at_30%_30%,#FFFFFF,#E8E9E8,#C8C9C8)] shadow-[-10px_10px_20px_rgba(0,0,0,0.15)]",
    position: { top: "30%", left: "30%" },
  },
  {
    id: "ethernicapsule",
    name: "EterniCapsule",
    type: "Digital Vault",
    founders: "Eduardo Díaz",
    product_name: "Capsule Sealing",
    price: "$9 AUD",
    valuation: "$4,000 AUD",
    available_pct: 100,
    pyadra_fee: "$1 of every $9 AUD",
    description: "A vault for words you cannot say today. Write them, seal them, choose when they open.",
    experience_today: "Seal your message in cryptographic metal. Zero-knowledge encryption. Only your recipient can open it.",
    enter_url: "/exhibitions/galaxy/ethernicapsule",
    traction: [
      { label: "Capsules sealed", value: "Early Stage" },
      { label: "System status", value: "Operational" }
    ],
    income_potential: {
      value: "Revenue Today: Capsule Sealing ($9 AUD Each)",
      description: "Future Potential: Audio ($25), Video ($49), White-Label Licensing"
    },
    effort: {
      title: "Autonomous system.",
      description: "Lives on Pyadra infrastructure."
    },
    assets_included: [
      { name: "Web Platform", included: true, detail: "Frontend + Backend + Database" },
      { name: "3D Capsule Interface", included: true, detail: "Breathing Animations" },
      { name: "Brand Identity", included: true, detail: "Complete Ceremonial Design" },
      { name: "4 Core Screens", included: true, detail: "Compose, Preview, Seal, Unlock" },
      { name: "Automated Email System", included: true, detail: "Scheduled Delivery" },
      { name: "Payment Integration", included: true, detail: "Stripe Checkout" },
      { name: "Security Technology", included: true, detail: "Encrypted Messages" },
      { name: "Emergency Access", included: true, detail: "Guardian Unlock" }
    ],
    next_steps: [
      "Launch Audio Capsules (Voice + Transcription)",
      "Launch Video Capsules (AI-Generated Farewell)",
      "White-Label Licensing (Memorial, Therapy, Legal)",
      "User Dashboard (My Capsules)",
      "Multi-Language Support (English + Spanish)"
    ],
    sphereClass: "bg-[radial-gradient(circle_at_30%_30%,#FFFFFF,#D4DDD6,#A0A0A0)] shadow-[-10px_10px_20px_rgba(0,0,0,0.1)]",
    position: { top: "30%", left: "70%" },
  },
  {
    id: "figurines",
    name: "Figurines",
    type: "Physical Product",
    founders: "Eduardo Díaz",
    product_name: "Personalized Figurine",
    price: "$99 AUD",
    valuation: "$5,000 AUD",
    available_pct: 100,
    pyadra_fee: "To be defined",
    description: "A physical and collectible version of yourself — created with AI, 3D printed, shipped to your door.",
    experience_today: "Order your personalized 3D figurine. Upload photos, customize design, receive a physical collectible.",
    enter_url: "/exhibitions/galaxy/figurines",
    traction: [
      { label: "Prototypes", value: "2 created" },
      { label: "Store status", value: "In development" }
    ],
    income_potential: {
      value: "Revenue Today: Personalized Figurines ($99 Each)",
      description: "Future Potential: Profession Collections, Event Editions, B2B Wholesale"
    },
    effort: {
      title: "Manual production required.",
      description: "External operation (Shopify)."
    },
    assets_included: [
      { name: "Shopify Store", included: true, detail: "E-Commerce Platform" },
      { name: "AI Workflow", included: true, detail: "Photo to 3D Pipeline" },
      { name: "Production Guide", included: true, detail: "AI + Blender + Print Process" },
      { name: "Brand Identity", included: true, detail: "Logo, Visual System" },
      { name: "QR Integration", included: true, detail: "Physical to Pyadra Gateway" },
      { name: "Product Line Concepts", included: true, detail: "Profession, Events, Editions" },
      { name: "Payment System", included: true, detail: "Shopify Checkout" },
      { name: "Packaging Design", included: true, detail: "Unboxing Experience" }
    ],
    next_steps: [
      "Launch Shopify Store",
      "Acquire Color 3D Printer",
      "Launch Profession Collection (Pre-Designed)",
      "Event Editions (World Cup, Sports)",
      "B2B Wholesale Partnerships"
    ],
    sphereClass: "bg-[radial-gradient(circle_at_30%_30%,#3A4A3E,#1A1C1A,#050A07)] shadow-[-10px_10px_20px_rgba(0,0,0,0.25)]",
    position: { top: "70%", left: "30%" },
  },
  {
    id: "ebooks",
    name: "Ebooks",
    type: "Publishing",
    founders: "Eduardo Díaz",
    product_name: "First Book",
    price: "TBD",
    valuation: "$2,000 AUD",
    available_pct: 100,
    pyadra_fee: "To be defined",
    description: "Real stories transformed into narrative worlds. Not what happened — what it felt like.",
    experience_today: "Access early chapters and narrative concepts. Real experiences transformed into mythology.",
    enter_url: "/exhibitions/galaxy/ebooks",
    traction: [
      { label: "Book concepts", value: "2 developed" },
      { label: "Manuscript", value: "In development" }
    ],
    income_potential: {
      value: "Revenue Today: None Yet (Manuscript in Progress)",
      description: "Future Potential: Digital Sales, Physical Books, Exclusive Editions, Audio"
    },
    effort: {
      title: "Active writing required.",
      description: "External distribution (Amazon, etc)."
    },
    assets_included: [
      { name: "Book Concepts", included: true, detail: "2 Narrative Worlds Developed" },
      { name: "Narrative Philosophy", included: true, detail: "Real Experiences as Mythology" },
      { name: "Brand Identity", included: true, detail: "Editorial Visual System" },
      { name: "Source Material", included: true, detail: "Author's Real Experiences" },
      { name: "Publishing Workflow", included: true, detail: "External + Pyadra Exclusive" },
      { name: "Distribution Channels", included: true, detail: "Amazon + Pyadra Platform" },
      { name: "Exclusive Editions", included: true, detail: "Pyadra-Only Collectibles" },
      { name: "IP Rights", included: true, detail: "Full Copyright Included" }
    ],
    next_steps: [
      "Complete First Manuscript",
      "Publish on External Platform (Amazon)",
      "Launch Pyadra Exclusive Edition",
      "Audio Narration Production",
      "Illustrated Collector's Edition"
    ],
    sphereClass: "bg-[radial-gradient(circle_at_30%_30%,#059669,#047857,#0A120E)] shadow-[-10px_10px_20px_rgba(0,0,0,0.2)]",
    position: { top: "70%", left: "70%" },
  }
];

// -----------------------------------------------------------------------------
// COMPONENTS
// -----------------------------------------------------------------------------
function AnimatedNumber({ value }: { value: string }) {
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""));
  const prefix = value.includes("$") ? "$" : "";
  const suffix = value.includes("AUD") ? " AUD" : value.includes("%") ? "%" : "";
  
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    const duration = 800; // 0.8s
    
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(Math.floor(ease * numericValue));
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    if (numericValue > 0) {
      requestAnimationFrame(animate);
    }
  }, [numericValue]);

  if (numericValue === 0) return <span>{value}</span>;
  if (value.includes("available")) return <span>{displayValue}{suffix} available</span>;
  return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>;
}

function MagneticProject({ 
  children, 
  onClick 
}: { 
  children: React.ReactNode, 
  onClick: () => void 
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / 4);
    y.set((e.clientY - centerY) / 4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x: mouseX, y: mouseY }}
      className="relative flex flex-col items-center justify-center cursor-pointer group"
    >
      {children}
    </motion.div>
  );
}

const GemIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-[#059669] drop-shadow-md">
    <polygon points="50 5, 95 27.5, 95 72.5, 50 95, 5 72.5, 5 27.5" fill="currentColor" opacity="0.8"/>
    <polygon points="50 20, 75 35, 75 65, 50 80, 25 65, 25 35" fill="white" opacity="0.2"/>
    <polygon points="50 5, 95 27.5, 50 50, 5 27.5" fill="white" opacity="0.4"/>
    <polygon points="95 27.5, 95 72.5, 50 50" fill="black" opacity="0.1"/>
    <polygon points="5 27.5, 5 72.5, 50 50" fill="white" opacity="0.1"/>
  </svg>
);

// -----------------------------------------------------------------------------
// MAIN PAGE COMPONENT
// -----------------------------------------------------------------------------
export default function GalaxyExhibition() {
  const [mounted, setMounted] = useState(false);
  const [activeProject, setActiveProject] = useState<typeof PROJECTS[0] | null>(null);

  // Parallax mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Transform values for parallax (must be at top level)
  const gridX = useTransform(mouseX, (value) => value * 0.2);
  const gridY = useTransform(mouseY, (value) => value * 0.2);
  const ringsX = useTransform(mouseX, (value) => value * 0.5);
  const ringsY = useTransform(mouseY, (value) => value * 0.5);
  const gemX = useTransform(mouseX, (value) => -value * 0.3);
  const gemY = useTransform(mouseY, (value) => -value * 0.3);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX - innerWidth / 2) / innerWidth;
    const y = (clientY - innerHeight / 2) / innerHeight;
    mouseX.set(x * 20);
    mouseY.set(y * 20);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="min-h-screen bg-[#EDEFED] text-[#1A1C1A] font-sans flex flex-col relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >

      {/* ----------------------------------------------------------------------
          BACKGROUND TEXTURE & GRID (Visual Richness)
      ---------------------------------------------------------------------- */}
      {/* 1. Ambient Vignette */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-white/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-[#D4DDD6]/40 to-transparent"></div>
        <div className="absolute top-0 right-0 w-[50vw] h-full bg-gradient-to-l from-[#D4DDD6]/20 to-transparent"></div>
        <div className="absolute top-0 left-0 w-[50vw] h-full bg-gradient-to-r from-white/20 to-transparent"></div>
      </div>

      {/* 2. Architectural Blueprint Grid with parallax */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.25]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #D4DDD6 1px, transparent 1px),
            linear-gradient(to bottom, #D4DDD6 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          x: gridX,
          y: gridY,
        }}
      />
      
      {/* 3. Film Grain / Tactile Noise */}
      <div className="absolute inset-0 pointer-events-none z-0 mix-blend-multiply opacity-[0.4]">
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-60" preserveAspectRatio="none">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
        </svg>
      </div>

      {/* 4. Ambient Green Dust */}
      <GreenDust count={250} />

      {/* ----------------------------------------------------------------------
          HEADER - Fixed at top
      ---------------------------------------------------------------------- */}
      <header className="relative z-10 w-full px-4 md:px-8 py-4 md:py-6 flex justify-between items-center border-b border-[#D4DDD6]/30">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 md:w-8 md:h-8"><GemIcon /></div>
          <div>
            <div className="font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#1A1C1A]">GALAXY</div>
            <div className="font-mono text-[7px] md:text-[8px] tracking-widest uppercase text-[#059669]">ACTIVE PROJECTS</div>
            <div className="font-mono text-[7px] md:text-[8px] tracking-[0.3em] uppercase text-[#6B8070] mt-1">
              Explore. Participate. Own.
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4 md:gap-6">
          <a href="/exhibitions" className="group flex items-center py-2 px-1 -ml-1 font-mono text-[8px] md:text-[9px] uppercase tracking-widest text-[#3A4A3E] hover:text-[#1A1C1A] transition-colors">
            <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1 mr-1">←</span> Back
          </a>
          <div className="hidden md:block font-mono text-[9px] uppercase tracking-widest text-[#059669]">
            Exhibitions / Galaxy
          </div>
        </div>
      </header>

      {/* ----------------------------------------------------------------------
          MAIN CONTENT - Orbital Projects (Grid + Transform)
      ---------------------------------------------------------------------- */}
      <main className="relative z-10 flex-1 w-full px-4 md:px-8 lg:px-12 py-4 md:py-8 flex items-center justify-center">

        {/* Orbital Container - with decorative rings */}
        <div className="w-full max-w-[1200px] relative">

           {/* SVG Orbital Rings - Decorative background with parallax */}
           <motion.div
             className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 md:opacity-15"
             style={{
               x: ringsX,
               y: ringsY,
             }}
           >
              <svg viewBox="0 0 800 800" className="w-full h-full text-[#059669]">
                <circle cx="400" cy="400" r="140" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="400" cy="400" r="260" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="400" cy="400" r="380" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" />
              </svg>
           </motion.div>

           {/* Central Core Gem with subtle parallax */}
           <motion.div
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 z-10"
             style={{
               x: gemX,
               y: gemY,
             }}
           >
              <div className="absolute inset-0 bg-[#059669] blur-xl opacity-20 rounded-full"></div>
              <GemIcon />
           </motion.div>

           {/* Projects Grid - Base structure with orbital transforms */}
           <div className="grid grid-cols-2 gap-4 md:gap-8 lg:gap-12 p-4 md:p-6 lg:p-8">
             {PROJECTS.map((project, index) => {
               const transforms = {
                 orbit: "md:-translate-x-6 md:-translate-y-6 lg:-translate-x-8 lg:-translate-y-8",
                 ethernicapsule: "md:translate-x-6 md:-translate-y-6 lg:translate-x-8 lg:-translate-y-8",
                 figurines: "md:-translate-x-6 md:translate-y-6 lg:-translate-x-8 lg:translate-y-8",
                 ebooks: "md:translate-x-6 md:translate-y-6 lg:translate-x-8 lg:translate-y-8"
               };

               return (
                 <motion.div
                   key={project.id}
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
                   className={`transform ${transforms[project.id as keyof typeof transforms]} transition-transform duration-500`}
                 >
                   <MagneticProject onClick={() => setActiveProject(project)}>
                     {/* Project Type */}
                     <div className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-[#6B8070] mb-2 transition-colors duration-500 group-hover:text-[#1A1C1A]">
                       {project.type}
                     </div>

                     {/* Sphere - Clickable with Breathing Effect */}
                     <div className="relative mb-4">
                       {/* Breathing outer glow */}
                       <motion.div
                         animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
                         transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                         className={`absolute inset-0 rounded-full blur-xl ${project.id === 'orbit' ? 'bg-[#6B8070]' : project.id === 'ethernicapsule' ? 'bg-white' : project.id === 'figurines' ? 'bg-[#3A4A3E]' : 'bg-[#059669]'}`}
                       />
                       <div
                         className={`relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full ${project.sphereClass} transition-transform duration-500 group-hover:scale-105 group-hover:shadow-2xl overflow-hidden`}
                       >
                         {/* Logo inside sphere (only for Orbit) */}
                         {project.id === 'orbit' && project.logo && (
                           <div className="absolute inset-0 flex items-center justify-center">
                             {/* Light background behind logo for visibility */}
                             <div className="absolute w-16 h-16 md:w-18 md:h-18 lg:w-22 lg:h-22 rounded-full bg-white/20 blur-sm"></div>
                             <img
                               src={project.logo}
                               alt={project.name}
                               className="relative w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain opacity-70"
                             />
                             {/* Subtle depth overlay */}
                             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 rounded-full pointer-events-none"></div>
                           </div>
                         )}

                         {/* Subtle rotating inner highlight */}
                         <motion.div
                           animate={{ rotate: 360 }}
                           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                           className="absolute inset-0 opacity-30 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_180deg,rgba(255,255,255,0.2)_270deg,transparent_360deg)]"
                         />
                       </div>
                     </div>

                     {/* Project Name */}
                     <h3 className="font-serif text-xl md:text-2xl lg:text-3xl italic font-light text-[#1A1C1A] mb-2 text-center transition-transform duration-500 group-hover:scale-105">
                       {project.name}
                     </h3>

                     {/* Valuation Label */}
                     <div className="font-mono text-[7px] md:text-[8px] uppercase tracking-[0.3em] text-[#6B8070] mb-1">
                       Valuation
                     </div>

                     {/* Valuation Amount (Animated) */}
                     <div className="font-mono text-[10px] md:text-[11px] text-[#059669] font-bold mb-1">
                       <AnimatedNumber value={project.valuation} />
                     </div>

                     {/* Available % */}
                     <div className="font-mono text-[8px] text-[#059669]">
                       <AnimatedNumber value={`${project.available_pct}% available`} />
                     </div>
                   </MagneticProject>
                 </motion.div>
               );
             })}
           </div>
        </div>
      </main>

      {/* ----------------------------------------------------------------------
          FOOTER - Minimal Phase Info
      ---------------------------------------------------------------------- */}
      <footer className="relative z-10 w-full px-4 md:px-8 py-3 md:py-4 border-t border-[#D4DDD6]/30">
        <div className="flex justify-between items-center font-mono text-[7px] md:text-[8px] uppercase tracking-[0.3em] text-[#6B8070]">
          <div>PHASE 1 — ACTIVE <span className="mx-2 md:mx-3 text-[#D4DDD6]">|</span> PHASE 2 — Q4 2026</div>
          <div className="hidden md:block">PYADRA.IO</div>
        </div>
      </footer>

      {/* ----------------------------------------------------------------------
          PROJECT OVERLAY (Side Panel)
      ---------------------------------------------------------------------- */}
      <AnimatePresence>
        {activeProject && (
          <ProjectDetailPanel
            project={activeProject}
            onClose={() => setActiveProject(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

// -----------------------------------------------------------------------------
// PROJECT DETAIL PANEL COMPONENT
// -----------------------------------------------------------------------------
function ProjectDetailPanel({ project, onClose }: { project: typeof PROJECTS[0], onClose: () => void }) {
  const [doorMode, setDoorMode] = useState<"light" | "dark">("dark");
  const [showInterestForm, setShowInterestForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsExpanded, setTermsExpanded] = useState(false);
  const isLight = doorMode === "light";

  return (
    <>
      {/* Backdrop - lighter on desktop to see projects */}
      <motion.div
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        onClick={onClose}
        className="fixed inset-0 bg-[#1A1C1A]/20 lg:bg-[#1A1C1A]/10 z-40"
      />

      {/* Panel - Side Panel (50% width on desktop) */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 w-full lg:w-1/2 z-50 flex flex-col overflow-hidden bg-[#EDEFED] text-[#1A1C1A]"
      >

        {/* Header */}
        <div className="p-4 md:p-5 flex justify-between items-start shrink-0">
          <div>
            <div className={`font-mono text-[9px] mb-2 uppercase tracking-[0.3em] ${isLight ? 'text-[#6B8070]' : 'text-[#6B8070]'}`}>{project.type}</div>
            <h2 className="font-serif text-3xl md:text-4xl italic font-light">{project.name}</h2>
            {project.founders && (
              <div className={`font-mono text-[9px] mt-2 uppercase tracking-[0.3em] ${isLight ? 'text-[#6B8070]' : 'text-[#6B8070]'}`}>
                {project.founders}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className={`group w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-300 ${
              isLight ? "border-[#D4DDD6] hover:bg-white" : "border-[#A8A9A8] hover:bg-[#D8D9D8]"
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="transition-transform duration-500 ease-out group-hover:rotate-90">
              <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.2 }
            }
          }}
          className="flex-1 overflow-y-auto px-4 md:px-5 pb-20"
        >

           {showInterestForm ? (
             /* Express Interest Form */
             <ExpressInterestForm
               project={project}
               onBack={() => {
                 setShowInterestForm(false);
                 setFormSubmitted(false);
               }}
               isSubmitting={isSubmitting}
               setIsSubmitting={setIsSubmitting}
               formSubmitted={formSubmitted}
               setFormSubmitted={setFormSubmitted}
             />
           ) : (
             <>
               {/* Description - No Logo */}
               <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className={`font-sans text-sm leading-normal mb-4 ${isLight ? 'text-[#3A4A3E]' : 'text-[#6B8070]'}`}>
                 {project.description}
               </motion.p>

               {/* Tab Toggle */}
               <div className="flex items-center p-1 rounded-full w-fit mx-auto mb-5 border bg-[#E8E9E8] border-[#D4DDD6] transition-colors duration-500">
                 <button
                   onClick={() => setDoorMode("dark")}
                   className={`relative px-6 py-2 rounded-full font-mono text-[9px] uppercase tracking-widest transition-colors duration-300 ${!isLight ? 'text-white' : 'text-[#6B8070] hover:text-[#1A1C1A]'}`}
                 >
                   {!isLight && (
                     <motion.div
                       layoutId="active-tab"
                       className="absolute inset-0 bg-[#059669] rounded-full shadow-md"
                       transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                     />
                   )}
                   <span className="relative z-10">Own the Project</span>
                 </button>
                 <button
                   onClick={() => setDoorMode("light")}
                   className={`relative px-6 py-2 rounded-full font-mono text-[9px] uppercase tracking-widest transition-colors duration-300 ${isLight ? 'text-white' : 'text-[#6B8070] hover:text-[#1A1C1A]'}`}
                 >
                   {isLight && (
                     <motion.div
                       layoutId="active-tab"
                       className="absolute inset-0 bg-[#059669] rounded-full shadow-md"
                       transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                     />
                   )}
                   <span className="relative z-10">The Product</span>
                 </button>
               </div>

           {/* Dynamic Content based on Tab */}
           <AnimatePresence mode="wait">
             {!isLight ? (
               <motion.div key="dark" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>

                 {/* Project Valuation - Clean Display */}
                 <div className="bg-[#F7FAF8] border-l-4 border-l-[#059669] rounded-lg p-3.5 mb-3 shadow-sm">
                   <div className="flex items-center justify-between">
                     <div>
                       <div className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#059669] mb-1.5 font-bold flex items-center gap-1.5">
                         <span className="text-sm">💎</span> PROJECT VALUATION
                       </div>
                       <div className="font-serif text-xl text-[#1A1C1A] font-bold"><AnimatedNumber value={project.valuation} /></div>
                     </div>
                     <div className="text-right">
                       <div className="font-mono text-[7px] uppercase tracking-[0.3em] text-[#6B8070] mb-1">AVAILABLE</div>
                       <div className="font-serif text-lg text-[#059669] font-bold">{project.available_pct}%</div>
                     </div>
                   </div>
                 </div>

                 {/* What's Included */}
                 <div className="mb-3">
                   <div className="text-[8px] font-mono text-[#6B8070] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                     <span className="text-sm">📋</span> WHAT'S INCLUDED
                   </div>
                   <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                     {project.assets_included.map((asset, idx) => (
                       <div key={idx} className="flex items-start gap-1.5 text-xs">
                         <span className="text-[#059669] mt-0.5 text-xs">✓</span>
                         <div className="flex-1">
                           <span className="text-[#1A1C1A]">{asset.name}</span>
                           {asset.detail && <span className="text-[#6B8070] text-[10px] ml-1">({asset.detail})</span>}
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Revenue */}
                 <div className="mb-3">
                   <div className="text-[8px] font-mono text-[#6B8070] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                     <span className="text-sm">💰</span> REVENUE
                   </div>
                   <div className="font-serif text-base text-[#059669] mb-0.5">{project.income_potential.value}</div>
                   <div className="text-[10px] text-[#6B8070]">{project.income_potential.description}</div>
                 </div>

                 {/* Next Steps */}
                 <div className="mb-3">
                   <div className="text-[8px] font-mono text-[#6B8070] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                     <span className="text-sm">📈</span> NEXT STEPS
                   </div>
                   <div className="space-y-1">
                     {project.next_steps.map((step, idx) => (
                       <div key={idx} className="flex items-start gap-2 text-xs text-[#6B8070]">
                         <span className="text-[#059669] mt-0.5">{idx + 1}.</span>
                         <span>{step}</span>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Acquisition Terms - Collapsible */}
                 <div className="pt-3 border-t border-[#A8A9A8]">
                   <button
                     onClick={() => setTermsExpanded(!termsExpanded)}
                     className="w-full flex items-center justify-between text-[8px] font-mono text-[#6B8070] uppercase tracking-widest mb-2 opacity-60 hover:opacity-100 transition-opacity"
                   >
                     <span>Acquisition terms</span>
                     <span className="text-sm">{termsExpanded ? '−' : '+'}</span>
                   </button>

                   {termsExpanded && (
                     <motion.div
                       initial={{ opacity: 0, height: 0 }}
                       animate={{ opacity: 1, height: 'auto' }}
                       exit={{ opacity: 0, height: 0 }}
                       transition={{ duration: 0.2 }}
                     >
                       {/* Participation model */}
                       <div className="mb-2">
                         <div className="text-[10px] text-[#6B8070] mb-1">Available: Partial acquisition ({project.available_pct}%)</div>
                         <div className="text-[9px] text-[#6B8070] opacity-60">Revenue share proportional to stake. Founders retain {100 - project.available_pct}%.</div>
                       </div>

                       {/* Effort + Fee in small grid */}
                       <div className="grid grid-cols-2 gap-3 text-[9px] text-[#6B8070] opacity-75">
                         <div>
                           <div className="font-mono uppercase tracking-wider mb-1 opacity-60">Effort</div>
                           <div>{project.effort.title}</div>
                         </div>
                         <div>
                           <div className="font-mono uppercase tracking-wider mb-1 opacity-60">Pyadra fee</div>
                           <div>{project.pyadra_fee}</div>
                         </div>
                       </div>
                     </motion.div>
                   )}
                 </div>

               </motion.div>
             ) : (
               <motion.div key="light" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                 <div className="font-mono text-[8px] uppercase tracking-widest text-[#059669] mb-2.5 font-bold flex items-center gap-2">
                   <span className="text-sm">🎯</span> WHAT YOU CAN DO TODAY
                 </div>
                 <p className="text-sm text-[#3A4A3E] leading-normal mb-4">
                   {project.experience_today}
                 </p>

                 {/* Product Info - Clean Display */}
                 <div className="bg-[#F7FAF8] border-l-4 border-l-[#059669] rounded-lg p-3.5 mb-3 shadow-sm">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2.5">
                       <span className="text-xl">📦</span>
                       <div>
                         <div className="font-mono text-[7px] uppercase tracking-[0.3em] text-[#6B8070] mb-0.5">PRODUCT</div>
                         <div className="font-serif text-sm text-[#1A1C1A] font-medium">{project.product_name}</div>
                       </div>
                     </div>
                     <div className="text-right">
                       <div className="font-mono text-[7px] uppercase tracking-[0.3em] text-[#6B8070] mb-0.5">PRICE</div>
                       <div className="font-serif text-sm text-[#059669] font-semibold">{project.price}</div>
                     </div>
                   </div>
                 </div>

                 <div className="space-y-2.5">
                   <div className="font-mono text-[8px] uppercase tracking-widest text-[#059669] mb-1.5 font-bold flex items-center gap-2">
                     <span className="text-sm">📊</span> CURRENT STATUS
                   </div>
                   <div className="grid grid-cols-2 gap-2.5">
                     {project.traction.map(t => (
                       <div key={t.label} className="bg-[#F7FAF8] rounded-lg p-3 shadow-sm">
                         <div className="font-serif text-base text-[#1A1C1A] mb-0.5 font-medium">{t.value}</div>
                         <div className="text-[7px] text-[#6B8070] uppercase tracking-[0.3em] font-bold">{t.label}</div>
                       </div>
                     ))}
                   </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
             </>
           )}

        </motion.div>

        {/* Fixed Bottom Actions - Minimal Accent Bars */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 border-t backdrop-blur-md bg-[#EDEFED]/90 border-[#D4DDD6]">
          <div className="flex gap-2.5">
            {/* Explore - Left (Principal Action) */}
            <button
              onClick={() => window.location.href = project.enter_url}
              className="w-full text-left pl-4 pr-3 py-3 border-l-4 border-l-[#059669] flex items-center justify-between group transition-all duration-300 rounded-r-lg hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg cursor-pointer"
              style={{ background: 'linear-gradient(to right, rgba(5, 150, 105, 0.25), transparent 70%)' }}
            >
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#059669] font-bold">
                Explore {project.name}
              </span>
              <span className="text-[#059669] text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>

            {/* Express Interest - Right (Secondary Action) */}
            <button
              onClick={() => setShowInterestForm(true)}
              className="w-full text-left pl-4 pr-3 py-3 border-l-4 border-l-[#047857] flex items-center justify-between group transition-all duration-300 rounded-r-lg hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg cursor-pointer"
              style={{ background: 'linear-gradient(to right, rgba(4, 120, 87, 0.20), transparent 70%)' }}
            >
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#047857] font-bold">
                Express Interest
              </span>
              <span className="text-[#047857] text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>

      </motion.div>
    </>
  );
}

// -----------------------------------------------------------------------------
// EXPRESS INTEREST FORM COMPONENT
// -----------------------------------------------------------------------------
function ExpressInterestForm({
  project,
  onBack,
  isSubmitting,
  setIsSubmitting,
  formSubmitted,
  setFormSubmitted,
}: {
  project: typeof PROJECTS[0];
  onBack: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (val: boolean) => void;
  formSubmitted: boolean;
  setFormSubmitted: (val: boolean) => void;
}) {
  const [formData, setFormData] = useState({
    model: "",
    name: "",
    email: "",
    message: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.model || !formData.name || !formData.email) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "express-interest",
          project: project.name,
          model: formData.model,
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send");
      }

      setFormSubmitted(true);
    } catch (err) {
      setError("Failed to send. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (formSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[400px] text-center px-4"
      >
        <div className="w-16 h-16 rounded-full bg-[#ECFDF5] border-4 border-[#059669] flex items-center justify-center text-[#059669] text-2xl mb-5 shadow-sm">
          ✓
        </div>
        <h3 className="font-serif text-2xl italic font-light text-[#1A1C1A] mb-3">
          <span className="text-[#059669]">Interest Recorded</span>
        </h3>
        <p className="text-sm text-[#3A4A3E] leading-normal max-w-md mb-6">
          Eduardo will contact you personally within 48 hours to discuss <span className="text-[#059669] font-medium">{project.name}</span>.
        </p>
        <button
          onClick={onBack}
          className="group px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 bg-[#F7FAF8] border-2 border-[#059669] text-[#059669] font-mono text-[8px] uppercase tracking-widest hover:bg-[#059669] hover:text-white transition-all shadow-sm"
        >
          <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">←</span>
          <span>Back to {project.name}</span>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="group flex items-center py-2 px-1 -ml-1 text-[#6B8070] hover:text-[#1A1C1A] transition-colors mb-5 font-mono text-[8px] uppercase tracking-widest"
      >
        <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1 mr-1">←</span> Back
      </button>

      {/* Header */}
      <div className="mb-6 pb-4 border-b-2 border-[#059669]/20">
        <h3 className="font-serif text-2xl italic font-light text-[#1A1C1A] mb-2">
          Express Interest
        </h3>
        <p className="text-sm text-[#3A4A3E] leading-normal">
          Tell us about your interest in <span className="text-[#059669] font-medium">{project.name}</span>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Model Selection */}
        <div>
          <label className="block font-mono text-[8px] uppercase tracking-widest text-[#059669] mb-2.5 flex items-center gap-1.5">
            <span className="text-sm">🤝</span> What are you looking for? *
          </label>
          <div className="space-y-2.5">
            {[
              {
                value: "Partner — share revenue",
                label: "Partner — Share Revenue",
                icon: "🤝"
              },
              {
                value: "Own — take it completely",
                label: "Own It — Take It Completely",
                icon: "💎"
              },
              {
                value: "Host — own it, Pyadra runs it",
                label: "Host It — Own It, Pyadra Runs It",
                icon: "🏛️"
              },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 p-3.5 border-l-4 rounded-lg cursor-pointer transition-colors ${
                  formData.model === option.value
                    ? "border-l-[#059669] bg-[#ECFDF5] shadow-sm"
                    : "border-l-[#059669]/30 bg-[#F7FAF8] hover:border-l-[#059669]/60"
                }`}
              >
                <input
                  type="radio"
                  name="model"
                  value={option.value}
                  checked={formData.model === option.value}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  className="w-4 h-4 text-[#059669]"
                />
                <span className="text-base">{option.icon}</span>
                <span className="text-sm text-[#1A1C1A]">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block font-mono text-[8px] uppercase tracking-widest text-[#059669] mb-2 flex items-center gap-1.5">
            <span className="text-sm">👤</span> Your Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 border-l-4 border-l-[#059669]/30 border border-[#D4DDD6] rounded-lg focus:border-[#059669] focus:border-l-[#059669] focus:outline-none transition-colors bg-[#F7FAF8] text-[#1A1C1A] text-sm"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-mono text-[8px] uppercase tracking-widest text-[#059669] mb-2 flex items-center gap-1.5">
            <span className="text-sm">📧</span> Your Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2.5 border-l-4 border-l-[#059669]/30 border border-[#D4DDD6] rounded-lg focus:border-[#059669] focus:border-l-[#059669] focus:outline-none transition-colors bg-[#F7FAF8] text-[#1A1C1A] text-sm"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label className="block font-mono text-[8px] uppercase tracking-widest text-[#059669] mb-2 flex items-center gap-1.5">
            <span className="text-sm">💬</span> Message (Optional)
          </label>
          <textarea
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-2.5 border-l-4 border-l-[#059669]/30 border border-[#D4DDD6] rounded-lg focus:border-[#059669] focus:border-l-[#059669] focus:outline-none transition-colors bg-[#F7FAF8] text-[#1A1C1A] text-sm resize-none"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 border-l-4 border-l-red-500 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-lg bg-[#059669] text-white font-mono text-[9px] uppercase tracking-widest shadow-md hover:bg-[#047857] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : "Submit Interest →"}
        </button>
      </form>
    </motion.div>
  );
}
