'use client';

import { useState, useEffect } from 'react';
import { getDestinationWithSpots } from '@/lib/db';

/**
 * Fetches a single destination and its researched spots.
 * Returns { destination, spots, loading, error, refetch }
 *
 * TODO (Week 2): wire up real Data Connect queries.
 */
export function useDestination(destinationId) {
  const [destination, setDestination] = useState(null);
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!destinationId) return;
    setLoading(true);
    try {
      const data = await getDestinationWithSpots(destinationId);
      setDestination(data?.destination ?? null);
      setSpots(data?.spots ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationId]);

  return { destination, spots, loading, error, refetch: fetchData };
}
