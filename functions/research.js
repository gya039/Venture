// functions/research.js
// Perplexity research function — checks DB cache first, calls API if no cache.
// Called from the frontend via Firebase callable function.

const { onCall } = require('firebase-functions/v2/https');

// ---------------------------------------------------------------------------
// Prompt builder
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
  "description": "2–3 sentence description",
  "why_hidden": "1 sentence explaining why most tourists miss it (null if it's a tourist staple)",
  "hiddenness_score": <integer 1–10>,
  "hiddenness_label": "<Tourist Staple|Worth Knowing|Hidden Gem|Local Secret|Off the Map>",
  "lat": <decimal>,
  "lng": <decimal>,
  "address": "Street address or area",
  "entry_price": <number or null if free>,
  "interests": ["<category>"],
  "sources": [{"label": "source name", "url": "url or null"}]
}

Hiddenness scoring:
- 1–3: Famous worldwide, always busy, on every tourist itinerary
- 4–5: Well-known locally but less visited than top 10
- 6–7: Known to travel enthusiasts, Reddit, niche blogs
- 8–9: Truly local knowledge, rarely on tourist radar
- 10: Requires specific insider knowledge to find

Source your information from Reddit (r/${city.toLowerCase()}, r/travel, r/solotravel),
travel forums, local blogs, and independent travel writers.
Prefer sources from the last 3 years.
Return only the JSON array, no other text.
`;

// ---------------------------------------------------------------------------
// Callable function
// ---------------------------------------------------------------------------
exports.researchDestination = onCall(async (request) => {
  const { city, interests } = request.data;
  const userId = request.auth?.uid;

  if (!userId) {
    throw new Error('Unauthenticated — must be signed in to run research');
  }
  if (!city) {
    throw new Error('Missing required field: city');
  }

  // TODO (Week 2): replace with Data Connect query
  // const existing = await db.query(
  //   'SELECT * FROM spots WHERE city = $1 ORDER BY hiddenness_score DESC',
  //   [city]
  // );
  // if (existing.rows.length > 0) return { spots: existing.rows, cached: true };

  // Call Perplexity
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar',
      messages: [
        {
          role: 'user',
          content: buildResearchPrompt(city, interests ?? []),
        },
      ],
      temperature: 0.2,
    }),
  });

  const data = await response.json();

  let spots;
  try {
    spots = JSON.parse(data.choices[0].message.content);
  } catch {
    // Retry with stricter instruction if JSON is malformed
    const retryResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'user',
            content:
              'Return ONLY valid JSON, no markdown, no explanation. ' +
              buildResearchPrompt(city, interests ?? []),
          },
        ],
        temperature: 0.1,
      }),
    });
    const retryData = await retryResponse.json();
    spots = JSON.parse(retryData.choices[0].message.content);
  }

  // Validate coordinates — flag spots with missing coords but don't drop them
  spots = spots.map((spot) => ({
    ...spot,
    coordsMissing: !spot.lat || !spot.lng || (spot.lat === 0 && spot.lng === 0),
  }));

  // TODO (Week 2): insert spots into Data Connect DB for caching

  return { spots, cached: false };
});
