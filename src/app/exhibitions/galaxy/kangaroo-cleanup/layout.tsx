import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kangaroo Cleanup',
  description:
    'Your own business — without starting from zero. A Sydney cleanup business with 500+ jobs done, a 5.0 reputation, and channels that still ring today.',
};

export default function KangarooLayout({ children }: { children: React.ReactNode }) {
  return children;
}
