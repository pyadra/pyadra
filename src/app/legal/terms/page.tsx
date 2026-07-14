import Link from "next/link";
import SiteFooter from "@/app/components/nav/SiteFooter";

/* Pyadra — Terms. Light museum page, plain human language.
   Includes the protections a small Delaware company actually needs:
   contributions ≠ investment, best-effort capsule delivery, liability cap,
   governing law. */
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

        <div className="inline-flex items-center gap-2 rounded-full bg-[#059669]/10 text-[#047857] px-4 py-2 t-d6 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
          The house rules
        </div>
        <h1 className="font-serif font-semibold text-4xl md:text-5xl tracking-tight mb-3">
          Terms
        </h1>
        <p className="t-d5 text-[#6B8070] mb-12">
          Effective July 2026 · Using pyadra.io means you agree with the
          following.
        </p>

        <div className="space-y-8 t-d4 text-[#3A4A3E] leading-relaxed">
          <p>
            <strong className="font-semibold text-[#047857]">
              1. Contributions.
            </strong>{" "}
            Actions labeled as support or sponsorship on pyadra.io (for
            example, supporting Orbit 77) are voluntary contributions to a
            creative project and are non-refundable once processed.
          </p>

          <p>
            <strong className="font-semibold text-[#047857]">
              2. What support is — and isn&rsquo;t.
            </strong>{" "}
            Support is cultural and artistic backing. It does not constitute
            investment, equity, securities, a loan, or a formal partnership,
            and it grants no ownership, returns, or creative control, unless
            explicitly agreed in a separate written contract.
          </p>

          <p>
            <strong className="font-semibold text-[#047857]">
              3. EterniCapsule.
            </strong>{" "}
            A capsule is a best-effort digital keepsake, not a guaranteed
            escrow or archival service. We will make reasonable efforts to
            keep capsules available and deliver guardian access as designed,
            but we cannot promise availability across years, decades, or
            events outside our control. Keep your keys safe: they are stored
            only as hashes and cannot be recovered if lost. You are
            responsible for the content of your capsule and for having
            permission to include other people&rsquo;s information.
          </p>

          <p>
            <strong className="font-semibold text-[#047857]">
              4. Acceptable use.
            </strong>{" "}
            Don&rsquo;t use pyadra.io for anything unlawful, harmful, or abusive,
            and don&rsquo;t attempt to disrupt or gain unauthorized access to the
            service.
          </p>

          <p>
            <strong className="font-semibold text-[#047857]">
              5. Our work.
            </strong>{" "}
            The visual and sound design, the experiences, and the Pyadra name
            and terminology are the intellectual property of Pyadra. Projects
            exhibited on pyadra.io remain the property of their creators.
          </p>

          <p>
            <strong className="font-semibold text-[#047857]">
              6. As-is service.
            </strong>{" "}
            pyadra.io is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without
            warranties of any kind, express or implied. We do not warrant that
            the site will be uninterrupted or error-free.
          </p>

          <p>
            <strong className="font-semibold text-[#047857]">
              7. Limitation of liability.
            </strong>{" "}
            To the maximum extent permitted by law, Pyadra&rsquo;s total liability
            for any claim arising from your use of pyadra.io is limited to the
            amount you paid us in the twelve months before the claim. We are
            not liable for indirect, incidental, or consequential damages.
          </p>

          <p>
            <strong className="font-semibold text-[#047857]">
              8. Governing law.
            </strong>{" "}
            These terms are governed by the laws of the State of Delaware,
            USA, without regard to conflict-of-law rules.
          </p>

          <p>
            <strong className="font-semibold text-[#047857]">9. Contact.</strong>{" "}
            Questions about these terms:{" "}
            <a
              href="mailto:pyadra@pyadra.io"
              className="text-[#059669] hover:underline"
            >
              pyadra@pyadra.io
            </a>
            .
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
