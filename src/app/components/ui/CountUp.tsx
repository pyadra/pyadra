'use client';

import { useEffect, useRef } from 'react';
import { animate, useReducedMotion } from 'framer-motion';
import { EASE } from './motion';

/** A number that counts up to itself when it appears — "500+" climbs from
 *  0 to 500 and keeps its "+". Anything that isn't a number stays as written. */
export default function CountUp({ value }: { value: string }) {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const m = value.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
    if (!m || reduced || !ref.current) return;
    const [, pre, num, post] = m;
    const target = parseFloat(num.replace(/,/g, ''));
    const decimals = num.includes('.') ? num.split('.')[1].length : 0;
    const el = ref.current;
    const controls = animate(0, target, {
      duration: 1.1,
      ease: EASE.out,
      delay: 0.25,
      onUpdate: (v) => {
        el.textContent = `${pre}${v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${post}`;
      },
    });
    return () => controls.stop();
  }, [value, reduced]);
  return <span ref={ref}>{value}</span>;
}
