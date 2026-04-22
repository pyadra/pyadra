"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import ProjectNav from "../components/ProjectNav";
import LiveBackground from "../components/LiveBackground";
import ScrollReveal from "./components/ScrollReveal";
import ScanLines from "./components/ScanLines";

// ProgressBar Component matching the Premium Orbit x Pyadra design language
function ProgressBar({ label, status, percentage, fraction, color = "orbit" }: { label: string, status: string, percentage: number, fraction?: string, color?: "orbit" | "pyadra" | "alert" }) {
  const colorMap = {
    orbit: { text: "text-[var(--orbit-green)]", bg: "bg-[var(--orbit-green)]", glow: "shadow-[0_0_15px_rgba(57,255,20,0.4)]" },
    pyadra: { text: "text-[var(--orbit-gold)]", bg: "bg-[var(--orbit-gold)]", glow: "shadow-[0_0_15px_rgba(255,176,0,0.4)]" },
    alert: { text: "text-[#FF4444]", bg: "bg-[#FF4444]", glow: "shadow-[0_0_15px_rgba(255,68,68,0.4)]" },
  };
  const theme = colorMap[color];

  return (
    <div>
       <div className="flex justify-between items-center text-xs md:text-sm font-mono text-[var(--orbit-cream)]/80 mb-3 uppercase tracking-widest">
         <span>{label}</span>
         <span className={`${theme.text}`}>{status} {fraction && `(${fraction})`}</span>
       </div>
       <div className="w-full h-[1px] md:h-[2px] bg-white/10 relative rounded-full overflow-hidden">
          <motion.div 
             initial={{ width: 0 }}
             whileInView={{ width: `${percentage}%` }}
             viewport={{ once: true }}
             transition={{ duration: 1.5, ease: "easeOut" }}
             className={`absolute top-0 left-0 h-full ${theme.bg} ${theme.glow}`} 
          />
       </div>
    </div>
  );
}

// Data for Episodes
const EPISODES = [
  { id: 1, title: "The Last Dance", thumb: "https://img.youtube.com/vi/7EYM9ecK3Ng/hqdefault.jpg", link: "https://youtu.be/7EYM9ecK3Ng?si=VNsVy7xsSlpclrzV" },
  { id: 2, title: "The Invisible Shapes of Love", thumb: "https://img.youtube.com/vi/dKMcW-eGNZs/hqdefault.jpg", link: "https://youtu.be/dKMcW-eGNZs?si=x0WWdJYJGuSv-qld" },
  { id: 3, title: "What We Carry, What We Let Go", thumb: "https://img.youtube.com/vi/d_tE-SibUfk/hqdefault.jpg", link: "https://youtu.be/d_tE-SibUfk?si=L2Ukmn2nhFF5IwYd" },
  { id: 4, title: "Faith in the Invisible", thumb: "https://img.youtube.com/vi/LfysC9OWP4w/hqdefault.jpg", link: "https://youtu.be/LfysC9OWP4w?si=hJxIiAgEQwopnDNt" },
  { id: 5, title: "Alive on Purpose", thumb: "https://img.youtube.com/vi/HJW8opwiCS0/hqdefault.jpg", link: "https://youtu.be/HJW8opwiCS0?si=Mx8scMLOjtf8ZwS3" },
  { id: 6, title: "Kids Then, Pretenders Now", thumb: "https://img.youtube.com/vi/r3sUwzIg-s8/hqdefault.jpg", link: "https://youtu.be/r3sUwzIg-s8?si=Vrvt2GM0dJZP7L1B" },
  { id: 7, title: "Trembling Is Not Surrender", thumb: "https://img.youtube.com/vi/mrGCSrx6bYc/hqdefault.jpg", link: "https://youtu.be/mrGCSrx6bYc?si=pzGzcgzuKR2cs7Vp" },
  { id: 8, title: "They Called Us Strong, We Left Soft", thumb: "https://img.youtube.com/vi/SKIuWBvOw0E/hqdefault.jpg", link: "https://youtu.be/SKIuWBvOw0E?si=sHqOIUUPN78s0BIv" },
  { id: 9, title: "Everything Changed, We're Still Here", thumb: "https://img.youtube.com/vi/rhG7zcGhGKA/hqdefault.jpg", link: "https://youtu.be/rhG7zcGhGKA?si=ZOtUXzRi37QO060w" },
  { id: 10, title: "The Part You Don't See", thumb: "https://img.youtube.com/vi/hvCCHVRK9iU/maxresdefault.jpg", link: "https://youtu.be/hvCCHVRK9iU?si=Ii6Byk0Tg_r9aNLC", latest: true },
];

