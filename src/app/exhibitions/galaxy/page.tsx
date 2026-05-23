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
      value: "Active: Credentials ($10–50) + Merchandise",
      description: "Potential: YouTube AdSense, Spotify, sponsorships, Season 2+ credentials"
    },
    effort: {
      title: "Active podcast production.",
      description: "Lives on Pyadra infrastructure."
    },
    assets_included: [
      { name: "YouTube & Spotify", included: true, detail: "10 episodes published" },
      { name: "Online Store", included: true, detail: "orbit77.shop active" },
      { name: "Credential", included: true, detail: "Operational funding system" },
      { name: "Brand Identity", included: true, detail: "Complete visual system" },
      { name: "Social Media", included: true, detail: "IG, TikTok" },
      { name: "Original Songs", included: true, detail: "Pablo & Eduardo creation" },
      { name: "Payment Integration", included: true, detail: "Stripe live mode" },
      { name: "Technical Infrastructure", included: true, detail: "Domains, hosting, DB, Drive" }
    ],
    next_steps: [
      "Produce Season 2 & 3",
      "Grow social media (TikTok, IG, Shorts)",
      "Monetize platforms (YouTube, Spotify, sponsors)",
      "Grow merch sales (apparel, hats, accessories)",
      "Open physical store & studio"
    ],
    sphereClass: "bg-[radial-gradient(circle_at_30%_30%,#6B8070,#1A1C1A,#0A120E)] shadow-[-10px_10px_20px_rgba(0,0,0,0.2)]",
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
      value: "Active: Capsule sealing ($9 AUD each)",
      description: "Potential: Audio ($25), Video ($49), white-label licensing"
    },
    effort: {
      title: "Autonomous system.",
      description: "Lives on Pyadra infrastructure."
    },
    assets_included: [
      { name: "Web Platform", included: true, detail: "Frontend + backend + database" },
      { name: "3D Capsule Interface", included: true, detail: "Breathing animations" },
      { name: "Brand Identity", included: true, detail: "Complete ceremonial design" },
      { name: "4 Core Screens", included: true, detail: "Compose, preview, seal, unlock" },
      { name: "Automated Email System", included: true, detail: "Scheduled delivery" },
      { name: "Payment Integration", included: true, detail: "Stripe checkout" },
      { name: "Security Technology", included: true, detail: "Encrypted messages" },
      { name: "Emergency Access", included: true, detail: "Guardian unlock" }
    ],
    next_steps: [
      "Launch audio capsules (voice + transcription)",
      "Launch video capsules (AI-generated farewell)",
      "White-label licensing (memorial, therapy, legal)",
      "User dashboard (My Capsules)",
      "Multi-language support (English + Spanish)"
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
      value: "Active: Personalized figurines ($99 each)",
      description: "Potential: Profession collections, event editions, B2B wholesale"
    },
    effort: {
      title: "Manual production required.",
      description: "External operation (Shopify)."
    },
    assets_included: [
      { name: "Shopify Store", included: true, detail: "E-commerce platform" },
      { name: "AI Workflow", included: true, detail: "Photo to 3D pipeline" },
      { name: "Production Guide", included: true, detail: "AI + Blender + print process" },
      { name: "Brand Identity", included: true, detail: "Logo, visual system" },
      { name: "QR Integration", included: true, detail: "Physical to Pyadra gateway" },
      { name: "Product Line Concepts", included: true, detail: "Profession, events, editions" },
      { name: "Payment System", included: true, detail: "Shopify checkout" },
      { name: "Packaging Design", included: true, detail: "Unboxing experience" }
    ],
    next_steps: [
      "Launch Shopify store",
      "Acquire color 3D printer",
      "Launch profession collection (pre-designed)",
      "Event editions (World Cup, sports)",
      "B2B wholesale partnerships"
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
      value: "Active: None yet (manuscript in progress)",
      description: "Potential: Digital sales, physical books, exclusive editions, audio"
    },
    effort: {
      title: "Active writing required.",
      description: "External distribution (Amazon, etc)."
    },
    assets_included: [
      { name: "Book Concepts", included: true, detail: "2 narrative worlds developed" },
      { name: "Narrative Philosophy", included: true, detail: "Real experiences as mythology" },
      { name: "Brand Identity", included: true, detail: "Editorial visual system" },
      { name: "Source Material", included: true, detail: "Author's real experiences" },
      { name: "Publishing Workflow", included: true, detail: "External + Pyadra exclusive" },
      { name: "Distribution Channels", included: true, detail: "Amazon + Pyadra platform" },
      { name: "Exclusive Editions", included: true, detail: "Pyadra-only collectibles" },
      { name: "IP Rights", included: true, detail: "Full copyright included" }
    ],
    next_steps: [
      "Complete first manuscript",
      "Publish on external platform (Amazon)",
      "Launch Pyadra exclusive edition",
      "Audio narration production",
      "Illustrated collector's edition"
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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#EDEFED] text-[#1A1C1A] font-sans flex flex-col relative overflow-hidden">

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

      {/* 2. Architectural Blueprint Grid */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.25]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #D4DDD6 1px, transparent 1px),
            linear-gradient(to bottom, #D4DDD6 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
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
      <GreenDust count={100} />

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

           {/* SVG Orbital Rings - Decorative background */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 md:opacity-15">
              <svg viewBox="0 0 800 800" className="w-full h-full text-[#059669]">
                <circle cx="400" cy="400" r="140" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="400" cy="400" r="260" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="400" cy="400" r="380" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" />
              </svg>
           </div>

           {/* Central Core Gem */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 z-10">
              <div className="absolute inset-0 bg-[#059669] blur-xl opacity-20 rounded-full"></div>
              <GemIcon />
           </div>

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
  const [doorMode, setDoorMode] = useState<"light" | "dark">("light");
  const [showInterestForm, setShowInterestForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        className={`fixed right-0 top-0 bottom-0 w-full lg:w-1/2 z-50 flex flex-col overflow-hidden transition-colors duration-700 ${
          isLight ? "bg-[#EDEFED] text-[#1A1C1A]" : "bg-[#C8C9C8] text-[#1A1C1A]"
        }`}
      >

        {/* Header */}
        <div className="p-6 md:p-8 flex justify-between items-start shrink-0">
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
          className="flex-1 overflow-y-auto px-6 md:px-8 pb-28"
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
               {/* Project Logo or Icon - Compact */}
               <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } } }} className="w-full max-w-[120px] mx-auto mb-6 flex items-center justify-center">
                  {project.logo ? (
                    <img src={project.logo} alt={`${project.name} logo`} className="w-full h-auto" />
                  ) : (
                    <div className="w-16 h-16"><GemIcon /></div>
                  )}
               </motion.div>

               <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className={`font-sans text-sm leading-relaxed mb-8 ${isLight ? 'text-[#3A4A3E]' : 'text-[#6B8070]'}`}>
                 {project.description}
               </motion.p>

               {/* Tab Toggle */}
               <div className={`flex items-center p-1 rounded-full w-fit mx-auto mb-10 border transition-colors duration-500 ${isLight ? 'bg-white border-[#D4DDD6]' : 'bg-[#D8D9D8] border-[#A8A9A8]'}`}>
                 <button
                   onClick={() => setDoorMode("light")}
                   className={`relative px-6 py-2 rounded-full font-mono text-[9px] uppercase tracking-widest transition-colors duration-300 ${isLight ? 'text-[#1A1C1A]' : 'text-[#6B8070] hover:text-[#1A1C1A]'}`}
                 >
                   {isLight && (
                     <motion.div
                       layoutId="active-tab"
                       className="absolute inset-0 bg-[#EDEFED] rounded-full shadow-sm"
                       transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                     />
                   )}
                   <span className="relative z-10">Experience</span>
                 </button>
                 <button
                   onClick={() => setDoorMode("dark")}
                   className={`relative px-6 py-2 rounded-full font-mono text-[9px] uppercase tracking-widest transition-colors duration-300 ${!isLight ? 'text-[#1A1C1A]' : 'text-[#6B8070] hover:text-[#1A1C1A]'}`}
                 >
                   {!isLight && (
                     <motion.div
                       layoutId="active-tab"
                       className="absolute inset-0 bg-[#B8B9B8] rounded-full shadow-sm"
                       transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                     />
                   )}
                   <span className="relative z-10">Acquire</span>
                 </button>
               </div>

           {/* Dynamic Content based on Tab */}
           <AnimatePresence mode="wait">
             {isLight ? (
               <motion.div key="light" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                 <div className="font-mono text-[10px] uppercase tracking-widest text-[#059669] mb-4 flex items-center gap-2 font-bold">
                   <span className="text-xl">•</span> WHAT YOU CAN DO TODAY
                 </div>
                 <p className="text-sm text-[#3A4A3E] leading-relaxed mb-10">
                   {project.experience_today}
                 </p>

                 {/* Product Card - Compact */}
                 <div className="relative bg-gradient-to-br from-[#ECFDF5] via-white to-[#F0FDF4] border-2 border-[#D4DDD6] border-l-[6px] border-l-[#059669] rounded-2xl p-5 mb-6 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
                   {/* Decorative corner accent */}
                   <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#059669] opacity-40"></div>

                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#059669] to-[#10B981] flex items-center justify-center text-white text-lg shadow-md shadow-[#059669]/30">✦</div>
                       <div>
                         <div className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#059669] mb-1 font-bold">PRODUCT</div>
                         <div className="font-serif text-base text-[#1A1C1A] font-medium">{project.product_name}</div>
                       </div>
                     </div>
                     <div className="text-right">
                       <div className="font-mono text-[7px] uppercase tracking-[0.3em] text-[#6B8070] mb-1">PRICE</div>
                       <div className="font-serif text-base text-[#059669] font-semibold">{project.price}</div>
                     </div>
                   </div>
                 </div>

                 <div className="space-y-3">
                   <div className="font-mono text-[9px] uppercase tracking-widest text-[#059669] mb-2 flex items-center gap-2 font-bold">
                     <span className="text-lg">•</span> CURRENT STATUS
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                     {project.traction.map(t => (
                       <div key={t.label} className="relative bg-white border-2 border-[#D4DDD6] rounded-xl p-4 shadow-md hover:shadow-lg hover:border-[#10B981] hover:scale-[1.02] transition-all duration-300 overflow-hidden group">
                         {/* Hover gradient overlay */}
                         <div className="absolute inset-0 bg-gradient-to-br from-[#ECFDF5]/0 to-[#ECFDF5]/0 group-hover:from-[#ECFDF5]/40 group-hover:to-transparent transition-all duration-300"></div>
                         <div className="relative">
                           <div className="font-serif text-lg text-[#1A1C1A] mb-1 font-medium">{t.value}</div>
                           <div className="text-[8px] text-[#6B8070] uppercase tracking-[0.3em] font-bold">{t.label}</div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               </motion.div>
             ) : (
               <motion.div key="dark" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>

                 {/* Project Valuation - Compact */}
                 <div className="relative bg-gradient-to-br from-[#D8D9D8] via-[#CCCCCC] to-[#BEBEBE] border-2 border-[#A8A9A8] border-l-[6px] border-l-[#059669] rounded-2xl p-5 mb-6 shadow-lg hover:shadow-xl transition-all duration-300">
                   {/* Decorative corner accent */}
                   <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#059669] opacity-50"></div>

                   <div className="flex items-center justify-between">
                     <div>
                       <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#059669] mb-2 flex items-center gap-2 font-bold">
                         <span className="text-lg">•</span> PROJECT VALUATION
                       </div>
                       <div className="font-serif text-2xl text-[#1A1C1A] font-bold"><AnimatedNumber value={project.valuation} /></div>
                     </div>
                     <div className="text-right">
                       <div className="font-mono text-[7px] uppercase tracking-[0.3em] text-[#6B8070] mb-1">AVAILABLE</div>
                       <div className="font-serif text-xl text-[#059669] font-bold">{project.available_pct}%</div>
                     </div>
                   </div>
                 </div>

                 {/* What's Included */}
                 <div className="mb-6">
                   <div className="text-[9px] font-mono text-[#6B8070] uppercase tracking-widest mb-3">WHAT'S INCLUDED</div>
                   <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                     {project.assets_included.map((asset, idx) => (
                       <div key={idx} className="flex items-start gap-2 text-sm">
                         <span className="text-[#10B981] mt-0.5 text-xs">✓</span>
                         <div className="flex-1">
                           <span className="text-[#1A1C1A]">{asset.name}</span>
                           {asset.detail && <span className="text-[#6B8070] text-xs ml-1">({asset.detail})</span>}
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Income Potential */}
                 <div className="mb-6">
                   <div className="text-[9px] font-mono text-[#6B8070] uppercase tracking-widest mb-2">Income potential</div>
                   <div className="font-serif text-lg text-[#10B981] mb-1">{project.income_potential.value}</div>
                   <div className="text-xs text-[#6B8070]">{project.income_potential.description}</div>
                 </div>

                 {/* Next Steps */}
                 <div className="mb-6">
                   <div className="text-[9px] font-mono text-[#6B8070] uppercase tracking-widest mb-3">NEXT STEPS</div>
                   <div className="space-y-2">
                     {project.next_steps.map((step, idx) => (
                       <div key={idx} className="flex items-start gap-3 text-sm text-[#6B8070]">
                         <span className="text-[#059669] mt-0.5">{idx + 1}.</span>
                         <span>{step}</span>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Acquisition Terms - Discrete */}
                 <div className="pt-4 border-t border-[#A8A9A8]">
                   <div className="text-[8px] font-mono text-[#6B8070] uppercase tracking-widest mb-3 opacity-60">Acquisition terms</div>

                   {/* Participation model */}
                   <div className="mb-3">
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
                 </div>

               </motion.div>
             )}
           </AnimatePresence>
             </>
           )}

        </motion.div>

        {/* Fixed Bottom Actions - Dual Doors */}
        <div className={`absolute bottom-0 left-0 right-0 p-6 border-t backdrop-blur-md ${isLight ? 'bg-[#EDEFED]/90 border-[#D4DDD6]' : 'bg-[#C8C9C8]/90 border-[#A8A9A8]'}`}>
          <div className="flex gap-3">
            {/* Light Door - Enter the Project */}
            <button
              onClick={() => window.location.href = project.enter_url}
              className="relative group flex-1 py-4 rounded-xl flex items-center justify-center gap-2 text-xs font-mono tracking-widest uppercase transition-all duration-300 active:scale-[0.98] bg-[#059669] text-white hover:bg-[#047857] shadow-lg shadow-[#059669]/20 hover:shadow-[#059669]/30 overflow-hidden"
            >
              <span className="relative z-10">Enter the project</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
              {/* Shimmer Effect */}
              <motion.div 
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
                className="absolute inset-0 z-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
            </button>

            {/* Dark Door - Buy the Project */}
            <button
              onClick={() => setShowInterestForm(true)}
              className="group flex-1 py-4 rounded-xl flex items-center justify-center gap-2 text-xs font-mono tracking-widest uppercase transition-all duration-300 active:scale-[0.98] bg-[#0A120E] text-[#059669] hover:bg-[#1A261D] border border-[#1A261D] hover:shadow-lg hover:shadow-black/10"
            >
              <span>Express interest</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
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
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#059669] to-[#10B981] flex items-center justify-center text-white text-3xl mb-6 shadow-lg">
          ✓
        </div>
        <h3 className="font-serif text-2xl md:text-3xl italic font-light text-[#1A1C1A] mb-4">
          Interest Recorded
        </h3>
        <p className="text-sm text-[#3A4A3E] leading-relaxed max-w-md mb-8">
          Eduardo will contact you personally within 48 hours to discuss {project.name}.
        </p>
        <button
          onClick={onBack}
          className="group px-6 py-3 rounded-xl flex items-center justify-center gap-2 bg-[#EDEFED] border-2 border-[#D4DDD6] text-[#1A1C1A] font-mono text-[9px] uppercase tracking-widest hover:bg-white transition-colors"
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
        className="group flex items-center py-2 px-1 -ml-1 text-[#6B8070] hover:text-[#1A1C1A] transition-colors mb-6 font-mono text-[9px] uppercase tracking-widest"
      >
        <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1 mr-1">←</span> Back
      </button>

      {/* Header */}
      <div className="mb-8">
        <h3 className="font-serif text-3xl md:text-4xl italic font-light text-[#1A1C1A] mb-2">
          Express Interest
        </h3>
        <p className="text-sm text-[#3A4A3E]">
          Tell us about your interest in {project.name}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Model Selection */}
        <div>
          <label className="block font-mono text-[9px] uppercase tracking-widest text-[#6B8070] mb-3">
            What are you looking for? *
          </label>
          <div className="space-y-3">
            {[
              {
                value: "Partner — share revenue",
                label: "I want to be a partner — share revenue",
              },
              {
                value: "Own — take it completely",
                label: "I want to own it — take it completely",
              },
              {
                value: "Host — own it, Pyadra runs it",
                label: "I want to host it — own it, Pyadra runs it",
              },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.model === option.value
                    ? "border-[#059669] bg-gradient-to-br from-[#ECFDF5] to-white shadow-md"
                    : "border-[#D4DDD6] bg-white hover:border-[#10B981]"
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
                <span className="text-sm text-[#1A1C1A]">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block font-mono text-[9px] uppercase tracking-widest text-[#6B8070] mb-2">
            Your name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border-2 border-[#D4DDD6] rounded-xl focus:border-[#059669] focus:outline-none transition-colors bg-white text-[#1A1C1A]"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-mono text-[9px] uppercase tracking-widest text-[#6B8070] mb-2">
            Your email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border-2 border-[#D4DDD6] rounded-xl focus:border-[#059669] focus:outline-none transition-colors bg-white text-[#1A1C1A]"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label className="block font-mono text-[9px] uppercase tracking-widest text-[#6B8070] mb-2">
            Message (optional)
          </label>
          <textarea
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            rows={4}
            className="w-full px-4 py-3 border-2 border-[#D4DDD6] rounded-xl focus:border-[#059669] focus:outline-none transition-colors bg-white text-[#1A1C1A] resize-none"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl bg-gradient-to-br from-[#059669] to-[#10B981] text-white font-mono text-[10px] uppercase tracking-widest shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : "Submit Interest →"}
        </button>
      </form>
    </motion.div>
  );
}
