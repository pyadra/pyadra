import type { Metadata } from 'next';
import BriefForm from './BriefForm';
import { planById } from '@/app/studio/offer';

export const metadata: Metadata = {
  title: 'Tell us your idea',
  description: 'One paragraph is enough. We read it ourselves and answer with what it would take, what it costs and when it lands.',
};

/* /start — the one door of the studio. Every "Tell us your idea" on the
   site lands here; `?plan=` carries the card that was pressed. */
export default async function StartPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  return <BriefForm initialPlan={planById(plan)?.id ?? null} />;
}
