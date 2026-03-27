"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Form Component wrapped in Suspense to handle `useSearchParams` properly in App Router
function ApplicationForm() {
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") || "open-application";
  
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    // Simulate submission to API / Mailing service
    setTimeout(() => setStatus("success"), 1500); 
  };

  if (status === "success") {
    return (
       <div className="text-center py-20 border border-[#39FF14]/20 rounded-2xl bg-[#050A07]/80 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
         <span className="w-3 h-3 rounded-full bg-[#39FF14] animate-pulse mx-auto block mb-6 shadow-[0_0_15px_rgba(57,255,20,0.8)]" />
         <h3 className="text-3xl lg:text-4xl font-serif italic text-[#39FF14] mb-4 drop-shadow-[0_0_15px_rgba(57,255,20,0.3)]">Transmission Confirmed</h3>
         <p className="text-sm font-light font-sans text-[#AEFFA1]/80">Pablo and Eduardo will review your data shortly.</p>
         <Link href="/projects/orbit" className="mt-10 inline-block text-[10px] uppercase font-mono tracking-[0.2em] font-bold text-[#39FF14] border-b border-[#39FF14]/30 pb-1 hover:border-[#39FF14] transition-colors">
            Return to Orbit 77
         </Link>
       </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Name */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase font-mono tracking-widest text-[#AEFFA1]/70 font-bold">Your name</label>
        <input required type="text" placeholder="First and last name" className="bg-[#0A120D] border border-[#39FF14]/20 focus:border-[#39FF14] focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] rounded-xl px-5 py-4 text-sm font-sans text-[#F4EFEA] outline-none transition-all placeholder:text-[#AEFFA1]/30" />
      </div>
      
      {/* Email */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase font-mono tracking-widest text-[#AEFFA1]/70 font-bold">Your email</label>
        <input required type="email" placeholder="we'll reply here" className="bg-[#0A120D] border border-[#39FF14]/20 focus:border-[#39FF14] focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] rounded-xl px-5 py-4 text-sm font-sans text-[#F4EFEA] outline-none transition-all placeholder:text-[#AEFFA1]/30" />
      </div>
      
      {/* Role Dropdown */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase font-mono tracking-widest text-[#AEFFA1]/70 font-bold">Which role are you applying for?</label>
        <select required defaultValue={defaultRole} className="appearance-none bg-[#0A120D] border border-[#39FF14]/20 focus:border-[#39FF14] focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] rounded-xl px-5 py-4 text-sm font-sans text-[#F4EFEA] outline-none transition-all cursor-pointer">
          <option value="social-media-operator">Social Media Operator 🔴</option>
          <option value="marketing-strategist">Marketing Strategist 🔴</option>
          <option value="video-editor">Video Editor 🟡</option>
          <option value="community-manager">Community Manager 🟡</option>
          <option value="sponsor-outreach">Sponsor Outreach 🟢</option>
          <option value="open-application">Open Application — tell us what you do</option>
        </select>
      </div>

      {/* Portfolio */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase font-mono tracking-widest text-[#AEFFA1]/70 font-bold">Where can we see your work?</label>
        <input required type="text" placeholder="Link to portfolio, Instagram, TikTok, LinkedIn, anything real" className="bg-[#0A120D] border border-[#39FF14]/20 focus:border-[#39FF14] focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] rounded-xl px-5 py-4 text-sm font-sans text-[#F4EFEA] outline-none transition-all placeholder:text-[#AEFFA1]/30" />
        <p className="text-[9px] font-sans text-[#AEFFA1]/50 ml-1">No portfolio? Tell us what you&apos;ve done instead. That works too.</p>
      </div>

      {/* Why Orbit 77 */}
      <div className="flex flex-col gap-2 mt-4">
        <label className="text-[10px] uppercase font-mono tracking-widest text-[#AEFFA1]/70 font-bold">Why Orbit 77?</label>
        <textarea required rows={4} placeholder="Not looking for a cover letter. Tell us in your own words why this caught your attention and what you'd actually do here." className="bg-[#0A120D] border border-[#39FF14]/20 focus:border-[#39FF14] focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] rounded-xl px-5 py-4 text-sm font-sans text-[#F4EFEA] outline-none transition-all resize-none placeholder:text-[#AEFFA1]/30" />
        <p className="text-[9px] font-sans text-[#AEFFA1]/50 ml-1">3 sentences or 3 paragraphs. Whatever feels right.</p>
      </div>

      {/* Anything else */}
      <div className="flex flex-col gap-2 mt-2">
        <label className="text-[10px] uppercase font-mono tracking-widest text-[#AEFFA1]/70 font-bold">Anything else? <span className="opacity-50">(Optional)</span></label>
        <textarea rows={2} placeholder="Questions, ideas, a voice note link. Whatever you want us to know." className="bg-[#0A120D] border border-[#39FF14]/20 focus:border-[#39FF14] focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] rounded-xl px-5 py-4 text-sm font-sans text-[#F4EFEA] outline-none transition-all resize-none placeholder:text-[#AEFFA1]/30" />
      </div>

      {/* Submit */}
      <button disabled={status === "submitting"} type="submit" className="mt-8 w-full bg-[#39FF14] hover:bg-[#39FF14]/80 text-[#060B08] py-5 rounded-xl text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] font-bold transition-all shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:shadow-[0_0_30px_rgba(57,255,20,0.6)] disabled:opacity-50">
        {status === "submitting" ? "TRANSMITTING..." : "SEND APPLICATION →"}
      </button>
    </form>
  )
}

export default function JoinCrewPage() {
  return (
    <div className="min-h-screen bg-[#020503] text-[#F4EFEA] overflow-x-hidden font-sans selection:bg-[#39FF14]/20 selection:text-[#39FF14] relative pb-24">
      {/* Background Deep Earth / Orbit Gradient */}
      <div className="fixed left-1/2 -translate-x-1/2 top-0 w-[120vw] h-[100vh] rounded-full blur-[180px] pointer-events-none mix-blend-screen z-0" style={{ background: "radial-gradient(circle at top, rgba(57, 255, 20, 0.08) 0%, transparent 60%)" }} />
      
      <nav className="relative z-50 w-full p-8 md:p-12 flex justify-between items-start pointer-events-none mix-blend-screen">
        <Link href="/projects/orbit" className="pointer-events-auto text-[9px] md:text-[10px] uppercase font-mono tracking-[0.3em] font-bold text-[#AEFFA1]/70 hover:text-[#39FF14] transition-colors duration-500">
          [ Return to Orbit 77 ]
        </Link>
      </nav>

      <main className="relative z-10 w-full max-w-2xl px-6 mx-auto flex flex-col pt-8 md:pt-12">
        
        {/* SECTION 1 - HEADER */}
        <div className="mb-14">
           <span className="text-[9px] md:text-[10px] font-mono tracking-[0.2em] uppercase text-[#39FF14] flex items-center gap-3 mb-6 font-bold drop-shadow-[0_0_8px_rgba(57,255,20,0.4)]">
             <span className="w-1.5 h-1.5 bg-[#39FF14] rounded-full animate-pulse shadow-[0_0_10px_rgba(57,255,20,0.8)]" /> 
             ORBIT 77 — CREW APPLICATION
           </span>
           <h1 className="text-5xl md:text-6xl font-serif italic font-light text-[#F4EFEA] mb-8">
             You want in.<br/>Tell us who you are.
           </h1>
           <p className="text-sm font-light font-sans text-[#AEFFA1] leading-relaxed bg-[#39FF14]/10 p-5 rounded-2xl border border-[#39FF14]/20 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
             We read every application. No bots. No auto-replies. Pablo and Eduardo review these personally.
           </p>
        </div>

        {/* SECTION 2 - FORM */}
        <div className="bg-[#050A07]/60 backdrop-blur-xl border border-[#39FF14]/20 rounded-3xl p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] mb-20">
           <Suspense fallback={<div className="text-center py-20 text-[#39FF14] font-mono text-[10px] uppercase tracking-widest animate-pulse font-bold">Initializing Matrix...</div>}>
             <ApplicationForm />
           </Suspense>
        </div>

        {/* SECTION 3 - NEXT STEPS */}
        <div className="mb-20">
          <h3 className="text-2xl font-serif italic text-[#F4EFEA] mb-8 border-b border-[#39FF14]/20 pb-4">What happens next?</h3>
          <div className="space-y-8">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#39FF14] block mb-2 font-bold">01 — We read it.</span>
              <p className="text-sm font-light text-[#AEFFA1]/80 leading-relaxed">Pablo and Eduardo review every application personally. Usually within 48 hours.</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#39FF14] block mb-2 font-bold">02 — We reply.</span>
              <p className="text-sm font-light text-[#AEFFA1]/80 leading-relaxed">If there&apos;s a fit, we schedule a quick call. No formal interviews. Just a conversation.</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#39FF14] block mb-2 font-bold">03 — You&apos;re in.</span>
              <p className="text-sm font-light text-[#AEFFA1]/80 leading-relaxed">We move fast. If it clicks, you start contributing within the same week.</p>
            </div>
          </div>
        </div>

        {/* SECTION 4 - SUPPORT ORBIT 77 */}
        <div className="bg-gradient-to-br from-[#101A14] to-[#0A120D] backdrop-blur-xl border border-[#39FF14]/30 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-[0_0_30px_rgba(57,255,20,0.1)]">
           <div className="absolute top-0 right-0 w-48 h-48 bg-[#39FF14]/10 rounded-full blur-[60px] pointer-events-none" />
           <div className="relative z-10">
             <h4 className="font-serif italic text-[#39FF14] text-2xl lg:text-3xl mb-4 drop-shadow-[0_0_10px_rgba(57,255,20,0.3)]">Not ready to apply?</h4>
             <p className="text-sm border border-[#39FF14]/20 bg-[#39FF14]/5 p-4 rounded-xl inline-block font-sans text-[#F4EFEA]/90 leading-relaxed mb-8 font-light">
               Support Orbit 77 directly.<br />
               <span className="font-mono text-[#39FF14]">Season 1 is complete. Help it reach further.</span>
             </p>
             <Link href="/projects/orbit#support" className="block w-full py-4 bg-[#39FF14]/10 hover:bg-[#39FF14] border border-[#39FF14]/40 hover:text-[#060B08] text-[#39FF14] rounded-xl text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] font-bold transition-all shadow-[0_0_15px_rgba(57,255,20,0.2)]">
               SUPPORT ORBIT 77 →
             </Link>
           </div>
        </div>
      </main>
    </div>
  );
}
