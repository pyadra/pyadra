import Link from "next/link";
import SiteFooter from "@/app/components/nav/SiteFooter";

/* Pyadra — Privacy. Light museum page, plain human language.
   Same legal substance as before, without the jargon. */
export default function Privacy() {
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
          Privacy
        </h1>
        <p className="t-d5 text-[#6B8070] mb-12">Effective 2026</p>

        <div className="space-y-8 t-d4 text-[#3A4A3E] leading-relaxed">
          <p>
            The data collected while you use pyadra.io is used strictly to make
            the site work — nothing more.
          </p>
          <p>
            <strong className="font-semibold text-[#1A1C1A]">
              1. Payments.
            </strong>{" "}
            Pyadra never stores or processes your card details. All payments
            are handled securely by Stripe. Pyadra only keeps the confirmation
            (amount and project) to acknowledge your contribution.
          </p>
          <p>
            <strong className="font-semibold text-[#1A1C1A]">
              2. Analytics.
            </strong>{" "}
            We use Vercel Analytics to understand how many people visit. This
            data is fully anonymized.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
