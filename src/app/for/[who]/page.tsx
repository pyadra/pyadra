import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '@/app/components/nav/SiteNav';
import SiteFooter from '@/app/components/nav/SiteFooter';
import MuseumAtmosphere from '@/app/components/ui/MuseumAtmosphere';
import { TYPE } from '@/app/components/ui/type';
import { getExhibition } from '@/app/house/store';
import { SAMPLE_SLUG } from '@/app/house/exhibition';
import ExhibitionRoom from './ExhibitionRoom';

/* ------------------------------------------------------------------ */
/*  /for/<who> — an exhibition of one.                                 */
/*                                                                     */
/*  Read at visit time, on the server, so a letter opens on its day    */
/*  and not a moment before: what reaches the browser has already      */
/*  been sealed (house/store.ts).                                      */
/* ------------------------------------------------------------------ */

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ who: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { who } = await params;
  const exhibition = await getExhibition(who);
  if (!exhibition) return { title: 'This room is not open', robots: { index: false, follow: false } };
  return {
    title: `For ${exhibition.forName}`,
    description: 'An exhibition of one, made at Pyadra.',
    // a real room is private: only the house's own sample may be found
    robots: exhibition.sample ? undefined : { index: false, follow: false },
  };
}

export default async function ExhibitionPage({ params }: Params) {
  const { who } = await params;
  const now = new Date();
  const exhibition = await getExhibition(who, now);

  if (!exhibition) {
    return (
      <main className="relative flex min-h-screen flex-col bg-paper text-ink">
        <MuseumAtmosphere dust={20} fixed />
        <SiteNav actions={[]} />
        <div className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-5 py-32 text-center">
          <div className={`${TYPE.label} mb-4`}>Pyadra · An exhibition of one</div>
          <h1 className={TYPE.display}>This room is not open.</h1>
          <p className={`${TYPE.lead} mt-4`}>
            The link may be mistyped, or the room may have been closed by the person who made it. If someone gave you a ticket, ask them to send it again.
          </p>
          <Link href={`/for/${SAMPLE_SLUG}`} className={`${TYPE.small} mt-8 !text-accent-deep underline-offset-4 hover:underline`}>
            Walk through a sample room
          </Link>
        </div>
        <SiteFooter />
      </main>
    );
  }

  return <ExhibitionRoom exhibition={exhibition} today={now.toISOString().slice(0, 10)} />;
}
