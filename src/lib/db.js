// src/lib/db.js
// Firebase Data Connect query helpers — Week 2 will wire these to the real DB.
// For now they return mock data so the UI can be built and tested.

// TODO (Week 2): replace with real Data Connect calls via the generated SDK

export async function getTrips(userId) {
  // Will become: SELECT * FROM trips WHERE user_id = $1 ORDER BY ...
  return [];
}

export async function createTrip({ userId, name, isMultiCity, destinations }) {
  // Will become: INSERT INTO trips ...
  return { id: crypto.randomUUID() };
}

export async function getDestinationWithSpots(destinationId) {
  // Will become: SELECT d.*, s.* FROM destinations d LEFT JOIN spots s ON s.city = d.city
  return null;
}

export async function getDayPlans(destinationId) {
  return [];
}
