import type { Metadata } from 'next';
import CarryPage from './CarryPage';

export const metadata: Metadata = {
  title: 'Carry it',
  description: 'Bring Pyadra to the people you know. Nothing to pay to come in, and a share of everything you bring.',
};

export default function Carry() {
  return <CarryPage />;
}
