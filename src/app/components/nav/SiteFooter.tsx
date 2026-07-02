'use client';

/* ------------------------------------------------------------------ */
/*  PYADRA · SiteFooter — the one footer every page uses.              */
/*                                                                     */
/*  Museum-plaque minimal: one thin line at the bottom.                */
/*    LEFT   © 2026 Pyadra + Observer № signature (discrete emerald)   */
/*    RIGHT  institutional destinations only                           */
/*                                                                     */
/*  Rules:                                                             */
/*    · No "We document. We verify. You decide." tagline (that's       */
/*      thesis copy — belongs in the hero or Manifesto, not buried).   */
/*    · Project socials (Orbit's YouTube, Figuitoon's shop, etc.)      */
/*      NEVER live here — each project lists its own on its page.      */
/*    · Instagram is a text link, not a coloured brand icon.           */
/*    · Mobile: stacks centered — links first, signature below.        */
/* ------------------------------------------------------------------ */

import Link from 'next/link';
import { useEffect, useState } from 'react';

/** Institutional destinations. Same weight, same style. */
const LINKS: { label: string; href: string; external?: boolean }[] = [
  { label: 'Manifesto', href: '/manifesto' },
  { label: 'Contact',   href: 'mailto:pyadra@pyadra.io',        external: true },
  { label: 'Instagram', href: 'https://instagram.com/pyadra',   external: true },
  { label: 'Terms',     href: '/legal/terms' },
  { label: 'Privacy',   href: '/legal/privacy' },
];

export default function SiteFooter() {
  const [observerId, setObserverId] = useState<string | null>(null);

  // 'pyadra:observer' fires when the home registers a first-time visitor,
  // so the number appears without a reload.
  useEffect(() => {
    const read = () => {
      const id = window.localStorage.getItem('pyadra_observer_id');
      if (id) setObserverId(id);
    };
    read();
    window.addEventListener('pyadra:observer', read);
    return () => window.removeEventListener('pyadra:observer', read);
  }, []);

  return (
    <footer className="relative z-10 w-full border-t border-[#1A1C1A]/8 mt-4">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between t-d5 text-[#6B8070]">
        {/* LEFT (visually) — signature. On mobile it renders BELOW the links. */}
        <div className="flex items-center gap-3 sm:order-1 order-2">
          <span>© 2026 Pyadra</span>
          {observerId && (
            <span
              className="inline-flex items-center gap-1.5 text-[#047857]/70"
              aria-label="Your Observer signature"
            >
              <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
              Observer № {observerId.replace('#', '')}
            </span>
          )}
        </div>

        {/* RIGHT (visually) — institutional links. On mobile: on top, centered. */}
        <nav
          aria-label="Institutional"
          className="flex items-center gap-x-5 gap-y-2 flex-wrap justify-center sm:order-2 order-1"
        >
          {LINKS.map((l) => {
            const isHttp = l.href.startsWith('http');
            if (l.external) {
              return (
                <a
                  key={l.label}
                  href={l.href}
                  target={isHttp ? '_blank' : undefined}
                  rel={isHttp ? 'noopener noreferrer' : undefined}
                  className="hover:text-[#059669] transition-colors"
                >
                  {l.label}
                </a>
              );
            }
            return (
              <Link key={l.label} href={l.href} className="hover:text-[#059669] transition-colors">
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}
