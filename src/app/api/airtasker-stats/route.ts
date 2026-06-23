import { NextResponse } from 'next/server';

/* Server-side fetch of the Kangaroo Cleanup Airtasker profile.
 * Cached 1h. Falls back to last-known-good if parsing changes. */

export const revalidate = 3600;

const PROFILE_URL =
  'https://www.airtasker.com/users/a9226792b540-p-29587653/';

const FALLBACK_TASKS = 248;
const FALLBACK_REVIEWS = 213;

function parseStats(html: string): { tasks?: number; reviews?: number } {
  const out: { tasks?: number; reviews?: number } = {};

  const reviewPatterns = [
    /"reviewCount"\s*:\s*"?(\d+)/,
    /"totalReviews"\s*:\s*(\d+)/,
    /(\d{1,5})\s*Reviews?\b/i,
  ];
  for (const re of reviewPatterns) {
    const m = html.match(re);
    if (m) {
      out.reviews = parseInt(m[1], 10);
      break;
    }
  }

  const taskPatterns = [
    /"completedTasks"\s*:\s*(\d+)/,
    /"tasksCompleted"\s*:\s*(\d+)/,
    /"completedTaskCount"\s*:\s*(\d+)/,
    /(\d{1,5})\s*Completed\s*Tasks?/i,
    /Completed:\s*<[^>]*>\s*(\d+)/i,
  ];
  for (const re of taskPatterns) {
    const m = html.match(re);
    if (m) {
      out.tasks = parseInt(m[1], 10);
      break;
    }
  }

  return out;
}

export async function GET() {
  try {
    const res = await fetch(PROFILE_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; PyadraBot/1.0; +https://pyadra.com)',
        Accept: 'text/html,application/xhtml+xml',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error('upstream not ok');
    const html = await res.text();
    const parsed = parseStats(html);

    const tasks =
      typeof parsed.tasks === 'number' && parsed.tasks > 0
        ? parsed.tasks
        : FALLBACK_TASKS;
    const reviews =
      typeof parsed.reviews === 'number' && parsed.reviews > 0
        ? parsed.reviews
        : FALLBACK_REVIEWS;

    return NextResponse.json(
      {
        tasks,
        reviews,
        source: parsed.tasks && parsed.reviews ? 'airtasker' : 'partial',
      },
      { headers: { 'Cache-Control': 'public, s-maxage=3600' } },
    );
  } catch {
    return NextResponse.json({
      tasks: FALLBACK_TASKS,
      reviews: FALLBACK_REVIEWS,
      source: 'fallback',
    });
  }
}
