import type { Metadata } from 'next';

/* The Home as it was before the house proposal (rethink/exhibition-of-one):
   the symbol, the wordmark, the tagline and the door to Galaxy. Kept whole. */
export const metadata: Metadata = {
  title: { default: 'The museum', template: '%s — Pyadra' },
  description: 'Discover. Connect. Build. Buy. The museum of Pyadra projects.',
};

export default function MuseumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
