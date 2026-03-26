"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

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

// Data for Roles
const ROLES = [
  { id: "social-media-operator", indicator: "URGENT", color: "red", label: "SOCIAL MEDIA", title: "Social Media Operator", desc: "Cut clips. Post reels. Grow TikTok and Instagram. You know what makes people stop scrolling. We need that skill now.", time: "~5 hrs/week", reward: "Founding Crew credit + Pyadra participation units" },
  { id: "marketing-strategist", indicator: "URGENT", color: "red", label: "MARKETING", title: "Marketing Strategist", desc: "Build the growth plan. Find the audience. You don't need a degree — you need to know how people move online.", time: "~3 hrs/week", reward: "Founding Crew credit + Pyadra participation units" },
  { id: "video-editor", indicator: "NEEDED", color: "yellow", label: "POST-PRODUCTION", title: "Video Editor", desc: "Take raw footage and make it hit. Reels, shorts, promos. Fast turnaround. Clean aesthetic.", time: "~4 hrs/week", reward: "Founding Crew credit + Pyadra participation units" },
  { id: "community-manager", indicator: "NEEDED", color: "yellow", label: "COMMUNITY", title: "Community Manager", desc: "Own the comments, the DMs, the community. Be the voice of Orbit 77 online.", time: "~3 hrs/week", reward: "Founding Crew credit + Pyadra participation units" },
  { id: "sponsor-outreach", indicator: "OPEN", color: "green", label: "PARTNERSHIPS", title: "Sponsor Outreach", desc: "Find brands that align. Send the pitch. Close the deal. Commission-based on top of participation units.", time: "Flexible", reward: "% of deals closed + Pyadra participation units" }
];

