"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ProjectNav from "../../components/ProjectNav";
import LiveBackground from "../../components/LiveBackground";

// Form Component wrapped in Suspense to handle `useSearchParams` properly in App Router
function ApplicationForm() {
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") || "open-application";
  
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      role: formData.get("role"),
      work_link: formData.get("work_link"),
      message: formData.get("message") || "",
    };

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to submit");
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
       <div className="text-center py-20 border border-[var(--orbit-green)]/20 rounded-2xl bg-[var(--orbit-void)]/80 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
         <span className="w-3 h-3 rounded-full bg-[var(--orbit-green)] animate-pulse mx-auto block mb-6 shadow-[0_0_15px_rgba(57,255,20,0.8)]" />
         <h3 className="text-3xl lg:text-4xl font-serif italic text-[var(--orbit-green)] mb-4 drop-shadow-[0_0_15px_rgba(57,255,20,0.3)]">Application recorded.</h3>
         <p className="text-sm font-light font-sans text-[var(--orbit-cream)]/80">Pablo and Eduardo will review your data shortly.</p>
         <Link href="/exhibitions/galaxy/orbit" className="mt-10 inline-block text-sm uppercase font-mono tracking-wide font-bold text-[var(--orbit-green)] border-b border-[var(--orbit-green)]/30 pb-1 hover:border-[var(--orbit-green)] transition-colors">
            Return to Orbit 77
         </Link>
       </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Name */}
      <div className="flex flex-col gap-2">
        <label className="text-sm uppercase font-mono tracking-widest text-[var(--orbit-cream)]/95 font-bold">Your name</label>
        <input required name="name" type="text" placeholder="First and last name" className="bg-[var(--orbit-charcoal)] border border-[var(--orbit-green)]/20 focus:border-[var(--orbit-green)] focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] rounded-xl px-5 py-4 text-sm font-sans text-[var(--orbit-cream)] outline-none transition-all placeholder:text-[var(--orbit-cream)]/30" />
      </div>
      
      {/* Email */}
      <div className="flex flex-col gap-2">
        <label className="text-sm uppercase font-mono tracking-widest text-[var(--orbit-cream)]/95 font-bold">Your email</label>
        <input required name="email" type="email" placeholder="we'll reply here" className="bg-[var(--orbit-charcoal)] border border-[var(--orbit-green)]/20 focus:border-[var(--orbit-green)] focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] rounded-xl px-5 py-4 text-sm font-sans text-[var(--orbit-cream)] outline-none transition-all placeholder:text-[var(--orbit-cream)]/30" />
      </div>
      
      {/* Role Dropdown */}
      <div className="flex flex-col gap-2">
        <label className="text-sm uppercase font-mono tracking-widest text-[var(--orbit-cream)]/95 font-bold">Which role are you applying for?</label>
        <select required name="role" defaultValue={defaultRole} className="appearance-none bg-[var(--orbit-charcoal)] border border-[var(--orbit-green)]/20 focus:border-[var(--orbit-green)] focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] rounded-xl px-5 py-4 text-sm font-sans text-[var(--orbit-cream)] outline-none transition-all cursor-pointer">
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
        <label className="text-sm uppercase font-mono tracking-widest text-[var(--orbit-cream)]/95 font-bold">Where can we see your work?</label>
        <input required name="work_link" type="text" placeholder="Link to portfolio, Instagram, TikTok, LinkedIn, anything real" className="bg-[var(--orbit-charcoal)] border border-[var(--orbit-green)]/20 focus:border-[var(--orbit-green)] focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] rounded-xl px-5 py-4 text-sm font-sans text-[var(--orbit-cream)] outline-none transition-all placeholder:text-[var(--orbit-cream)]/30" />
        <p className="text-[9px] font-sans text-[var(--orbit-cream)]/50 ml-1">No portfolio? Tell us what you&apos;ve done instead. That works too.</p>
      </div>

      {/* Why Orbit 77 */}
      <div className="flex flex-col gap-2 mt-4">
        <label className="text-sm uppercase font-mono tracking-widest text-[var(--orbit-cream)]/95 font-bold">Why Orbit 77?</label>
        <textarea required name="message" rows={4} placeholder="Not looking for a cover letter. Tell us in your own words why this caught your attention and what you'd actually do here." className="bg-[var(--orbit-charcoal)] border border-[var(--orbit-green)]/20 focus:border-[var(--orbit-green)] focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] rounded-xl px-5 py-4 text-sm font-sans text-[var(--orbit-cream)] outline-none transition-all resize-none placeholder:text-[var(--orbit-cream)]/30" />
        <p className="text-[9px] font-sans text-[var(--orbit-cream)]/50 ml-1">3 sentences or 3 paragraphs. Whatever feels right.</p>
      </div>

      {/* Anything else */}
      <div className="flex flex-col gap-2 mt-2">
        <label className="text-sm uppercase font-mono tracking-widest text-[var(--orbit-cream)]/95 font-bold">Anything else? <span className="opacity-50">(Optional)</span></label>
        <textarea rows={2} placeholder="Questions, ideas, a voice note link. Whatever you want us to know." className="bg-[var(--orbit-charcoal)] border border-[var(--orbit-green)]/20 focus:border-[var(--orbit-green)] focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] rounded-xl px-5 py-4 text-sm font-sans text-[var(--orbit-cream)] outline-none transition-all resize-none placeholder:text-[var(--orbit-cream)]/30" />
      </div>

      {status === "error" && (
        <p className="text-[#FF4444] text-xs font-mono font-bold uppercase tracking-widest text-center mt-4">
          Transmission failed. Please try again.
        </p>
      )}

      {/* Submit */}
      <button disabled={status === "submitting"} type="submit" className="mt-8 w-full bg-[var(--orbit-green)] hover:bg-[var(--orbit-green)]/80 text-[#060B08] py-5 rounded-xl text-sm md:text-xs font-mono uppercase tracking-wide font-bold transition-all shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:shadow-[0_0_30px_rgba(57,255,20,0.6)] disabled:opacity-50">
        {status === "submitting" ? "TRANSMITTING..." : "SEND APPLICATION →"}
      </button>
    </form>
  )
}

