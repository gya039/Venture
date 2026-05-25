// src/lib/hiddenness.js
// Score → label / colour helpers used throughout the app.

import { HIDDENNESS_LEVELS } from '@/constants/hiddenness';

export function getHiddennessLevel(score) {
  return (
    HIDDENNESS_LEVELS.find((l) => score >= l.min && score <= l.max) ??
    HIDDENNESS_LEVELS[0]
  );
}

export function getHiddennessColor(score) {
  return getHiddennessLevel(score).color;
}

export function getHiddennessLabel(score) {
  return getHiddennessLevel(score).label;
}
