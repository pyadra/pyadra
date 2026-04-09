"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import ProjectNav from "../components/ProjectNav";
import LiveBackground from "../components/LiveBackground";

// ProgressBar Component matching the Premium Orbit x Pyadra design language
function ProgressBar({ label, status, percentage, fraction, color = "orbit" }: { label: string, status: string, percentage: number, fraction?: string, color?: "orbit" | "pyadra" | "alert" }) {
  const colorMap = {
    orbit: { text: "text-[#39FF14]", bg: "bg-[#39FF14]", glow: "shadow-[0_0_15px_rgba(57,255,20,0.4)]" },
    pyadra: { text: "text-[#FFB000]", bg: "bg-[#FFB000]", glow: "shadow-[0_0_15px_rgba(255,176,0,0.4)]" },
    alert: { text: "text-[#FF4444]", bg: "bg-[#FF4444]", glow: "shadow-[0_0_15px_rgba(255,68,68,0.4)]" },
  };
  const theme = colorMap[color];

  return (
    <div>
       <div className="flex justify-between items-center text-[9px] md:text-[10px] font-mono text-[#AEFFA1]/80 mb-3 uppercase tracking-widest">
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
    <div className="min-h-screen bg-[#020503] text-[#F4EFEA] overflow-x-hidden font-sans selection:bg-[#39FF14]/20 selection:text-[#39FF14] relative flex flex-col items-center">

      {/* LIVE BACKGROUND */}
      <LiveBackground color="#39FF14" intensity="medium" />

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
        projectColor="#39FF14"
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
        <motion.div {...fadeUp} className="w-full mb-12 flex flex-col items-center md:items-start text-center md:text-left gap-5 border-b border-[#39FF14]/10 pb-16 relative z-10">
           <span className="text-[9px] md:text-[10px] font-mono tracking-[0.3em] uppercase text-[#FFB000] flex items-center justify-center md:justify-start gap-3 w-full md:w-auto drop-shadow-[0_0_10px_rgba(255,176,0,0.5)] font-bold">
             <span className="w-1.5 h-1.5 bg-[#FFB000] rounded-full animate-pulse shadow-[0_0_10px_rgba(255,176,0,0.8)]" /> 
             PYADRA ECOSYSTEM — NODE ACTIVE
           </span>
           
           <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif italic font-light text-[#F4EFEA] tracking-wider w-full drop-shadow-[0_15px_40px_rgba(57,255,20,0.25)] md:-ml-2">
             Orbit 77
           </h1>
           
           <p className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-[#39FF14] uppercase w-full font-bold md:pl-2">
             Real conversations. No filters. No script. No bullshit.
           </p>
           
           <p className="max-w-xl text-xs md:text-sm font-light text-[#AEFFA1]/80 leading-relaxed mt-2 font-sans md:pl-2">
             Born in Australia. Built by a group of friends who decided to stop watching and start creating. 10 episodes in. This is already in motion. We need people to take it further.
           </p>
           
           <div className="flex flex-col sm:flex-row items-center gap-8 mt-8 w-full md:w-auto md:pl-2">
             <motion.button 
               onClick={() => { setAmountAud(20); setStripeOpen(true); }}
               animate={{ boxShadow: ["0px 0px 15px rgba(57,255,20,0.3)", "0px 0px 40px rgba(57,255,20,0.6)", "0px 0px 15px rgba(57,255,20,0.3)"] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               className="w-full sm:w-auto px-10 py-5 rounded-full text-[10px] md:text-[11px] uppercase font-mono tracking-[0.3em] transition-all border border-[#39FF14] text-[#060B08] bg-[#39FF14] hover:bg-[#39FF14] hover:shadow-[0_0_50px_rgba(57,255,20,0.9)] font-bold relative overflow-hidden group"
             >
               <div className="absolute inset-0 bg-white/20 w-[100%] group-hover:w-[150%] h-[100%] transform -skew-x-12 -translate-x-[150%] group-hover:translate-x-[150%] transition-all duration-1000 ease-in-out z-0" />
               <span className="relative z-10">SUPPORT ORBIT 77</span>
             </motion.button>
             <a href="#latest-episode" className="text-[10px] md:text-[11px] uppercase font-mono tracking-[0.2em] text-[#AEFFA1]/60 hover:text-[#FFB000] transition-colors md:mr-4 font-bold border-b border-transparent hover:border-[#FFB000]">
               Watch the latest episode ↓
             </a>
           </div>
        </motion.div>

        {/* SECTION 2 — PROOF */}
        <div className="w-full mb-16 relative">
          <div className="absolute left-1/2 -top-16 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-[#39FF14]/30 to-transparent" />
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6 mb-8 items-center">
            
            {/* DOMINANT STAT */}
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="bg-[#0A1A0D]/90 backdrop-blur-xl border-2 border-[#39FF14]/60 rounded-2xl p-8 text-center shadow-[0_0_40px_rgba(57,255,20,0.2)] flex flex-col items-center justify-center transition-all hover:bg-[#0A2211] lg:-mt-4 relative z-10"
            >
              <div className="absolute inset-0 bg-[#39FF14]/5 rounded-2xl pointer-events-none" />
              <span className="text-5xl md:text-6xl font-serif italic text-[#39FF14] mb-3 drop-shadow-[0_0_20px_rgba(57,255,20,0.5)]">10</span>
              <span className="text-[9px] md:text-[10px] uppercase font-mono tracking-[0.2em] text-[#39FF14] font-bold leading-relaxed">Episodes Live</span>
            </motion.div>

            {/* SECONDARY STATS (Staggered organically via margins) */}
            <div className="bg-[#050A07]/60 backdrop-blur-xl border border-[#39FF14]/10 rounded-2xl p-5 text-center flex flex-col items-center justify-center transition-all hover:border-[#39FF14]/40 mt-4 h-full">
              <span className="text-3xl md:text-4xl font-serif italic text-[#AEFFA1]/80 mb-2">26</span>
              <span className="text-[7px] md:text-[8px] uppercase font-mono tracking-[0.2em] text-[#AEFFA1]/50 font-bold leading-relaxed">Content Pieces Published</span>
            </div>
            
            <div className="bg-[#050A07]/60 backdrop-blur-xl border border-[#39FF14]/10 rounded-2xl p-5 text-center flex flex-col items-center justify-center transition-all hover:border-[#39FF14]/40 -mt-2 h-full">
              <span className="text-3xl md:text-4xl font-serif italic text-[#AEFFA1]/80 mb-2">~45m</span>
              <span className="text-[7px] md:text-[8px] uppercase font-mono tracking-[0.2em] text-[#AEFFA1]/50 font-bold leading-relaxed">Real Conversations</span>
            </div>
            
            <div className="bg-[#050A07]/60 backdrop-blur-xl border border-[#39FF14]/10 rounded-2xl p-5 text-center flex flex-col items-center justify-center transition-all hover:border-[#39FF14]/40 mt-6 h-full">
              <span className="text-3xl md:text-4xl font-serif italic text-[#AEFFA1]/80 mb-2">50+</span>
              <span className="text-[7px] md:text-[8px] uppercase font-mono tracking-[0.2em] text-[#AEFFA1]/50 font-bold leading-relaxed">People Behind Orbit</span>
            </div>
            
            <div className="bg-[#050A07]/60 backdrop-blur-xl border border-[#39FF14]/10 rounded-2xl p-5 text-center flex flex-col items-center justify-center transition-all hover:border-[#39FF14]/40 md:col-span-3 lg:col-span-1 border-dashed mt-2 h-full">
              <span className="text-3xl md:text-4xl font-serif italic text-[#AEFFA1]/80 mb-2">1</span>
              <span className="text-[7px] md:text-[8px] uppercase font-mono tracking-[0.2em] text-[#AEFFA1]/50 font-bold leading-relaxed">Original Song Created</span>
            </div>

          </motion.div>
          <p className="text-center text-[9px] md:text-[10px] font-mono tracking-[0.3em] uppercase font-bold text-[#39FF14] max-w-2xl mx-auto drop-shadow-[0_0_10px_rgba(57,255,20,0.3)] opacity-80 mt-4">
            This is not an idea. This is already happening.
          </p>
        </div>

        {/* SECTION 3 & 4: LATEST EPISODE + TENSION */}
        <div id="latest-episode" className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full mb-20">
           
           {/* SECTION 3 - LATEST EPISODE (7 cols) */}
           <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="col-span-1 lg:col-span-7 bg-[#050A07]/90 backdrop-blur-xl border border-[#39FF14]/40 rounded-2xl p-6 lg:p-10 flex flex-col justify-between group h-full shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden hover:border-[#39FF14]/60 transition-colors">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#39FF14]/5 rounded-full blur-[80px] pointer-events-none" />
               <div className="flex justify-between items-center mb-6 relative z-10">
                   <span className="text-[9px] md:text-[10px] font-mono tracking-[0.2em] uppercase text-[#39FF14] font-bold drop-shadow-[0_0_8px_rgba(57,255,20,0.4)]">
                     LATEST TRANSMISSION — EP. 10
                   </span>
                   <span className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse shadow-[0_0_15px_rgba(57,255,20,1)]" />
               </div>
               
               <div className="w-full aspect-[16/9] md:aspect-auto md:h-80 bg-[#000] rounded-xl overflow-hidden relative border border-[#39FF14]/30 shadow-[0_0_30px_rgba(57,255,20,0.1)] mb-8 z-10">
                    <iframe 
                       src="https://www.youtube.com/embed/hvCCHVRK9iU?rel=0&modestbranding=1&autohide=1&showinfo=0&controls=1" 
                       title="Orbit77 Video" 
                       frameBorder="0" 
                       allowFullScreen
                       className="absolute inset-0 w-full h-full object-cover opacity-[0.8] mix-blend-luminosity grayscale group-hover:grayscale-0 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-1000 z-0"
                    />
               </div>
               
               <div className="relative z-10">
                   <h3 className="text-3xl lg:text-4xl font-serif text-[#F4EFEA] font-light italic mb-4">The Part You Don&apos;t See</h3>
                   <p className="text-xs md:text-sm font-light font-sans text-[#AEFFA1]/80 leading-relaxed mb-6 max-w-lg">
                     Our most honest episode yet. The one where we stopped pretending and talked about what it actually takes to build something from nothing.
                   </p>
                   <p className="inline-flex items-center gap-3 text-[10px] md:text-[11px] font-mono tracking-[0.2em] font-bold uppercase text-[#060B08] bg-[#FFB000] px-6 py-3 rounded-sm shadow-[0_0_15px_rgba(255,176,0,0.4)]">
                     <span className="w-1.5 h-1.5 bg-[#060B08] rounded-full animate-pulse" />
                     Watch it. Then decide if you want in.
                   </p>
               </div>
           </motion.div>

           {/* SECTION 4 - TENSION (5 cols) */}
           <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="col-span-1 lg:col-span-5 bg-gradient-to-br from-[#0A0500] to-[#0A0A0A] backdrop-blur-xl border border-[#FFB000]/30 hover:border-[#FFB000]/50 transition-colors rounded-2xl p-8 lg:p-10 flex flex-col justify-center h-full shadow-[0_10px_40px_rgba(255,176,0,0.1)] text-center lg:text-left">
               <span className="text-[9px] md:text-[10px] font-mono tracking-[0.2em] uppercase text-[#FFB000] mb-6 block font-bold drop-shadow-[0_0_8px_rgba(255,176,0,0.5)]">The Reality</span>
               <h3 className="text-3xl lg:text-4xl font-serif italic text-[#FFB000] mb-8 leading-tight drop-shadow-[0_0_20px_rgba(255,176,0,0.3)]">
                 The signal is strong.<br/>The reach is not.
               </h3>
               <p className="text-xs md:text-sm font-light font-sans text-[#E3DAC9]/90 leading-relaxed mb-6">
                 Orbit 77 has the content. It has the voice. It has the story. What it doesn&apos;t have yet is the team to take it to the world.
               </p>
               <div className="bg-[#FFB000]/10 p-6 rounded-xl border border-[#FFB000]/20 border-l-2 border-l-[#FFB000] shadow-[0_0_20px_rgba(255,176,0,0.1)] relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-full bg-[#FFB000]/5 animate-pulse" />
                 <p className="text-xs md:text-sm font-medium font-sans text-[#FFB000] leading-relaxed relative z-10">
                   We&apos;re not looking for investors with spreadsheets. We&apos;re looking for people who feel it — and want to be part of building it.
                 </p>
               </div>
           </motion.div>

        </div>

        {/* SECTION 4B: ALL TRANSMISSIONS (EPISODE GRID) */}
        {/* SECTION 4B: ALL TRANSMISSIONS (EPISODE GRID) */}
        <motion.div {...fadeUp} transition={{ delay: 0.35 }} className="w-full mb-16 bg-[#050A07]/40 backdrop-blur-md rounded-2xl p-6 lg:p-10 border border-[#39FF14]/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-[#39FF14]/10 pb-6">
            <div>
              <span className="text-[9px] md:text-[10px] font-mono tracking-[0.2em] uppercase text-[#AEFFA1]/60 mb-2 block font-bold">ALL TRANSMISSIONS — SEASON 1</span>
              <h3 className="text-2xl lg:text-3xl font-serif italic text-[#F4EFEA]">10 episodes. Every one of them real.</h3>
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
                 <div className="w-full aspect-video rounded-lg overflow-hidden relative border border-white/5 group-hover:border-[#39FF14]/50 transition-colors shadow-[0_5px_15px_rgba(0,0,0,0.5)] bg-[#0A120D]">
                   {ep.latest && (
                      <div className="absolute top-2 right-2 bg-[#39FF14] text-[#060B08] text-[7px] font-mono tracking-widest px-2 py-1 rounded uppercase font-bold z-10 shadow-[0_0_10px_rgba(57,255,20,0.5)]">
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
                   <span className="text-[9px] font-mono tracking-widest text-[#39FF14] block mb-1">EP.{ep.id.toString().padStart(2, '0')}</span>
                   <p className="text-xs text-[#F4EFEA]/80 font-light leading-snug group-hover:text-[#39FF14] transition-colors">{ep.title}</p>
                 </div>
               </a>
            ))}
          </div>
        </motion.div>

        {/* FLOW INDICATOR */}
        <div className="w-full flex justify-center mb-10 opacity-70">
          <div className="w-px h-16 bg-gradient-to-b from-[#39FF14]/30 to-transparent" />
        </div>

        {/* SECTION 5: MISSION STATUS */}
        <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="w-full bg-[#050A07]/80 backdrop-blur-xl border border-[#39FF14]/30 rounded-2xl p-8 lg:p-12 mb-16 shadow-[0_15px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-32 bg-[#39FF14]/10 rounded-b-full blur-[90px] pointer-events-none" />
           <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FF4444]/5 rounded-tl-full blur-[80px] pointer-events-none" />
           
           <span className="text-[9px] md:text-[10px] font-mono tracking-[0.3em] uppercase text-[#39FF14] mb-12 block text-center font-bold drop-shadow-[0_0_15px_rgba(57,255,20,0.5)]">
             — Mission Status —
           </span>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 relative z-10">
               {/* Column 1 */}
               <div className="space-y-8">
                   <ProgressBar label="Content Production" status="COMPLETE" percentage={100} color="orbit" />
                   <ProgressBar label="Spotify & YouTube" status="ACTIVE" percentage={40} color="orbit" />
                   <div className="border border-[#FFB000]/20 p-4 rounded-xl bg-[#FFB000]/5 -mx-4">
                     <ProgressBar label="Social Media Growth" status="NEEDS CREW" percentage={20} color="pyadra" />
                   </div>
                   <div className="border border-[#FF4444]/40 p-4 rounded-xl bg-[#FF4444]/10 shadow-[0_0_20px_rgba(255,68,68,0.15)] -mx-4 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-full bg-[#FF4444]/5 animate-pulse pointer-events-none" />
                     <ProgressBar label="TikTok & Reels" status="CRITICAL" percentage={10} color="alert" />
                   </div>
               </div>
               
               {/* Column 2 */}
               <div className="space-y-8 mt-10 md:mt-0">
                   <ProgressBar label="Clothing Brand" status="ACTIVE" percentage={40} color="orbit" />
                   <div className="border border-[#FF4444]/40 p-4 rounded-xl bg-[#FF4444]/10 shadow-[0_0_20px_rgba(255,68,68,0.15)] -mx-4 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-full bg-[#FF4444]/5 animate-pulse pointer-events-none" />
                     <ProgressBar label="Marketing & Distribution" status="CRITICAL" percentage={10} color="alert" />
                   </div>
                   <div className="border border-[#39FF14]/20 p-4 rounded-xl bg-[#39FF14]/5 -mx-4">
                     <ProgressBar label="Support Goal" status="OPEN" percentage={supportPercentage} fraction={`$${supportRaisedAud} / $${supportGoalAud} AUD`} color="pyadra" />
                   </div>
               </div>
           </div>
           
           <div className="mt-16 pt-10 border-t border-[#39FF14]/20 text-center flex flex-col items-center relative z-10">
             <div className="mb-6 outline outline-1 outline-[#39FF14]/30 w-8 h-8 rounded-full flex items-center justify-center bg-[#39FF14]/10">
               <div className="text-[#39FF14] animate-bounce text-xs font-bold">↓</div>
             </div>
             <p className="text-sm md:text-base font-light font-sans text-[#AEFFA1] leading-relaxed max-w-3xl mx-auto italic drop-shadow-[0_0_10px_rgba(57,255,20,0.2)]">
               &quot;The content exists. The distribution doesn&apos;t — yet. That&apos;s the only thing standing between Orbit 77 and scale.&quot;
             </p>
           </div>
        </motion.div>

        {/* FLOW INDICATOR */}
        <div className="w-full flex justify-center mb-6 opacity-70">
          <div className="w-px h-16 bg-gradient-to-b from-[#39FF14]/30 to-transparent" />
        </div>

        {/* SECTION 6: WHO WE NEED */}
        <motion.div {...fadeUp} transition={{ delay: 0.5 }} className="w-full mb-16">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4 border-b border-[#39FF14]/10 pb-6">
            <div>
              <span className="text-[9px] md:text-[10px] font-mono tracking-widest uppercase text-[#AEFFA1]/50 mb-3 block font-bold">Build It With Us</span>
              <h4 className="font-serif italic text-[#F4EFEA] text-2xl lg:text-3xl drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">Three roles. All urgent.</h4>
            </div>
            <Link href="/exhibitions/galaxy/orbit/join" className="flex-shrink-0 text-[10px] font-mono uppercase tracking-[0.2em] text-[#060B08] bg-[#AEFFA1]/80 px-4 py-2 hover:bg-[#39FF14] transition-colors font-bold rounded-sm">
              Open application →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Role 1 - SUPER DOMINANT */}
            <div className="bg-[#1A0A0A]/90 backdrop-blur-xl border border-[#FF4444]/60 hover:border-[#FF4444] rounded-2xl p-8 flex flex-col gap-6 transition-all group shadow-[0_15px_40px_rgba(255,68,68,0.15)] relative overflow-hidden scale-100 md:scale-105 z-10 hover:shadow-[0_20px_50px_rgba(255,68,68,0.3)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4444]/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-[#FF4444]/20 transition-colors" />
              <div className="flex items-center gap-2 relative z-10">
                <span className="w-2 h-2 rounded-full bg-[#FF4444] shadow-[0_0_15px_rgba(255,68,68,1)] animate-pulse" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#FF4444] font-bold drop-shadow-[0_0_5px_rgba(255,68,68,0.5)]">CRITICAL</span>
              </div>
              <div className="relative z-10">
                <h5 className="font-serif italic text-[#F4EFEA] text-2xl mb-2 drop-shadow-sm">Social Media Operator</h5>
                <p className="text-xs font-light font-sans text-[#AEFFA1]/80 leading-relaxed">Cut clips. Post reels. Make people stop scrolling.</p>
              </div>
              <Link href="/exhibitions/galaxy/orbit/join?role=social-media-operator" className="mt-auto text-[9px] font-mono uppercase tracking-[0.2em] text-[#060B08] bg-[#FF4444] hover:bg-[#FF4444]/90 transition-colors font-bold px-4 py-3 rounded-sm w-fit shadow-[0_0_15px_rgba(255,68,68,0.4)] relative z-10 group-hover:shadow-[0_0_25px_rgba(255,68,68,0.6)]">
                Apply Now →
              </Link>
            </div>

            {/* Role 2 */}
            <div className="bg-[#050A07]/80 backdrop-blur-xl border border-[#FF4444]/20 hover:border-[#FF4444]/40 rounded-2xl p-6 flex flex-col gap-4 transition-colors group shadow-[0_10px_30px_rgba(0,0,0,0.4)] mt-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4444] shadow-[0_0_8px_rgba(255,68,68,0.8)]" />
                <span className="text-[8px] font-mono uppercase tracking-widest text-[#FF4444] font-bold">High Priority</span>
              </div>
              <div>
                <h5 className="font-serif italic text-[#F4EFEA]/90 text-lg mb-2">Marketing Strategist</h5>
                <p className="text-xs font-light font-sans text-[#AEFFA1]/50 leading-relaxed">Build the growth plan. Find the audience. Make noise.</p>
              </div>
              <Link href="/exhibitions/galaxy/orbit/join?role=marketing-strategist" className="mt-auto text-[8px] font-mono uppercase tracking-widest text-[#39FF14]/70 hover:text-[#39FF14] transition-colors font-bold border-b border-[#39FF14]/20 hover:border-[#39FF14]/60 pb-0.5 w-fit">
                Apply →
              </Link>
            </div>

            {/* Role 3 */}
            <div className="bg-[#050A07]/80 backdrop-blur-xl border border-[#FFB000]/10 hover:border-[#FFB000]/30 rounded-2xl p-6 flex flex-col gap-4 transition-colors group shadow-[0_10px_30px_rgba(0,0,0,0.4)] mt-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB000] shadow-[0_0_8px_rgba(255,176,0,0.5)]" />
                <span className="text-[8px] font-mono uppercase tracking-widest text-[#FFB000]/80 font-bold">Needed</span>
              </div>
              <div>
                <h5 className="font-serif italic text-[#F4EFEA]/80 text-lg mb-2">Video Editor</h5>
                <p className="text-xs font-light font-sans text-[#AEFFA1]/40 leading-relaxed">Raw footage to reels. Fast turnaround. Clean aesthetic.</p>
              </div>
              <Link href="/exhibitions/galaxy/orbit/join?role=video-editor" className="mt-auto text-[8px] font-mono uppercase tracking-widest text-[#39FF14]/50 hover:text-[#39FF14] transition-colors font-bold border-b border-[#39FF14]/10 hover:border-[#39FF14]/40 pb-0.5 w-fit">
                Apply →
              </Link>
            </div>
          </div>
        </motion.div>

        {/* FLOW INDICATOR */}
        <div className="w-full flex justify-center mb-10 opacity-70">
          <div className="w-px h-20 bg-gradient-to-b from-[#39FF14]/40 to-transparent" />
        </div>

        {/* SECTION 7, 8, 9: SUPPORT ORBIT 77, STORE, FOLLOW GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full mb-10">

           {/* SECTION 7: SUPPORT ORBIT 77 — Spans 2 cols */}
           <motion.div {...fadeUp} transition={{ delay: 0.6 }} id="support" className="md:col-span-2 bg-[#09150C] backdrop-blur-xl border border-[#39FF14]/60 hover:border-[#39FF14] rounded-2xl p-6 lg:p-8 flex flex-col justify-between shadow-[0_0_50px_rgba(57,255,20,0.2)] relative overflow-hidden group transition-all duration-700 hover:shadow-[0_0_70px_rgba(57,255,20,0.3)]">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#39FF14]/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#39FF14]/40 transition-colors duration-700" />

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#39FF14] mb-4 block font-bold drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]">Support Orbit 77</span>

                  <h4 className="font-serif italic text-[#39FF14] text-3xl mb-3 drop-shadow-[0_0_10px_rgba(57,255,20,0.3)]">The signal is strong.<br/>The reach is not.</h4>

                  <p className="text-xs md:text-sm font-sans text-[#F4EFEA]/90 leading-relaxed mb-6 font-light bg-[#39FF14]/5 p-4 rounded-xl border border-[#39FF14]/30 shadow-[0_0_20px_rgba(57,255,20,0.1)]">
                    Season 1 is complete. Ten episodes. Real conversations. No script.<br/>
                    The problem is distribution, not creation.
                    <span className="block mt-2 text-[#39FF14]/80 font-medium">
                      If this work means something to you — support it. That&apos;s how it reaches further.
                    </span>
                  </p>
                </div>

                {/* Support Progress Bar */}
                <div className="my-6 border-t border-[#39FF14]/20 pt-6">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#39FF14] font-bold">Distribution Fund</p>
                    <span className="text-[9px] font-mono text-[#AEFFA1]/80 font-bold bg-[#39FF14]/10 px-2 py-1 rounded">
                      ${supportRaisedAud} <span className="text-[#AEFFA1]/50">/ ${supportGoalAud} AUD</span>
                    </span>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="w-full h-3 bg-[#020503] border border-[#39FF14]/30 rounded-full overflow-hidden mb-2 relative">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: supportPercentage === 0 ? "2px" : `${supportPercentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute top-0 left-0 h-full bg-[#39FF14] rounded-full flex items-center justify-end overflow-hidden"
                    >
                      <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.2)_10px,rgba(255,255,255,0.2)_20px)] animate-[progress-scroll_2s_linear_infinite]" />
                    </motion.div>
                  </div>
                  <p className="text-[9px] font-mono text-[#AEFFA1]/50 text-right mt-2">
                    Goal: 1,000 AUD — Every support extends the reach.
                  </p>
                </div>

                <div className="mt-4 relative w-full text-center">
                  <motion.button
                    onClick={() => { setAmountAud(20); setStripeOpen(true); }}
                    animate={{ boxShadow: ["0 0 20px rgba(57,255,20,0.4)", "0 0 50px rgba(57,255,20,0.8)", "0 0 20px rgba(57,255,20,0.4)"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full bg-[#39FF14] border border-[#39FF14] text-[#060B08] py-5 rounded-xl text-[11px] md:text-xs font-mono uppercase tracking-widest font-bold transition-all cursor-pointer group-hover:bg-white"
                  >
                    Support Orbit 77
                  </motion.button>
                  <p className="text-[8px] md:text-[9px] font-mono text-[#AEFFA1]/40 text-center mt-5 leading-relaxed">
                    Any amount. No recurring charges. Receive a digital support card.
                  </p>
                </div>
              </div>
           </motion.div>
           {/* SECTION 8: STORE */}
           <motion.div {...fadeUp} transition={{ delay: 0.7 }} className="bg-[#050A07]/80 backdrop-blur-xl border border-white/5 hover:border-[#39FF14]/30 rounded-2xl p-6 flex flex-col justify-start transition-colors group shadow-sm h-full">
              <div>
                <span className="text-[9px] md:text-[10px] font-mono tracking-widest uppercase text-[#AEFFA1]/40 mb-2 block font-bold">Official Gear</span>
                <h4 className="font-serif italic text-[#F4EFEA]/80 text-lg lg:text-xl mb-2">Orbit77.shop</h4>
                <p className="text-[11px] text-[#AEFFA1]/50 leading-relaxed font-light font-sans mb-4">Support the journey by wearing the brand. Premium streetwear from Australia.</p>
              </div>
              <a href="https://orbit77.shop/" target="_blank" rel="noreferrer" className="mt-auto text-[9px] md:text-[10px] uppercase font-mono tracking-widest text-[#39FF14]/70 font-bold inline-block group-hover:text-[#39FF14] transition-colors bg-[#39FF14]/5 hover:bg-[#39FF14]/10 border border-[#39FF14]/20 px-3 py-2 w-fit rounded">
                Shop Now ↗
              </a>
           </motion.div>

           {/* SECTION 9: FOLLOW  */}
           <motion.div {...fadeUp} transition={{ delay: 0.8 }} className="bg-[#050A07]/80 backdrop-blur-xl border border-white/5 hover:border-[#39FF14]/30 rounded-2xl p-6 flex flex-col justify-start transition-colors group shadow-sm h-full">
              <div>
                <span className="text-[9px] md:text-[10px] font-mono tracking-widest uppercase text-[#AEFFA1]/40 mb-2 block font-bold">Signal Check</span>
                <h4 className="font-serif italic text-[#F4EFEA]/80 text-lg lg:text-xl mb-2">Follow Us</h4>
                <p className="text-[11px] text-[#AEFFA1]/50 leading-relaxed font-light font-sans mb-4">Watch on YouTube, listen on Spotify, and engage on Instagram.</p>
              </div>
              <a href="https://www.youtube.com/@Orbit77Podcast" target="_blank" rel="noreferrer" className="mt-auto text-[9px] md:text-[10px] uppercase font-mono tracking-widest text-[#39FF14]/70 font-bold inline-block group-hover:text-[#39FF14] transition-colors bg-[#39FF14]/5 hover:bg-[#39FF14]/10 border border-[#39FF14]/20 px-3 py-2 w-fit rounded">
                Subscribe ↗
              </a>
           </motion.div>

        </div>

      </main>

      {/* Stripe Modal — Support Orbit 77 */}
      {stripeOpen && (
         <div className="fixed inset-0 z-[99999] bg-[#020503]/90 backdrop-blur-2xl overflow-y-auto px-4 py-8 md:py-16">
           <motion.div
             initial={{ opacity: 0, scale: 0.95, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             className="w-full max-w-xl mx-auto bg-[#09120D] border border-[#39FF14]/40 rounded-2xl p-6 md:p-10 relative flex flex-col shadow-[0_30px_80px_rgba(57,255,20,0.15)] overflow-hidden"
           >
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#39FF14]/5 rounded-full blur-[80px] pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#39FF14]/10 rounded-full blur-[80px] pointer-events-none" />

             <button
               onClick={() => setStripeOpen(false)}
               className="absolute top-6 right-6 text-[9px] font-mono tracking-[0.2em] uppercase text-[#AEFFA1]/60 hover:text-[#39FF14] transition-colors duration-300 cursor-pointer font-bold z-10"
             >
               Close
             </button>

             <h3 className="text-3xl md:text-4xl font-serif italic text-[#39FF14] mb-2 text-center drop-shadow-[0_0_15px_rgba(57,255,20,0.2)] relative z-10">
               Support Orbit 77
             </h3>
             <p className="text-xs font-light font-sans text-[#AEFFA1]/70 leading-relaxed mb-8 text-center max-w-sm mx-auto relative z-10">
               Season 1 is recorded. Now we distribute.
             </p>

             {/* PREVIEW CARD - "This is what you'll receive" */}
             <div className="relative z-10 mb-8 border border-[#39FF14]/30 rounded-2xl bg-gradient-to-br from-[#0A1A0D] to-[#050A07] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#39FF14]/10 rounded-full blur-[40px] pointer-events-none" />
               <p className="text-[8px] font-mono tracking-[0.2em] uppercase text-[#39FF14] mb-4 font-bold text-center">
                 — Preview: Your Season Credential —
               </p>
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <p className="text-[7px] font-mono tracking-[0.3em] uppercase text-[#39FF14]/60 mb-1">Orbit 77</p>
                   <p className="text-[8px] font-mono tracking-[0.2em] uppercase text-[#AEFFA1]/40">Season 1 — 2026</p>
                 </div>
                 <div className="w-6 h-6 rounded-full border border-[#39FF14]/30 flex items-center justify-center">
                   <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14]" />
                 </div>
               </div>
               <div className="mb-4">
                 <p className="text-[7px] font-mono tracking-[0.3em] uppercase text-[#AEFFA1]/50 mb-1">Display Name</p>
                 <h4 className="text-xl font-serif italic text-[#F4EFEA]">{supporterName || "Your Name"}</h4>
               </div>
               <div className="flex justify-between items-end border-t border-[#39FF14]/10 pt-4 pb-2">
                 <div className="flex flex-col gap-1">
                   <p className="text-[7px] font-mono tracking-[0.3em] uppercase text-[#AEFFA1]/50">Role</p>
                   <p className="text-[8px] font-mono text-[#39FF14] tracking-widest font-bold pt-1">Orbit 77 Supporter</p>
                 </div>
                 <div className="text-right flex flex-col gap-1">
                   <p className="text-[7px] font-mono tracking-[0.3em] uppercase text-[#AEFFA1]/50">Archive ID</p>
                   <p className="text-[8px] font-mono text-[#AEFFA1]/70 tracking-widest pt-1">O77-S1-XXXXXX</p>
                 </div>
               </div>
             </div>

             <div className="relative z-10 mb-5 text-center">
               <p className="text-[9px] font-mono tracking-widest uppercase text-[#39FF14] font-bold">
                 Your support is permanently recorded in the Orbit 77 Archive · Season 1 · 2026
               </p>
             </div>

             {/* Supporter Info Collection */}
             <div className="relative z-10 flex flex-col gap-4 mb-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="text-[8px] uppercase font-mono tracking-widest text-[#AEFFA1]/60 font-bold block mb-2">Display Name</label>
                   <input
                     type="text"
                     value={supporterName}
                     onChange={e => setSupporterName(e.target.value)}
                     placeholder="Name for the archive"
                     className="w-full bg-[#0A120D] border border-[#39FF14]/20 focus:border-[#39FF14] focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] rounded-xl px-4 py-3 text-sm font-sans text-[#F4EFEA] outline-none transition-all placeholder:text-[#AEFFA1]/30"
                   />
                 </div>
                 <div>
                   <label className="text-[8px] uppercase font-mono tracking-widest text-[#AEFFA1]/60 font-bold block mb-2">Email Address *</label>
                   <input
                     type="email"
                     required
                     value={supporterEmail}
                     onChange={e => setSupporterEmail(e.target.value)}
                     placeholder="To send your season credential"
                     className="w-full bg-[#0A120D] border border-[#39FF14]/20 focus:border-[#39FF14] focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] rounded-xl px-4 py-3 text-sm font-sans text-[#F4EFEA] outline-none transition-all placeholder:text-[#AEFFA1]/30"
                   />
                 </div>
               </div>

               <div>
                 <label className="text-[8px] uppercase font-mono tracking-widest text-[#AEFFA1]/60 font-bold block mb-2">Public visibility</label>
                 <div className="flex gap-4">
                   <button 
                     onClick={() => setIsAnonymous(false)}
                     className={`flex-1 py-3 text-[9px] font-mono tracking-widest uppercase rounded-lg border transition-colors ${!isAnonymous ? 'bg-[#39FF14]/10 border-[#39FF14] text-[#39FF14]' : 'bg-black border-white/10 text-white/40'}`}
                   >
                     Public Name
                   </button>
                   <button 
                     onClick={() => setIsAnonymous(true)}
                     className={`flex-1 py-3 text-[9px] font-mono tracking-widest uppercase rounded-lg border transition-colors ${isAnonymous ? 'bg-[#39FF14]/10 border-[#39FF14] text-[#39FF14]' : 'bg-black border-white/10 text-white/40'}`}
                   >
                     Off-Record
                   </button>
                 </div>
               </div>

               <div>
                  <label className="text-[8px] uppercase font-mono tracking-widest text-[#AEFFA1]/60 font-bold block mb-2">Message <span className="opacity-50">(Optional)</span></label>
                  <input
                    type="text"
                    maxLength={120}
                    value={supportMessage}
                    onChange={e => setSupportMessage(e.target.value)}
                    placeholder="Leave a message for the archive."
                    className="w-full bg-[#0A120D] border border-[#39FF14]/20 focus:border-[#39FF14] focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] rounded-xl px-4 py-3 text-sm font-sans text-[#F4EFEA] outline-none transition-all placeholder:text-[#AEFFA1]/30"
                  />
               </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 relative z-10">
               {[
                 { val: 10, label: "Entry Transmission" },
                 { val: 20, label: "Season Record", recommended: true },
                 { val: 50, label: "Archive Patron" }
               ].map(tier => (
                 <button
                   key={tier.val}
                   onClick={() => setAmountAud(tier.val)}
                   className={`relative py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 cursor-pointer border-2 ${amountAud === tier.val ? 'bg-[#39FF14] text-[#060B08] border-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.4)]' : 'bg-black/40 text-[#39FF14] border-[#39FF14]/20 hover:bg-[#39FF14]/10 hover:border-[#39FF14]/40'}`}
                 >
                   <span className="text-sm font-mono tracking-widest font-bold">${tier.val} AUD</span>
                   <span className={`text-[7px] font-mono tracking-widest uppercase ${amountAud === tier.val ? 'text-[#060B08]/70' : 'text-[#AEFFA1]/50'}`}>{tier.label}</span>
                   {tier.recommended && (
                     <span className={`absolute -top-2 bg-[#020503] border px-2 py-0.5 text-[6px] font-mono tracking-widest uppercase rounded-full ${amountAud === tier.val ? 'border-[#39FF14] text-[#39FF14]' : 'border-[#39FF14]/30 text-[#39FF14]/60'}`}>Recommended</span>
                   )}
                 </button>
               ))}
             </div>

             {checkoutError && (
               <div className="mb-4 text-center px-4 py-3 bg-[#FF4444]/10 border border-[#FF4444]/30 rounded-lg">
                 <p className="text-[#FF4444] text-[10px] md:text-sm font-sans">{checkoutError}</p>
               </div>
             )}

             <button
               onClick={handleSupport}
               disabled={loading || !amountAud || !supporterEmail}
               className={`w-full py-4 rounded-full text-[10px] md:text-sm font-mono tracking-[0.2em] uppercase transition-all duration-500 flex justify-center items-center gap-3 cursor-pointer border-2 relative z-10 ${(!amountAud || !supporterEmail || loading) ? 'bg-black/40 text-[#39FF14]/30 cursor-not-allowed border-white/5' : 'bg-[#39FF14] border-[#39FF14] text-[#060B08] font-bold hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] hover:bg-[#39FF14]/90'}`}
             >
               {loading ? 'Initializing Protocol...' : 'Record My Transmission'}
               {amountAud && supporterEmail && !loading && <span className="text-[#060B08] text-lg font-bold">→</span>}
             </button>

             <p className="text-[7px] md:text-[8px] font-mono text-[#AEFFA1]/30 text-center mt-4 leading-relaxed uppercase tracking-[0.15em] relative z-10">
               Secure checkout via Stripe. One-time only.
             </p>
           </motion.div>
         </div>
      )}

    </div>
  );
}