export default function JoinCrewPage() {
  return (
    <div className="min-h-screen bg-[#020503] text-[var(--orbit-cream)] overflow-x-hidden font-sans selection:bg-[var(--orbit-green)]/20 selection:text-[var(--orbit-green)] relative pb-24">
      <LiveBackground color="var(--orbit-green)" intensity="medium" />
      <ProjectNav
        projectName="Orbit 77"
        projectColor="var(--orbit-green)"
        links={[
          { href: "/exhibitions/galaxy/orbit", label: "Overview" },
          { href: "/exhibitions/galaxy/orbit/join", label: "Join Crew" }
        ]}
      />

      {/* Background Deep Earth / Orbit Gradient */}
      <div className="fixed left-1/2 -translate-x-1/2 top-0 w-[120vw] h-[100vh] rounded-full blur-[180px] pointer-events-none mix-blend-screen z-0" style={{ background: "radial-gradient(circle at top, rgba(57, 255, 20, 0.08) 0%, transparent 60%)" }} />

      <main className="relative z-10 w-full max-w-2xl px-6 mx-auto flex flex-col pt-8 md:pt-12">
        
        {/* SECTION 1 - HEADER */}
        <div className="mb-14">
           <span className="text-xs md:text-sm font-mono tracking-wide uppercase text-[var(--orbit-green)] flex items-center gap-3 mb-6 font-bold drop-shadow-[0_0_8px_rgba(57,255,20,0.4)]">
             <span className="w-1.5 h-1.5 bg-[var(--orbit-green)] rounded-full animate-pulse shadow-[0_0_10px_rgba(57,255,20,0.8)]" />
             ORBIT 77 — CREW APPLICATION
           </span>
           <h1 className="text-5xl md:text-6xl font-serif italic font-light text-[var(--orbit-cream)] mb-8">
             You want in.<br/>Tell us who you are.
           </h1>
           <p className="text-sm font-light font-sans text-[var(--orbit-cream)] leading-relaxed bg-[var(--orbit-green)]/10 p-5 rounded-2xl border border-[var(--orbit-green)]/20 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
             We read every application. No bots. No auto-replies. Pablo and Eduardo review these personally.
           </p>
        </div>

        {/* SECTION 2 - FORM */}
        <div className="bg-[var(--orbit-void)]/60 backdrop-blur-sm border border-[var(--orbit-green)]/20 rounded-3xl p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] mb-20">
           <Suspense fallback={<div className="text-center py-20 text-[var(--orbit-green)] font-mono text-sm uppercase tracking-widest animate-pulse font-bold">Initializing Matrix...</div>}>
             <ApplicationForm />
           </Suspense>
        </div>

        {/* SECTION 3 - NEXT STEPS */}
        <div className="mb-20">
          <h3 className="text-2xl font-serif italic text-[var(--orbit-cream)] mb-8 border-b border-[var(--orbit-green)]/20 pb-4">What happens next?</h3>
          <div className="space-y-8">
            <div>
              <span className="text-sm uppercase font-mono tracking-widest text-[var(--orbit-green)] block mb-2 font-bold">01 — We read it.</span>
              <p className="text-sm font-light text-[var(--orbit-cream)]/80 leading-relaxed">Pablo and Eduardo review every application personally. Usually within 48 hours.</p>
            </div>
            <div>
              <span className="text-sm uppercase font-mono tracking-widest text-[var(--orbit-green)] block mb-2 font-bold">02 — We reply.</span>
              <p className="text-sm font-light text-[var(--orbit-cream)]/80 leading-relaxed">If there&apos;s a fit, we schedule a quick call. No formal interviews. Just a conversation.</p>
            </div>
            <div>
              <span className="text-sm uppercase font-mono tracking-widest text-[var(--orbit-green)] block mb-2 font-bold">03 — You&apos;re in.</span>
              <p className="text-sm font-light text-[var(--orbit-cream)]/80 leading-relaxed">We move fast. If it clicks, you start contributing within the same week.</p>
            </div>
          </div>
        </div>

        {/* SECTION 4 - FUND SEASON 2 */}
        <div className="bg-gradient-to-br from-[#101A14] to-[var(--orbit-charcoal)] backdrop-blur-sm border border-[var(--orbit-green)]/30 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-[0_0_30px_rgba(57,255,20,0.1)]">
           <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--orbit-green)]/10 rounded-full blur-[60px] pointer-events-none" />
           <div className="relative z-10">
             <h4 className="font-serif italic text-[var(--orbit-green)] text-2xl lg:text-3xl mb-4 drop-shadow-[0_0_10px_rgba(57,255,20,0.3)]">Not ready to apply?</h4>
             <p className="text-sm border border-[var(--orbit-green)]/20 bg-[var(--orbit-green)]/5 p-4 rounded-xl inline-block font-sans text-[var(--orbit-cream)]/90 leading-relaxed mb-8 font-light">
               Fund Season 2 instead.<br />
               <span className="font-mono text-[var(--orbit-green)]">Get your credential. Join the founding members.</span>
             </p>
             <Link href="/exhibitions/galaxy/orbit#support" className="block w-full py-4 bg-[var(--orbit-green)]/10 hover:bg-[var(--orbit-green)] border border-[var(--orbit-green)]/40 hover:text-[#060B08] text-[var(--orbit-green)] rounded-xl text-sm font-mono uppercase tracking-wide font-bold transition-all shadow-[0_0_15px_rgba(57,255,20,0.2)]">
               LOCK IN YOUR FREQUENCY →
             </Link>
           </div>
        </div>
      </main>
    </div>
  );
}
