"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function OrbitOrganic() {
  const [stripeOpen, setStripeOpen] = useState(false);
  const [amountAud, setAmountAud] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#171211] text-[#F4EFEA] overflow-x-hidden font-sans selection:bg-[#FCA880]/30 pb-40 relative">
      
      {/* Warm Ambient Breath (Replacing the brutalist heatmap) */}
      <motion.div 
        animate={{ opacity: [0.03, 0.08, 0.03], scale: [1, 1.05, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] rounded-full blur-[160px] pointer-events-none mix-blend-screen z-0"
        style={{ background: "radial-gradient(circle at center, rgba(220, 168, 143, 0.2) 0%, rgba(252, 168, 128, 0.05) 50%, transparent 70%)" }}
      />
      
      {/* Delicate Navigation */}
      <nav className="fixed top-0 left-0 w-full p-8 md:p-12 z-50 flex justify-between items-start pointer-events-none mix-blend-screen">
        <Link href="/projects" className="pointer-events-auto text-[10px] uppercase font-sans font-light tracking-[0.3em] text-[#DCA88F] hover:text-[#F4EFEA] transition-colors duration-500">
          [ Return to Constellation ]
        </Link>
        <div className="text-right flex flex-col items-end">
          <p className="text-[9px] font-sans font-light tracking-[0.3em] text-[#DCA88F]/60 mb-2 uppercase">Genesis Node</p>
          <div className="flex items-center gap-3 text-[#F4EFEA]/80 text-[10px] font-sans font-light tracking-widest uppercase">
            <span className="w-1.5 h-1.5 bg-[#FCA880] rounded-full animate-[pulse_2s_infinite] shadow-[0_0_10px_rgba(252,168,128,0.8)]" />
            Active Incubation
          </div>
        </div>
      </nav>

      {/* Massive Centered Editorial Header (Matches the Homepage format) */}
      <section className="relative w-full flex flex-col justify-center items-center pt-32 md:pt-48 px-8 z-10 text-center">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="relative max-w-4xl flex flex-col items-center"
        >
          <p className="text-[9px] uppercase tracking-[0.6em] text-[#DCA88F]/60 mb-12 font-sans font-light">Exhibit 01</p>
          
          <h1 
            className="text-[6rem] md:text-[9rem] leading-[0.8] font-serif italic font-light text-[#F4EFEA] mb-12"
            style={{ textShadow: "0px 10px 40px rgba(220,168,143,0.3)" }}
          >
            Orbit 77
          </h1>
          
          <p className="text-xs md:text-sm font-light font-sans leading-loose text-[#F4EFEA]/60 max-w-lg mx-auto">
            A decentralized ecosystem linking capital and continuous artistic preservation.
          </p>

          <Link href="#exhibit" onClick={(e) => { e.preventDefault(); document.getElementById('exhibit')?.scrollIntoView({ behavior: 'smooth' }) }} className="group flex flex-col items-center gap-4 mt-20 transition-all duration-700 hover:-translate-y-1">
             <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-light text-[#DCA88F] group-hover:text-[#F4EFEA] transition-colors duration-500">
               Descend
             </span>
             <div className="w-[1px] h-12 bg-gradient-to-b from-[#DCA88F]/80 to-transparent group-hover:h-20 group-hover:from-[#F4EFEA] transition-all duration-[1000ms] ease-out" />
          </Link>
        </motion.div>
      </section>

      {/* The Centered Artifact Window (Replaced the 50/50 split box) */}
      <section id="exhibit" className="relative w-full max-w-5xl mx-auto px-8 mt-32 md:mt-48 z-10 flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5 }}
          className="w-full aspect-[4/3] md:aspect-video bg-[#1A1514] border border-[#DCA88F]/10 relative group overflow-hidden p-8 md:p-12 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem] md:rounded-[3rem]"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSIvPjwvc3ZnPg==')] opacity-10 mix-blend-overlay pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#DCA88F]/10 to-transparent mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative z-10 flex w-full justify-between items-start">
             <p className="text-[9px] font-sans font-light tracking-[0.3em] uppercase text-[#DCA88F]/80">Transmission</p>
             <span className="w-2 h-2 rounded-full bg-[#FCA880]/30 group-hover:bg-[#FCA880] transition-colors duration-700" />
          </div>

          <div className="relative z-10 flex w-full justify-between items-end">
            <div>
               <h3 className="text-2xl md:text-4xl font-serif text-[#F4EFEA] font-light italic mb-2">The Genesis Cut</h3>
               <p className="text-[10px] font-light text-[#F4EFEA]/40 uppercase tracking-[0.3em]">04 • 2026</p>
            </div>
            
            <div className="w-16 h-16 rounded-full border border-[#DCA88F]/30 flex items-center justify-center text-[#DCA88F] hover:border-[#FCA880] hover:bg-[#FCA880]/10 hover:text-[#FCA880] transition-all duration-700 cursor-pointer group-hover:scale-110 shadow-lg">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                 <path d="M8 5v14l11-7z" />
               </svg>
            </div>
          </div>
        </motion.div>

        {/* The Evolution Log (Centered elegant elegant list, perfectly harmonized) */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="w-full max-w-2xl mt-40 md:mt-48 text-center"
        >
          <h3 className="text-3xl font-serif italic text-[#F4EFEA] mb-16 pb-8 border-b border-[#DCA88F]/10 inline-block px-12">
            Evolution Log
          </h3>
          
          <div className="space-y-16 text-xs md:text-sm font-light text-[#F4EFEA]/70 leading-loose flex flex-col items-center">
            
            <div className="flex flex-col items-center gap-4">
              <span className="text-[9px] tracking-[0.3em] text-[#DCA88F]/40 font-mono">01</span>
              <p className="opacity-40">Conceptual architecture mapped.</p>
              <p className="opacity-40">Visual language refined to Human Warmth.</p>
            </div>

            <div className="flex flex-col items-center gap-4 mt-8">
              <span className="text-[9px] tracking-[0.3em] text-[#DCA88F] font-mono">02</span>
              <p className="text-[#F4EFEA] max-w-sm text-center">
                 Developing the core mechanisms of decentralized capital flow. 
                 <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FCA880] animate-pulse align-middle ml-3 shadow-[0_0_8px_rgba(252,168,128,0.8)]" />
              </p>
            </div>

            <div className="flex flex-col items-center mt-12 p-8 rounded-3xl bg-[#DCA88F]/[0.02] border border-[#DCA88F]/10 w-full max-w-lg">
              <p className="leading-loose text-[#DCA88F] italic font-serif text-lg">
                 "Our connection to the ecosystem is defined by the capital we breathe into it. The node awaits propagation."
              </p>
            </div>

          </div>

          <div className="mt-32 flex justify-center">
            <button 
              onClick={() => setStripeOpen(true)} 
              className="group flex flex-col items-center gap-4 transition-all duration-700 hover:-translate-y-1"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-light text-[#DCA88F] group-hover:text-[#FCA880] transition-colors duration-500">
                Inject Genesis Capital
              </span>
              <div className="w-[1px] h-12 bg-gradient-to-b from-[#DCA88F]/80 to-transparent group-hover:h-20 group-hover:from-[#FCA880] transition-all duration-[1000ms] ease-out" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Stripe Modal (Warm Elegance UI) */}
      {stripeOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171211]/80 backdrop-blur-xl">
           <div className="w-full max-w-xl bg-[#1A1514] border border-[#DCA88F]/20 rounded-[2rem] p-10 md:p-16 relative flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
             <button 
               onClick={() => setStripeOpen(false)} 
               className="absolute top-8 right-8 text-[9px] font-sans tracking-[0.3em] uppercase text-[#DCA88F]/50 hover:text-[#F4EFEA] transition-colors duration-300"
             >
               Close
             </button>
             
             <h3 className="text-3xl md:text-5xl font-serif italic text-[#F4EFEA] mb-6 text-center">
                Ignite Core
             </h3>
             <p className="text-xs font-light text-[#F4EFEA]/50 leading-loose mb-12 text-center max-w-xs mx-auto">
                Select your level of incubation capital to permanently anchor yourself to Orbit 77's genesis.
             </p>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
               {[10, 50, 100].map(val => (
                 <button 
                   key={val} 
                   onClick={() => setAmountAud(val)} 
                   className={`py-6 rounded-[1.5rem] text-sm font-light tracking-widest transition-all duration-500 ${amountAud === val ? 'bg-[#DCA88F] text-[#171211] shadow-[0_10px_20px_rgba(220,168,143,0.3)]' : 'bg-[#DCA88F]/5 text-[#DCA88F] border border-[#DCA88F]/10 hover:bg-[#DCA88F]/10 hover:border-[#DCA88F]/30'}`}
                 >
                   ${val}
                 </button>
               ))}
             </div>
             
             <button 
               onClick={handleSupport} 
               disabled={loading || !amountAud} 
               className={`w-full py-6 rounded-full text-[10px] md:text-xs tracking-[0.4em] uppercase transition-all duration-700 flex justify-center items-center gap-4 ${!amountAud || loading ? 'bg-[#DCA88F]/5 text-[#DCA88F]/30 cursor-not-allowed border border-[#DCA88F]/5' : 'bg-gradient-to-r from-[#DCA88F] to-[#FCA880] text-[#171211] hover:shadow-[0_0_30px_rgba(252,168,128,0.4)]'}`}
             >
               {loading ? 'Processing Transaction...' : 'Inject Capital'}
             </button>
           </div>
         </div>
      )}

    </div>
  );
}
