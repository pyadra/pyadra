'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from './motion';

/* ------------------------------------------------------------------ */
/*  PYADRA · RevealText — a line that rises out of its own baseline.   */
/*                                                                     */
/*  Each word sits in a mask and slides up into view, one after the    */
/*  other — the way a sentence is said, not printed. The text is still */
/*  one string to screen readers (aria-label on the wrapper).          */
/* ------------------------------------------------------------------ */

export default function RevealText({
  text,
  as: Tag = 'span',
  className = '',
  delay = 0,
  stagger = 0.045,
  after,
}: {
  text: string;
  as?: 'span' | 'h1' | 'h2' | 'p';
  className?: string;
  delay?: number;
  stagger?: number;
  /** Something that lands with the last word — e.g. an accent full stop. */
  after?: React.ReactNode;
}) {
  const reduced = useReducedMotion() ?? false;
  const words = text.split(' ');
  const MotionTag = motion[Tag];

  if (reduced) {
    return (
      <Tag className={className}>
        {text}
        {after}
      </Tag>
    );
  }

  return (
    <MotionTag className={className} aria-label={text} initial="hidden" animate="show">
      {words.map((w, i) => (
        <span key={`${w}-${i}`} aria-hidden className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '105%', rotate: 4 },
              show: { y: '0%', rotate: 0, transition: { duration: 0.75, ease: EASE.out, delay: delay + i * stagger } },
            }}
          >
            {w}
            {i === words.length - 1 && after}
          </motion.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </MotionTag>
  );
}
