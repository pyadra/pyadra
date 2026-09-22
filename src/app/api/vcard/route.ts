import { NextResponse } from 'next/server';
import { PEOPLE, type Person } from '@/app/team/people';

/* ------------------------------------------------------------------ */
/*  PYADRA · /api/vcard — the contact, saved.                          */
/*                                                                     */
/*  vCard 3.0, not 4.0: 4.0 still trips Android and Outlook importers. */
/*  CRLF line endings and `text/vcard` are both required — an octet-   */
/*  stream download dead-ends on iOS. The photo goes by URI, never     */
/*  base64: an inline image is the most common silent import failure.  */
/*                                                                     */
/*  ?c=<slug> picks whose card to hand over; the roster lives in       */
/*  team/people.ts — a new teammate is one object, not a file.   */
/* ------------------------------------------------------------------ */

const SITE = 'https://pyadra.io';

/* A vCard is line-based, so a newline or a stray CR in a field would
   forge new properties. Strip them and escape the value separators. */
const esc = (v: string) =>
  v.replace(/[\r\n]+/g, ' ').replace(/([,;\\])/g, '\\$1').trim();

function build(person: Person): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${esc(person.lastName)};${esc(person.firstName)};;;`,
    `FN:${esc(person.name)}`,
    'ORG:Pyadra LLC',
    `TITLE:${esc(person.role)}`,
    `EMAIL;TYPE=INTERNET,WORK:${esc(person.email)}`,
    `URL:${SITE}/team/${person.slug}`,
  ];

  if (person.linkedin) lines.push(`URL:${esc(person.linkedin)}`);
  if (person.photo) lines.push(`PHOTO;VALUE=URI;TYPE=JPEG:${SITE}${person.photo}`);

  lines.push(
    'NOTE:Pyadra — where projects and ideas find the people who make them real.',
    'END:VCARD',
  );
  return lines.join('\r\n') + '\r\n';
}

export function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get('c');
  const person = PEOPLE.find((p) => p.slug === slug) ?? PEOPLE[0];

  return new NextResponse(build(person), {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${person.slug}.vcf"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
