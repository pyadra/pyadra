import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Manifesto',
  description:
    'Why Pyadra exists: where projects and ideas find the people who make them real. Contribute with money, work, or skills. Discover. Connect. Build. Buy.',
};

export default function ManifestoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
