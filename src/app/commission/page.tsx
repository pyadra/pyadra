import type { Metadata } from 'next';
import CommissionForm from './CommissionForm';
import { pieceById } from '@/app/house/house';

export const metadata: Metadata = {
  title: 'Make one for someone',
  description: 'Tell us about the person. We answer with the price and the day their room will be ready.',
};

/* /commission — the one door of the house. `?piece=` carries the piece
   that was pressed; `?via=` carries a carrier's code (house/via.ts). */
export default async function CommissionPage({ searchParams }: { searchParams: Promise<{ piece?: string }> }) {
  const { piece } = await searchParams;
  return <CommissionForm initialPiece={pieceById(piece)?.id ?? null} />;
}
