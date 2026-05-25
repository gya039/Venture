'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getTrips } from '@/lib/db';

/**
 * Fetches the signed-in user's trips from the DB.
 * Returns { trips, loading, error, refetch }
 *
 * TODO (Week 2): wire up real Data Connect queries.
 * For now returns mock data so the dashboard can be developed.
 */

const MOCK_TRIPS = [
  {
    id: 'mock-1',
    name: null,
    isMultiCity: false,
    destinations: [
      {
        id: 'dest-1',
        city: 'Amsterdam',
        country: 'Netherlands',
        countryCode: 'NL',
        startDate: '2026-07-10',
        endDate: '2026-07-13',
        researchDone: true,
        researchProgress: 0.8,
      },
    ],
  },
  {
    id: 'mock-2',
    name: null,
    isMultiCity: false,
    destinations: [
      {
        id: 'dest-2',
        city: 'Berlin',
        country: 'Germany',
        countryCode: 'DE',
        startDate: '2026-07-13',
        endDate: '2026-07-17',
        researchDone: false,
        researchProgress: 0,
      },
    ],
  },
  {
    id: 'mock-3',
    name: 'Euro Trip 2026',
    isMultiCity: true,
    destinations: [
      {
        id: 'dest-3',
        city: 'Prague',
        country: 'Czech Republic',
        countryCode: 'CZ',
        startDate: '2026-08-24',
        endDate: '2026-08-29',
        researchDone: false,
        researchProgress: 0,
      },
      {
        id: 'dest-4',
        city: 'Vienna',
        country: 'Austria',
        countryCode: 'AT',
        startDate: '2026-08-29',
        endDate: '2026-09-02',
        researchDone: false,
        researchProgress: 0,
      },
    ],
  },
];

export function useTrips() {
  const { user, loading: authLoading } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrips = async () => {
    if (!user) {
      setTrips([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // TODO (Week 2): replace with real DB call
      // const data = await getTrips(user.uid);
      const data = MOCK_TRIPS; // remove when DB is wired
      setTrips(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  return { trips, loading: loading || authLoading, error, refetch: fetchTrips };
}
