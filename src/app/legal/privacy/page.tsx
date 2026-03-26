import Link from "next/link";

export default function Privacy() {
  return (
    <main className="min-h-screen bg-black text-[#E3DAC9] font-sans selection:bg-[#FFB000]/20 selection:text-[#FFB000] flex justify-center py-24 md:py-32 px-6">
      <div className="max-w-2xl w-full">
        <Link href="/" className="text-[10px] uppercase font-mono tracking-widest text-[#FFB000]/60 hover:text-[#FFB000] transition-colors mb-12 block">
          [ Return to Core ]
        </Link>
        <h1 className="text-3xl font-serif italic mb-12">Privacy Protocol</h1>
        <div className="space-y-8 font-light text-sm text-white/50 leading-loose">
          <p>Effective Date: 2026</p>
          <p>At Pyadra.io, we believe in the sanctity of human connection. The data collected during your interaction with the Pyadra ecosystem is used strictly for technical performance and maintaining the collective matrix.</p>
          <p><strong>1. Financial Data:</strong> Pyadra does not store or process credit card data. All resource injections (payments, coffees) are securely tokenized and handled by Stripe. Pyadra only retains the confirmation telemetry (amount and project ID) to acknowledge the transaction in our network.</p>
          <p><strong>2. Telemetry:</strong> We utilize Vercel Analytics to measure global connection density to the Pyadra Core. This data is fully anonymized.</p>
        </div>
      </div>
    </main>
  );
}
