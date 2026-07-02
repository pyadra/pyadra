import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orbit 77',
  description:
    'A podcast recorded from Australia exploring life, creation, and identity. 10 episodes live. Built for permanence, not virality.',
};

export default function OrbitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
