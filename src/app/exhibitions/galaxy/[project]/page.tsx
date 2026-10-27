import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOTS } from '../lots';
import { ROOMS, roomBySlug } from '../rooms';
import ProjectDashboard from '../room/ProjectDashboard';

/* Every project's dashboard, from one template (room/ProjectDashboard.tsx)
   and one row of data (lots.ts + rooms.ts). The URL segment is the room's
   slug — the four that existed before keep their addresses. */

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(ROOMS).map((r) => ({ project: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ project: string }> }): Promise<Metadata> {
  const { project } = await params;
  const hit = roomBySlug(project);
  const lot = hit && LOTS.find((l) => l.id === hit[0]);
  if (!lot) return {};
  return {
    title: lot.name,
    description: [lot.sheet?.hook, lot.sheet?.summary ?? lot.subtitle].filter(Boolean).join(' '),
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ project: string }> }) {
  const { project } = await params;
  const hit = roomBySlug(project);
  if (!hit) notFound();
  return <ProjectDashboard id={hit[0]} />;
}
