import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Figuitoon',
  description:
    'Your face. Your team. Your figurine. Upload a photo, pick a model, and get a custom 3D-printed mini version of you — collectible, one of a kind.',
};

export default function FiguitoonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
