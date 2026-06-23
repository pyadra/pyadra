'use client';

/* ------------------------------------------------------------------ */
/*  PYADRA · El Peón Gema — reusable brand mark                        */
/*                                                                     */
/*  Two animations:                                                    */
/*    · `intro`        gem drops in, body rises, spark sparks once.   */
/*    · `interactive`  on click, gem and body MEET in the center.     */
/*                                                                     */
/*  Anatomy: ojal 44, patas 24 — emerald #059669 (light) / #10B981 (dark). */
/* ------------------------------------------------------------------ */

import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type Props = {
  /** Pixel width of the symbol. Height auto-scales (~ width × 232/240). */
  size?: number;
  /** Play the drop-gem / rise-body / spark entrance once on mount. */
  intro?: boolean;
  /** Click toggles the "meet" state (gem ↓, body ↑). */
  interactive?: boolean;
  /** Show "PYADRA" word below the symbol. */
  showWord?: boolean;
  /** Show "LO QUE DEJAS IMPORTA" tagline below the word. */
  showTagline?: boolean;
  /** Light or dark surface — switches stroke + text colors. */
  mode?: 'light' | 'dark';
  /** Override the stroke width. Auto-picks heavier weight below ~32px. */
  strokeWidth?: number;
  /** Aria label for screen readers. */
  label?: string;
  className?: string;
};

const VIEW_W = 240;
const VIEW_H = 232;

export default function PyadraLogo({
  size = 48,
  intro = false,
  interactive = false,
  showWord = false,
  showTagline = false,
  mode = 'light',
  strokeWidth,
  label = 'Pyadra',
  className = '',
}: Props) {
  const [met, setMet] = useState(false);
  const [introDone, setIntroDone] = useState(!intro);

  const gemControls = useAnimationControls();
  const bodyControls = useAnimationControls();
  const sparkControls = useAnimationControls();
  const wordControls = useAnimationControls();
  const tagControls = useAnimationControls();

  /* Avoid double-running intro in React 18 strict mode + during SSR. */
  const ranIntro = useRef(false);

  const stroke = mode === 'dark' ? '#10B981' : '#059669';
  const inkColor = mode === 'dark' ? '#EDEFED' : '#1A1C1A';
  const subColor = mode === 'dark' ? '#A8BCA1' : '#6B8070';

  /* Auto-heavier stroke for tiny sizes (favicon-like). */
  const sw = strokeWidth ?? (size < 28 ? 17 : size < 40 ? 14 : 11);

  /* --- entrance --- */
  useEffect(() => {
    if (!intro || ranIntro.current) return;
    ranIntro.current = true;

    (async () => {
      await Promise.all([
        gemControls.start({
          y: 0,
          opacity: 1,
          transition: { type: 'spring', stiffness: 110, damping: 14, mass: 1 },
        }),
        bodyControls.start({
          y: 0,
          opacity: 1,
          transition: { type: 'spring', stiffness: 110, damping: 14, mass: 1, delay: 0.15 },
        }),
      ]);

      /* spark only on intro */
      sparkControls.start({
        scale: [0, 1.25, 1],
        opacity: [0, 1, 0.9],
        transition: { duration: 0.55, times: [0, 0.55, 1], ease: 'easeOut' },
      });

      /* word + tagline fade in after the symbol has assembled */
      wordControls.start({
        opacity: 1,
        transition: { duration: 0.8 },
      });
      tagControls.start({
        opacity: 1,
        transition: { duration: 0.8, delay: 0.15 },
      });

      setIntroDone(true);
    })();
  }, [intro, gemControls, bodyControls, sparkControls, wordControls, tagControls]);

  /* --- meet toggle (after intro is done) --- */
  useEffect(() => {
    if (!introDone) return;
    gemControls.start({
      y: met ? 30 : 0,
      transition: { type: 'spring', stiffness: 200, damping: 22 },
    });
    bodyControls.start({
      y: met ? -24 : 0,
      transition: { type: 'spring', stiffness: 200, damping: 22 },
    });
  }, [met, introDone, gemControls, bodyControls]);

  const onClick = interactive && introDone ? () => setMet((m) => !m) : undefined;

  /* Initial pose for each group depends on whether we're playing intro. */
  const gemInitial = intro ? { y: -90, opacity: 0 } : { y: 0, opacity: 1 };
  const bodyInitial = intro ? { y: 90, opacity: 0 } : { y: 0, opacity: 1 };

  const heightPx = Math.round((size * VIEW_H) / VIEW_W);

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <button
        type="button"
        onClick={onClick}
        disabled={!interactive}
        aria-label={interactive ? `${label} — tap to see them meet` : label}
        className={`bg-transparent p-0 border-0 ${
          interactive ? 'cursor-pointer' : 'cursor-default'
        }`}
        style={{ lineHeight: 0 }}
      >
        <svg
          width={size}
          height={heightPx}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          overflow="visible"
          style={{ display: 'block' }}
        >
          {/* gem + spark group */}
          <motion.g initial={gemInitial} animate={gemControls}>
            <path
              d="M106,20 L134,20 L150,38 L150,72 L134,90 L106,90 L90,72 L90,38 Z"
              fill="none"
              stroke={stroke}
              strokeWidth={sw}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {intro && (
              <motion.path
                d="M168,16 L170.5,23.5 L178,26 L170.5,28.5 L168,36 L165.5,28.5 L158,26 L165.5,23.5 Z"
                fill={stroke}
                initial={{ scale: 0, opacity: 0 }}
                animate={sparkControls}
                style={{ transformOrigin: '168px 26px', transformBox: 'fill-box' }}
              />
            )}
          </motion.g>

          {/* body + smile group */}
          <motion.g initial={bodyInitial} animate={bodyControls}>
            <path
              d="M88,184 Q92,170 93,160 A27,44 0 0 1 147,160 Q148,170 152,184"
              fill="none"
              stroke={stroke}
              strokeWidth={sw}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M70,196 Q120,214 170,196"
              fill="none"
              stroke={stroke}
              strokeWidth={sw}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.g>
        </svg>
      </button>

      {showWord && (
        <motion.div
          initial={intro ? { opacity: 0 } : { opacity: 1 }}
          animate={wordControls}
          className="font-serif font-semibold text-center"
          style={{
            color: inkColor,
            fontSize: Math.max(14, size * 0.3),
            letterSpacing: '0.32em',
            textIndent: '0.32em',
            marginTop: size * 0.22,
          }}
        >
          PYADRA
        </motion.div>
      )}

      {showTagline && (
        <motion.div
          initial={intro ? { opacity: 0 } : { opacity: 1 }}
          animate={tagControls}
          className="font-mono uppercase text-center"
          style={{
            color: subColor,
            fontSize: Math.max(10, size * 0.085),
            letterSpacing: '0.34em',
            marginTop: size * 0.08,
          }}
        >
          LO QUE DEJAS IMPORTA
        </motion.div>
      )}
    </div>
  );
}
