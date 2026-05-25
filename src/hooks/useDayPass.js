'use client';

import { useMemo } from 'react';
import { calculateDayPassValue } from '@/lib/daypass';

/**
 * Reactively calculates day pass value when the city pass or planned spots change.
 * @param {object|null} cityPass   — from city_passes table
 * @param {object[]}    dayPlanSpots — spots currently in the day plan
 */
export function useDayPass(cityPass, dayPlanSpots) {
  return useMemo(() => {
    if (!cityPass || !dayPlanSpots?.length) return null;
    return calculateDayPassValue(cityPass, dayPlanSpots);
  }, [cityPass, dayPlanSpots]);
}
