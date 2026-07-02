import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Store',
  description:
    'The museum shop. Objects made by Pyadra — starting with two digital books, written one real story at a time.',
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
