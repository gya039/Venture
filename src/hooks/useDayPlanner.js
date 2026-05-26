'use client';

import { useState, useEffect } from 'react';
import { getDayPlans, getDayPlanSpots, getCachedSpots } from '@/lib/db';

/**
 * Loads day plans for a destination, with their spots fully assembled.
 *
 * Returns:
 *   days: [{
 *     id, dayNumber, planDate,
 *     spots: [{ ...spotData, dayPlanSpotId, timeOfDay, sortOrder }],
 *     totalCost: number,
 *   }]
 *   loading, error, refetch
 */
export function useDayPlanner(destId, city) {
  const [days,    setDays]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchData = async () => {
    if (!destId || !city) { setLoading(false); return; }
    setLoading(true);
    setError(null);

    try {
      // 1. Day plans for this destination
      const plans = await getDayPlans(destId);

      // 2. All researched spots for the city (one batch read)
      const allSpots = await getCachedSpots(city);
      const spotMap  = Object.fromEntries(allSpots.map(s => [s.id, s]));

      // 3. Day plan spots for each plan
      const days = await Promise.all(plans.map(async (plan) => {
        const dpSpots  = await getDayPlanSpots(plan.id);
        const assembled = dpSpots
          .map(dps => {
            const spot = spotMap[dps.spotId];
            if (!spot) return null;
            return { ...spot, dayPlanSpotId: dps.id, timeOfDay: dps.timeOfDay, sortOrder: dps.sortOrder };
          })
          .filter(Boolean)
          .sort((a, b) => {
            const order = { morning: 0, afternoon: 1, evening: 2 };
            return (order[a.timeOfDay] ?? 3) - (order[b.timeOfDay] ?? 3) || a.sortOrder - b.sortOrder;
          });

        const totalCost = assembled.reduce((sum, s) => sum + (s.entryPrice ?? 0), 0);

        return { ...plan, spots: assembled, totalCost };
      }));

      setDays(days);
    } catch (err) {
      console.error('useDayPlanner error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [destId, city]); // eslint-disable-line

  return { days, loading, error, refetch: fetchData };
}
