'use client';

import { useEffect, useState } from 'react';
import { readVia } from './via';

/** The carrier's code for this visit (see via.ts), once the page is in
 *  the browser. null until then, and when there is none. */
export function useVia(): string | null {
  const [via, setVia] = useState<string | null>(null);
  useEffect(() => setVia(readVia(window.location.search)), []);
  return via;
}
