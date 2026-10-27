import type { Metadata } from 'next';
import { LOTS } from './lots';

export const metadata: Metadata = {
  // Re-declare the template — Next resets it when a segment defines a plain title.
  title: { default: 'Galaxy', template: '%s — Pyadra' },
  // Built from the lots, so the description never falls behind the orbit.
  description: `${LOTS.length} projects: ${LOTS.slice(0, -1).map((l) => l.name).join(', ')} and ${LOTS[LOTS.length - 1].name}. Where a project sits tells you how to come in.`,
};

export default function GalaxyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
