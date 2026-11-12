'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import SiteNav from '@/app/components/nav/SiteNav';
import SiteFooter from '@/app/components/nav/SiteFooter';
import MuseumAtmosphere from '@/app/components/ui/MuseumAtmosphere';
import { TYPE } from '@/app/components/ui/type';
import { EASE } from '@/app/components/ui/motion';
import { OCCASIONS, PIECES, REPLY_WINDOW, aud, priceFor, type PieceId } from '@/app/house/house';
import { SAMPLE_SLUG } from '@/app/house/exhibition';
import { useVia } from '@/app/house/useVia';

/* ------------------------------------------------------------------ */
/*  PYADRA · /commission — tell us about them.                         */
/*                                                                     */
/*  The first rooms are made by hand, so this takes no payment: it     */
/*  sends the commission to pyadra@pyadra.io (through /api/contact)    */
/*  and a person answers with the price and a payment link.            */
/* ------------------------------------------------------------------ */

const ENTER = 0.75;
const STORY_MAX = 1400;

const chip = (on: boolean) =>
  `rounded-2xl px-4 py-3 text-left ring-1 transition-colors ${on ? 'bg-accent/10 ring-accent/50' : 'bg-white/70 ring-ink/8 hover:ring-accent/30'}`;
const input =
  'w-full rounded-2xl bg-white/80 px-4 py-3 font-sans text-base text-ink ring-1 ring-ink/10 placeholder:text-ink-mute/60 focus:outline-none focus:ring-2 focus:ring-accent/60 transition-shadow';

