import { getOrbitSupabase } from "@/app/lib/orbit-db";
import Link from "next/link";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Supporter Archive — Orbit 77",
  description: "Your permanent transmission archive for Orbit 77.",
};

/* Matches the Orbit 77 page design system: light museum surface,
   emerald accent, serif italic display + mono labels. */
const T = {
  display: 'text-3xl lg:text-4xl',
  heading: 'text-base',
  body: 'text-sm',
  small: 'text-[13px]',
  micro: 'text-[11px]',
} as const;

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
    <main className="min-h-screen bg-[#EDEFED] text-[#1A1C1A] font-sans flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md text-center">
        <p className={`font-mono ${T.micro} uppercase tracking-[0.18em] text-[#B45309] mb-6 flex items-center justify-center gap-2`}>
          <span className="w-1.5 h-1.5 bg-[#B45309] rounded-full inline-block animate-pulse" />
          Archive access failed
        </p>
        <h1 className={`${T.display} font-serif italic font-light mb-4`}>Signal not found</h1>
        <p className={`${T.body} text-[#6B8070] leading-relaxed font-light mb-10`}>{reason}</p>
        <div className="flex flex-col gap-3">
          <Link
            href="/exhibitions/galaxy/orbit"
            className={`inline-block rounded-full bg-[#059669] text-white font-mono ${T.micro} uppercase tracking-[0.18em] font-bold px-6 py-3 hover:bg-[#047857] transition-colors`}
          >
            Return to Orbit 77
          </Link>
          <a
            href="mailto:pyadra@pyadra.io"
            className={`inline-block font-mono ${T.micro} uppercase tracking-[0.18em] text-[#6B8070] hover:text-[#1A1C1A] transition-colors`}
          >
            Contact support →
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
  const supabase = getOrbitSupabase() as any;
  if (!supabase) {
    console.error("[Archive] Orbit Supabase client could not be initialized. Check SUPABASE_SERVICE_ROLE_KEY / ORBIT_SUPABASE_SERVICE_ROLE_KEY env vars.");
    return <InvalidAccessScreen reason="The archive system is temporarily offline. Please try again in a few minutes." />;
  }

  // 1. Fetch the credential this archive link points at — it carries the
  //    supporter's identity (email + display name) directly.
  const { data: supporter, error: supporterError } = await supabase
    .from("orbit_support_credentials")
    .select("id, display_name, supporter_email, created_at")
    .eq("id", id)
    .single();

  if (supporterError) {
    console.error("[Archive] Credential lookup failed:", supporterError);
    return (
      <InvalidAccessScreen reason="We couldn't find your supporter record. If you just completed your payment, please wait a few minutes and try again." />
    );
  }

  if (!supporter) {
    return (
      <InvalidAccessScreen reason="No supporter found for this archive link. Please contact us at pyadra@pyadra.io." />
    );
  }

  // 2. Fetch all paid credentials belonging to the same supporter (same email)
  const { data: credentials, error: credError } = await supabase
    .from("orbit_support_credentials")
    .select("id, credential_code, season_label, amount_aud, created_at")
    .eq("supporter_email", supporter.supporter_email)
    .eq("payment_status", "paid")
    .order("created_at", { ascending: false });

  if (credError) {
    console.error("[Archive] Credentials lookup failed:", credError);
  }

  const credList = credentials || [];
  const activeCount = credList.length;

  return (
    <main className="min-h-screen bg-[#EDEFED] text-[#1A1C1A] font-sans antialiased selection:bg-[#059669] selection:text-white relative overflow-hidden flex flex-col">
      {/* Soft museum light */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(5,150,105,0.06)_0%,transparent_55%)]" />

      {/* Navigator */}
      <nav className="relative z-50 w-full p-8 md:p-12 flex justify-between items-start">
        <Link
          href="/"
          className={`font-mono ${T.micro} uppercase tracking-[0.18em] text-[#6B8070] hover:text-[#059669] transition-colors duration-300`}
        >
          [ Return to main ]
        </Link>
        <span className={`font-mono ${T.micro} uppercase tracking-[0.18em] text-[#059669] border border-[#059669]/25 bg-white/40 px-3 py-1 rounded-full`}>
          System: Secure
        </span>
      </nav>

      {/* Identity Header */}
      <div className="w-full max-w-4xl mx-auto px-6 relative z-10 pt-6 pb-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end justify-between border-b border-[#1A1C1A]/10 pb-10">
          <div>
            <p className={`font-mono ${T.micro} uppercase tracking-[0.18em] text-[#059669] mb-3 flex items-center gap-2 font-bold`}>
              <span className="w-1.5 h-1.5 bg-[#059669] rounded-full inline-block animate-pulse" />
              Supporter identity
            </p>
            <h1 className="text-4xl md:text-5xl font-serif italic font-light text-[#1A1C1A] mb-2 tracking-tight">
              {supporter.display_name}
            </h1>
            <p className={`font-mono ${T.micro} uppercase tracking-[0.18em] text-[#6B8070]`}>
              Identity node: {supporter.id.split("-")[0].toUpperCase()}
            </p>
          </div>
          <div className="md:text-right">
            <p className={`font-mono ${T.micro} uppercase tracking-[0.18em] text-[#6B8070] mb-1`}>Total transmissions</p>
            <p className="font-mono text-2xl font-light text-[#059669]">
              {activeCount < 10 ? `0${activeCount}` : activeCount}
            </p>
          </div>
        </div>

        {/* Credentials Archive List */}
        <div className="mt-14">
          <h2 className={`font-mono ${T.micro} uppercase tracking-[0.18em] text-[#6B8070] mb-8 border-b border-[#1A1C1A]/5 pb-4`}>
            Permanent archive record
          </h2>

          {activeCount === 0 ? (
            <div className="text-center py-20 rounded-[32px] bg-white/50 border border-white/40">
              <p className={`font-mono ${T.small} uppercase tracking-[0.18em] text-[#6B8070] mb-2`}>
                No transmissions found yet.
              </p>
              <p className={`font-mono ${T.micro} text-[#6B8070]/60`}>
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
                    className="group relative rounded-[32px] bg-white/60 border border-white/40 p-6 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(10,18,14,0.10)] hover:border-[#059669]/25"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className={`font-mono text-[9px] tracking-[0.18em] uppercase text-[#6B8070] mb-1`}>
                          Credential code
                        </p>
                        <p className={`font-mono ${T.body} md:${T.heading} font-bold tracking-widest text-[#059669]`}>
                          {cred.credential_code}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2.5 py-1 bg-[#EDEFED] rounded-full border border-[#1A1C1A]/10 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6B8070]`}>
                          {cred.season_label}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-serif italic font-light text-[#1A1C1A] mb-1">Orbit 77</h3>
                    <p className={`font-mono ${T.micro} tracking-[0.18em] uppercase text-[#6B8070] mb-8 block`}>
                      Project node
                    </p>

                    <div className="grid grid-cols-2 gap-4 border-t border-[#1A1C1A]/10 pt-4">
                      <div>
                        <p className={`font-mono text-[9px] tracking-[0.18em] uppercase text-[#6B8070] mb-1`}>Status</p>
                        <p className={`font-mono ${T.micro} uppercase tracking-[0.1em] text-[#059669] font-bold`}>Verified</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-mono text-[9px] tracking-[0.18em] uppercase text-[#6B8070] mb-1`}>Timestamp</p>
                        <p className={`font-mono ${T.micro} text-[#6B8070]`}>{formattedDate}</p>
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
