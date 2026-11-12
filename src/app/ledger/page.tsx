import type { Metadata } from 'next';
import LedgerPage from './LedgerPage';

export const metadata: Metadata = {
  title: 'The open book',
  description: 'Everything Pyadra has made and what it has done so far, with where each number comes from.',
};

export default function Ledger() {
  return <LedgerPage />;
}
