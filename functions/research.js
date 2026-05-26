// functions/research.js
// Research callable function — checks Firestore cache first, calls OpenAI if no cache.
// Deployed as a Firebase callable function (v2).

const { onCall } = require('firebase-functions/v2/https');
const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// Init Firebase Admin (singleton)
if (!getApps().length) initializeApp();
const db = getFirestore();

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------
const buildResearchPrompt = (city, interests) => `
You are a travel researcher specialising in hidden gems and authentic local experiences.

Research "${city}" and return exactly 20 places to visit. Include a mix:
- 5 well-known tourist attractions (honest about their popularity)
- 10 lesser-known spots that locals love
- 5 genuinely off-the-beaten-path spots that most tourists never find

The user is interested in: ${interests.length > 0 ? interests.join(', ') : 'general sightseeing'}.
Bias your results toward these interests but don't exclude other great spots.

Return ONLY a valid JSON object in this exact structure — no markdown, no explanation:
{
  "spots": [
    {
      "name": "Spot name",
      "description": "2–3 sentence description",
      "why_hidden": "1 sentence explaining why most tourists miss it (null if it's a well-known tourist attraction)",
      "hiddenness_score": <integer 1–10>,
      "hiddenness_label": "<Tourist Staple|Worth Knowing|Hidden Gem|Local Secret|Off the Map>",
      "lat": <decimal latitude>,
      "lng": <decimal longitude>,
      "address": "Street address or neighbourhood",
      "entry_price": <number in EUR, or null if free>,
      "interests": ["<one or more of: hiking, food, museums, art, nightlife, beaches, markets, landmarks, photography, relaxation>"],
      "sources": [{"label": "source name e.g. r/amsterdam", "url": null}]
    }
  ]
}

Hiddenness scoring guide:
- 1–3: Famous worldwide, always busy, on every tourist itinerary
- 4–5: Well-known locally, less visited than top 10
- 6–7: Known to travel enthusiasts, Reddit, niche blogs
- 8–9: Truly local knowledge, rarely on tourist radar
- 10: Requires specific insider knowledge to find

For sources, mention Reddit threads (r/${city.toLowerCase()}, r/travel, r/solotravel),
travel forums, local blogs, or independent travel writers where applicable.
`.trim();

// ---------------------------------------------------------------------------
// Callable function
// ---------------------------------------------------------------------------
exports.researchDestination = onCall(async (request) => {
  const { city, interests = [], destinationId, force = false } = request.data;
  const userId = request.auth?.uid;

  if (!userId) throw new Error('Unauthenticated');
  if (!city)   throw new Error('Missing required field: city');

  const spotsRef = db.collection('citySpots').doc(city).collection('spots');

  // 1. Check / bust cache
  if (!force) {
    const existing = await spotsRef.limit(1).get();
    if (!existing.empty) {
      const cached = await spotsRef.orderBy('hiddennessScore', 'desc').get();
      const spots  = cached.docs.map((d) => ({ id: d.id, ...d.data() }));
      return { spots, cached: true };
    }
  } else {
    // Force refresh — delete existing spots first
    const existing = await spotsRef.get();
    if (!existing.empty) {
      const deleteBatch = db.batch();
      existing.docs.forEach((d) => deleteBatch.delete(d.ref));
      await deleteBatch.commit();
    }
  }

  // 2. Call OpenAI
  const callOpenAI = async (prompt) => {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization:  `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model:           'gpt-4o-mini',
        messages:        [{ role: 'user', content: prompt }],
        temperature:     0.3,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`OpenAI error ${res.status}: ${err?.error?.message ?? res.statusText}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;
  };

  let spots;
  try {
    const raw  = await callOpenAI(buildResearchPrompt(city, interests));
    const parsed = JSON.parse(raw);
    // Support both {"spots":[...]} and a bare array
    spots = Array.isArray(parsed) ? parsed : (parsed.spots ?? []);
  } catch (firstErr) {
    console.warn('First parse failed, retrying with stricter instruction:', firstErr.message);
    try {
      const raw = await callOpenAI(
        'Return ONLY a valid JSON object {"spots":[...]}. No markdown. ' +
        buildResearchPrompt(city, interests)
      );
      const parsed = JSON.parse(raw);
      spots = Array.isArray(parsed) ? parsed : (parsed.spots ?? []);
    } catch (secondErr) {
      throw new Error(`Failed to parse AI response: ${secondErr.message}`);
    }
  }

  if (!Array.isArray(spots) || spots.length === 0) {
    throw new Error('AI returned no spots. Please try again.');
  }

  // Validate + flag missing coordinates (don't drop the spot)
  spots = spots.map((s) => ({
    ...s,
    coordsMissing: !s.lat || !s.lng || (s.lat === 0 && s.lng === 0),
  }));

  // 3. Write to Firestore cache (batch)
  const batch = db.batch();
  spots.forEach((spot) => {
    const ref = spotsRef.doc();
    batch.set(ref, {
      city,
      name:            spot.name,
      description:     spot.description ?? null,
      whyHidden:       spot.why_hidden ?? null,
      hiddennessScore: spot.hiddenness_score,
      hiddennessLabel: spot.hiddenness_label,
      lat:             spot.lat ?? null,
      lng:             spot.lng ?? null,
      address:         spot.address ?? null,
      entryPrice:      spot.entry_price ?? null,
      currency:        'EUR',
      interests:       spot.interests ?? [],
      sources:         spot.sources ?? [],
      coordsMissing:   spot.coordsMissing,
      createdAt:       FieldValue.serverTimestamp(),
    });
  });
  await batch.commit();

  // 4. Mark destination as research-complete
  if (destinationId) {
    await db.collection('destinations').doc(destinationId).update({
      researchDone: true,
      researchAt:   FieldValue.serverTimestamp(),
    });
  }

  return { spots, cached: false };
});