export default function OrbitEntertainmentDashboard() {
  const [stripeOpen, setStripeOpen] = useState(false);
  const [amountAud, setAmountAud] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Simulated dynamic state for Founding Members
  const totalFounders = 50;
  const currentFounders = 2; // Connected to Stripe count in a real DB
  const percentageFounders = (currentFounders / totalFounders) * 100;
  
  // Bioluminescence tied to scroll depth - blending Green and Amber
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 4000], ["-50%", "30%"]);

  const handleSupport = async () => {
    if (!amountAud || amountAud < 2 || loading) return;
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
      alert(`Stripe Error: ${errorMessage}\n\nPlease ensure you have added a valid STRIPE_SECRET_KEY to your .env.local file to enable payments.`);
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
      
      <nav className="fixed top-0 left-0 w-full p-8 md:p-12 z-50 flex justify-between items-start pointer-events-none mix-blend-screen">
        <Link href="/projects" className="pointer-events-auto text-[9px] md:text-[10px] uppercase font-mono tracking-[0.3em] text-[#AEFFA1]/70 hover:text-[#39FF14] transition-colors duration-500 drop-shadow-md">
          [ Return to Core ]
        </Link>
      </nav>

      {/* DASHBOARD HUD CONTAINER */}
      <main className="relative z-10 w-full max-w-[1280px] px-6 lg:px-12 pt-32 pb-24 md:pt-40 mx-auto min-h-screen flex flex-col justify-center items-center">
        
        {/* LOGO WATERMARK (Atmospheric) */}
        <div className="absolute top-10 md:top-0 left-1/2 -translate-x-1/2 w-[140%] md:w-[120%] max-w-5xl opacity-[0.10] md:opacity-[0.12] pointer-events-none z-0 flex justify-center select-none pt-10">
           {/* eslint-disable-next-line @next/next/no-img-element */}
           <img 
             src="/orbit-logo.png" 
             alt="Orbit 77 Element" 
             className="w-full h-auto object-contain blur-[3px]"
           />
        </div>
        
        {/* SECTION 1 — HERO */}
        <motion.div {...fadeUp} className="w-full mb-16 flex flex-col items-center md:items-start text-center md:text-left gap-5 border-b border-[#39FF14]/20 pb-12">
           <span className="text-[9px] md:text-[10px] font-mono tracking-[0.3em] uppercase text-[#FFB000] flex items-center justify-center md:justify-start gap-3 w-full md:w-auto drop-shadow-[0_0_10px_rgba(255,176,0,0.5)] font-bold">
             <span className="w-1.5 h-1.5 bg-[#FFB000] rounded-full animate-pulse shadow-[0_0_10px_rgba(255,176,0,0.8)]" /> 
             PYADRA ECOSYSTEM — NODE ACTIVE
           </span>
           
           <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif italic font-light text-[#F4EFEA] tracking-wider w-full drop-shadow-[0_10px_30px_rgba(57,255,20,0.15)]">
             Orbit 77
           </h1>
           
           <p className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-[#39FF14] uppercase w-full font-bold">
             Real conversations. No filters. No script. No bullshit.
           </p>
           
           <p className="max-w-xl text-xs md:text-sm font-light text-[#AEFFA1]/80 leading-relaxed mt-2 font-sans">
             Born in Australia. Built by a group of friends who decided to stop watching and start creating. 10 episodes in. This is already in motion. We need people to take it further.
           </p>
           
           <div className="flex flex-col sm:flex-row items-center gap-6 mt-6 w-full md:w-auto">
             <button 
               onClick={() => { setAmountAud(10); setStripeOpen(true); }}
               className="w-full sm:w-auto px-8 py-4 rounded-full text-[9px] md:text-[10px] uppercase font-mono tracking-[0.2em] transition-all border border-[#39FF14]/40 hover:border-[#39FF14] text-[#060B08] bg-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] font-bold"
             >
               BECOME A FOUNDING MEMBER
             </button>
             <a href="#latest-episode" className="text-[10px] md:text-[11px] uppercase font-mono tracking-[0.2em] text-[#AEFFA1]/80 hover:text-[#FFB000] transition-colors md:mr-4 font-bold border-b border-transparent hover:border-[#FFB000]">
               Watch the latest episode ↓
             </a>
           </div>
        </motion.div>

        {/* SECTION 2 — PROOF */}
        <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="w-full mb-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6 mb-8">
            <div className="bg-[#050A07]/80 backdrop-blur-xl border border-[#39FF14]/20 rounded-2xl p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center transition-all hover:border-[#39FF14]/40 group">
              <span className="text-4xl md:text-5xl font-serif italic text-[#39FF14] mb-3 group-hover:text-[#FFB000] transition-colors drop-shadow-[0_0_15px_rgba(57,255,20,0.3)]">10</span>
              <span className="text-[8px] md:text-[9px] uppercase font-mono tracking-[0.2em] text-[#AEFFA1]/70 font-bold leading-relaxed">Episodes Live</span>
            </div>
            <div className="bg-[#050A07]/80 backdrop-blur-xl border border-[#39FF14]/20 rounded-2xl p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center transition-all hover:border-[#39FF14]/40 group">
              <span className="text-4xl md:text-5xl font-serif italic text-[#39FF14] mb-3 group-hover:text-[#FFB000] transition-colors drop-shadow-[0_0_15px_rgba(57,255,20,0.3)]">26</span>
              <span className="text-[8px] md:text-[9px] uppercase font-mono tracking-[0.2em] text-[#AEFFA1]/70 font-bold leading-relaxed">Content Pieces Published</span>
            </div>
            <div className="bg-[#050A07]/80 backdrop-blur-xl border border-[#39FF14]/20 rounded-2xl p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center transition-all hover:border-[#39FF14]/40 group">
              <span className="text-3xl md:text-4xl lg:text-5xl font-serif italic text-[#39FF14] mb-3 group-hover:text-[#FFB000] transition-colors drop-shadow-[0_0_15px_rgba(57,255,20,0.3)]">~45m</span>
              <span className="text-[8px] md:text-[9px] uppercase font-mono tracking-[0.2em] text-[#AEFFA1]/70 font-bold leading-relaxed">Real Conversations</span>
            </div>
            <div className="bg-[#050A07]/80 backdrop-blur-xl border border-[#39FF14]/20 rounded-2xl p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center transition-all hover:border-[#39FF14]/40 group">
              <span className="text-4xl md:text-5xl font-serif italic text-[#39FF14] mb-3 group-hover:text-[#FFB000] transition-colors drop-shadow-[0_0_15px_rgba(57,255,20,0.3)]">50+</span>
              <span className="text-[8px] md:text-[9px] uppercase font-mono tracking-[0.2em] text-[#AEFFA1]/70 font-bold leading-relaxed">People Behind Orbit</span>
            </div>
            <div className="bg-[#050A07]/80 backdrop-blur-xl border border-[#39FF14]/20 rounded-2xl p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center transition-all hover:border-[#39FF14]/40 group md:col-span-3 lg:col-span-1">
              <span className="text-4xl md:text-5xl font-serif italic text-[#39FF14] mb-3 group-hover:text-[#FFB000] transition-colors drop-shadow-[0_0_15px_rgba(57,255,20,0.3)]">1</span>
              <span className="text-[8px] md:text-[9px] uppercase font-mono tracking-[0.2em] text-[#AEFFA1]/70 font-bold leading-relaxed">Original Song Created</span>
            </div>
          </div>
          <p className="text-center text-[9px] md:text-[10px] font-mono tracking-[0.3em] uppercase font-bold text-[#39FF14] bg-[#39FF14]/5 py-4 rounded-full border border-[#39FF14]/10 max-w-2xl mx-auto shadow-[0_10px_20px_rgba(57,255,20,0.05)]">
            This is not an idea. This is already happening.
          </p>
        </motion.div>

        {/* SECTION 3 & 4: LATEST EPISODE + TENSION */}
        <div id="latest-episode" className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full mb-20">
           
           {/* SECTION 3 - LATEST EPISODE (7 cols) */}
           <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="col-span-1 lg:col-span-7 bg-[#050A07]/80 backdrop-blur-xl border border-[#39FF14]/20 rounded-2xl p-6 lg:p-8 flex flex-col justify-between group h-full shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
               <div className="flex justify-between items-center mb-6">
                   <span className="text-[9px] md:text-[10px] font-mono tracking-[0.2em] uppercase text-[#39FF14] font-bold">
                     LATEST TRANSMISSION — EP. 10
                   </span>
                   <span className="w-1.5 h-1.5 bg-[#39FF14] rounded-full animate-pulse shadow-[0_0_10px_rgba(57,255,20,0.8)]" />
               </div>
               
               <div className="w-full aspect-[16/9] md:aspect-auto md:h-72 bg-[#000] rounded-xl overflow-hidden relative border border-[#39FF14]/20 shadow-[0_20px_40px_rgba(0,0,0,0.4)] mb-8">
                    <iframe 
                       src="https://www.youtube.com/embed/hvCCHVRK9iU?rel=0&modestbranding=1&autohide=1&showinfo=0&controls=1" 
                       title="Orbit77 Video" 
                       frameBorder="0" 
                       allowFullScreen
                       className="absolute inset-0 w-full h-full object-cover opacity-[0.8] mix-blend-luminosity grayscale group-hover:grayscale-0 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-1000 z-0"
                    />
               </div>
               
               <div>
                   <h3 className="text-2xl lg:text-3xl font-serif text-[#F4EFEA] font-light italic mb-4">The Part You Don&apos;t See</h3>
                   <p className="text-xs md:text-sm font-light font-sans text-[#AEFFA1]/80 leading-relaxed mb-6">
                     Our most honest episode yet. The one where we stopped pretending and talked about what it actually takes to build something from nothing.
                   </p>
                   <p className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] font-bold uppercase text-[#FFB000] inline-block border-b border-[#FFB000]/40 pb-1">
                     Watch it. Then decide if you want in.
                   </p>
               </div>
           </motion.div>

           {/* SECTION 4 - TENSION (5 cols) */}
           <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="col-span-1 lg:col-span-5 bg-gradient-to-br from-[#0A0500] to-[#0A0A0A] backdrop-blur-xl border border-[#FFB000]/20 hover:border-[#FFB000]/40 transition-colors rounded-2xl p-8 lg:p-10 flex flex-col justify-center h-full shadow-[0_0_30px_rgba(255,176,0,0.1)] text-center lg:text-left">
               <span className="text-[9px] md:text-[10px] font-mono tracking-[0.2em] uppercase text-[#FFB000] mb-6 block font-bold drop-shadow-sm">The Reality</span>
               <h3 className="text-3xl lg:text-4xl font-serif italic text-[#FFB000] mb-8 leading-tight drop-shadow-[0_0_15px_rgba(255,176,0,0.2)]">
                 The signal is strong.<br/>The reach is not.
               </h3>
               <p className="text-xs md:text-sm font-light font-sans text-[#E3DAC9]/90 leading-relaxed mb-6">
                 Orbit 77 has the content. It has the voice. It has the story. What it doesn&apos;t have yet is the team to take it to the world.
               </p>
               <p className="text-xs md:text-sm font-light font-sans text-[#FFB000] leading-relaxed bg-[#FFB000]/5 p-6 rounded-xl border border-[#FFB000]/10 border-l-2 border-l-[#FFB000] shadow-[0_5px_20px_rgba(255,176,0,0.05)]">
                 We&apos;re not looking for investors with spreadsheets. We&apos;re looking for people who feel it — and want to be part of building it.
               </p>
           </motion.div>

        </div>

        {/* SECTION 4B: ALL TRANSMISSIONS (EPISODE GRID) */}
        <motion.div {...fadeUp} transition={{ delay: 0.35 }} className="w-full mb-20 bg-[#050A07]/40 backdrop-blur-md rounded-2xl p-6 lg:p-10 border border-[#39FF14]/10">
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
                      <div className="absolute top-2 right-2 bg-[#39FF14] text-[#060B08] text-[7px] font-mono tracking-widest px-2 py-1 rounded uppercase font-bold z-10">
                        LATEST
                      </div>
                   )}
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img 
                     src={ep.thumb} 
                     alt={ep.title} 
                     className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                   />
                 </div>
                 <div>
                   <span className="text-[9px] font-mono tracking-widest text-[#39FF14] block mb-1">EP.{ep.id.toString().padStart(2, '0')}</span>
                   <p className="text-xs text-[#F4EFEA] font-light leading-snug group-hover:text-[#39FF14] transition-colors">{ep.title}</p>
                 </div>
               </a>
            ))}
          </div>
        </motion.div>

        {/* SECTION 5: MISSION STATUS */}
        <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="w-full bg-[#050A07]/80 backdrop-blur-xl border border-[#39FF14]/20 rounded-2xl p-8 lg:p-10 mb-20 shadow-[0_15px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-24 bg-[#39FF14]/10 rounded-b-full blur-[80px] pointer-events-none" />
           
           <span className="text-[9px] md:text-[10px] font-mono tracking-[0.3em] uppercase text-[#39FF14] mb-12 block text-center font-bold drop-shadow-[0_0_8px_rgba(57,255,20,0.3)]">
             Mission Status
           </span>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 relative z-10">
               {/* Column 1 */}
               <div className="space-y-8">
                   <ProgressBar label="Content Production" status="COMPLETE" percentage={100} color="orbit" />
                   <ProgressBar label="Spotify & YouTube" status="ACTIVE" percentage={40} color="orbit" />
                   <ProgressBar label="Social Media Growth" status="NEEDS CREW" percentage={20} color="pyadra" />
                   <ProgressBar label="TikTok & Reels" status="CRITICAL" percentage={10} color="alert" />
               </div>
               
               {/* Column 2 */}
               <div className="space-y-8 mt-10 md:mt-0">
                   <ProgressBar label="Clothing Brand" status="ACTIVE" percentage={40} color="orbit" />
                   <ProgressBar label="Marketing & Distribution" status="CRITICAL" percentage={10} color="alert" />
                   <ProgressBar label="Founding Members" status="OPEN — BE FIRST" percentage={0} fraction="0 / 50" color="pyadra" />
               </div>
           </div>
           
           <div className="mt-16 pt-8 border-t border-[#39FF14]/10 text-center flex flex-col items-center">
             <div className="mb-4 text-[#39FF14] animate-bounce text-sm font-bold">↓</div>
             <p className="text-sm md:text-base font-light font-sans text-[#AEFFA1] leading-relaxed max-w-3xl mx-auto italic">
               &quot;The content exists. The distribution doesn&apos;t — yet. That&apos;s the only thing standing between Orbit 77 and scale.&quot;
             </p>
           </div>
        </motion.div>

        {/* SECTION 6: JOIN THE CREW (Role Directory Accordion) */}
        <motion.div {...fadeUp} transition={{ delay: 0.5 }} className="w-full mb-16">
          <div className="bg-[#050A07]/80 backdrop-blur-xl border border-white/5 rounded-2xl md:rounded-3xl p-6 lg:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
            <div className="mb-8 border-b border-[#39FF14]/20 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <span className="text-[9px] md:text-[10px] font-mono tracking-widest uppercase text-[#AEFFA1]/70 mb-4 block font-bold">Join The Crew</span>
                <h4 className="font-serif italic text-[#F4EFEA] text-2xl lg:text-3xl mb-2">Crew Roster</h4>
                <p className="text-sm text-[#AEFFA1]/80 font-light font-sans max-w-lg">
                   We don&apos;t pay in promises. We pay in participation. Pick a role and stop watching from the sidelines.
                </p>
              </div>
              <div className="hidden md:flex flex-col gap-2 items-end">
                 <span className="flex items-center gap-2 text-[9px] font-mono text-[#AEFFA1]/50"><span className="w-1.5 h-1.5 rounded-full bg-[#FF4444]" /> URGENT</span>
                 <span className="flex items-center gap-2 text-[9px] font-mono text-[#AEFFA1]/50"><span className="w-1.5 h-1.5 rounded-full bg-[#FFB000]" /> NEEDED</span>
                 <span className="flex items-center gap-2 text-[9px] font-mono text-[#AEFFA1]/50"><span className="w-1.5 h-1.5 rounded-full bg-[#39FF14]" /> OPEN</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              {ROLES.map((role) => {
                const dotColors = {
                   red: "bg-[#FF4444] shadow-[0_0_10px_rgba(255,68,68,0.8)]",
                   yellow: "bg-[#FFB000] shadow-[0_0_10px_rgba(255,176,0,0.8)]",
                   green: "bg-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.8)]"
                };
                const dotStyle = dotColors[role.color as keyof typeof dotColors];
                const activeBorder = role.color === 'red' ? 'focus-within:border-[#FF4444]/60' : role.color === 'yellow' ? 'focus-within:border-[#FFB000]/60' : 'focus-within:border-[#39FF14]/60';
                
                return (
                  <details key={role.id} className={`group bg-[#0A120D]/60 border border-white/5 hover:border-white/20 ${activeBorder} rounded-xl overflow-hidden cursor-pointer transition-colors max-w-full`}>
                     <summary className="flex items-center justify-between p-4 md:p-5 outline-none list-none marker:hidden">
                        <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                           <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotStyle}`} />
                           <span className="text-sm md:text-base font-serif italic text-[#F4EFEA] truncate">{role.title}</span>
                        </div>
                        <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
                           <span className="hidden sm:inline-block text-[8px] md:text-[9px] font-mono uppercase tracking-widest text-[#AEFFA1]/40 border border-white/5 px-2 py-1 rounded bg-black/20 whitespace-nowrap">
                             {role.indicator}
                           </span>
                           <span className="text-[#39FF14] text-xs font-mono group-open:rotate-180 transition-transform duration-300">▼</span>
                        </div>
                     </summary>
                     <div className="p-4 md:p-5 pt-0 border-t border-white/5 mt-2 bg-black/40">
                        <p className="text-xs font-light font-sans text-[#AEFFA1]/80 leading-relaxed mb-6 max-w-3xl">{role.desc}</p>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                           <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 bg-[#050A07] px-5 py-3 rounded-lg border border-[#39FF14]/10 w-full md:w-auto">
                             <div className="flex flex-col gap-1">
                               <span className="text-[8px] font-mono uppercase text-[#AEFFA1]/50">Time</span>
                               <span className="text-[10px] font-mono text-[#39FF14]">{role.time}</span>
                             </div>
                             <div className="hidden sm:block w-[1px] h-8 bg-white/5" />
                             <div className="flex flex-col gap-1">
                               <span className="text-[8px] font-mono uppercase text-[#AEFFA1]/50">Get</span>
                               <span className="text-[10px] font-mono text-[#F4EFEA]">{role.reward}</span>
                             </div>
                           </div>
                           <Link href={`/projects/orbit/join?role=${role.id}`} className="w-full md:w-auto text-center px-8 py-4 rounded-xl text-[9px] uppercase font-mono tracking-widest font-bold transition-all border border-[#39FF14]/40 hover:bg-[#39FF14] hover:text-[#000] text-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.1)] hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] whitespace-nowrap">
                              APPLY FOR THIS ROLE →
                           </Link>
                        </div>
                     </div>
                  </details>
                );
              })}
              
              {/* EXTRA OPEN APPLICATION ROW */}
              <Link href="/projects/orbit/join?role=open-application" className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 md:p-5 bg-[#39FF14]/5 hover:bg-[#39FF14]/10 border border-[#39FF14]/20 rounded-xl transition-colors group">
                 <div className="overflow-hidden">
                    <span className="text-sm font-serif italic text-[#39FF14]">Not the right role?</span>
                    <p className="text-[9px] text-[#AEFFA1]/60 mt-1 font-mono uppercase tracking-widest truncate">Tell us what you do. We&apos;ll find where you fit.</p>
                 </div>
                 <span className="flex-shrink-0 text-[9px] font-mono font-bold text-[#39FF14] sm:group-hover:translate-x-1 transition-transform border-b border-transparent group-hover:border-[#39FF14] pb-0.5 whitespace-nowrap">
                   SEND OPEN APPLICATION →
                 </span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* SECTION 7, 8, 9: FOUNDING MEMBERS, STORE, FOLLOW GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
           
           {/* SECTION 7: FOUNDING MEMBERS (CRITICAL SECTION - Spans 2 cols on tablet/desktop) */}
           <motion.div {...fadeUp} transition={{ delay: 0.6 }} className="md:col-span-2 bg-gradient-to-br from-[#101A14] to-[#0A120D] backdrop-blur-xl border border-[#39FF14]/40 hover:border-[#39FF14] rounded-2xl p-8 lg:p-10 flex flex-col justify-between shadow-[0_0_30px_rgba(57,255,20,0.1)] relative overflow-hidden group transition-colors">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#39FF14]/15 rounded-full blur-[80px] pointer-events-none" />
              
              <div>
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#39FF14] mb-6 block font-bold drop-shadow-[0_0_8px_rgba(57,255,20,0.4)]">Founding Members</span>
                
                <h4 className="font-serif italic text-[#39FF14] text-3xl mb-4 drop-shadow-[0_0_10px_rgba(57,255,20,0.3)]">Secure Your Spot</h4>
                
                <p className="text-xs md:text-sm font-sans text-[#F4EFEA]/90 leading-relaxed mb-6 font-light bg-[#39FF14]/5 p-5 rounded-xl border border-[#39FF14]/20">
                   Each member receives <strong>100 Pyadra Units</strong>. These represent your early participation in the ecosystem.
                </p>
                
                {/* IMPROVEMENT 1: Foundation Members Counter */}
                <div className="my-8 border-t border-[#39FF14]/20 pt-6">
                   <div className="flex justify-between items-center mb-3">
                     <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#39FF14] font-bold">FOUNDING MEMBERS (LIVE)</p>
                     <span className="text-[9px] font-mono text-[#AEFFA1]/50">{currentFounders} of {totalFounders} spots claimed</span>
                   </div>
                   
                   {/* Visual Progress Bar */}
                   <div className="w-full h-1.5 bg-[#000] border border-[#39FF14]/10 rounded-full overflow-hidden mb-6 relative">
                     <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${percentageFounders}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute top-0 left-0 h-full bg-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.6)]"
                     />
                   </div>

                   {/* Live Roster */}
                   <ul className="space-y-4 text-xs md:text-sm text-[#F4EFEA] font-light font-sans italic bg-black/40 p-5 rounded-xl border border-[#39FF14]/10">
                     <li className="flex items-center gap-4">
                       <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse shadow-[0_0_10px_rgba(57,255,20,0.8)]" /> 
                       <span>Pablo Ramirez <span className="text-[#AEFFA1]/40 ml-2 not-italic text-[10px] font-mono">— Founding Member #001</span></span>
                     </li>
                     <li className="flex items-center gap-4">
                       <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse shadow-[0_0_10px_rgba(57,255,20,0.8)]" /> 
                       <span>Eduardo Diaz <span className="text-[#AEFFA1]/40 ml-2 not-italic text-[10px] font-mono">— Founding Member #002</span></span>
                     </li>
                   </ul>
                   <p className="text-[10px] font-mono text-[#AEFFA1]/40 mt-4 text-center">Every name here made a decision before it was obvious.</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                 <button onClick={() => { setAmountAud(10); setStripeOpen(true); }} className="w-full bg-[#39FF14] hover:bg-[#39FF14]/80 border border-[#39FF14] hover:border-white text-[#060B08] py-5 rounded-xl text-[10px] md:text-xs font-mono uppercase tracking-widest font-bold transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] cursor-pointer">
                   Become a Member
                 </button>
                 <div className="text-center mt-4">
                    <span className="text-sm md:text-base font-mono text-[#39FF14] font-bold tracking-[0.2em]">$10.00 AUD</span>
                    <p className="text-[8px] md:text-[9px] font-mono uppercase tracking-widest text-[#AEFFA1]/60 mt-1 font-bold">Early access price. This will not stay this low.</p>
                 </div>
                 <p className="text-[7px] md:text-[8px] font-sans uppercase tracking-[0.2em] text-[#AEFFA1]/40 text-center mt-6 leading-relaxed">
                   Participation units are internal ecosystem units, not financial securities.
                 </p>
              </div>
           </motion.div>

           {/* SECTION 8: STORE */}
           <motion.div {...fadeUp} transition={{ delay: 0.7 }} className="bg-[#050A07]/80 backdrop-blur-xl border border-[#39FF14]/20 hover:border-[#39FF14]/40 rounded-2xl p-6 lg:p-8 flex flex-col justify-between transition-colors group shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
              <div>
                <span className="text-[9px] md:text-[10px] font-mono tracking-widest uppercase text-[#AEFFA1]/70 mb-6 block font-bold">Official Gear</span>
                <h4 className="font-serif italic text-[#F4EFEA] text-xl lg:text-2xl mb-4">Orbit77.shop</h4>
                <p className="text-xs md:text-sm text-[#AEFFA1]/80 leading-relaxed font-light font-sans mb-6">Support the journey by wearing the brand. Premium streetwear from Australia to the world.</p>
              </div>
              <a href="https://orbit77.shop/" target="_blank" rel="noreferrer" className="mt-6 text-[9px] md:text-[10px] uppercase font-mono tracking-widest text-[#39FF14] font-bold inline-block group-hover:text-[#FFB000] transition-colors group-hover:translate-x-1 group-hover:-translate-y-1">
                Shop Now ↗
              </a>
           </motion.div>

           {/* SECTION 9: FOLLOW  */}
           <motion.div {...fadeUp} transition={{ delay: 0.8 }} className="bg-[#050A07]/80 backdrop-blur-xl border border-[#39FF14]/20 hover:border-[#39FF14]/40 rounded-2xl p-6 lg:p-8 flex flex-col justify-between transition-colors group shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
              <div>
                <span className="text-[9px] md:text-[10px] font-mono tracking-widest uppercase text-[#AEFFA1]/70 mb-6 block font-bold">Signal Check</span>
                <h4 className="font-serif italic text-[#F4EFEA] text-xl lg:text-2xl mb-4">Follow Us</h4>
                <p className="text-xs md:text-sm text-[#AEFFA1]/80 leading-relaxed font-light font-sans mb-6">Watch on YouTube, listen on Spotify, and engage on Instagram.</p>
              </div>
              <a href="https://www.youtube.com/@Orbit77Podcast" target="_blank" rel="noreferrer" className="mt-6 text-[9px] md:text-[10px] uppercase font-mono tracking-widest text-[#39FF14] font-bold inline-block group-hover:text-[#FFB000] transition-colors group-hover:translate-x-1 group-hover:-translate-y-1">
                Subscribe ↗
              </a>
           </motion.div>

        </div>

      </main>

      {/* Stripe Modal blending Orbit Energy with Pyadra Luxury */}
      {stripeOpen && (
         <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#020503]/90 backdrop-blur-2xl">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="w-full max-w-xl bg-[#09120D] border border-[#39FF14]/40 rounded-2xl p-10 md:p-14 relative flex flex-col shadow-[0_30px_80px_rgba(57,255,20,0.15)] overflow-hidden"
           >
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFB000]/5 rounded-full blur-[80px] pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#39FF14]/10 rounded-full blur-[80px] pointer-events-none" />
             
             <button 
               onClick={() => setStripeOpen(false)} 
               className="absolute top-6 right-6 text-[9px] font-mono tracking-[0.2em] uppercase text-[#AEFFA1]/60 hover:text-[#39FF14] transition-colors duration-300 cursor-pointer font-bold z-10"
             >
               Close
             </button>
             
             <h3 className="text-3xl md:text-5xl font-serif italic text-[#39FF14] mb-5 text-center drop-shadow-[0_0_15px_rgba(57,255,20,0.2)] relative z-10">
                Initialize Matrix
             </h3>
             <p className="text-xs md:text-sm font-light font-sans text-[#F4EFEA]/80 leading-relaxed mb-10 text-center max-w-sm mx-auto relative z-10">
                Secure your position in the Pyadra collective. You are joining early. No amount is too small.
             </p>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 relative z-10">
               {[10, 50, 100].map(val => (
                 <button 
                   key={val} 
                   onClick={() => setAmountAud(val)} 
                   className={`py-5 rounded-xl text-xs md:text-sm font-mono tracking-widest transition-all duration-300 cursor-pointer border-2 ${amountAud === val ? 'bg-[#39FF14] text-[#060B08] border-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.4)] font-bold' : 'bg-black/40 text-[#39FF14] border-[#39FF14]/20 hover:bg-[#39FF14]/10 hover:border-[#39FF14]/40'}`}
                 >
                   ${val}
                 </button>
               ))}
             </div>
             
             <button 
               onClick={handleSupport} 
               disabled={loading || !amountAud} 
               className={`w-full py-5 rounded-full text-[10px] md:text-xs font-mono tracking-[0.3em] uppercase transition-all duration-500 flex justify-center items-center gap-4 cursor-pointer border-2 relative z-10 ${!amountAud || loading ? 'bg-black/40 text-[#39FF14]/30 cursor-not-allowed border-[#39FF14]/10' : 'bg-gradient-to-r from-[#FFB000] to-[#E3DAC9] border-transparent text-[#000000] font-bold hover:shadow-[0_0_30px_rgba(255,176,0,0.4)]'}`}
             >
               {loading ? 'Processing Transaction...' : 'Confirm Trajectory'}
               {amountAud && !loading && <span className="text-[#000000] text-lg font-bold">→</span>}
             </button>
           </motion.div>
         </div>
      )}

    </div>
  );
}
