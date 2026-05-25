// src/lib/firebase.js
// Firebase app singleton — safe to import in any client component.
// Only initialises when env vars are present (i.e. not during static prerender).

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

// Skip initialisation during prerender/SSR (no env vars available)
const app = apiKey
  ? getApps().length === 0
    ? initializeApp({
        apiKey,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId:  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      })
    : getApp()
  : null;

export const auth = app ? getAuth(app) : null;
export default app;
