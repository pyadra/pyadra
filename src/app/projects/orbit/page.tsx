"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function OrbitEntertainmentDashboard() {
  const [stripeOpen, setStripeOpen] = useState(false);
  const [amountAud, setAmountAud] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Bioluminescence tied to scroll depth
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 3000], ["-50%", "30%"]);

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
    <div className="min-h-screen bg-[#060B08] text-[#F4EFEA] overflow-x-hidden font-sans selection:bg-[#39FF14]/20 selection:text-[#39FF14] relative flex flex-col items-center">
      
      {/* Background Alien Gradient */}
      <motion.div 
        animate={{ opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="fixed left-1/2 -translate-x-1/2 w-[120vw] h-[120vh] rounded-full blur-[180px] pointer-events-none mix-blend-screen z-0"
        style={{ 
          top: backgroundY, 
          background: "radial-gradient(circle at center, rgba(57, 255, 20, 0.15) 0%, rgba(80, 200, 120, 0.05) 40%, transparent 60%)" 
        }}
      />
      
      <nav className="fixed top-0 left-0 w-full p-8 md:p-12 z-50 flex justify-between items-start pointer-events-none mix-blend-screen">
        <Link href="/projects" className="pointer-events-auto text-[10px] uppercase font-sans font-light tracking-[0.3em] text-[#AEFFA1] hover:text-[#39FF14] transition-colors duration-500">
          [ Return to Main ]
        </Link>
      </nav>

      {/* DASHBOARD HUD CONTAINER */}
      <main className="relative z-10 w-full max-w-[1400px] px-6 lg:px-12 pt-32 pb-24 md:pt-40 mx-auto min-h-screen flex flex-col justify-center items-center">
        
        {/* HEADER */}
        <motion.div {...fadeUp} className="w-full mb-10 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-[#39FF14]/10 pb-8">
           <div>
             <span className="text-[10px] tracking-[0.4em] uppercase text-[#FFB000] mb-4 block font-bold flex items-center gap-3">
               <span className="w-1.5 h-1.5 bg-[#FFB000] rounded-full animate-pulse shadow-[0_0_10px_rgba(255,176,0,0.8)]" /> 
               Pyadra Ecosystem Link
             </span>
             <h1 className="text-5xl md:text-7xl font-serif italic font-light text-[#F4EFEA] tracking-tight" style={{ textShadow: "0px 10px 40px rgba(57,255,20,0.15)" }}>
               Orbit 77
             </h1>
           </div>
           <div className="text-right">
             <p className="text-[10px] font-sans font-light tracking-[0.3em] text-[#AEFFA1]/70 mb-2 uppercase">
               Real conversations. Global voices.
             </p>

           </div>
        </motion.div>

        {/* ROW 1: THE VIDEO (Widget 1) & THE STORY (Widget 2) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full mb-6">
           
           {/* WIDGET 1: THE EPISODE (Video) - Returned to Bento Size (8 cols) */}
           <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="col-span-1 md:col-span-8 bg-[#0A120D]/60 backdrop-blur-xl border border-[#39FF14]/10 rounded-[2rem] p-6 lg:p-8 flex flex-col justify-between group h-full">
               <div className="flex justify-between items-center mb-6">
                   <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#AEFFA1]/60">Latest Episode</span>
                   <span className="text-[9px] uppercase tracking-[0.3em] text-[#39FF14] flex items-center gap-2">
                     Now Streaming <span className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse shadow-[0_0_10px_rgba(57,255,20,0.8)]" />
                   </span>
               </div>
               
               <div className="w-full h-full aspect-[16/9] md:aspect-auto bg-[#000] rounded-2xl overflow-hidden relative border border-[#39FF14]/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <iframe 
                       src="https://www.youtube.com/embed/hvCCHVRK9iU?rel=0&modestbranding=1&autohide=1&showinfo=0&controls=1" 
                       title="Orbit77 Video" 
                       frameBorder="0" 
                       allowFullScreen
                       className="absolute inset-0 w-full h-full object-cover opacity-[0.8] mix-blend-luminosity grayscale group-hover:grayscale-0 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-1000 z-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060B08] via-transparent to-transparent pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity duration-1000 z-10" />
                    <div className="relative z-20 h-full p-6 md:p-8 flex flex-col justify-end pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity duration-1000">
                       <h3 className="text-3xl font-serif text-[#F4EFEA] font-light italic drop-shadow-lg">The Part You Don&apos;t See</h3>
                       <p className="text-[10px] font-sans font-light tracking-[0.2em] uppercase text-[#AEFFA1]/80 mt-3">Watch on YouTube</p>
                    </div>
               </div>
           </motion.div>

           {/* WIDGET 2: THE ORIGIN STORY - 4 cols */}
           <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="col-span-1 md:col-span-4 bg-[#0A120D]/60 backdrop-blur-xl border border-[#39FF14]/10 rounded-[2rem] p-6 lg:p-8 flex flex-col h-full bg-gradient-to-b from-[#0A120D]/60 to-[#39FF14]/[0.02]">
                 <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#39FF14] mb-8 block font-bold">The Origin Story</span>
                 
                 <h3 className="text-2xl font-serif italic text-[#F4EFEA] mb-6">Born in Australia</h3>
                 <p className="text-[12px] font-sans font-light text-[#AEFFA1]/80 leading-relaxed mb-6">
                   Orbit 77 is a podcast designed in Australia by a group of friends trying to do something different. We talk about life, entertainment, and explore ideas with people from all over the world.
                 </p>
                 <p className="text-[12px] font-sans font-light text-[#AEFFA1]/80 leading-relaxed mb-6">
                   It’s not just a podcast. We wrote our own original song, created intros from scratch, and even launched our own clothing brand, all from the ground up.
                 </p>
                 <div className="mt-auto h-[1px] w-full bg-[#39FF14]/20" />
           </motion.div>

        </div>

        {/* ROW 2: METRICS (4), GOALS (4), STORE (4) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-6">
           
           {/* WIDGET 3: PROJECT METRICS */}
           <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="bg-[#0A120D]/60 backdrop-blur-xl border border-[#39FF14]/10 rounded-[2rem] p-6 lg:p-8 flex flex-col justify-between">
              <div>
                 <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#AEFFA1]/60 mb-8 block">Project Metrics</span>
                 
                 <div className="space-y-8">
                   <div>
                     <div className="flex justify-between text-[10px] md:text-xs font-mono text-[#AEFFA1]/80 mb-3">
                       <span>PUBLISHED EPISODES</span>
                       <span className="text-[#39FF14] animate-pulse">10 / 10</span>
                     </div>
                     <div className="w-full h-[2px] bg-[#39FF14]/10 relative rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 h-full w-full bg-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.5)]" />
                     </div>
                     <p className="text-[9px] mt-3 tracking-[0.2em] text-[#F4EFEA]/60 uppercase">10 Videos • 10 Spotify Tracks • ~45m Avg</p>
                   </div>

                   <div>
                     <div className="flex justify-between text-[10px] md:text-xs font-mono text-[#AEFFA1]/80 mb-3 mt-10">
                       <span>ORIGINAL PRODUCTION</span>
                       <span className="text-[#39FF14]">100%</span>
                     </div>
                     <div className="w-full h-[2px] bg-[#39FF14]/10 relative rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 h-full w-full bg-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.5)]" />
                     </div>
                     <p className="text-[9px] mt-3 tracking-[0.2em] text-[#F4EFEA]/60 uppercase">Original Song • Video Promos • Event Coverage</p>
                   </div>
                 </div>
              </div>
           </motion.div>

           {/* WIDGET 4: OUR NEXT GOALS */}
           <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="bg-[#0A120D]/60 backdrop-blur-xl border border-[#39FF14]/10 rounded-[2rem] p-6 lg:p-8 flex flex-col justify-between">
              <div>
                 <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#AEFFA1]/60 mb-6 block">Our Next Goals</span>
                 <p className="text-[11px] font-sans font-light text-[#F4EFEA]/60 leading-relaxed mb-6">
                   Orbit 77 is already producing high-quality entertainment. To take it to the next level, we are focused on three main goals:
                 </p>
                 
                 <ul className="space-y-5 text-sm font-light text-[#AEFFA1]/90 font-serif italic">
                    <li className="flex items-center gap-4">
                      <span className="text-[8px] uppercase font-sans tracking-widest text-[#39FF14] bg-[#39FF14]/10 border border-[#39FF14]/20 px-2 py-1 rounded">01</span>
                      Go viral and grow on TikTok & IG.
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="text-[8px] uppercase font-sans tracking-widest text-[#39FF14] bg-[#39FF14]/10 border border-[#39FF14]/20 px-2 py-1 rounded">02</span>
                      Sell and expand our clothing brand.
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="text-[8px] uppercase font-sans tracking-widest text-[#39FF14] bg-[#39FF14]/10 border border-[#39FF14]/20 px-2 py-1 rounded">03</span>
                      Recruit dedicated administrators.
                    </li>
                 </ul>
              </div>
           </motion.div>

           {/* WIDGET 5: E-COMMERCE (Our Store) */}
           <motion.div {...fadeUp} transition={{ delay: 0.5 }} className="bg-[#0A120D]/60 backdrop-blur-xl border border-[#39FF14]/10 rounded-[2rem] p-6 lg:p-8 flex flex-col justify-between group hover:border-[#39FF14]/40 transition-colors">
              <div>
                 <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#AEFFA1]/60 mb-6 block">Our Store</span>
                 <h3 className="text-3xl font-serif italic text-[#F4EFEA] mb-4">Orbit77.shop</h3>
                 <p className="text-[11px] font-sans font-light text-[#AEFFA1]/60 leading-relaxed max-w-xs">
                   Support our journey by buying our official clothing brand. By wearing Orbit 77, you become part of the community globally.
                 </p>
              </div>
              <a href="https://orbit77.shop/" target="_blank" rel="noreferrer" className="mt-8 flex items-center justify-between border border-[#39FF14]/20 rounded-2xl p-6 bg-black/20 hover:bg-[#39FF14]/10 transition-colors group-hover:border-[#39FF14]/50">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#39FF14]">Shop Clothing</span>
                <span className="text-[#39FF14] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500">↗</span>
              </a>
           </motion.div>

        </div>

        {/* WIDGET 6: PARTICIPATION MATRIX (Full Width Action Grid) */}
        <motion.div {...fadeUp} transition={{ delay: 0.6 }} className="w-full bg-[#0A120D]/60 backdrop-blur-xl border border-[#39FF14]/30 rounded-[2rem] p-6 lg:p-10 flex flex-col justify-between shadow-[0_0_50px_rgba(57,255,20,0.03)] mt-2">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#39FF14] mb-8 block font-bold">Invest & Participate</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
               
               {/* 1. Partner With Us (Equity) */}
               <a href="mailto:invest@pyadra.com" className="flex flex-col justify-between bg-gradient-to-br from-[#39FF14]/[0.15] to-transparent border border-[#39FF14]/40 p-6 xl:p-8 rounded-[1.5rem] hover:bg-[#39FF14]/30 hover:shadow-[0_0_30px_rgba(57,255,20,0.2)] transition-all text-left group">
                  <div>
                    <h4 className="font-serif italic text-[#39FF14] text-2xl xl:text-3xl mb-3">Partner With Us</h4>
                    <p className="text-[10px] xl:text-[11px] text-[#AEFFA1]/80 tracking-wide leading-relaxed font-light">Acquire 10%, 20%, 30%, or up to 100% of the podcast&apos;s equity directly.</p>
                  </div>
                  <span className="text-[9px] xl:text-[10px] uppercase tracking-[0.2em] font-bold text-[#39FF14] mt-8 group-hover:translate-x-2 transition-transform">Get in Touch →</span>
               </a>

               {/* 2. Sponsor the Podcast (Stripe / Coffee) - GOLD PYADRA ACCENT */}
               <button onClick={() => setStripeOpen(true)} className="flex flex-col justify-between bg-black/40 border border-[#FFB000]/10 p-6 xl:p-8 rounded-[1.5rem] hover:border-[#FFB000]/30 hover:shadow-[0_0_30px_rgba(255,176,0,0.1)] transition-all text-left group">
                  <div>
                    <h4 className="font-serif italic text-[#FFB000] text-xl xl:text-2xl mb-3">Buy us a Coffee</h4>
                    <p className="text-[10px] xl:text-[11px] text-[#AEFFA1]/60 tracking-wide leading-relaxed font-light">Support our journey with a direct donation. Help us keep filming and creating in Australia.</p>
                  </div>
                  <span className="text-[9px] xl:text-[10px] uppercase tracking-[0.3em] text-[#FFB000] mt-8 group-hover:translate-x-2 transition-transform">Sponsor Us →</span>
               </button>

               {/* 3. Join the Crew */}
               <a href="mailto:genesis@pyadra.com" className="flex flex-col justify-between bg-black/40 border border-[#39FF14]/10 p-6 xl:p-8 rounded-[1.5rem] hover:border-[#39FF14]/30 transition-colors text-left group">
                  <div>
                    <h4 className="font-serif italic text-[#F4EFEA] text-xl xl:text-2xl mb-3">Join The Crew</h4>
                    <p className="text-[10px] xl:text-[11px] text-[#AEFFA1]/60 tracking-wide leading-relaxed font-light">We urgently need people skilled in social media, marketing, and administration to join the team.</p>
                  </div>
                  <span className="text-[9px] xl:text-[10px] uppercase tracking-[0.3em] text-[#AEFFA1] mt-8 group-hover:translate-x-2 transition-transform">Give Talent →</span>
               </a>

               {/* 4. Follow the Journey */}
               <a href="https://www.youtube.com/@Orbit77Podcast" target="_blank" rel="noreferrer" className="flex flex-col justify-between bg-black/40 border border-[#39FF14]/10 p-6 xl:p-8 rounded-[1.5rem] hover:border-[#39FF14]/30 transition-colors text-left group">
                  <div>
                    <h4 className="font-serif italic text-[#F4EFEA] text-xl xl:text-2xl mb-3">Follow Us</h4>
                    <p className="text-[10px] xl:text-[11px] text-[#AEFFA1]/60 tracking-wide leading-relaxed font-light">Join the community. Watch us on YouTube, listen on Spotify, and follow us on Instagram & TikTok.</p>
                  </div>
                  <span className="text-[9px] xl:text-[10px] uppercase tracking-[0.3em] text-[#AEFFA1] mt-6 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform">Subscribe ↗</span>
               </a>

            </div>
        </motion.div>

      </main>

      {/* Stripe Modal retains the bioluminescent green perfection */}
      {stripeOpen && (
         <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#060B08]/90 backdrop-blur-xl">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="w-full max-w-xl bg-[#0A120D] border border-[#39FF14]/20 rounded-[2rem] p-10 md:p-16 relative flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
           >
             <button 
               onClick={() => setStripeOpen(false)} 
               className="absolute top-8 right-8 text-[9px] font-sans tracking-[0.3em] uppercase text-[#AEFFA1]/50 hover:text-[#F4EFEA] transition-colors duration-300 cursor-pointer"
             >
               Close
             </button>
             
             <h3 className="text-3xl md:text-5xl font-serif italic text-[#F4EFEA] mb-8 text-center">
                Buy Us a Coffee
             </h3>
             <p className="text-xs font-light font-sans text-[#F4EFEA]/50 leading-loose mb-12 text-center max-w-sm mx-auto">
                No amount is too small. Your sponsorship helps us cover studio time, equipment, and keeps us creating in Australia.
             </p>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
               {[10, 50, 100].map(val => (
                 <button 
                   key={val} 
                   onClick={() => setAmountAud(val)} 
                   className={`py-6 rounded-[1.5rem] text-sm font-light tracking-widest transition-all duration-500 cursor-pointer ${amountAud === val ? 'bg-[#39FF14] text-[#060B08] shadow-[0_10px_20px_rgba(57,255,20,0.3)] font-bold' : 'bg-[#39FF14]/5 text-[#39FF14] border border-[#39FF14]/10 hover:bg-[#39FF14]/10 hover:border-[#39FF14]/40'}`}
                 >
                   ${val}
                 </button>
               ))}
             </div>
             
             <button 
               onClick={handleSupport} 
               disabled={loading || !amountAud} 
               className={`w-full py-6 rounded-full text-[10px] md:text-xs font-sans tracking-[0.4em] uppercase transition-all duration-700 flex justify-center items-center gap-4 cursor-pointer ${!amountAud || loading ? 'bg-[#FFB000]/5 text-[#FFB000]/30 cursor-not-allowed border border-[#FFB000]/10' : 'bg-gradient-to-r from-[#FFB000] to-[#E3DAC9] text-[#060B08] hover:shadow-[0_0_30px_rgba(255,176,0,0.4)]'}`}
             >
               {loading ? 'Processing Transaction...' : 'Sponsor Podcast'}
               {amountAud && !loading && <span className="text-[#060B08]">→</span>}
             </button>
           </motion.div>
         </div>
      )}

    </div>
  );
}
