'use client';

import { useSyncExternalStore } from 'react';
import type { WayIn } from '@/app/exhibitions/galaxy/lots';

/* ------------------------------------------------------------------ */
/*  The visitor's intent — what brought them here.                     */
/*                                                                     */
/*  Asked once, on the Home, in plain words. It travels with them for  */
/*  the session: Galaxy lights what fits, the guide speaks to it, and  */
/*  a contact form knows which door the visitor used.                  */
/*  Kept in sessionStorage — it's a mood, not an account.              */
/* ------------------------------------------------------------------ */

export type Intent = 'own' | 'run' | 'back' | 'idea' | 'look';

export const INTENTS: { key: Intent; title: string; line: string; way: WayIn | null }[] = [
  { key: 'own', title: 'I want to own one', line: 'Buy a project, whole.', way: 'acquire' },
  { key: 'run', title: 'I want to run one', line: 'Your work is your capital.', way: 'operate' },
  { key: 'back', title: 'I want to back one', line: 'Help it keep going.', way: 'support' },
  { key: 'idea', title: 'I have an idea', line: 'Build it with Pyadra.', way: 'build' },
  { key: 'look', title: 'Just looking', line: 'Walk the whole galaxy.', way: null },
];

const KEY = 'pyadra_intent';
const EVENT = 'pyadra:intent';

function read(): Intent | null {
  try {
    const v = window.sessionStorage.getItem(KEY);
    return INTENTS.some((i) => i.key === v) ? (v as Intent) : null;
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

export function setIntent(intent: Intent) {
  try {
    window.sessionStorage.setItem(KEY, intent);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function useIntent(): Intent | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

/** The Galaxy URL an intent lands on. */
export function galaxyHref(intent: Intent) {
  const way = INTENTS.find((i) => i.key === intent)?.way;
  return way ? `/exhibitions/galaxy?way=${way}` : '/exhibitions/galaxy';
}
