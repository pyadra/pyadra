import Link from "next/link";
import SiteFooter from "@/app/components/nav/SiteFooter";

/* Pyadra — Terms. Light museum page, plain human language.
   Same legal substance as before, without the jargon. */
export default function Terms() {
  return (
    <div className="min-h-[100svh] bg-[#EDEFED] text-[#1A1C1A] flex flex-col antialiased selection:bg-[#059669] selection:text-white">
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 pt-24 md:pt-32 pb-20">
        <Link
          href="/"
          className="t-d6 text-[#6B8070] hover:text-[#059669] transition-colors mb-12 inline-block"
        >
          ← Pyadra
        </Link>

        <h1 className="font-serif font-semibold text-4xl md:text-5xl tracking-tight mb-3">
          Terms
        </h1>
        <p className="t-d5 text-[#6B8070] mb-12">
          Using pyadra.io means you agree with the following.
        </p>

        <div className="space-y-8 t-d4 text-[#3A4A3E] leading-relaxed">
          <p>
            <strong className="font-semibold text-[#1A1C1A]">
              1. Contributions.
            </strong>{" "}
            Actions labeled as support or sponsorship on pyadra.io (for
            example, supporting Orbit 77) are voluntary contributions to a
            project and are non-refundable.
          </p>
          <p>
            <strong className="font-semibold text-[#1A1C1A]">
              2. What support is — and isn&rsquo;t.
            </strong>{" "}
            Support is cultural and artistic backing. It does not constitute
            investment, equity, or a formal partnership unless explicitly
            agreed in a separate written contract.
          </p>
          <p>
            <strong className="font-semibold text-[#1A1C1A]">
              3. Our work.
            </strong>{" "}
            The visual and sound design, the experiences, and the Pyadra name
            and terminology are the intellectual property of Pyadra.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