export default function CommissionForm({ initialPiece }: { initialPiece: PieceId | null }) {
  const reduced = useReducedMotion() ?? false;
  const via = useVia();
  const [forName, setForName] = useState('');
  const [occasion, setOccasion] = useState<string>(OCCASIONS[0]);
  const [pieces, setPieces] = useState<PieceId[]>(initialPiece ? [initialPiece] : ['song', 'letter']);
  const [opens, setOpens] = useState('');
  const [story, setStory] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const { total, set } = priceFor(pieces);
  const has = (id: PieceId) => pieces.includes(id);
  const toggle = (id: PieceId) => setPieces((was) => (was.includes(id) ? was.filter((p) => p !== id) : [...was, id]));
  const ready = forName.trim() && pieces.length > 0 && story.trim().length >= 20 && name.trim() && email.includes('@');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || status === 'sending') return;
    setStatus('sending');
    const chosen = PIECES.filter((p) => has(p.id)).map((p) => p.name.replace('The ', '')).join(', ');
    const lines = [
      `For: ${forName.trim()}`,
      `Occasion: ${occasion}`,
      `Pieces: ${chosen} (${aud(total)}${set ? `, ${set.name.toLowerCase()}` : ''})`,
      has('letter') && opens ? `Letter opens: ${opens}` : '',
      via ? `Carrier code: ${via}` : '',
      '',
      story.trim(),
    ].filter((l, i) => l !== '' || i === 5);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'exhibition-commission',
          project: `Exhibition for ${forName.trim()}`,
          model: `${chosen} · ${aud(total)}`,
          name: name.trim(),
          email: email.trim(),
          message: lines.join('\n'),
        }),
      });
      if (!res.ok) throw new Error('send failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col bg-paper text-ink">
      <MuseumAtmosphere dust={20} fixed />
      <SiteNav crumbs={[{ label: 'Make one' }]} actions={[]} />

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: ENTER, duration: 0.7, ease: EASE.out }}
        className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-5 pb-20 pt-32 sm:px-8 lg:pt-40"
      >
        {status === 'success' ? (
          <div className="rounded-[28px] bg-white/80 p-8 text-center ring-1 ring-ink/5 sm:p-12">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent-deep">✓</div>
            <h1 className={TYPE.display}>We have it.</h1>
            <p className={`${TYPE.lead} mx-auto mt-4 max-w-md`}>
              A person will read what you wrote about {forName.trim()} and answer within {REPLY_WINDOW}, from pyadra@pyadra.io, with the price and a payment link. Nothing is charged before that.
            </p>
            <Link href={`/for/${SAMPLE_SLUG}`} className={`${TYPE.small} mt-8 inline-block !text-accent-deep underline-offset-4 hover:underline`}>
              Walk through the sample room while you wait
            </Link>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className={`${TYPE.label} !text-accent-deep mb-3`}>Pyadra · An exhibition of one</div>
            <h1 className={TYPE.display}>Tell us about them.</h1>
            <p className={`${TYPE.lead} mt-4`}>Write it the way you would say it to a friend. No payment here: a person answers with the price and the day it will be ready.</p>

            <div className="mt-10 space-y-9">
              <label className="block">
                <span className={`${TYPE.label} mb-2.5 block`}>The name on the wall</span>
                <input type="text" required maxLength={60} value={forName} onChange={(e) => setForName(e.target.value)} placeholder="What you call them" className={input} />
              </label>

              <fieldset>
                <legend className={`${TYPE.label} mb-2.5`}>The day</legend>
                <div className="flex flex-wrap gap-2">
                  {OCCASIONS.map((o) => (
                    <button key={o} type="button" aria-pressed={occasion === o} onClick={() => setOccasion(o)} className={`${chip(occasion === o)} !rounded-full !py-2`}>
                      <span className={`${TYPE.small} !text-ink`}>{o}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className={`${TYPE.label} mb-2.5 flex w-full justify-between`}>
                  <span>The pieces</span>
                  <span className="!text-accent-deep">
                    {pieces.length ? aud(total) : 'Choose at least one'}
                    {set ? ` · ${set.name.toLowerCase()}` : ''}
                  </span>
                </legend>
                <div className="grid gap-2.5 sm:grid-cols-3">
                  {PIECES.map((p) => (
                    <button key={p.id} type="button" aria-pressed={has(p.id)} onClick={() => toggle(p.id)} className={chip(has(p.id))}>
                      <span className={`${TYPE.lead} block !text-ink`}>{p.name}</span>
                      <span className={`${TYPE.small} mt-0.5 block !text-ink-mute`}>
                        {aud(p.price)} · {p.time.replace(/\.$/, '')}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>

              {has('letter') && (
                <label className="block">
                  <span className={`${TYPE.label} mb-2.5 block`}>The day the letter opens</span>
                  <input type="date" value={opens} onChange={(e) => setOpens(e.target.value)} className={input} />
                  <span className={`${TYPE.small} mt-2 block !text-ink-mute`}>You send the letter itself after we reply. It stays shut until this day.</span>
                </label>
              )}

              <label className="block">
                <span className={`${TYPE.label} mb-2.5 flex justify-between`}>
                  <span>Their story</span>
                  <span>
                    {story.length} / {STORY_MAX}
                  </span>
                </span>
                <textarea
                  rows={6}
                  maxLength={STORY_MAX}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Who they are to you, a memory, the joke only you two get, the music they love."
                  className={`${input} resize-y`}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={`${TYPE.label} mb-2.5 block`}>Your name</span>
                  <input type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} className={input} />
                </label>
                <label className="block">
                  <span className={`${TYPE.label} mb-2.5 block`}>Email to answer you</span>
                  <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
                </label>
              </div>
            </div>

            {via && <p className={`${TYPE.small} mt-6 !text-ink-mute`}>Carried by {via}.</p>}

            {status === 'error' && (
              <p role="alert" className={`${TYPE.small} mt-6 !text-red-700`}>
                It did not send. Write to{' '}
                <a href="mailto:pyadra@pyadra.io" className="font-semibold underline">
                  pyadra@pyadra.io
                </a>{' '}
                and we will pick it up there.
              </p>
            )}

            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
              <button
                type="submit"
                disabled={!ready || status === 'sending'}
                className="cta-glow py-sheen inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-sans text-sm font-semibold text-white disabled:pointer-events-none disabled:opacity-40"
              >
                {status === 'sending' ? 'Sending…' : 'Send it to the house'} <span aria-hidden>→</span>
              </button>
              <p className={`${TYPE.small} !text-ink-mute`}>We answer within {REPLY_WINDOW}.</p>
            </div>
          </form>
        )}
      </motion.div>

      <SiteFooter />
    </main>
  );
}
