import { ImageResponse } from 'next/og';

/* Pyadra — social share card. Generated at build time; applies to every
   route below the root (project routes can override with their own file). */

export const runtime = 'edge';
export const alt = 'Pyadra — a museum of living projects. Discover. Connect. Build. Buy.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const STROKE = '#059669';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#EDEFED',
          backgroundImage:
            'radial-gradient(circle at 50% 42%, rgba(5,150,105,0.12), rgba(5,150,105,0) 55%)',
        }}
      >
        {/* the symbol — gem above, body below, spark at its side */}
        <svg width="230" height="222" viewBox="0 0 240 232">
          <path
            d="M106,20 L134,20 L150,38 L150,72 L134,90 L106,90 L90,72 L90,38 Z"
            fill="none"
            stroke={STROKE}
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M168,16 L170.5,23.5 L178,26 L170.5,28.5 L168,36 L165.5,28.5 L158,26 L165.5,23.5 Z"
            fill={STROKE}
          />
          <path
            d="M88,184 Q92,170 93,160 A27,44 0 0 1 147,160 Q148,170 152,184"
            fill="none"
            stroke={STROKE}
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M70,196 Q120,214 170,196"
            fill="none"
            stroke={STROKE}
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div
          style={{
            display: 'flex',
            marginTop: 48,
            fontSize: 68,
            fontWeight: 700,
            letterSpacing: '0.32em',
            color: '#1A1C1A',
            /* letter-spacing adds a trailing gap — nudge back to optical center */
            paddingLeft: '0.32em',
          }}
        >
          PYADRA
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 22,
            fontSize: 24,
            letterSpacing: '0.34em',
            color: '#6B8070',
            paddingLeft: '0.34em',
          }}
        >
          LO QUE DEJAS IMPORTA
        </div>
      </div>
    ),
    { ...size }
  );
}
