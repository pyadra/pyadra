/**
 * Generate observation signature client-side for immediate display
 * Format: #0001-0048-42-040626-143027
 *         (id)-(time)-(pulses)-(date)-(time)
 */
export function generateSignature(
  observerId: number,
  timeElapsed: number,
  pulsesSent: number,
  timestamp: string
): string {
  const date = new Date(timestamp);

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const dateStr = `${month}${day}${year}`;
  const timeStr = `${hours}${minutes}${seconds}`;

  return `#${String(observerId).padStart(4, '0')}-${String(timeElapsed).padStart(4, '0')}-${String(pulsesSent).padStart(2, '0')}-${dateStr}-${timeStr}`;
}
