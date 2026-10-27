/* ------------------------------------------------------------------ */
/*  PYADRA · Type — one voice across the museum.                       */
/*                                                                     */
/*  Taken from the project dossiers, which already speak it: names in  */
/*  Fraunces, labels in IBM Plex Mono uppercase, everything else in    */
/*  DM Sans. Six sizes. New pages compose these instead of writing     */
/*  their own `text-[Npx]`, so moving between rooms never jars.        */
/*                                                                     */
/*  hero     .t-d1     Fraunces 600   one per site: the Home wordmark  */
/*                                    and a room's opening line (Store) */
/*  display  36 / 30   Fraunces 600   page and project names           */
/*  title    24        Fraunces 600   a name inside a panel or card    */
/*  lead     16        DM Sans 500    the line under a name            */
/*  body     14        DM Sans 400    paragraphs, values               */
/*  small    13        DM Sans 500    captions, list items, previews   */
/*  label    11        Plex Mono 700  UPPERCASE labels, chips, paths   */
/*  statement 24       Fraunces 400   the Home's one sentence — said,  */
/*                                    not shouted                      */
/* ------------------------------------------------------------------ */

export const TYPE = {
  display: 'font-serif font-semibold text-[30px] lg:text-[36px] leading-none tracking-[-0.01em] text-ink',
  title: 'font-serif font-semibold text-2xl leading-tight tracking-[-0.01em] text-ink',
  lead: 'font-sans font-medium text-base leading-snug text-ink-soft',
  body: 'font-sans text-sm leading-relaxed text-ink',
  small: 'font-sans font-medium text-[13px] leading-snug text-ink-soft',
  label: 'font-mono font-bold text-[11px] uppercase tracking-[0.18em] text-ink-mute',
  statement: 'font-serif font-normal text-2xl leading-snug tracking-[-0.005em] text-ink-soft',
} as const;

/** A chip: the label voice on a quiet pill. */
export const CHIP = `${TYPE.label} rounded-full px-3 py-1 bg-paper`;
