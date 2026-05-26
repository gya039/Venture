'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { upsertUser } from '@/lib/db';

const CACHE_KEY = 'venture_uid';

export function useAuth() {
  // Seed from localStorage instantly — no network wait on repeat visits
  const [user,    setUser]    = useState(() => {
    if (typeof window === 'undefined') return undefined;
    try {
      const uid = localStorage.getItem(CACHE_KEY);
      return uid ? { uid, _cached: true } : undefined;
    } catch { return undefined; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setUser(null);
      setLoading(false);
      return;
    }

    // If we had a cached uid, stop showing the spinner immediately
    if (typeof window !== 'undefined' && localStorage.getItem(CACHE_KEY)) {
      setLoading(false);
    }

    const timeout = setTimeout(() => {
      setUser(null);
      setLoading(false);
    }, 5000);

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      clearTimeout(timeout);
      if (firebaseUser) {
        try { localStorage.setItem(CACHE_KEY, firebaseUser.uid); } catch {}
        try { await upsertUser(firebaseUser.uid, firebaseUser.email); } catch {}
        setUser(firebaseUser);
      } else {
        try { localStorage.removeItem(CACHE_KEY); } catch {}
        setUser(null);
      }
      setLoading(false);
    });

    return () => { clearTimeout(timeout); unsub(); };
  }, []);

  return { user, loading };
}
