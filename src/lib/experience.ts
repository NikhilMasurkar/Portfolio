/**
 * Years of professional experience, derived rather than hardcoded so the
 * number cannot drift out of date.
 *
 * Note: this is evaluated at build time on a statically generated site, so the
 * figure advances on the next deploy after an anniversary, not at midnight.
 */

/** First day of the first professional role: IndigoLearn, September 2022. */
export const CAREER_START = new Date(2022, 8, 1); // month is 0-indexed

/** Completed years only — never rounds up to a year not yet worked. */
export function yearsOfExperience(now: Date = new Date()): number {
  let years = now.getFullYear() - CAREER_START.getFullYear();
  const monthDelta = now.getMonth() - CAREER_START.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < CAREER_START.getDate())) {
    years -= 1;
  }
  return Math.max(0, years);
}
