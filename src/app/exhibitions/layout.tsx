import type { Metadata } from 'next';

export const metadata: Metadata = {
  // Re-declare the template — Next resets it when a segment defines a plain title.
  title: { default: 'Exhibitions', template: '%s — Pyadra' },
  description:
    'Three exhibitions are set up. Galaxy is open — step inside and meet four living projects you can understand, support, or take further.',
};

export default function ExhibitionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
