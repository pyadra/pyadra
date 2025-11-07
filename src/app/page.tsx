export default function Home() {
  // Datos mockeados; cámbialos por los reales cuando conectes tu backend.
  const stats = { ideas: 12, actions: 134, energyPct: 87, trustPct: 97, projectsCompleted: 0 };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <section
        aria-label="Pyadra Home"
        className="card-glass bg-stars"
      >
        {/* Top stats */}
        <header className="flex flex-col items-center gap-3 text-center md:flex-row md:justify-center md:gap-12">
          <p className="text-lg md:text-xl">
            <span className="font-medium">{stats.ideas}</span> evolving ideas
          </p>
          <p className="text-lg md:text-xl">
            <span className="font-medium">{stats.actions}</span> actions
          </p>
          <p className="text-lg md:text-xl">
            <span className="font-medium">{stats.energyPct}%</span> collective energy
          </p>
        </header>

        {/* Circles grid */}
        <div className="mt-10 grid grid-cols-1 place-items-center gap-8 md:mt-12 md:grid-cols-2">
          <CircleButton label="Projects" href="/projects" />
          <CircleButton label="Actions" href="/actions" />
          <CircleButton label="Studio" href="/studio" />
          <CircleButton label="Soul Network" href="/network" />
        </div>

        {/* Tagline */}
        <p className="mt-10 text-center text-xl md:mt-12">
          Every action feeds the light.
        </p>

        {/* Footer: progress + CTA + right metrics */}
        <footer className="mt-8 flex flex-col items-center gap-6 md:mt-10 md:flex-row md:items-end md:justify-between">
          {/* Left: label + bar */}
          <div className="w-full md:max-w-sm">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="opacity-90">Collective Energy</span>
              <span className="opacity-90">{stats.energyPct}%</span>
            </div>
            <div className="progress">
              <span style={{ width: `${stats.energyPct}%` }} />
            </div>
          </div>

          {/* Center: CTA */}
          <div className="flex justify-center">
            <a
              href="/join"
              className="btn-cta inline-flex items-center justify-center min-w-56"
              aria-label="Join the Flow"
            >
              Join the Flow
            </a>
          </div>

          {/* Right: extra metrics */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-white/80">
            <span className="opacity-90">Trust</span>
            <span className="text-right font-semibold">{stats.trustPct}%</span>

            <span className="opacity-90">Projects Completed</span>
            <span className="text-right font-semibold">{stats.projectsCompleted}</span>
          </div>
        </footer>
      </section>
    </main>
  );
}

/* ---------- Componentes ---------- */

function CircleButton({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="circle group"
      aria-label={label}
    >
      <span className="pointer-events-none select-none drop-shadow-[0_1px_10px_rgba(0,0,0,.6)]">
        {label}
      </span>

      {/* halo interior */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full
                   bg-[radial-gradient(45%_45%_at_50%_35%,rgba(255,255,255,.08),transparent_60%)]
                   group-hover:bg-[radial-gradient(45%_45%_at_50%_35%,rgba(255,255,255,.12),transparent_60%)]
                   transition"
      />
      {/* borde con degradado */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full
                   ring-1 ring-white/15 
                   shadow-[inset_0_0_40px_rgba(41,171,226,.15),inset_0_0_80px_rgba(0,224,199,.12)]"
      />
    </a>
  );
}