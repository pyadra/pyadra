/* ------------------------------------------------------------------ */
/*  PYADRA · via — the carrier's code.                                 */
/*                                                                     */
/*  A carrier's link is any page of the house with `?via=<code>`. The  */
/*  code is kept for the visit in the browser's session storage (it    */
/*  goes when the tab closes: no cookie, nothing sent anywhere) and    */
/*  written on the commission, so the house knows whose it is.         */
/*                                                                     */
/*  Codes are handed out by the house, by hand, for now. They carry no */
/*  rights by themselves: a code on a commission is a note for the     */
/*  person who reads it.                                               */
/* ------------------------------------------------------------------ */

const KEY = 'pyadra_via';

/** A code as the house writes them: letters, digits and dashes, 2 to 24
 *  characters, lower case. Anything else is no code. */
export function cleanVia(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const code = raw.trim().toLowerCase();
  return /^[a-z0-9](?:[a-z0-9-]{0,22}[a-z0-9])$/.test(code) ? code : null;
}

/** `href` with the code on it, for links inside the house. */
export function withVia(href: string, via: string | null): string {
  if (!via || !href.startsWith('/')) return href;
  const [path, hash = ''] = href.split('#');
  const joined = `${path}${path.includes('?') ? '&' : '?'}via=${encodeURIComponent(via)}`;
  return hash ? `${joined}#${hash}` : joined;
}

/** Read the code for this visit: the address first, then what the
 *  visit already carries. Remembers a new one. Browser only. */
export function readVia(search: string): string | null {
  const fromUrl = cleanVia(new URLSearchParams(search).get('via'));
  try {
    if (fromUrl) {
      window.sessionStorage.setItem(KEY, fromUrl);
      return fromUrl;
    }
    return cleanVia(window.sessionStorage.getItem(KEY));
  } catch {
    // storage can be blocked; the address still works
    return fromUrl;
  }
}
