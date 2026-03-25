import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#000000] text-[#E3DAC9] flex flex-col justify-center items-center font-mono selection:bg-[#FFB000]/20 selection:text-[#FFB000] p-6 text-center">
      <div className="max-w-md w-full bg-[#0A120D]/60 backdrop-blur-xl border border-[#FFB000]/30 rounded-[2rem] p-10 shadow-[0_0_30px_rgba(255,176,0,0.1)]">
        
        <h2 className="text-5xl font-serif italic mb-8 text-[#FFB000] drop-shadow-[0_0_15px_rgba(255,176,0,0.5)]">
          404 
        </h2>
        <h3 className="text-2xl font-serif italic mb-6 text-[#E3DAC9]">Node Offline</h3>
        
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#E3DAC9]/60 leading-relaxed mb-12">
          The coordinates you transmitted do not map to an active Pyadra sector.
        </p>

        <Link href="/">
          <button className="w-full px-8 py-5 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold transition-all border border-[#FFB000]/30 hover:border-[#FFB000] text-[#FFB000] bg-[#FFB000]/5 hover:bg-[#FFB000]/20 shadow-[0_0_20px_rgba(255,176,0,0.1)]">
            Recall to Base
          </button>
        </Link>
      </div>
    </main>
  );
}
