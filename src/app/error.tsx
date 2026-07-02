"use client";

import { useEffect } from "react";
import Link from "next/link";

/* Pyadra error boundary — honest and calm, in the museum's voice.
   Kept dependency-light: this page must render even when things break. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Pyadra error:", error);
  }, [error]);

  return (
    <main className="min-h-[100svh] bg-[#EDEFED] text-[#1A1C1A] flex flex-col justify-center items-center p-6 text-center antialiased selection:bg-[#059669] selection:text-white">
      <p className="t-d6 text-[#059669] mb-6">Something broke</p>

      <h1 className="font-serif font-semibold text-4xl md:text-5xl tracking-tight mb-4">
        That&rsquo;s on us.
      </h1>

      <p className="t-d4 text-[#3A4A3E] max-w-sm mb-10">
        Something went wrong on our side. Try again — or head back to the
        entrance.
      </p>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <button
          onClick={() => reset()}
          className="rounded-full bg-[#1A1C1A] text-white px-8 py-3.5 t-d5 font-semibold shadow-lg shadow-[#1A1C1A]/20 hover:scale-[1.03] transition-transform cursor-pointer"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full bg-white text-[#1A1C1A] ring-1 ring-[#1A1C1A]/10 px-8 py-3.5 t-d5 font-semibold shadow-sm hover:scale-[1.03] transition-transform"
        >
          Back to the entrance
        </Link>
      </div>
    </main>
  );
}
