// src/lib/functions.js
// Firebase callable function wrappers — thin client-side callers.

import { getFunctions, httpsCallable } from 'firebase/functions';
import app from './firebase';

const functions = getFunctions(app);

/**
 * Trigger AI research for a city.
 * @param {string} city
 * @param {string[]} interests
 */
export async function runResearch(city, interests) {
  const fn = httpsCallable(functions, 'researchDestination');
  const result = await fn({ city, interests });
  return result.data;
}
