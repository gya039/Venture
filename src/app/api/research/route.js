// src/app/api/research/route.js
// Server-side API route — calls OpenAI and returns parsed spots.
// The client then writes them to Firestore using the client SDK.
// This avoids needing Firebase Cloud Functions (Blaze plan).

import { NextResponse } from 'next/server';

// Allow up to 60s on Vercel Hobby plan (default is 10s)
export const maxDuration = 60;

const buildPrompt = (city, interests) => `
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

Hiddenness scoring:
- 1–3: Famous worldwide, always busy, on every tourist itinerary
- 4–5: Well-known locally, less visited than top 10
- 6–7: Known to travel enthusiasts, Reddit, niche blogs
- 8–9: Truly local knowledge, rarely on tourist radar
- 10: Requires specific insider knowledge to find
`.trim();

export async function POST(request) {
  try {
    const { city, interests = [] } = await request.json();

    if (!city) {
      return NextResponse.json({ error: 'Missing required field: city' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY is not set in .env.local' }, { status: 500 });
    }

    // Call OpenAI
    const callOpenAI = async (prompt) => {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization:  `Bearer ${apiKey}`,
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
      const raw    = await callOpenAI(buildPrompt(city, interests));
      const parsed = JSON.parse(raw);
      spots = Array.isArray(parsed) ? parsed : (parsed.spots ?? []);
    } catch {
      // Retry with stricter instruction
      const raw    = await callOpenAI('Return ONLY valid JSON {"spots":[...]}. No markdown.\n' + buildPrompt(city, interests));
      const parsed = JSON.parse(raw);
      spots = Array.isArray(parsed) ? parsed : (parsed.spots ?? []);
    }

    if (!Array.isArray(spots) || spots.length === 0) {
      return NextResponse.json({ error: 'AI returned no spots. Please try again.' }, { status: 500 });
    }

    // ── Geocode spots via Mapbox ──────────────────────────────────────────
    // AI-generated lat/lng values are often completely wrong (hallucinated).
    // We geocode every spot name within a tight bbox around the city centre
    // so markers always land in the right country/city.
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (mapboxToken) {
      try {
        // 1. Resolve city centre coordinates
        const cityGeoRes = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json` +
          `?types=place&limit=1&access_token=${mapboxToken}`
        );
        if (cityGeoRes.ok) {
          const cityGeoData = await cityGeoRes.json();
          if (cityGeoData.features?.length > 0) {
            const [cLng, cLat] = cityGeoData.features[0].center;
            // 0.35° ≈ 38 km — tight enough to stay in the city, loose enough
            // for suburban spots.  Mapbox also uses proximity for ranking.
            const pad  = 0.35;
            const bbox = [cLng - pad, cLat - pad, cLng + pad, cLat + pad].join(',');

            // 2. Geocode all spots in parallel inside the city bbox
            spots = await Promise.all(spots.map(async (spot) => {
              try {
                const q   = encodeURIComponent(spot.name);
                const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${q}.json` +
                            `?proximity=${cLng},${cLat}&bbox=${bbox}` +
                            `&types=poi,address&limit=1&access_token=${mapboxToken}`;
                const r = await fetch(url);
                if (!r.ok) return spot;
                const d = await r.json();
                if (d.features?.length > 0) {
                  const [lng, lat] = d.features[0].center;
                  return { ...spot, lat, lng, coordsMissing: false };
                }
              } catch { /* fall through — keep AI coords */ }
              return spot;
            }));
          }
        }
      } catch (geoErr) {
        // Geocoding is best-effort — research still succeeds without it
        console.warn('[research] Mapbox geocoding failed, using AI coords:', geoErr.message);
      }
    }

    // Flag any spots that still have missing / zero coordinates
    spots = spots.map((s) => ({
      ...s,
      coordsMissing: !s.lat || !s.lng || (s.lat === 0 && s.lng === 0),
    }));

    return NextResponse.json({ spots });

  } catch (err) {
    console.error('[/api/research] error:', err);
    return NextResponse.json({ error: err.message ?? 'Research failed' }, { status: 500 });
  }
}
