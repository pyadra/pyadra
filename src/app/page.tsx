'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import SiteNav from '@/app/components/nav/SiteNav';
import SiteFooter from '@/app/components/nav/SiteFooter';
import MuseumAtmosphere from '@/app/components/ui/MuseumAtmosphere';
import RevealText from '@/app/components/ui/RevealText';
import Magnetic from '@/app/components/ui/Magnetic';
import { TYPE } from '@/app/components/ui/type';
import { EASE, RISE } from '@/app/components/ui/motion';
import { trackPointer } from '@/app/components/ui/pointer';
import { LOTS } from '@/app/exhibitions/galaxy/lots';
import { priceFrom } from '@/app/exhibitions/galaxy/rooms';
import { FAQ, LIMITS, PLANS, REPLY_WINDOW, STEPS, TIMELINE } from '@/app/studio/offer';

/* ------------------------------------------------------------------ */
/*  PYADRA — HOME · The studio                                         */
/*                                                                     */
/*  The `rethink/studio` proposal (November 2026). The Home stops      */
/*  being a threshold to a room of finished projects waiting for a     */
/*  buyer, and says one thing a stranger can act on: send us your      */
/*  idea, we build it, here is the price and the date.                 */
/*                                                                     */
/*  The nine projects stay exactly where they were (Galaxy and their   */
/*  dashboards). Here they change role: from inventory to proof.       */
/*  The old Home lives on at /museum.                                  */
/*                                                                     */
/*  Every string is in the copy deck first:                            */
/*  docs/pyadra_obsidian/Pyadra/02_Strategy/Studio_Rethink.md          */
/*  Every price and day count comes from studio/offer.ts.              */
/* ------------------------------------------------------------------ */

const ENTER = 0.75; // the template dissolve (template.tsx) settles first

const WORK = LOTS.filter((l) => l.stage === 'ready');
const OPENABLE = WORK.filter((l) => l.sheet?.live).length;
/** The count as a word, from the data — it can never fall behind lots.ts. */
const COUNT = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'][WORK.length] ?? String(WORK.length);

/** The second door on a row, named by how that project is entered. */
const doorLabel = (wayIn: string, from: string | null) => {
  const verb = wayIn === 'support' ? 'Back it' : 'Take it over';
  return from ? `${verb} · ${from.toLowerCase()}` : 'Its page';
};

const CTA =
  'cta-glow py-sheen inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-sans text-sm font-semibold text-white';
const GHOST =
  'inline-flex items-center gap-2 rounded-full px-5 py-3.5 font-sans text-sm font-semibold text-ink-soft ring-1 ring-ink/10 bg-white/60 hover:text-accent-deep hover:ring-accent/40 transition-colors';

