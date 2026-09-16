import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eduardo Díaz — Founder',
  description:
    'Seven projects in orbit. Four in exhibition, three forming. Some are open for acquisition, one is looking for a partner. This is the room where the curator stands.',
  openGraph: {
    title: 'Eduardo Díaz — Founder of Pyadra',
    description: 'Seven projects in orbit. Four in exhibition, three forming.',
    url: 'https://pyadra.io/eduardo',
    type: 'profile',
  },
};

export default function EduardoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