export default function OrbitEntertainmentDashboard() {
  const [stripeOpen, setStripeOpen] = useState(false);
  const [amountAud, setAmountAud] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [supporterName, setSupporterName] = useState("");
  const [supporterEmail, setSupporterEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const [checkoutError, setCheckoutError] = useState("");

  // Support goal progress — in AUD
  const supportGoalAud = 1000;
  const [supportRaisedAud, setSupportRaisedAud] = useState(0);

  useEffect(() => {
    fetch('/api/stats/orbit-fund')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.total === 'number') {
          setSupportRaisedAud(data.total);
        }
      })
      .catch(console.error);
  }, []);

  const supportPercentage = Math.min((supportRaisedAud / supportGoalAud) * 100, 100);

  // Bioluminescence tied to scroll depth - blending Green and Amber
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 4000], ["-50%", "30%"]);

  const handleSupport = async () => {
    setCheckoutError("");
    if (!amountAud || amountAud < 2 || loading) return;
    if (!supporterEmail || !supporterEmail.includes('@')) {
      setCheckoutError("Please provide a valid email format.");
      return;
    }
    
    try {
      setLoading(true);
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "orbit-support",
          amount: Math.round(amountAud * 100),
          project_id: "orbit-77",
          currency: "AUD",
          supporter_name: supporterName.trim() || "Anonymous",
          supporter_email: supporterEmail.trim(),
          is_anonymous: isAnonymous,
          support_message: supportMessage.trim()
        }),
      });
      const data = await res.json();
      if (data?.url) {
         window.location.href = data.url;
      } else {
         throw new Error(data?.error || "Unable to start checkout");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(errorMessage);
      setCheckoutError(errorMessage || "Unable to start checkout. Please ensure STRIPE_SECRET_KEY is configured.");
      setLoading(false);
    }
  };

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-5%" },
    transition: { duration: 1.2 }
  };

  return (
    <div className="min-h-screen bg-[var(--orbit-black)] text-[var(--orbit-cream)] overflow-x-hidden font-sans selection:bg-[var(--orbit-green)]/20 selection:text-[var(--orbit-green)] relative flex flex-col items-center">

      {/* CRT SCAN LINES */}
      <ScanLines />

      {/* LIVE BACKGROUND */}
      <LiveBackground color="var(--orbit-green)" intensity="medium" />

      {/* Background Deep Earth / Orbit Gradient */}
      <motion.div
        animate={{ opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="fixed left-1/2 -translate-x-1/2 w-[120vw] h-[120vh] rounded-full blur-[180px] pointer-events-none mix-blend-screen z-0"
        style={{
          top: backgroundY,
          background: "radial-gradient(circle at center, rgba(57, 255, 20, 0.12) 0%, rgba(255, 176, 0, 0.05) 50%, transparent 80%)"
        }}
      />

      <ProjectNav
        projectName="Orbit 77"
        projectColor="var(--orbit-green)"
        links={[
          { href: "/exhibitions/galaxy/orbit", label: "Overview" },
          { href: "/exhibitions/galaxy/orbit/join", label: "Join Crew" }
        ]}
      />

      {/* DASHBOARD HUD CONTAINER */}
      <main className="relative z-10 w-full max-w-[1280px] px-6 lg:px-12 pt-32 pb-24 md:pt-40 mx-auto min-h-screen flex flex-col justify-center items-center">
        
        {/* LOGO WATERMARK (Atmospheric) */}
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.10, 0.15, 0.10] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 md:top-0 left-1/2 -translate-x-1/2 w-[140%] md:w-[130%] max-w-6xl pointer-events-none z-0 flex justify-center select-none pt-10"
        >
           {/* eslint-disable-next-line @next/next/no-img-element */}
           <img
             src="/orbit-logo.png"
             alt="Orbit 77 Element"
             className="w-full h-auto object-contain blur-[8px] opacity-80"
           />
        </motion.div>
        
        {/* SECTION 1 — HERO */}
        <motion.div {...fadeUp} className="w-full mb-12 border-b border-[var(--orbit-green)]/10 pb-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

            {/* Left Column - Main Hero Content (8 cols) */}
            <div className="lg:col-span-8 flex flex-col items-center md:items-start text-center md:text-left gap-5">

              <motion.h1
                className="text-6xl md:text-7xl lg:text-8xl font-serif italic font-light text-[var(--orbit-cream)] tracking-wider w-full md:-ml-2 cursor-default"
                animate={{
                  textShadow: [
                    "0 0 50px rgba(255,176,0,0.6)",
                    "0 0 70px rgba(255,176,0,0.8), 2px 0 0 rgba(57,255,20,0.3), -2px 0 0 rgba(255,176,0,0.3)",
                    "0 0 50px rgba(255,176,0,0.6)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{
                  textShadow: "5px 0 0 rgba(57,255,20,0.9), -5px 0 0 rgba(255,176,0,0.9), 0 0 80px rgba(255,176,0,1)",
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                Orbit 77
              </motion.h1>

              <p className="text-sm md:text-xs font-mono tracking-wide text-[var(--orbit-green)] uppercase w-full font-bold md:pl-2">
                Real conversations. No filters. No script. No bullshit.
              </p>

              <p className="max-w-xl text-xs md:text-sm font-light text-[var(--orbit-cream)]/80 leading-relaxed mt-2 font-sans md:pl-2">
                Ten transmissions recorded from Australia. No filters. No script.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-8 mt-8 w-full md:w-auto md:pl-2">
                <motion.button
                  onClick={() => { setAmountAud(20); setStripeOpen(true); }}
                  animate={{ boxShadow: ["0px 0px 15px rgba(57,255,20,0.3)", "0px 0px 40px rgba(57,255,20,0.6)", "0px 0px 15px rgba(57,255,20,0.3)"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full sm:w-auto px-10 py-5 rounded-full text-sm md:text-base uppercase font-mono tracking-wide transition-all border border-[var(--orbit-green)] text-[var(--orbit-black)] bg-[var(--orbit-green)] hover:bg-[var(--orbit-green)] hover:shadow-[0_0_50px_rgba(57,255,20,0.9)] font-bold relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/20 w-[100%] group-hover:w-[150%] h-[100%] transform -skew-x-12 -translate-x-[150%] group-hover:translate-x-[150%] transition-all duration-1000 ease-in-out z-0" />
                  <span className="relative z-10">LOCK IN NOW →</span>
                </motion.button>
                <a href="#latest-episode" className="text-sm md:text-base uppercase font-mono tracking-wide text-[var(--orbit-cream)]/90 hover:text-[var(--orbit-gold)] transition-colors md:mr-4 font-bold border-b border-transparent hover:border-[var(--orbit-gold)]">
                  Watch the latest episode ↓
                </a>
              </div>

              {/* Value Proposition - Clear and concise */}
              <div className="mt-8 bg-[var(--orbit-green)]/5 border border-[var(--orbit-green)]/20 rounded-xl p-4 max-w-lg mx-auto md:mx-0 backdrop-blur-sm">
                <p className="text-xs md:text-sm font-sans text-[var(--orbit-cream)]/95 leading-relaxed text-center md:text-left">
                  <span className="font-bold text-[var(--orbit-green)]">Fund Season 2. Get your credential.</span>
                  {" "}Your contribution fuels 10 more transmissions. You receive a permanent digital credential and founding member status.
                </p>
              </div>
            </div>

            {/* Right Column - Orbital Diagram (4 cols) */}
            <div className="lg:col-span-4 flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-[300px] space-y-6">

                {/* SVG Orbital Visualization - Clean, no overlapping labels */}
                <div className="relative w-full aspect-square flex items-center justify-center">
                  <svg viewBox="0 0 200 200" className="w-full h-full">

                    {/* Glow effect filters */}
                    <defs>
                      <filter id="glow-green">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="glow-gold">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Background subtle grid */}
                    <circle cx="100" cy="100" r="90" fill="none" stroke="white" strokeWidth="0.2" opacity="0.05" />

                    {/* Season 1 - Inner orbit (complete circle) */}
                    <circle
                      cx="100"
                      cy="100"
                      r="55"
                      fill="none"
                      stroke="var(--orbit-green)"
                      strokeWidth="2"
                      opacity="0.8"
                      filter="url(#glow-green)"
                    />

                    {/* Season 2 - Outer orbit (partial based on funding %) */}
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="var(--orbit-gold)"
                      strokeWidth="2.5"
                      opacity="0.9"
                      strokeDasharray={`${(supportPercentage / 100) * 502.65} 502.65`}
                      strokeDashoffset="125.66"
                      strokeLinecap="round"
                      filter="url(#glow-gold)"
                      transform="rotate(-90 100 100)"
                    />

                    {/* Orbiting satellite on Season 1 */}
                    <g>
                      <circle
                        cx="100"
                        cy="45"
                        r="3"
                        fill="var(--orbit-green)"
                        filter="url(#glow-green)"
                      >
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          from="0 100 100"
                          to="360 100 100"
                          dur="12s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>

                    {/* Funding progress indicator on Season 2 arc */}
                    {supportPercentage > 0 && (
                      <circle
                        cx="100"
                        cy="20"
                        r="3.5"
                        fill="var(--orbit-gold)"
                        filter="url(#glow-gold)"
                        transform={`rotate(${(supportPercentage / 100) * 360 - 90} 100 100)`}
                      >
                        <animate
                          attributeName="opacity"
                          values="0.6;1;0.6"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </svg>

                  {/* Center - Simple status only */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-4xl font-serif italic text-[var(--orbit-cream)] mb-1">O77</p>
                      <p className="text-[10px] font-mono text-[var(--orbit-cream)]/50 tracking-widest">ACTIVE</p>
                    </div>
                  </div>
                </div>

                {/* Legend - Clear info below diagram */}
                <div className="space-y-3 px-4">
                  {/* Season 1 */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-[var(--orbit-green)] rounded-full" />
                      <span className="text-sm font-mono text-[var(--orbit-green)] font-bold">Season 1</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-serif italic text-[var(--orbit-cream)]">Complete</p>
                      <p className="text-[10px] font-mono text-[var(--orbit-cream)]/50">10 episodes</p>
                    </div>
                  </div>

                  {/* Season 2 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-[var(--orbit-gold)] rounded-full animate-pulse" />
                      <span className="text-sm font-mono text-[var(--orbit-gold)] font-bold">Season 2</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-serif italic text-[var(--orbit-gold)]">{Math.round(supportPercentage)}% funded</p>
                      <p className="text-[10px] font-mono text-[var(--orbit-cream)]/50">${supportRaisedAud} / $1,000 AUD</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </motion.div>

        {/* SECTION 2 — PROOF */}
        <div className="w-full mb-16 relative">
          <div className="absolute left-1/2 -top-16 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-[#39FF14]/80 to-transparent" />
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6 mb-8 items-center">
            
            {/* DOMINANT STAT */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="bg-[var(--orbit-deep)]/90 backdrop-blur-sm border-2 border-[var(--orbit-green)]/90 rounded-2xl p-8 text-center shadow-[0_0_20px_rgba(57,255,20,0.15)] flex flex-col items-center justify-center transition-all hover:bg-[#0A2211] lg:-mt-4 relative z-10"
            >
              <div className="absolute inset-0 bg-[var(--orbit-green)]/5 rounded-2xl pointer-events-none" />
              <span className="text-5xl md:text-6xl font-serif italic text-[var(--orbit-green)] mb-3">10</span>
              <span className="text-xs md:text-sm uppercase font-mono tracking-wide text-[var(--orbit-green)] font-bold leading-relaxed">Episodes Live</span>
            </motion.div>

            {/* SECONDARY STATS (Staggered organically via margins) */}
            <div className="bg-[var(--orbit-void)]/90 backdrop-blur-sm border border-[var(--orbit-green)]/10 rounded-2xl p-5 text-center flex flex-col items-center justify-center transition-all hover:border-[var(--orbit-green)]/90 mt-4 h-full">
              <span className="text-3xl md:text-4xl font-serif italic text-[var(--orbit-cream)]/80 mb-2">26</span>
              <span className="text-xs md:text-sm uppercase font-mono tracking-wide text-[var(--orbit-cream)]/90 font-bold leading-relaxed">Content Pieces Published</span>
            </div>
            
            <div className="bg-[var(--orbit-void)]/90 backdrop-blur-sm border border-[var(--orbit-green)]/10 rounded-2xl p-5 text-center flex flex-col items-center justify-center transition-all hover:border-[var(--orbit-green)]/90 -mt-2 h-full">
              <span className="text-3xl md:text-4xl font-serif italic text-[var(--orbit-cream)]/80 mb-2">~45m</span>
              <span className="text-xs md:text-sm uppercase font-mono tracking-wide text-[var(--orbit-cream)]/90 font-bold leading-relaxed">Real Conversations</span>
            </div>
            
            <div className="bg-[var(--orbit-void)]/90 backdrop-blur-sm border border-[var(--orbit-green)]/10 rounded-2xl p-5 text-center flex flex-col items-center justify-center transition-all hover:border-[var(--orbit-green)]/90 mt-6 h-full">
              <span className="text-3xl md:text-4xl font-serif italic text-[var(--orbit-cream)]/80 mb-2">50+</span>
              <span className="text-xs md:text-sm uppercase font-mono tracking-wide text-[var(--orbit-cream)]/90 font-bold leading-relaxed">People Behind Orbit</span>
            </div>
            
            <div className="bg-[var(--orbit-void)]/90 backdrop-blur-sm border border-[var(--orbit-green)]/10 rounded-2xl p-5 text-center flex flex-col items-center justify-center transition-all hover:border-[var(--orbit-green)]/90 md:col-span-3 lg:col-span-1 border-dashed mt-2 h-full">
              <span className="text-3xl md:text-4xl font-serif italic text-[var(--orbit-cream)]/80 mb-2">1</span>
              <span className="text-xs md:text-sm uppercase font-mono tracking-wide text-[var(--orbit-cream)]/90 font-bold leading-relaxed">Original Song Created</span>
            </div>

          </motion.div>
          <p className="text-center text-xs md:text-sm font-mono tracking-wide uppercase font-bold text-[var(--orbit-green)] max-w-2xl mx-auto opacity-60 mt-4">
            This is not an idea. This is already happening.
          </p>
        </div>

        {/* SECTION 3: LATEST EPISODE */}
        <div id="latest-episode" className="w-full mb-20">
           <motion.div
             {...fadeUp}
             animate={{
               x: [0, -3, 3, -2, 2, 0],
             }}
             transition={{
               delay: 0.2,
               x: {
                 duration: 0.4,
                 repeat: Infinity,
                 repeatDelay: 8,
                 ease: "easeInOut"
               }
             }}
             whileHover={{
               x: [0, -4, 4, -2, 2, 0],
               transition: { duration: 0.3 }
             }}
             className="bg-[var(--orbit-void)]/90 backdrop-blur-sm border border-[var(--orbit-green)]/90 rounded-2xl p-6 lg:p-10 flex flex-col justify-between group shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden hover:border-[var(--orbit-green)]/90 transition-colors"
           >
               <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--orbit-green)]/5 rounded-full blur-[80px] pointer-events-none" />

               {/* Glitch overlay - auto-triggers every 8s */}
               <motion.div
                 animate={{
                   opacity: [0, 0, 0.25, 0, 0.15, 0],
                   x: [0, -5, 5, -3, 0],
                 }}
                 transition={{
                   duration: 0.6,
                   repeat: Infinity,
                   repeatDelay: 8,
                   ease: "easeInOut"
                 }}
                 className="absolute inset-0 pointer-events-none z-[5]"
                 style={{
                   background: "linear-gradient(90deg, transparent 0%, rgba(57,255,20,0.2) 50%, transparent 100%)",
                   mixBlendMode: "screen"
                 }}
               />

               <div className="flex justify-between items-center mb-6 relative z-10">
                   <span className="text-xs md:text-sm font-mono tracking-wide uppercase text-[var(--orbit-green)] font-bold">
                     LATEST TRANSMISSION — EP. 10
                   </span>
                   <span className="w-2 h-2 bg-[var(--orbit-green)] rounded-full animate-pulse shadow-[0_0_15px_rgba(57,255,20,1)]" />
               </div>

               {/* Grid layout: Video + Content side by side on large screens */}
               <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
                 {/* Video - 3 columns on large screens */}
                 <div className="lg:col-span-3">
                   <div className="w-full aspect-video bg-[#000] rounded-xl overflow-hidden relative border border-[var(--orbit-green)]/40 shadow-[0_0_30px_rgba(57,255,20,0.1)]">
                     <iframe
                       src="https://www.youtube.com/embed/hvCCHVRK9iU?rel=0&modestbranding=1&autohide=1&showinfo=0&controls=1"
                       title="Orbit 77 — Episode 10: The Part You Don't See"
                       frameBorder="0"
                       allowFullScreen
                       className="absolute inset-0 w-full h-full"
                     />
                   </div>
                 </div>

                 {/* Content - 2 columns on large screens */}
                 <div className="lg:col-span-2 flex flex-col justify-center">
                   <h3 className="text-3xl lg:text-4xl font-serif text-[var(--orbit-cream)] font-light italic mb-4">The Part You Don&apos;t See</h3>
                   <p className="text-xs md:text-sm font-light font-sans text-[var(--orbit-cream)]/80 leading-relaxed mb-6">
                     Our most honest episode yet. The one where we stopped pretending and talked about what it actually takes to build something from nothing.
                   </p>
                   <p className="inline-flex items-center gap-3 text-sm md:text-base font-mono tracking-wide font-bold uppercase text-[var(--orbit-black)] bg-[var(--orbit-gold)] px-6 py-3 rounded-sm shadow-[0_0_15px_rgba(255,176,0,0.4)] w-fit">
                     <span className="w-1.5 h-1.5 bg-[var(--orbit-black)] rounded-full animate-pulse" />
                     Watch it. Then decide if you want in.
                   </p>
                 </div>
               </div>
           </motion.div>

        </div>

        {/* SECTION 4B: ALL TRANSMISSIONS (EPISODE GRID) */}
        <ScrollReveal delay={0.1}>
        <div className="w-full mb-16 bg-[var(--orbit-void)]/90 backdrop-blur-md rounded-2xl p-6 lg:p-10 border border-[var(--orbit-green)]/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-[var(--orbit-green)]/10 pb-6">
            <div>
              <span className="text-xs md:text-sm font-mono tracking-wide uppercase text-[var(--orbit-cream)]/90 mb-2 block font-bold">ALL TRANSMISSIONS — SEASON 1</span>
              <h3 className="text-2xl lg:text-3xl font-serif italic text-[var(--orbit-cream)]">10 episodes. Every one of them real.</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {EPISODES.map((ep) => (
               <a 
                 key={ep.id} 
                 href={ep.link} 
                 target="_blank" 
                 rel="noreferrer"
                 className="group flex flex-col gap-3"
               >
                 <div className="w-full aspect-video rounded-lg overflow-hidden relative border border-white/5 group-hover:border-[var(--orbit-gold)]/90 transition-colors shadow-[0_5px_15px_rgba(0,0,0,0.5)] bg-[var(--orbit-charcoal)]">
                   {ep.latest && (
                      <div className="absolute top-2 right-2 bg-[var(--orbit-green)] text-[var(--orbit-black)] text-xs font-mono tracking-widest px-2 py-1 rounded uppercase font-bold z-10">
                        LATEST
                      </div>
                   )}
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img
                     src={ep.thumb}
                     alt={ep.title}
                     className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 scale-105 group-hover:scale-100"
                   />
                 </div>
                 <div>
                   <span className="text-xs font-mono tracking-widest text-[var(--orbit-gold)]/70 block mb-1">EP.{ep.id.toString().padStart(2, '0')}</span>
                   <p className="text-xs text-[var(--orbit-cream)]/80 font-light leading-snug group-hover:text-[var(--orbit-gold)] transition-colors">{ep.title}</p>
                 </div>
               </a>
            ))}
          </div>
        </div>
        </ScrollReveal>

        {/* SECTION 7, 8, 9: SUPPORT ORBIT 77, STORE, FOLLOW GRID */}
        <ScrollReveal delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full mb-10">

           {/* SECTION 7: SUPPORT ORBIT 77 — Spans 2 cols */}
           <motion.div {...fadeUp} transition={{ delay: 0.6 }} id="support" className="md:col-span-2 bg-[#09150C] backdrop-blur-md border border-[var(--orbit-green)]/90 hover:border-[var(--orbit-green)] rounded-2xl p-6 lg:p-8 flex flex-col justify-between shadow-[0_0_50px_rgba(57,255,20,0.2)] relative overflow-hidden group transition-all duration-700 hover:shadow-[0_0_70px_rgba(57,255,20,0.3)]">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--orbit-green)]/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-[var(--orbit-green)]/90 transition-colors duration-700" />

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <span className="text-sm font-mono tracking-wide uppercase text-[var(--orbit-green)] mb-4 block font-bold drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]">Hold The Signal</span>

                  <h4 className="font-serif italic text-[var(--orbit-green)] text-3xl mb-4 drop-shadow-[0_0_10px_rgba(57,255,20,0.3)]">Season 2 needs you.</h4>

                  <div className="text-sm font-sans text-[var(--orbit-cream)]/95 leading-relaxed mb-6 font-light bg-[var(--orbit-green)]/5 p-5 rounded-xl border border-[var(--orbit-green)]/30 shadow-[0_0_20px_rgba(57,255,20,0.1)] space-y-3">
                    <p>
                      <span className="font-bold text-[var(--orbit-green)]">Season 1 is complete.</span> Ten transmissions.
                      Real conversations. No script. The signal is strong.
                    </p>

                    <p>
                      <span className="font-bold text-[var(--orbit-green)]">Season 2 is next.</span> Ten more transmissions.
                      Deeper questions. Bigger reach. That requires funding.
                    </p>

                    <div className="pt-3 border-t border-[var(--orbit-green)]/20">
                      <p className="font-bold text-[var(--orbit-green)] mb-2 text-sm">When you contribute:</p>
                      <ul className="space-y-1.5 text-xs leading-relaxed ml-1">
                        <li>→ Permanent digital credential (O77-S1-XXXXXX)</li>
                        <li>→ Founding member status in Archive</li>
                        <li>→ Early access to Season 2 episodes</li>
                        <li>→ Direct updates from Pablo & Eduardo</li>
                      </ul>
                    </div>

                    <p className="pt-3 border-t border-[var(--orbit-green)]/20 text-[var(--orbit-green)] font-medium text-sm">
                      If this frequency resonates — lock in. That's how it reaches further.
                    </p>
                  </div>
                </div>

                {/* Support Progress Bar */}
                <div className="my-6 border-t border-[var(--orbit-green)]/20 pt-6">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-mono uppercase tracking-wide text-[var(--orbit-green)] font-bold">Season 2 Fund</p>
                    <span className="text-xs font-mono text-[var(--orbit-cream)]/80 font-bold bg-[var(--orbit-green)]/10 px-2 py-1 rounded">
                      ${supportRaisedAud} <span className="text-[var(--orbit-cream)]/90">/ ${supportGoalAud} AUD</span>
                    </span>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="w-full h-3 bg-[var(--orbit-black)] border border-[var(--orbit-green)]/80 rounded-full overflow-hidden mb-2 relative">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: supportPercentage === 0 ? "2px" : `${supportPercentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute top-0 left-0 h-full bg-[var(--orbit-green)] rounded-full flex items-center justify-end overflow-hidden"
                    >
                      <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.2)_10px,rgba(255,255,255,0.2)_20px)] animate-[progress-scroll_2s_linear_infinite]" />
                    </motion.div>
                  </div>
                  <p className="text-xs font-mono text-[var(--orbit-cream)]/90 text-right mt-2">
                    Goal: 1,000 AUD — Every contribution extends the reach.
                  </p>
                </div>

                <div className="mt-4 relative w-full text-center">
                  <motion.button
                    onClick={() => { setAmountAud(20); setStripeOpen(true); }}
                    animate={{ boxShadow: ["0 0 20px rgba(57,255,20,0.4)", "0 0 50px rgba(57,255,20,0.8)", "0 0 20px rgba(57,255,20,0.4)"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full bg-[var(--orbit-green)] border border-[var(--orbit-green)] text-[var(--orbit-black)] py-5 rounded-xl text-base md:text-xs font-mono uppercase tracking-widest font-bold transition-all cursor-pointer group-hover:bg-white"
                  >
                    Lock In Your Frequency →
                  </motion.button>
                  <p className="text-sm md:text-xs font-mono text-[var(--orbit-cream)]/90 text-center mt-5 leading-relaxed">
                    Any amount. One-time only. Credential sent via email.
                  </p>
                </div>
              </div>
           </motion.div>
           {/* SECTION 8: STORE */}
           <motion.div {...fadeUp} transition={{ delay: 0.7 }} className="bg-[var(--orbit-void)]/80 backdrop-blur-sm border border-white/5 hover:border-[var(--orbit-gold)]/80 rounded-2xl p-6 flex flex-col justify-start transition-colors group shadow-sm h-full">
              <div>
                <span className="text-xs md:text-sm font-mono tracking-widest uppercase text-[var(--orbit-cream)]/90 mb-2 block font-bold">Official Gear</span>
                <h4 className="font-serif italic text-[var(--orbit-cream)]/80 text-lg lg:text-xl mb-2">Orbit77.shop</h4>
                <p className="text-base text-[var(--orbit-cream)]/90 leading-relaxed font-light font-sans mb-4">Support the journey by wearing the brand. Premium streetwear from Australia.</p>
              </div>
              <a href="https://orbit77.shop/" target="_blank" rel="noreferrer" className="mt-auto text-xs md:text-sm uppercase font-mono tracking-widest text-[var(--orbit-gold)]/70 font-bold inline-block group-hover:text-[var(--orbit-gold)] transition-colors bg-[var(--orbit-gold)]/5 hover:bg-[var(--orbit-gold)]/10 border border-[var(--orbit-gold)]/20 px-3 py-2 w-fit rounded">
                Shop Now ↗
              </a>
           </motion.div>

           {/* SECTION 9: FOLLOW  */}
           <motion.div {...fadeUp} transition={{ delay: 0.8 }} className="bg-[var(--orbit-void)]/80 backdrop-blur-sm border border-white/5 hover:border-[var(--orbit-gold)]/80 rounded-2xl p-6 flex flex-col justify-start transition-colors group shadow-sm h-full">
              <div>
                <span className="text-xs md:text-sm font-mono tracking-widest uppercase text-[var(--orbit-cream)]/90 mb-2 block font-bold">Signal Check</span>
                <h4 className="font-serif italic text-[var(--orbit-cream)]/80 text-lg lg:text-xl mb-2">Follow Us</h4>
                <p className="text-base text-[var(--orbit-cream)]/90 leading-relaxed font-light font-sans mb-4">Watch on YouTube, listen on Spotify, and engage on Instagram.</p>
              </div>
              <a href="https://www.youtube.com/@Orbit77Podcast" target="_blank" rel="noreferrer" className="mt-auto text-xs md:text-sm uppercase font-mono tracking-widest text-[var(--orbit-gold)]/70 font-bold inline-block group-hover:text-[var(--orbit-gold)] transition-colors bg-[var(--orbit-gold)]/5 hover:bg-[var(--orbit-gold)]/10 border border-[var(--orbit-gold)]/20 px-3 py-2 w-fit rounded">
                Subscribe ↗
              </a>
           </motion.div>

        </div>
        </ScrollReveal>

      </main>

      {/* Stripe Modal — Support Orbit 77 */}
      {stripeOpen && (
         <div className="fixed inset-0 z-[99999] bg-[var(--orbit-black)]/90 backdrop-blur-2xl overflow-y-auto px-4 py-8 md:py-16">
           <motion.div
             initial={{ opacity: 0, scale: 0.95, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             className="w-full max-w-xl mx-auto bg-[#09120D] border border-[var(--orbit-green)]/90 rounded-2xl p-6 md:p-10 relative flex flex-col shadow-[0_30px_80px_rgba(57,255,20,0.15)] overflow-hidden"
           >
             <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--orbit-green)]/5 rounded-full blur-[80px] pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--orbit-green)]/10 rounded-full blur-[80px] pointer-events-none" />

             <button
               onClick={() => setStripeOpen(false)}
               className="absolute top-6 right-6 text-xs font-mono tracking-wide uppercase text-[var(--orbit-cream)]/90 hover:text-[var(--orbit-green)] transition-colors duration-300 cursor-pointer font-bold z-10"
             >
               Close
             </button>

             <h3 className="text-3xl md:text-4xl font-serif italic text-[var(--orbit-green)] mb-2 text-center relative z-10">
               Hold The Signal
             </h3>
             <p className="text-sm font-light font-sans text-[var(--orbit-cream)]/95 leading-relaxed mb-8 text-center max-w-sm mx-auto relative z-10">
               Season 1 is live. Expand its reach.
             </p>

             {/* PREVIEW CARD - "This is what you'll receive" */}
             <div className="relative z-10 mb-8 border border-[var(--orbit-green)]/80 rounded-2xl bg-gradient-to-br from-[var(--orbit-deep)] to-[var(--orbit-void)] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--orbit-green)]/10 rounded-full blur-[40px] pointer-events-none" />
               <p className="text-sm font-mono tracking-wide uppercase text-[var(--orbit-green)] mb-4 font-bold text-center">
                 — Your Frequency in the Archive —
               </p>
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <p className="text-xs font-mono tracking-wide uppercase text-[var(--orbit-green)]/90 mb-1">Orbit 77</p>
                   <p className="text-sm font-mono tracking-wide uppercase text-[var(--orbit-cream)]/90">Season 1 — 2026</p>
                 </div>
                 <div className="w-6 h-6 rounded-full border border-[var(--orbit-green)]/80 flex items-center justify-center">
                   <span className="w-1.5 h-1.5 rounded-full bg-[var(--orbit-green)]" />
                 </div>
               </div>
               <div className="mb-4">
                 <p className="text-xs font-mono tracking-wide uppercase text-[var(--orbit-cream)]/90 mb-1">Display Name</p>
                 <h4 className="text-xl font-serif italic text-[var(--orbit-cream)]">{supporterName || "Your Name"}</h4>
               </div>
               <div className="flex justify-between items-end border-t border-[var(--orbit-green)]/10 pt-4 pb-2">
                 <div className="flex flex-col gap-1">
                   <p className="text-xs font-mono tracking-wide uppercase text-[var(--orbit-cream)]/90">Role</p>
                   <p className="text-sm font-mono text-[var(--orbit-green)] tracking-widest font-bold pt-1">Orbit 77 Supporter</p>
                 </div>
                 <div className="text-right flex flex-col gap-1">
                   <p className="text-xs font-mono tracking-wide uppercase text-[var(--orbit-cream)]/90">Archive ID</p>
                   <p className="text-sm font-mono text-[var(--orbit-cream)]/95 tracking-wide pt-1">O77-S1-XXXXXX</p>
                 </div>
               </div>
             </div>

             <div className="relative z-10 mb-5 text-center">
               <p className="text-sm font-mono tracking-wide uppercase text-[var(--orbit-green)] font-bold">
                 Your frequency is permanently recorded in the Archive · Orbit 77 · Season 1 · 2026
               </p>
             </div>

             {/* Supporter Info Collection */}
             <div className="relative z-10 flex flex-col gap-4 mb-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="text-sm uppercase font-mono tracking-widest text-[var(--orbit-cream)]/90 font-bold block mb-2">Display Name</label>
                   <input
                     type="text"
                     value={supporterName}
                     onChange={e => setSupporterName(e.target.value)}
                     placeholder="Name for the archive"
                     className="w-full bg-[var(--orbit-charcoal)] border border-[var(--orbit-green)]/20 focus:border-[var(--orbit-green)] focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] rounded-xl px-4 py-3 text-sm font-sans text-[var(--orbit-cream)] outline-none transition-all placeholder:text-[var(--orbit-cream)]/80"
                   />
                 </div>
                 <div>
                   <label className="text-sm uppercase font-mono tracking-widest text-[var(--orbit-cream)]/90 font-bold block mb-2">Email Address *</label>
                   <input
                     type="email"
                     required
                     value={supporterEmail}
                     onChange={e => setSupporterEmail(e.target.value)}
                     placeholder="To send your season credential"
                     className="w-full bg-[var(--orbit-charcoal)] border border-[var(--orbit-green)]/20 focus:border-[var(--orbit-green)] focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] rounded-xl px-4 py-3 text-sm font-sans text-[var(--orbit-cream)] outline-none transition-all placeholder:text-[var(--orbit-cream)]/80"
                   />
                 </div>
               </div>

               <div>
                 <label className="text-sm uppercase font-mono tracking-widest text-[var(--orbit-cream)]/90 font-bold block mb-2">Public visibility</label>
                 <div className="flex gap-4">
                   <button 
                     onClick={() => setIsAnonymous(false)}
                     className={`flex-1 py-3 text-xs font-mono tracking-widest uppercase rounded-lg border transition-colors ${!isAnonymous ? 'bg-[var(--orbit-green)]/10 border-[var(--orbit-green)] text-[var(--orbit-green)]' : 'bg-black border-white/10 text-white/90'}`}
                   >
                     Public Name
                   </button>
                   <button 
                     onClick={() => setIsAnonymous(true)}
                     className={`flex-1 py-3 text-xs font-mono tracking-widest uppercase rounded-lg border transition-colors ${isAnonymous ? 'bg-[var(--orbit-green)]/10 border-[var(--orbit-green)] text-[var(--orbit-green)]' : 'bg-black border-white/10 text-white/90'}`}
                   >
                     Off-Record
                   </button>
                 </div>
               </div>

               <div>
                  <label className="text-sm uppercase font-mono tracking-widest text-[var(--orbit-cream)]/90 font-bold block mb-2">Message <span className="opacity-50">(Optional)</span></label>
                  <input
                    type="text"
                    maxLength={120}
                    value={supportMessage}
                    onChange={e => setSupportMessage(e.target.value)}
                    placeholder="Leave a message for the archive."
                    className="w-full bg-[var(--orbit-charcoal)] border border-[var(--orbit-green)]/20 focus:border-[var(--orbit-green)] focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] rounded-xl px-4 py-3 text-sm font-sans text-[var(--orbit-cream)] outline-none transition-all placeholder:text-[var(--orbit-cream)]/80"
                  />
               </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 relative z-10">
               {[
                 { val: 10, label: "Signal Carrier" },
                 { val: 20, label: "Archive Node", recommended: true },
                 { val: 50, label: "Transmission Keeper" }
               ].map(tier => (
                 <button
                   key={tier.val}
                   onClick={() => setAmountAud(tier.val)}
                   className={`relative py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 cursor-pointer border-2 ${amountAud === tier.val ? 'bg-[var(--orbit-green)] text-[var(--orbit-black)] border-[var(--orbit-green)] shadow-[0_0_20px_rgba(57,255,20,0.4)]' : 'bg-black/90 text-[var(--orbit-green)] border-[var(--orbit-green)]/20 hover:bg-[var(--orbit-green)]/10 hover:border-[var(--orbit-green)]/90'}`}
                 >
                   <span className="text-sm font-mono tracking-widest font-bold">${tier.val} AUD</span>
                   <span className={`text-xs font-mono tracking-widest uppercase ${amountAud === tier.val ? 'text-[var(--orbit-black)]/70' : 'text-[var(--orbit-cream)]/90'}`}>{tier.label}</span>
                   {tier.recommended && (
                     <span className={`absolute -top-2 bg-[var(--orbit-black)] border px-2 py-0.5 text-[10px] font-mono tracking-wide uppercase rounded-full ${amountAud === tier.val ? 'border-[var(--orbit-green)] text-[var(--orbit-green)]' : 'border-[var(--orbit-green)]/80 text-[var(--orbit-green)]/90'}`}>Recommended</span>
                   )}
                 </button>
               ))}
             </div>

             {checkoutError && (
               <div className="mb-4 text-center px-4 py-3 bg-[#FF4444]/10 border border-[#FF4444]/80 rounded-lg">
                 <p className="text-[#FF4444] text-sm md:text-sm font-sans">{checkoutError}</p>
               </div>
             )}

             <button
               onClick={handleSupport}
               disabled={loading || !amountAud || !supporterEmail}
               className={`w-full py-4 rounded-full text-sm md:text-sm font-mono tracking-wide uppercase transition-all duration-500 flex justify-center items-center gap-3 cursor-pointer border-2 relative z-10 ${(!amountAud || !supporterEmail || loading) ? 'bg-black/90 text-[var(--orbit-green)]/80 cursor-not-allowed border-white/5' : 'bg-[var(--orbit-green)] border-[var(--orbit-green)] text-[var(--orbit-black)] font-bold hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] hover:bg-[var(--orbit-green)]/90'}`}
             >
               {loading ? 'Initializing Protocol...' : 'Lock In Transmission'}
               {amountAud && supporterEmail && !loading && <span className="text-[var(--orbit-black)] text-lg font-bold">→</span>}
             </button>

             <p className="text-sm font-mono text-[var(--orbit-cream)]/90 text-center mt-4 leading-relaxed uppercase tracking-wide relative z-10">
               Encrypted protocol. One-time transmission only.
             </p>
           </motion.div>
         </div>
      )}

    </div>
  );
}
