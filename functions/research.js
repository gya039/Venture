// functions/research.js
// Perplexity research function — checks Firestore cache first, calls API if no cache.
// Deployed as a Firebase callable function (v2).

const { onCall } = require('firebase-functions/v2/https');
const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// Init Firebase Admin (singleton)
if (!getApps().length) initializeApp();
const db = getFirestore();

// ---------------------------------------------------------------------------
// Prompt builder (copied from spec)
// ---------------------------------------------------------------------------
const buildResearchPrompt = (city, interests) => `
You are a travel researcher specialising in hidden gems and authentic local experiences.

Research "${city}" and return exactly 20 places to visit. Include a mix:
- 5 well-known tourist attractions (honest about their popularity)
- 10 lesser-known spots that locals love
- 5 genuinely off-the-beaten-path spots that most tourists never find

The user is interested in: ${interests.join(', ')}.
Bias your results toward these interests but don't exclude other great spots.

For each spot, return a JSON array with this exact structure:
{
  "name": "Spot name",
  "description": "2-3 sentence description",
  "why_hidden": "1 sentence explaining why most tourists miss it (null if it's a tourist staple)",
  "hiddenness_score": <integer 1-10>,
  "hiddenness_label": "<Tourist Staple|Worth Knowing|Hidden Gem|Local Secret|Off the Map>",
  "lat": <decimal>,
  "lng": <decimal>,
  "address": "Street address or area",
  "entry_price": <number or null if free>,
  "interests": ["<category>"],
  "sources": [{"label": "source name", "url": "url or null"}]
}

Hiddenness scoring:
- 1-3: Famous worldwide, always busy, on every tourist itinerary
- 4-5: Well-known locally but less visited than top 10
- 6-7: Known to travel enthusiasts, Reddit, niche blogs
- 8-9: Truly local knowledge, rarely on tourist radar
- 10: Requires specific insider knowledge to find

Source your information from Reddit (r/${city.toLowerCase()}, r/travel, r/solotravel),
travel forums, local blogs, and independent travel writers.
Prefer sources from the last 3 years.
Return ONLY the JSON array, no markdown, no explanation, no other text.
`;

// ---------------------------------------------------------------------------
// Callable function
// ---------------------------------------------------------------------------
exports.researchDestination = onCall(async (request) => {
  const { city, interests = [], destinationId } = request.data;
  const userId = request.auth?.uid;

  if (!userId) throw new Error('Unauthenticated');
  if (!city)   throw new Error('Missing required field: city');

  // 1. Check Firestore cache
  const spotsRef = db.collection('citySpots').doc(city).collection('spots');
  const existing = await spotsRef.limit(1).get();
  if (!existing.empty) {
    const cached = await spotsRef.orderBy('hiddennessScore', 'desc').get();
    const spots  = cached.docs.map((d) => ({ id: d.id, ...d.data() }));
    return { spots, cached: true };
  }

  // 2. Call Perplexity
  const callPerplexity = async (prompt) => {
    const res = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
      }),
    });
    const data = await res.json();
    return data.choices[0].message.content;
  };

  let spots;
  try {
    const raw = await callPerplexity(buildResearchPrompt(city, interests));
    spots = JSON.parse(raw);
  } catch {
    // Retry with stricter instruction
    const raw = await callPerplexity(
      'Return ONLY valid JSON array, no markdown. ' + buildResearchPrompt(city, interests)
    );
    spots = JSON.parse(raw);
  }

  // Validate + flag missing coords (don't drop the spot)
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

  // 4. Mark destination as researched
  if (destinationId) {
    await db.collection('destinations').doc(destinationId).update({
      researchDone: true,
      researchAt:   FieldValue.serverTimestamp(),
    });
  }

  return { spots, cached: false };
});
