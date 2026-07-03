import { NextResponse } from 'next/server';

/* Server-side fetch of the Kangaroo Cleanup Airtasker profile.
 * Cached 1h. Falls back to last-known-good if parsing changes. */

export const revalidate = 3600;

const PROFILE_URL =
  'https://www.airtasker.com/users/a9226792b540-p-29587653/';

const FALLBACK_TASKS = 248;
const FALLBACK_REVIEWS = 213;

// The business is dormant, so real numbers can only drift slightly above the
// last-known-good 248/213. Anything outside these windows is a bad parse
// (e.g. a year like "2018" scraped from unrelated markup) — reject it.
const TASKS_MIN = 240;
const TASKS_MAX = 500;
const REVIEWS_MIN = 205;
const REVIEWS_MAX = 500;

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

    const tasksValid =
      typeof parsed.tasks === 'number' && parsed.tasks >= TASKS_MIN && parsed.tasks <= TASKS_MAX;
    const reviewsValid =
      typeof parsed.reviews === 'number' && parsed.reviews >= REVIEWS_MIN && parsed.reviews <= REVIEWS_MAX;
    const tasks = tasksValid ? (parsed.tasks as number) : FALLBACK_TASKS;
    const reviews = reviewsValid ? (parsed.reviews as number) : FALLBACK_REVIEWS;

    return NextResponse.json(
      {
        tasks,
        reviews,
        source: tasksValid && reviewsValid ? 'airtasker' : 'partial',
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
