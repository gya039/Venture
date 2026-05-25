// src/lib/daypass.js
// Day pass calculator logic — pure function, no side effects.

/**
 * @param {object} cityPass   — row from city_passes table
 * @param {object[]} dayPlanSpots — spot objects from spots table that are in the day plan
 * @returns {{ coveredSpots, coveredCount, individualCost, passPrice, passDuration, savings, worthIt }}
 */
export function calculateDayPassValue(cityPass, dayPlanSpots) {
  const coveredSpots = dayPlanSpots.filter((spot) =>
    (cityPass.covers ?? []).some((name) =>
      spot.name.toLowerCase().includes(name.toLowerCase())
    )
  );

  const individualCost = coveredSpots.reduce(
    (sum, spot) => sum + (spot.entry_price ?? 0),
    0
  );

  // Pick cheapest duration — minimum 24h
  const bestPass = [...(cityPass.durations ?? [])]
    .sort((a, b) => a.price - b.price)
    .find((d) => d.hours >= 24);

  if (!bestPass) {
    return { coveredSpots, coveredCount: coveredSpots.length, individualCost, passPrice: null, passDuration: null, savings: 0, worthIt: false };
  }

  const savings = individualCost - bestPass.price;

  return {
    coveredSpots,
    coveredCount: coveredSpots.length,
    individualCost,
    passPrice: bestPass.price,
    passDuration: bestPass.hours,
    savings,
    worthIt: savings > 0,
  };
}
