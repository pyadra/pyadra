import Link from "next/link";

/* Pyadra 404 — a room that doesn't exist. Light museum page,
   same design language as the rest of the navigation. */
export default function NotFound() {
  return (
    <main className="min-h-[100svh] bg-[#EDEFED] text-[#1A1C1A] flex flex-col justify-center items-center p-6 text-center antialiased selection:bg-[#059669] selection:text-white">
      <p className="t-d6 text-[#059669] mb-6">404 · No such room</p>

      <h1 className="font-serif font-semibold text-4xl md:text-5xl tracking-tight mb-4">
        This room doesn&rsquo;t exist.
      </h1>

      <p className="t-d4 text-[#3A4A3E] max-w-sm mb-10">
        The door you tried leads nowhere in the museum. The exhibitions are
        this way.
      </p>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <Link
          href="/exhibitions"
          className="rounded-full bg-[#1A1C1A] text-white px-8 py-3.5 t-d5 font-semibold shadow-lg shadow-[#1A1C1A]/20 hover:scale-[1.03] transition-transform"
        >
          See the exhibitions →
        </Link>
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
