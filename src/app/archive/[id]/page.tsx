import { getSupabase } from "@/app/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Supporter Archive — Orbit 77",
  description: "Your permanent transmission archive for Orbit 77.",
};

interface ArchiveProps {
  params: Promise<{
    id: string; // The supporter_id UUID
  }>;
}

export default async function ArchivePage({ params }: ArchiveProps) {
  const { id } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getSupabase() as any;
  if (!supabase) {
    return <div className="min-h-screen bg-[#020503] flex items-center justify-center p-8 text-[#39FF14] font-mono text-xs">ARCHIVE SYSTEM OFFLINE</div>;
  }

  // 1. Fetch Supporter Identity
  const { data: supporter, error: supporterError } = await supabase
    .from('orbit_supporters')
    .select('*')
    .eq('id', id)
    .single();

  if (supporterError || !supporter) {
    return (
      <div className="min-h-screen bg-[#020503] flex flex-col items-center justify-center p-8 font-mono text-xs">
        <div className="w-full max-w-2xl border border-red-500/30 bg-black/50 p-6 rounded text-left overflow-auto">
          <p className="text-red-500 mb-4 font-bold">--- TEMPORARY DEBUG SCREEN ---</p>
          <p className="text-white/60 mb-2"><strong>Param ID:</strong> <span className="text-[#39FF14]">{id}</span></p>
          <p className="text-white/60 mb-2"><strong>Database Error:</strong></p>
          <pre className="text-red-400 mb-4 whitespace-pre-wrap">{JSON.stringify(supporterError, null, 2)}</pre>
          <p className="text-white/60 mb-2"><strong>Data Returned:</strong></p>
          <pre className="text-yellow-400 mb-4 whitespace-pre-wrap">{JSON.stringify(supporter, null, 2)}</pre>
          <p className="text-white/60 mt-4">This screen replaces the 404 page temporarily to diagnose why the DB read is failing in production.</p>
        </div>
      </div>
    );
  }

  // 2. Fetch all credentials attached to this supporter
  const { data: credentials, error: credError } = await supabase
    .from('orbit_support_credentials')
    .select('*')
    .eq('supporter_id', supporter.id)
    .order('created_at', { ascending: false });

  if (credError) {
    console.error("Failed to load credentials", credError);
  }

  const credList = credentials || [];
  const activeCount = credList.length;

  return (
    <main className="min-h-screen bg-[#020503] text-[#AEFFA1] font-sans selection:bg-[#39FF14]/20 selection:text-[#39FF14] relative overflow-hidden flex flex-col">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#39FF14] opacity-[0.03] blur-[150px] mix-blend-screen rounded-full" />
      </div>

      {/* Global Navigator */}
      <nav className="relative z-50 w-full p-8 md:p-12 flex justify-between items-start">
        <Link href="/" className="text-[10px] uppercase font-sans font-light tracking-[0.3em] text-[#AEFFA1]/70 hover:text-[#39FF14] transition-colors duration-500 hover:drop-shadow-[0_0_10px_rgba(57,255,20,0.8)]">
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
              <span className="w-1.5 h-1.5 bg-[#39FF14] rounded-full inline-block animate-pulse shadow-[0_0_10px_#39FF14]"></span>
              Supporter Identity
            </p>
            <h1 className="text-4xl md:text-5xl font-serif italic font-light text-white mb-2 tracking-tight">
              {supporter.display_name}
            </h1>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
              Identity Node: {supporter.id.split('-')[0].toUpperCase()}
            </p>
          </div>
          <div className="md:text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#39FF14]/40 mb-1">Total Transmissions</p>
            <p className="font-mono text-2xl font-light text-[#39FF14]">{activeCount < 10 ? `0${activeCount}` : activeCount}</p>
          </div>
        </div>

        {/* Credentials Archive List */}
        <div className="mt-16">
          <h2 className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-8 border-b border-white/5 pb-4">
            Permanent Archive Record
          </h2>

          {activeCount === 0 ? (
             <div className="text-center py-20 border border-white/5 bg-white/[0.02] rounded-xl">
               <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/30">No transmissions found.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
               {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
               {credList.map((cred: any) => {
                 const dateGenerated = new Date(cred.created_at);
                 const formattedDate = `${dateGenerated.getFullYear()}.${String(dateGenerated.getMonth() + 1).padStart(2, "0")}.${String(dateGenerated.getDate()).padStart(2, "0")}`;
                 
                 return (
                   <div key={cred.id} className="group relative bg-[#050A07] border border-[#39FF14]/10 rounded-2xl p-6 transition-all duration-500 hover:border-[#39FF14]/40 hover:bg-[#070F0A] hover:shadow-[0_0_30px_rgba(57,255,20,0.05)]">
                     <div className="flex justify-between items-start mb-6">
                       <div>
                         <p className="text-[8px] font-mono tracking-[0.3em] uppercase text-[#39FF14]/50 mb-1">Credential Code</p>
                         <p className="font-mono text-sm md:text-base font-bold tracking-widest text-[#39FF14]">{cred.credential_code}</p>
                       </div>
                       <div className="text-right">
                         <span className="inline-block px-2 py-1 bg-white/5 rounded border border-white/10 text-[9px] font-mono uppercase tracking-widest text-white/60">
                           {cred.season_label}
                         </span>
                       </div>
                     </div>
                     
                     <h3 className="text-2xl font-serif italic text-white mb-1">Orbit 77</h3>
                     <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#AEFFA1]/40 mb-8 block">Project Node</p>

                     <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 mt-auto">
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
