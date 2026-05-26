'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { listenTrips } from '@/lib/db';

export function useTrips() {
  const { user, loading: authLoading, authReady } = useAuth();
  const [trips,   setTrips]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    // Wait for Firebase to confirm the session before touching Firestore
    if (authLoading || !authReady) return;

    if (!user) {
      setTrips([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = listenTrips(
      user.uid,
      (data) => { setTrips(data); setLoading(false); setError(null); },
      (err)  => { console.error('useTrips error:', err); setError(err.message); setLoading(false); }
    );
    return unsub;
  }, [user?.uid, authLoading, authReady]);

  return { trips, loading: loading || authLoading, error, refetch: () => {} };
}
