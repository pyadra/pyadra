import type { Metadata } from 'next';

export const metadata: Metadata = {
  // Re-declare the template — Next resets it when a segment defines a plain title.
  title: { default: 'Galaxy', template: '%s — Pyadra' },
  description:
    'Seven projects, already alive: Orbit 77, EterniCapsule, Figuitoon, Kangaroo Cleanup, Byndi, Momentos Inolvidables and Gym routines. Step into any one of them. Take it further.',
};

export default function GalaxyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
