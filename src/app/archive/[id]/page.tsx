import { getSupabase } from "@/app/lib/db";
import Link from "next/link";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Supporter Archive — Orbit 77",
  description: "Your permanent transmission archive for Orbit 77.",
};

interface ArchiveProps {
  params: Promise<{
    id: string;
  }>;
}

// Minimal UUID format check — prevents unnecessary DB queries for garbage IDs
function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

// Clean, on-brand error state — never crashes, always communicates
function InvalidAccessScreen({ reason }: { reason: string }) {
  return (
    <main className="min-h-screen bg-[#020503] text-[#F4EFEA] font-sans flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#FF4444]/70 mb-6 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#FF4444] rounded-full inline-block animate-pulse" />
          Archive Access Failed
        </p>
        <h1 className="text-3xl font-serif italic font-light text-white mb-4">Signal Not Found</h1>
        <p className="text-sm text-[#AEFFA1]/50 leading-relaxed font-light mb-10">{reason}</p>
        <div className="flex flex-col gap-3">
          <Link
            href="/exhibitions/galaxy/orbit"
            className="inline-block border border-[#39FF14]/30 text-[#39FF14] font-mono text-[10px] uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-[#39FF14]/10 transition-colors"
          >
            Return to Orbit 77
          </Link>
          <a
            href="mailto:orbit@pyadra.io"
            className="inline-block text-[#AEFFA1]/40 font-mono text-[10px] uppercase tracking-widest hover:text-[#AEFFA1]/70 transition-colors"
          >
            Contact Support →
          </a>
        </div>
      </div>
    </main>
  );
}

export default async function ArchivePage({ params }: ArchiveProps) {
  const { id } = await params;

  // Guard: if the ID format is wrong, fail early with a clear message
  if (!isValidUUID(id)) {
    return <InvalidAccessScreen reason="The archive link appears to be malformed. Please check your email and try again." />;
  }

  // Guard: if Supabase is not initialized (missing env vars), fail clearly
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getSupabase() as any;
  if (!supabase) {
    console.error("[Archive] Supabase client could not be initialized. Check SUPABASE_SERVICE_ROLE_KEY env var.");
    return <InvalidAccessScreen reason="The archive system is temporarily offline. Please try again in a few minutes." />;
  }

  // 1. Fetch Supporter Identity
  const { data: supporter, error: supporterError } = await supabase
    .from("orbit_supporters")
    .select("id, display_name, created_at")
    .eq("id", id)
    .single();

  if (supporterError) {
    console.error("[Archive] Supporter lookup failed:", supporterError);
    return (
      <InvalidAccessScreen reason="We couldn't find your supporter record. If you just completed your payment, please wait a few minutes and try again." />
    );
  }

  if (!supporter) {
    return (
      <InvalidAccessScreen reason="No supporter found for this archive link. Please contact us at orbit@pyadra.io." />
    );
  }

  // 2. Fetch all paid credentials attached to this supporter
  const { data: credentials, error: credError } = await supabase
    .from("orbit_support_credentials")
    .select("id, credential_code, season_label, amount_aud, created_at")
    .eq("supporter_id", supporter.id)
    .eq("payment_status", "paid")
    .order("created_at", { ascending: false });

  if (credError) {
    console.error("[Archive] Credentials lookup failed:", credError);
  }

  const credList = credentials || [];
  const activeCount = credList.length;

  return (
    <main className="min-h-screen bg-[#020503] text-[#AEFFA1] font-sans selection:bg-[#39FF14]/20 selection:text-[#39FF14] relative overflow-hidden flex flex-col">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#39FF14] opacity-[0.03] blur-[150px] mix-blend-screen rounded-full" />
      </div>

      {/* Navigator */}
      <nav className="relative z-50 w-full p-8 md:p-12 flex justify-between items-start">
        <Link
          href="/"
          className="text-[10px] uppercase font-sans font-light tracking-[0.3em] text-[#AEFFA1]/70 hover:text-[#39FF14] transition-colors duration-500"
        >
          [ Return to Main ]
        </Link>
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#39FF14]/50 border border-[#39FF14]/20 px-3 py-1 rounded-sm">
          System: Secure
        </span>
      </nav>

      {/* Identity Header */}
      <div className="w-full max-w-4xl mx-auto px-6 relative z-10 pt-10 pb-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end justify-between border-b border-[#39FF14]/10 pb-10">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#39FF14]/60 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#39FF14] rounded-full inline-block animate-pulse shadow-[0_0_10px_#39FF14]" />
              Supporter Identity
            </p>
            <h1 className="text-4xl md:text-5xl font-serif italic font-light text-white mb-2 tracking-tight">
              {supporter.display_name}
            </h1>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
              Identity Node: {supporter.id.split("-")[0].toUpperCase()}
            </p>
          </div>
          <div className="md:text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#39FF14]/40 mb-1">Total Transmissions</p>
            <p className="font-mono text-2xl font-light text-[#39FF14]">
              {activeCount < 10 ? `0${activeCount}` : activeCount}
            </p>
          </div>
        </div>

        {/* Credentials Archive List */}
        <div className="mt-16">
          <h2 className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-8 border-b border-white/5 pb-4">
            Permanent Archive Record
          </h2>

          {activeCount === 0 ? (
            <div className="text-center py-20 border border-white/5 bg-white/[0.02] rounded-xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/30 mb-2">
                No transmissions found yet.
              </p>
              <p className="font-mono text-[10px] text-white/20">
                If you just completed a payment, your credential will appear here shortly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {credList.map((cred: any) => {
                const dateGenerated = new Date(cred.created_at);
                const formattedDate = `${dateGenerated.getFullYear()}.${String(dateGenerated.getMonth() + 1).padStart(2, "0")}.${String(dateGenerated.getDate()).padStart(2, "0")}`;

                return (
                  <div
                    key={cred.id}
                    className="group relative bg-[#050A07] border border-[#39FF14]/10 rounded-2xl p-6 transition-all duration-500 hover:border-[#39FF14]/40 hover:bg-[#070F0A] hover:shadow-[0_0_30px_rgba(57,255,20,0.05)]"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-[8px] font-mono tracking-[0.3em] uppercase text-[#39FF14]/50 mb-1">
                          Credential Code
                        </p>
                        <p className="font-mono text-sm md:text-base font-bold tracking-widest text-[#39FF14]">
                          {cred.credential_code}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-1 bg-white/5 rounded border border-white/10 text-[9px] font-mono uppercase tracking-widest text-white/60">
                          {cred.season_label}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-serif italic text-white mb-1">Orbit 77</h3>
                    <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#AEFFA1]/40 mb-8 block">
                      Project Node
                    </p>

                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                      <div>
                        <p className="text-[8px] font-mono tracking-[0.2em] uppercase text-white/30 mb-1">Status</p>
                        <p className="font-mono text-xs uppercase tracking-[0.1em] text-[#39FF14]/80">Verified</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-mono tracking-[0.2em] uppercase text-white/30 mb-1">Timestamp</p>
                        <p className="font-mono text-xs text-white/60">{formattedDate}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
