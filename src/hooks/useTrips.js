'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { listenTrips } from '@/lib/db';

/**
 * useTrips — real-time Firestore listener for the signed-in user's trips.
 * Returns { trips, loading, error, refetch }
 *
 * trips are sorted by firstStartDate (soonest first) and each has:
 * { id, name, isMultiCity, destinations: [{ id, city, countryCode, startDate, endDate, researchDone, ... }] }
 */
export function useTrips() {
  const { user, loading: authLoading } = useAuth();
  const [trips,   setTrips]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setTrips([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsub = listenTrips(
      user.uid,
      (data) => {
        setTrips(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('useTrips error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsub; // unsubscribe on unmount or user change
  }, [user, authLoading]);

  // refetch is a no-op here (listener auto-updates), kept for API compatibility
  const refetch = () => {};

  return { trips, loading: loading || authLoading, error, refetch };
}
