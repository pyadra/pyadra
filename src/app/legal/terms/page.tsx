import Link from "next/link";

export default function Terms() {
  return (
    <main className="min-h-screen bg-black text-[#E3DAC9] font-sans selection:bg-[#FFB000]/20 selection:text-[#FFB000] flex justify-center py-24 md:py-32 px-6">
      <div className="max-w-2xl w-full">
        <Link href="/" className="text-[10px] uppercase font-mono tracking-widest text-[#FFB000]/60 hover:text-[#FFB000] transition-colors mb-12 block">
          [ Return to Core ]
        </Link>
        <h1 className="text-3xl font-serif italic mb-12">Terms of Protocol</h1>
        <div className="space-y-8 font-light text-sm text-white/50 leading-loose">
          <p>Welcome to Pyadra.io. Interacting with the Pyadra Ecosystem constitutes your agreement with the following operational terms.</p>
          <p><strong>1. Resource Injections (Contributions):</strong> Actions designated as &quot;Support Orbit 77&quot; or &quot;Sponsoring&quot; on pyadra.io are symbolic contributions to the collective and are non-refundable. They represent energy given to nourish the project node in question.</p>
          <p><strong>2. Community Support:</strong> Support is strictly a cultural and artistic backing. It does not constitute investment, equity, or formal partnership unless explicitly contracted in a separate agreement.</p>
          <p><strong>3. Artifacts:</strong> The visual and acoustic design, the 3D Torus, and Pyadra terminology are intellectual properties of the Pyadra ecosystem.</p>
        </div>
      </div>
    </main>
  );
}
