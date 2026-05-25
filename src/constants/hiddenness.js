// Hiddenness score system — 1 (tourist staple) → 10 (off the map)
export const HIDDENNESS_LEVELS = [
  { min: 1,  max: 3,  label: 'Tourist Staple', color: '#6b7280', dotColor: '#6b7280', bg: '#1a1a1a' },
  { min: 4,  max: 5,  label: 'Worth Knowing',  color: '#3b82f6', dotColor: '#3b82f6', bg: '#0d1a2e' },
  { min: 6,  max: 7,  label: 'Hidden Gem',     color: '#22c55e', dotColor: '#22c55e', bg: '#0d2218' },
  { min: 8,  max: 9,  label: 'Local Secret',   color: '#f59e0b', dotColor: '#f59e0b', bg: '#2a1a00' },
  { min: 10, max: 10, label: 'Off the Map',    color: '#eab308', dotColor: '#eab308', bg: '#2a2000' },
];

/**
 * Returns the hiddenness level object for a given score (1–10).
 * Falls back to Tourist Staple if score is out of range.
 */
export function getHiddennessLevel(score) {
  return (
    HIDDENNESS_LEVELS.find((l) => score >= l.min && score <= l.max) ??
    HIDDENNESS_LEVELS[0]
  );
}
