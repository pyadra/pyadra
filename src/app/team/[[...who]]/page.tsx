import type { Metadata } from 'next';
import TeamPage from '../TeamPage';
import { PEOPLE, DEFAULT_PERSON, personIndex } from '../people';

/* ------------------------------------------------------------------ */
/*  /team            → the team, opening on the first person     */
/*  /team/edu        → opening on Eduardo                        */
/*  /team/cris       → opening on Cristian                       */
/*                                                                     */
/*  One optional catch-all serves every name, so adding a teammate is  */
/*  one object in people.ts and never a new route.                     */
/* ------------------------------------------------------------------ */

type Props = { params: Promise<{ who?: string[] }> };

/* Pre-render a page per person instead of resolving them on demand. */
export function generateStaticParams() {
  return [{ who: [] as string[] }, ...PEOPLE.map((p) => ({ who: [p.slug] }))];
}

function resolve(who?: string[]) {
  const slug = who?.[0];
  const i = personIndex(slug);
  return PEOPLE[i] ?? PEOPLE[personIndex(DEFAULT_PERSON)] ?? PEOPLE[0];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { who } = await params;
  const person = resolve(who);
  const url = `https://pyadra.io/team/${person.slug}`;
  const title = `${person.name} — ${person.role} at Pyadra`;
  const description =
    person.statement ||
    'The people behind Pyadra, and the seven projects they are building.';

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'profile' },
  };
}

export default async function PyadraTeamPage({ params }: Props) {
  const { who } = await params;
  return <TeamPage initial={resolve(who).slug} />;
}
