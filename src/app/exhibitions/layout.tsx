import type { Metadata } from 'next';

export const metadata: Metadata = {
  // Re-declare the template — Next resets it when a segment defines a plain title.
  title: { default: 'Exhibitions', template: '%s — Pyadra' },
  description:
    'Discover, meet, build, buy, and support new projects through exhibitions — like walking through a museum of ideas, businesses, and opportunities.',
};

export default function ExhibitionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
