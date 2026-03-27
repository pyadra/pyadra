// Validation utilities for the Orbit 77 project
// ---------------------------------------------------
// These helpers are tiny, pure functions that can be reused across API routes.
// They avoid pulling in heavy libraries and keep the codebase lightweight.

/**
 * Sanitizes a string by trimming whitespace, limiting length, and stripping any HTML tags.
 * Returns a safe string suitable for storing in Stripe metadata.
 */
export function sanitizeString(input: unknown, maxLength: number = 50): string {
  if (typeof input !== 'string') return '';
  // Remove any HTML tags – simple regex, sufficient for our use‑case.
  const stripped = input.replace(/<[^>]*>/g, '').trim();
  // Truncate to the maximum allowed length.
  return stripped.length > maxLength ? stripped.slice(0, maxLength) : stripped;
}

/**
 * Validates a monetary amount (in AUD cents).
 * Returns true if the amount is a positive integer and within a sensible range.
 */
export function validateAmount(amount: unknown, minCents = 500, maxCents = 50000): boolean {
  const num = Number(amount);
  return Number.isInteger(num) && num >= minCents && num <= maxCents;
}
