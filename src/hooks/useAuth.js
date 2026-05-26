'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { upsertUser } from '@/lib/db';

export function useAuth() {
  const [user,    setUser]    = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Hard 3s timeout — never spin forever if Firebase is slow
    const timeout = setTimeout(() => {
      setUser(null);
      setLoading(false);
    }, 3000);

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      clearTimeout(timeout);
      if (firebaseUser) {
        try { await upsertUser(firebaseUser.uid, firebaseUser.email); }
        catch {}
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => { clearTimeout(timeout); unsub(); };
  }, []);

  return { user, loading };
}
