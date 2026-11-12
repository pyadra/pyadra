'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import SiteNav from '@/app/components/nav/SiteNav';
import SiteFooter from '@/app/components/nav/SiteFooter';
import MuseumAtmosphere from '@/app/components/ui/MuseumAtmosphere';
import { TYPE } from '@/app/components/ui/type';
import { EASE } from '@/app/components/ui/motion';
import { PLANS, REPLY_WINDOW, STAGES, type PlanId } from '@/app/studio/offer';

/* ------------------------------------------------------------------ */
/*  PYADRA · /start — the brief.                                       */
/*                                                                     */
/*  Three questions and a way to answer back. It asks only what the    */
/*  first reply needs: the idea, where it is today and how big a step  */
/*  the person wants to take. Sent through /api/contact to             */
/*  pyadra@pyadra.io, the one inbox.                                   */
/* ------------------------------------------------------------------ */

const ENTER = 0.75;
const IDEA_MAX = 1500;

type Choice = PlanId | 'unsure';

const CHOICES: { id: Choice; name: string; note: string }[] = [
  ...PLANS.filter((p) => p.id !== 'care').map((p) => ({ id: p.id as Choice, name: p.name, note: `${p.time} · ${p.price}` })),
  { id: 'unsure', name: 'Not sure yet', note: 'Tell me what fits' },
];

const chip = (on: boolean) =>
  `rounded-2xl px-4 py-3 text-left ring-1 transition-colors ${
    on ? 'bg-accent/10 ring-accent/50' : 'bg-white/70 ring-ink/8 hover:ring-accent/30'
  }`;

const input =
  'w-full rounded-2xl bg-white/80 px-4 py-3 font-sans text-base text-ink ring-1 ring-ink/10 placeholder:text-ink-mute/60 focus:outline-none focus:ring-2 focus:ring-accent/60 transition-shadow';

export default function BriefForm({ initialPlan }: { initialPlan: PlanId | null }) {
  const reduced = useReducedMotion() ?? false;
  const [idea, setIdea] = useState('');
  const [stage, setStage] = useState<string>(STAGES[0]);
  const [choice, setChoice] = useState<Choice>(initialPlan && initialPlan !== 'care' ? initialPlan : 'unsure');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const careAsked = initialPlan === 'care';
  const ready = idea.trim().length >= 20 && name.trim() && email.includes('@');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || status === 'sending') return;
    setStatus('sending');
    const picked = CHOICES.find((c) => c.id === choice)!;
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'studio-brief',
          project: stage,
          model: careAsked ? 'Care' : picked.name,
          name: name.trim(),
          email: email.trim(),
          message: idea.trim(),
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
      <SiteNav crumbs={[{ label: 'Your idea' }]} actions={[{ label: 'Work', href: '/#work' }]} />

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: ENTER, duration: 0.7, ease: EASE.out }}
        className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-5 pb-20 pt-32 sm:px-8 lg:pt-40"
      >
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE.out }}
              className="rounded-[28px] bg-white/80 p-8 text-center ring-1 ring-ink/5 sm:p-12"
            >
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent-deep">✓</div>
              <h1 className={TYPE.display}>We have it.</h1>
              <p className={`${TYPE.lead} mx-auto mt-4 max-w-md`}>
                Your idea is in our inbox. One of us will read it and write back within {REPLY_WINDOW}, from pyadra@pyadra.io.
              </p>
              <Link href="/#work" className={`${TYPE.small} mt-8 inline-block !text-accent-deep underline-offset-4 hover:underline`}>
                See what we have built while you wait
              </Link>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <div className={`${TYPE.label} !text-accent-deep mb-3`}>Pyadra · Your idea</div>
              <h1 className={TYPE.display}>Tell us what you want to exist.</h1>
              <p className={`${TYPE.lead} mt-4`}>
                {careAsked
                  ? 'Tell us what you have running and what it needs. We answer with whether Care fits.'
                  : 'No pitch deck, no call to book. Write it the way you would say it to a friend.'}
              </p>

              <div className="mt-10 space-y-9">
                <label className="block">
                  <span className={`${TYPE.label} mb-2.5 flex justify-between`}>
                    <span>The idea</span>
                    <span className={idea.length > IDEA_MAX - 100 ? '!text-accent-deep' : ''}>
                      {idea.length} / {IDEA_MAX}
                    </span>
                  </span>
                  <textarea
                    rows={6}
                    maxLength={IDEA_MAX}
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="What is it, who is it for, and what should someone be able to do with it on day one?"
                    className={`${input} resize-y`}
                  />
                </label>

                <fieldset>
                  <legend className={`${TYPE.label} mb-2.5`}>Where it is today</legend>
                  <div className="grid grid-cols-2 gap-2.5">
                    {STAGES.map((s) => (
                      <button key={s} type="button" aria-pressed={stage === s} onClick={() => setStage(s)} className={chip(stage === s)}>
                        <span className={`${TYPE.small} !text-ink`}>{s}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                {!careAsked && (
                  <fieldset>
                    <legend className={`${TYPE.label} mb-2.5`}>The step you want to take</legend>
                    <div className="grid gap-2.5 sm:grid-cols-3">
                      {CHOICES.map((c) => (
                        <button key={c.id} type="button" aria-pressed={choice === c.id} onClick={() => setChoice(c.id)} className={chip(choice === c.id)}>
                          <span className={`${TYPE.lead} block !text-ink`}>{c.name}</span>
                          <span className={`${TYPE.small} mt-0.5 block !text-ink-mute`}>{c.note}</span>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}

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
                  {status === 'sending' ? 'Sending…' : 'Send it to us'} <span aria-hidden>→</span>
                </button>
                <p className={`${TYPE.small} !text-ink-mute`}>Free to ask. We answer within {REPLY_WINDOW}.</p>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      <SiteFooter />
    </main>
  );
}