/** A section that rises as it enters the screen, its children one after another. */
function Section({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.section
      id={id}
      initial={reduced ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '-12% 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
      className={`relative z-10 mx-auto w-full max-w-6xl scroll-mt-24 px-5 sm:px-8 ${className}`}
    >
      {children}
    </motion.section>
  );
}

function Heading({ label, title, lead }: { label: string; title: string; lead?: string }) {
  return (
    <motion.div variants={RISE} className="max-w-2xl">
      <div className={`${TYPE.label} !text-accent-deep mb-3`}>{label}</div>
      <h2 className={TYPE.display}>{title}</h2>
      {lead && <p className={`${TYPE.lead} mt-4`}>{lead}</p>}
    </motion.div>
  );
}

export default function PyadraHome() {
  const reduced = useReducedMotion() ?? false;

  return (
    <main className="relative min-h-screen bg-paper text-ink overflow-x-clip">
      <MuseumAtmosphere dust={28} fixed />
      <SiteNav actions={[{ label: 'Work', href: '/#work' }, { label: 'Pricing', href: '/#pricing' }]} />

      {/* ---------------------------------------------------------- */}
      {/*  Opening — the offer and the calendar, side by side         */}
      {/* ---------------------------------------------------------- */}
      <section className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pb-28 lg:pt-44">
        <div>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ENTER, duration: 0.6, ease: EASE.out }}
            className={`${TYPE.label} !text-accent-deep mb-5 flex items-center gap-2`}
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
            Pyadra · Product studio
          </motion.div>

          <RevealText
            as="h1"
            text="Your idea, live and taking payments in 30 days"
            className="t-d1 text-ink text-balance"
            delay={ENTER + 0.1}
            after={<span className="text-accent">.</span>}
          />

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ENTER + 0.6, duration: 0.7, ease: EASE.out }}
            className={`${TYPE.lead} mt-6 max-w-xl`}
          >
            We are a small team that has taken {COUNT} ideas from a sentence to a working product. Now we do it
            for yours. One fixed price, agreed before we start, and everything we build is yours.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ENTER + 0.75, duration: 0.7, ease: EASE.out }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <Link href="/start" className={CTA}>
                Tell us your idea <span aria-hidden>→</span>
              </Link>
            </Magnetic>
            <Link href="/#work" className={GHOST}>
              See what we have built
            </Link>
          </motion.div>

          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: ENTER + 1, duration: 0.8 }}
            className={`${TYPE.small} mt-5 !text-ink-mute`}
          >
            Free to ask. We answer within {REPLY_WINDOW}.
          </motion.p>
        </div>

        {/* the calendar — the Launch build, day by day */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: ENTER + 0.45, duration: 0.9, ease: EASE.out }}
          className="relative rounded-[28px] bg-white/80 p-6 shadow-xl shadow-ink/5 ring-1 ring-ink/5 backdrop-blur-md sm:p-8"
        >
          <div className="flex items-baseline justify-between">
            <div className={TYPE.label}>The launch build</div>
            <div className={`${TYPE.label} !text-accent-deep`}>{PLANS.find((p) => p.pick)?.price} fixed</div>
          </div>

          <ol className="relative mt-7">
            {TIMELINE.map((t, i) => {
              const last = i === TIMELINE.length - 1;
              return (
                <motion.li
                  key={t.day}
                  initial={reduced ? false : { opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: ENTER + 1 + i * 0.38, duration: 0.6, ease: EASE.out }}
                  className={`relative pl-8 ${last ? '' : 'pb-6'}`}
                >
                  {/* the line to the next day: drawn as the days arrive */}
                  {!last && (
                    <motion.span
                      aria-hidden
                      initial={reduced ? false : { scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: ENTER + 1.15 + i * 0.38, duration: 0.45, ease: EASE.inOut }}
                      className="absolute -bottom-1.5 left-[5px] top-[17px] w-px origin-top bg-accent/45"
                    />
                  )}
                  <span
                    aria-hidden
                    className={`absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full ${
                      last ? 'bg-accent shadow-[0_0_0_6px_rgba(5,150,105,0.14)]' : 'border-2 border-accent/50 bg-white'
                    }`}
                  />
                  <div className={`${TYPE.label} ${last ? '!text-accent-deep' : ''}`}>{t.day}</div>
                  <div className={`mt-1 ${last ? TYPE.title : `${TYPE.lead} !text-ink`}`}>{t.what}</div>
                </motion.li>
              );
            })}
          </ol>

          <div className="mt-7 border-t border-ink/8 pt-5">
            <p className={TYPE.small}>
              Not sure yet? Start with a working prototype in {PLANS[0].time} for {PLANS[0].price}.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/*  The proof — our own projects, as a ledger you can open     */}
      {/* ---------------------------------------------------------- */}
      <Section id="work" className="pb-24 lg:pb-32">
        <Heading
          label={`The proof · ${WORK.length} built, ${OPENABLE} you can open today`}
          title="We built these for ourselves first."
          lead="Before asking anyone to trust us with an idea, we shipped our own: apps, stores, a podcast and a cleanup business with real customers. Open any of them."
        />

        <motion.ul variants={RISE} className="mt-10 overflow-hidden rounded-[28px] bg-white/70 ring-1 ring-ink/5 backdrop-blur-sm">
          {WORK.map((lot, i) => {
            const from = priceFrom(lot.id);
            return (
              <li
                key={lot.id}
                onPointerMove={trackPointer}
                className={`py-spot grid gap-x-6 gap-y-2 px-5 py-5 sm:px-7 md:grid-cols-[13rem_minmax(0,1fr)_auto] md:items-center ${
                  i > 0 ? 'border-t border-ink/6' : ''
                }`}
              >
                <div className="min-w-0">
                  <div className={`${TYPE.label} mb-1.5`}>{lot.kind}</div>
                  <div className={TYPE.title}>{lot.name}</div>
                </div>

                <div className="min-w-0">
                  <p className={`${TYPE.body} !text-ink-soft`}>{lot.subtitle}</p>
                  <p className={`${TYPE.small} mt-1 !text-ink-mute`}>{lot.proof}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                  {lot.sheet?.live && (
                    <a
                      href={lot.sheet.live.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${TYPE.small} rounded-full bg-paper px-3.5 py-2 !text-ink hover:!text-accent-deep transition-colors`}
                    >
                      {lot.sheet.live.label} <span aria-hidden>↗</span>
                    </a>
                  )}
                  {lot.enter_url && (
                    <Link
                      href={lot.enter_url}
                      className={`${TYPE.small} rounded-full px-3.5 py-2 ring-1 ring-ink/10 !text-ink-soft hover:!text-accent-deep hover:ring-accent/40 transition-colors`}
                    >
                      {doorLabel(lot.wayIn, from)}
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </motion.ul>

        <motion.p variants={RISE} className={`${TYPE.small} mt-5 !text-ink-mute`}>
          Each one is still open to a new owner or operator.{' '}
          <Link href="/exhibitions/galaxy" className="!text-accent-deep underline-offset-4 hover:underline">
            See them in Galaxy
          </Link>
          .
        </motion.p>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  How it goes                                                */}
      {/* ---------------------------------------------------------- */}
      <Section id="how" className="pb-24 lg:pb-32">
        <Heading label="How it goes" title="Four steps, and you can see every one." />
        <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <motion.div key={s.n} variants={RISE} className="border-t border-ink/10 pt-5">
              <div className={`${TYPE.label} !text-accent-deep`}>{s.n}</div>
              <h3 className={`${TYPE.title} mt-3`}>{s.title}</h3>
              <p className={`${TYPE.body} mt-3 !text-ink-soft`}>{s.text}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  Pricing — said out loud                                    */}
      {/* ---------------------------------------------------------- */}
      <Section id="pricing" className="pb-24 lg:pb-32">
        <Heading
          label="Pricing"
          title="The price is on the page."
          lead="No quote to wait for and no hourly meter. If your idea does not fit one of these, we will tell you before you pay anything."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {PLANS.map((p) => (
            <motion.div
              key={p.id}
              variants={RISE}
              onPointerMove={trackPointer}
              className={`py-spot panel-lift flex flex-col rounded-[28px] p-7 ring-1 ${
                p.pick ? 'bg-white ring-accent/40 shadow-xl shadow-accent/10' : 'bg-white/70 ring-ink/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className={TYPE.title}>{p.name}</h3>
                {p.pick && (
                  <span className={`${TYPE.label} rounded-full bg-accent/10 px-3 py-1 !text-accent-deep`}>Most asked for</span>
                )}
              </div>
              <div className="mt-5 flex items-baseline gap-2">
                <span className={TYPE.display}>{p.price}</span>
                <span className={TYPE.small}>{p.priceNote}</span>
              </div>
              <div className={`${TYPE.label} mt-2 !text-accent-deep`}>{p.time}</div>
              <p className={`${TYPE.body} mt-4 !text-ink-soft`}>{p.line}</p>
              <ul className="mt-5 space-y-2.5 border-t border-ink/8 pt-5">
                {p.gets.map((g) => (
                  <li key={g} className={`${TYPE.small} flex gap-2.5`}>
                    <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {g}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-7">
                <Link href={`/start?plan=${p.id}`} className={p.pick ? `${CTA} w-full justify-center` : `${GHOST} w-full justify-center`}>
                  {p.id === 'care' ? 'Ask about Care' : `Start with ${p.name}`}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.p variants={RISE} className={`${TYPE.small} mt-5 !text-ink-mute`}>
          Prices in Australian dollars. We work with people in Australia and the United States.
        </motion.p>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  The limits — what we do not do                             */}
      {/* ---------------------------------------------------------- */}
      <Section className="pb-24 lg:pb-32">
        <Heading label="Straight talk" title="What we will not do." />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {LIMITS.map((l) => (
            <motion.div key={l.title} variants={RISE} className="rounded-[28px] bg-ink/[0.035] p-7">
              <h3 className={TYPE.title}>{l.title}</h3>
              <p className={`${TYPE.body} mt-3 !text-ink-soft`}>{l.text}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  Questions                                                  */}
      {/* ---------------------------------------------------------- */}
      <Section className="pb-24 lg:pb-32">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Heading
            label="Questions"
            title="Asked before the first call."
            lead="Anything else, write to pyadra@pyadra.io. A person answers."
          />
          <motion.div variants={RISE} className="divide-y divide-ink/8 border-y border-ink/8">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className={`${TYPE.lead} !text-ink flex cursor-pointer list-none items-center justify-between gap-6 [&::-webkit-details-marker]:hidden`}>
                  {f.q}
                  <span aria-hidden className="text-accent transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className={`${TYPE.body} mt-3 max-w-xl !text-ink-soft`}>{f.a}</p>
              </details>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  The ask, once more                                         */}
      {/* ---------------------------------------------------------- */}
      <Section className="pb-20">
        <motion.div
          variants={RISE}
          className="relative overflow-hidden rounded-[32px] bg-white px-6 py-14 text-center ring-1 ring-ink/5 sm:px-12 sm:py-20"
        >
          <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-64 w-[36rem] max-w-full rounded-full bg-accent/15 blur-3xl" />
          <div className="relative">
            <h2 className={`${TYPE.display} text-balance`}>One paragraph is enough to start.</h2>
            <p className={`${TYPE.lead} mx-auto mt-4 max-w-md`}>
              Tell us what you want to exist. We will tell you if we can build it, what it costs and when it lands.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/start" className={CTA}>
                Tell us your idea <span aria-hidden>→</span>
              </Link>
            </div>
            <p className={`${TYPE.small} mt-5 !text-ink-mute`}>
              Who you will be talking to:{' '}
              <Link href="/team" className="!text-accent-deep underline-offset-4 hover:underline">
                meet the team
              </Link>
              .
            </p>
          </div>
        </motion.div>
      </Section>

      <SiteFooter />
    </main>
  );
}
