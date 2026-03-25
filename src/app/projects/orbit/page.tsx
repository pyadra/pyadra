"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function OrbitAliasGreen() {
  const [stripeOpen, setStripeOpen] = useState(false);
  const [amountAud, setAmountAud] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  
  // High-End Polish: Tie Scroll Depth to Background Magic (Bioluminescence)
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 2000], ["-50%", "10%"]);

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
      if (data?.url) window.location.href = data.url;
      else throw new Error("Unable to start checkout");
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-10%" },
    transition: { duration: 1.5, ease: "easeOut" }
  };

  return (
    // BRAND ALIEN INTEGRATION: Deep Obsidian Green base (#060B08)
    <div className="min-h-screen bg-[#060B08] text-[#F4EFEA] overflow-x-hidden font-sans selection:bg-[#39FF14]/20 selection:text-[#39FF14] pb-40 relative">
      
      {/* Scroll-Synced Environmental Breathing Glow (Bioluminescent Green) */}
      <motion.div 
        animate={{ opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="fixed left-1/2 -translate-x-1/2 w-[120vw] h-[120vh] rounded-full blur-[180px] pointer-events-none mix-blend-screen z-0"
        style={{ 
          top: backgroundY, // Active Theory detail: moves down as you read!
          background: "radial-gradient(circle at center, rgba(57, 255, 20, 0.15) 0%, rgba(80, 200, 120, 0.05) 40%, transparent 60%)" 
        }}
      />
      
      {/* Disconnect System Navigation */}
      <nav className="fixed top-0 left-0 w-full p-8 md:p-12 z-50 flex justify-between items-start pointer-events-none mix-blend-screen">
        <Link href="/projects" className="pointer-events-auto text-[10px] uppercase font-sans font-light tracking-[0.3em] text-[#AEFFA1] hover:text-[#39FF14] transition-colors duration-500">
          [ Disconnect ]
        </Link>
      </nav>

      {/* PHASE 1: CURIOSITY */}
      <section className="relative w-full min-h-screen flex flex-col justify-center items-center px-8 z-10 text-center">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <span className="w-1.5 h-1.5 bg-[#39FF14] rounded-full animate-[pulse_1.5s_infinite] shadow-[0_0_15px_rgba(57,255,20,0.8)] mb-8" />
          
          <h1 
            className="text-[6rem] md:text-[10rem] leading-[0.8] font-serif italic font-light text-[#F4EFEA] mb-12"
            style={{ textShadow: "0px 10px 40px rgba(57,255,20,0.15)" }}
          >
            Orbit 77
          </h1>
          
          <p className="text-sm md:text-base font-light font-sans text-[#AEFFA1]/60 max-w-sm tracking-wide">
            A signal in the void.
          </p>

          <Link href="#understanding" onClick={(e) => { e.preventDefault(); document.getElementById('understanding')?.scrollIntoView({ behavior: 'smooth' }) }} className="group flex flex-col items-center gap-4 mt-32 transition-all duration-700 hover:-translate-y-1">
             <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-light text-[#AEFFA1] group-hover:text-[#39FF14] transition-colors duration-500">
               Investigate
             </span>
             <div className="w-[1px] h-12 bg-gradient-to-b from-[#AEFFA1]/80 to-transparent group-hover:h-20 group-hover:from-[#39FF14] transition-all duration-[1000ms] ease-out" />
          </Link>
        </motion.div>
      </section>

      {/* PHASE 2: UNDERSTANDING */}
      <section id="understanding" className="relative w-full min-h-[80vh] flex flex-col justify-center items-center px-8 pt-24 z-10">
        <motion.div {...fadeUp} className="w-full max-w-3xl text-center">
          <p className="text-2xl md:text-4xl font-serif italic text-[#F4EFEA] leading-relaxed mb-8">
            This is not just a podcast. <br/>
            It is a living documentary bridging capital and continuous artistic preservation.
          </p>
          <p className="text-xs md:text-sm font-sans font-light text-[#AEFFA1]/60 leading-loose max-w-xl mx-auto">
            Seven voices. One fire. And a conversation beyond what meets the eye. Orbit 77 is an ecosystem of recorded conversations, raw footage, and thoughts captured in real time.
          </p>
        </motion.div>

        {/* YouTube Artifact Container Styled with Alien Biology */}
        <motion.div 
          {...fadeUp}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="w-full max-w-4xl aspect-[16/9] bg-[#0A120D] border border-[#39FF14]/10 relative group overflow-hidden mt-32 flex flex-col justify-end shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-[2rem] md:rounded-[3rem]"
        >
          <iframe 
            src="https://www.youtube.com/embed/hvCCHVRK9iU?rel=0&modestbranding=1&autohide=1&showinfo=0&controls=1" 
            title="Orbit77 T1 Ep10" 
            frameBorder="0" 
            allowFullScreen
            className="absolute inset-0 w-full h-full object-cover opacity-[0.65] mix-blend-luminosity grayscale group-hover:grayscale-0 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-[1500ms] pointer-events-auto z-0"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#060B08] via-[#060B08]/40 to-transparent pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity duration-1000 z-10" />
          
          <div className="relative z-20 p-8 md:p-12 flex w-full justify-between items-end pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity duration-1000">
            <div>
               <p className="text-[9px] font-sans font-light tracking-[0.3em] uppercase text-[#AEFFA1]/80 mb-2">T1 • Transmission 10</p>
               <h3 className="text-xl md:text-3xl font-serif text-[#F4EFEA] font-light italic">The Part You Don't See</h3>
            </div>
            
            <div className="w-14 h-14 rounded-full border border-[#AEFFA1]/30 flex items-center justify-center text-[#F4EFEA] bg-[#0A120D]/60 backdrop-blur-sm">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                 <path d="M8 5v14l11-7z" />
               </svg>
            </div>
          </div>
        </motion.div>
      </section>

      {/* PHASE 3: REALITY */}
      <section className="relative w-full min-h-[80vh] flex flex-col justify-center items-center px-8 z-10 mt-32 md:mt-48 text-center">
        <motion.div {...fadeUp} className="w-full max-w-2xl">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#39FF14]/70 mb-12 font-sans">
            Current State: Open Construction
          </p>
          <h2 className="text-3xl md:text-5xl font-serif italic text-[#F4EFEA] mb-8">
            An organism in its infancy.
          </h2>
          <p className="text-sm font-sans font-light text-[#AEFFA1]/50 leading-loose max-w-lg mx-auto">
            We are architecting it in real time, completely exposed. There are gaps and unrecorded dialogues waiting to be filled by the community.
          </p>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.2, duration: 1.5 }} className="w-full max-w-xl mt-24 space-y-4 text-left">
          <div className="flex flex-col gap-2 border-l border-[#39FF14]/10 pl-6 pb-8">
            <span className="text-[9px] font-sans tracking-[0.3em] uppercase text-[#AEFFA1]/40">Status: Complete</span>
            <p className="text-[#F4EFEA]/40 font-light text-sm">Conceptual architecture established. Season 1 recordings captured.</p>
          </div>
          
          <div className="flex flex-col gap-2 border-l border-[#39FF14] pl-6 pb-8">
             <span className="text-[9px] font-sans tracking-[0.3em] uppercase text-[#39FF14] flex items-center gap-3">
               Status: In Progress <span className="w-1.5 h-1.5 bg-[#39FF14] rounded-full animate-pulse shadow-[0_0_10px_rgba(57,255,20,0.8)]" />
             </span>
             <p className="text-[#F4EFEA] font-light text-sm">Developing decentralized funding mechanisms.</p>
          </div>
          
          <div className="flex flex-col gap-2 border-l border-[#39FF14]/10 pl-6 pb-2">
            <span className="text-[9px] font-sans tracking-[0.3em] uppercase text-[#AEFFA1]/40">Status: Missing</span>
            <p className="text-[#F4EFEA]/40 font-light text-sm">Audio engineers, early narrative contributors, and initial propagation capital.</p>
          </div>
        </motion.div>
      </section>

      {/* PHASE 4 & 5: OPPORTUNITY & ACTION */}
      <section className="relative w-full flex flex-col justify-center items-center px-8 z-10 mt-32 md:mt-48 text-center">
        <motion.div {...fadeUp} className="w-full max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-serif italic text-[#F4EFEA] mb-8">
            The node requires energy to propagate.
          </h2>
          <p className="text-sm font-sans font-light text-[#AEFFA1]/80 leading-loose max-w-2xl mx-auto mb-24">
            This is your opportunity to anchor yourself to the genesis block of a real venture. Subscribe to the channel, contribute your talent, or deploy capital. Be part of something early.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
            {/* ACTION 1: Witness */}
            <a href="https://www.youtube.com/@Orbit77Podcast" target="_blank" rel="noreferrer" className="group flex flex-col items-center justify-between p-10 bg-[#0A120D] border border-[#39FF14]/10 rounded-[2rem] hover:border-[#39FF14]/30 hover:bg-[#39FF14]/[0.02] transition-all duration-700 cursor-pointer min-h-[280px]">
              <div className="mb-8 flex flex-col items-center">
                <span className="text-2xl font-serif italic text-[#F4EFEA] mb-4">Witness</span>
                <p className="text-[10px] font-sans font-light text-[#F4EFEA]/40 uppercase tracking-[0.2em] leading-relaxed">
                  Observe the evolution by joining the main broadcasting channel.
                </p>
              </div>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#AEFFA1] group-hover:text-[#39FF14] transition-colors">Subscribe →</span>
            </a>

            {/* ACTION 2: Inject Capital */}
            <div onClick={() => setStripeOpen(true)} className="relative group flex flex-col items-center justify-between p-10 bg-[#0A120D] border border-[#39FF14]/20 rounded-[2rem] hover:border-[#39FF14] hover:shadow-[0_0_30px_rgba(57,255,20,0.15)] transition-all duration-700 cursor-pointer overflow-hidden pb-10 min-h-[280px]">
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#39FF14]/10 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10 mb-8 flex flex-col items-center">
                <span className="text-2xl font-serif italic text-[#39FF14] mb-4">Provide Capital</span>
                <p className="text-[10px] font-sans font-light text-[#F4EFEA]/60 uppercase tracking-[0.2em] leading-relaxed">
                  Anchor yourself financially to the genesis block of Orbit 77.
                </p>
              </div>
              <span className="relative z-10 text-[9px] uppercase tracking-[0.3em] font-bold text-[#39FF14] group-hover:text-[#F4EFEA] transition-colors">Support →</span>
            </div>

            {/* ACTION 3: Join */}
            <a href="mailto:genesis@pyadra.com" className="group flex flex-col items-center justify-between p-10 bg-[#0A120D] border border-[#39FF14]/10 rounded-[2rem] hover:border-[#39FF14]/30 hover:bg-[#39FF14]/[0.02] transition-all duration-700 cursor-pointer min-h-[280px]">
              <div className="mb-8 flex flex-col items-center">
                <span className="text-2xl font-serif italic text-[#F4EFEA] mb-4">Contribute Skill</span>
                <p className="text-[10px] font-sans font-light text-[#F4EFEA]/40 uppercase tracking-[0.2em] leading-relaxed">
                  Provide labor, audio engineering, or narrative support.
                </p>
              </div>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#AEFFA1] group-hover:text-[#39FF14] transition-colors">Join →</span>
            </a>
          </div>
        </motion.div>
      </section>

      {/* Stripe Modal (Bioluminescent Green UI) */}
      {stripeOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060B08]/90 backdrop-blur-xl">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="w-full max-w-xl bg-[#0A120D] border border-[#39FF14]/20 rounded-[2rem] p-10 md:p-16 relative flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
           >
             <button 
               onClick={() => setStripeOpen(false)} 
               className="absolute top-8 right-8 text-[9px] font-sans tracking-[0.3em] uppercase text-[#AEFFA1]/50 hover:text-[#F4EFEA] transition-colors duration-300"
             >
               Close
             </button>
             
             <h3 className="text-3xl md:text-5xl font-serif italic text-[#F4EFEA] mb-8 text-center">
                Incubation Capital
             </h3>
             <p className="text-xs font-light font-sans text-[#F4EFEA]/50 leading-loose mb-12 text-center max-w-sm mx-auto">
                You are not donating. You are actively providing the energy required for this node to survive and propagate.
             </p>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
               {[10, 50, 100].map(val => (
                 <button 
                   key={val} 
                   onClick={() => setAmountAud(val)} 
                   className={`py-6 rounded-2xl text-sm font-light tracking-widest transition-all duration-500 ${amountAud === val ? 'bg-[#39FF14] text-[#060B08] shadow-[0_10px_20px_rgba(57,255,20,0.3)] font-bold' : 'bg-[#39FF14]/5 text-[#39FF14] border border-[#39FF14]/10 hover:bg-[#39FF14]/10 hover:border-[#39FF14]/40'}`}
                 >
                   ${val}
                 </button>
               ))}
             </div>
             
             <button 
               onClick={handleSupport} 
               disabled={loading || !amountAud} 
               className={`w-full py-6 rounded-full text-[10px] md:text-xs font-sans tracking-[0.4em] uppercase transition-all duration-700 flex justify-center items-center gap-4 ${!amountAud || loading ? 'bg-[#39FF14]/5 text-[#39FF14]/30 cursor-not-allowed border border-[#39FF14]/10' : 'bg-gradient-to-r from-[#2DCC54] to-[#39FF14] text-[#060B08] hover:shadow-[0_0_30px_rgba(57,255,20,0.4)]'}`}
             >
               {loading ? 'Processing Transaction...' : 'Provide Capital'}
               {amountAud && !loading && <span className="text-[#060B08]">→</span>}
             </button>
           </motion.div>
         </div>
      )}

    </div>
  );
}
