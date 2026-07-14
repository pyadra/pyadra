import Link from "next/link";
import SiteFooter from "@/app/components/nav/SiteFooter";

/* Pyadra — Privacy. Light museum page, plain human language.
   Accurately describes what the code actually collects (see supabase/README.md).
   Update this page whenever a new data flow ships. */
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

        <div className="inline-flex items-center gap-2 rounded-full bg-[#059669]/10 text-[#047857] px-4 py-2 t-d6 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
          The museum&rsquo;s promise
        </div>
        <h1 className="font-serif font-semibold text-4xl md:text-5xl tracking-tight mb-3">
          Privacy
        </h1>
        <p className="t-d5 text-[#6B8070] mb-12">Effective July 2026</p>

        <div className="space-y-8 t-d4 text-[#3A4A3E] leading-relaxed">
          <p>
            Pyadra collects only the data needed to make each experience work.
            This page describes exactly what that is, in plain language.
          </p>

          <p>
            <strong className="font-semibold text-[#047857]">1. Payments.</strong>{" "}
            Pyadra never sees or stores your card details. All payments are
            handled by Stripe. After a payment we keep the confirmation: the
            amount, the project you supported, the name and email you provided,
            and any public message you chose to leave.
          </p>

          <p>
            <strong className="font-semibold text-[#047857]">
              2. Supporting a project (Orbit 77).
            </strong>{" "}
            When you support a project we store your name, email, display name
            and optional message so we can issue your permanent credential,
            email it to you, and show your archive page. If you choose to be
            anonymous, your display name is shown as &ldquo;Anonymous.&rdquo;
          </p>

          <p>
            <strong className="font-semibold text-[#047857]">
              3. EterniCapsule.
            </strong>{" "}
            When you seal a capsule we store your name and email, the
            recipient&rsquo;s name, the guardian&rsquo;s email if you name one, the
            opening date, and the message itself. The access keys are stored
            only as cryptographic hashes — we cannot recover them for you. The
            message text is stored on our database provider&rsquo;s encrypted
            infrastructure; treat a capsule as private, not as unreadable by
            the operator. If you provide a guardian&rsquo;s email, you confirm you
            have their permission to share it.
          </p>

          <p>
            <strong className="font-semibold text-[#047857]">
              4. The observer ticket.
            </strong>{" "}
            Your visit to the home page is counted with a sequential number
            stored in your own browser. We keep the browser type of the visit.
            We do not store your IP address.
          </p>

          <p>
            <strong className="font-semibold text-[#047857]">
              5. Analytics &amp; cookies.
            </strong>{" "}
            We use Vercel Analytics, which is anonymized and cookie-free. We do
            not use tracking cookies or advertising trackers.
          </p>

          <p>
            <strong className="font-semibold text-[#047857]">
              6. Who processes data for us.
            </strong>{" "}
            Stripe (payments), Supabase (database), Resend (transactional
            email) and Vercel (hosting and analytics). We never sell or rent
            personal data to anyone.
          </p>

          <p>
            <strong className="font-semibold text-[#047857]">
              7. Your choices.
            </strong>{" "}
            To ask what we hold about you, correct it, or delete it, write to{" "}
            <a
              href="mailto:pyadra@pyadra.io"
              className="text-[#059669] hover:underline"
            >
              pyadra@pyadra.io
            </a>{" "}
            and we will respond. Note that deleting a capsule or a credential
            is permanent.
          </p>

          <p>
            <strong className="font-semibold text-[#047857]">8. Age.</strong>{" "}
            Pyadra is not directed at children under 13 and we do not knowingly
            collect their data.
          </p>

          <p>
            <strong className="font-semibold text-[#047857]">9. Changes.</strong>{" "}
            If what we collect changes, this page changes first. The effective
            date above tells you when it was last revised.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
