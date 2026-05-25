'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { upsertUser } from '@/lib/db';

/**
 * useAuth — returns { user, loading } where user is a Firebase User or null.
 * Also ensures a Firestore user document exists on every sign-in.
 */
export function useAuth() {
  const [user,    setUser]    = useState(undefined); // undefined = still loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      // No Firebase config (dev without .env.local)
      setUser(null);
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Ensure Firestore user doc exists (no-op if already there)
        try {
          await upsertUser(firebaseUser.uid, firebaseUser.email);
        } catch (err) {
          console.warn('upsertUser failed:', err.message);
        }
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsub;
  }, []);

  return { user, loading };
}
