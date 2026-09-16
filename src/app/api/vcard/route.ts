import { NextResponse } from 'next/server';

/* ------------------------------------------------------------------ */
/*  PYADRA · /api/vcard — the contact, saved.                          */
/*                                                                     */
/*  vCard 3.0, not 4.0: 4.0 still trips Android and Outlook importers. */
/*  CRLF line endings and `text/vcard` are both required — an octet-   */
/*  stream download dead-ends on iOS. The photo goes by URI, never     */
/*  base64: an inline image is the most common silent import failure.  */
/* ------------------------------------------------------------------ */

const SITE = 'https://pyadra.io';

const LINES = [
  'BEGIN:VCARD',
  'VERSION:3.0',
  'N:Díaz;Eduardo;;;',
  'FN:Eduardo Díaz',
  'ORG:Pyadra LLC',
  'TITLE:Founder',
  'EMAIL;TYPE=INTERNET,WORK:pyadra@pyadra.io',
  `URL:${SITE}/eduardo`,
  `PHOTO;VALUE=URI;TYPE=JPEG:${SITE}/images/eduardo/eduardo.jpg`,
  'NOTE:Pyadra — where projects and ideas find the people who make them real.',
  'END:VCARD',
];

export function GET() {
  return new NextResponse(LINES.join('\r\n') + '\r\n', {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="eduardo-diaz.vcf"',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
