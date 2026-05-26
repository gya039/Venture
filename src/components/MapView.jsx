'use client';

import { useEffect, useRef, useState } from 'react';
import { getHiddennessLevel } from '@/constants/hiddenness';

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

/**
 * MapView — Mapbox GL JS map with coloured hiddenness pins.
 *
 * Props:
 *   spots          {object[]}  Spot docs with lat/lng/hiddennessScore
 *   centerLat      {number}
 *   centerLng      {number}
 *   onSpotClick    {fn}        Called with spot when a marker is tapped
 *   filterInterest {string}    Hides pins not matching this interest
 *   focusSpotId    {string}    When this changes, fly to that spot + highlight its pin
 */
export default function MapView({ spots = [], centerLat, centerLng, onSpotClick, filterInterest = '', focusSpotId = null }) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);
  const markersRef   = useRef([]);
  const [ready,  setReady]  = useState(false);
  const [mapErr, setMapErr] = useState(null);

  /* ── Init map ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!TOKEN)                   { setMapErr('no-token');    return; }
    if (!containerRef.current)    return;
    if (mapRef.current)           return;

    let map;

    import('mapbox-gl').then(({ default: mapboxgl }) => {
      mapboxgl.accessToken = TOKEN;

      map = new mapboxgl.Map({
        container:          containerRef.current,
        style:              'mapbox://styles/mapbox/dark-v11',
        center:             [centerLng ?? 4.9, centerLat ?? 52.37],
        zoom:               12,
        attributionControl: false,
      });

      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
      map.addControl(new mapboxgl.AttributionControl({ compact: true }),    'bottom-right');

      map.on('load', () => {
        mapRef.current = map;
        // Double rAF: first lets the browser finish the flex layout pass,
        // second lets Mapbox's own rAF queue drain before we place markers.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            map.resize();
            setReady(true);
          });
        });
      });

      // Only resize on actual window resize — NOT on internal layout changes.
      // A ResizeObserver on the container fires during hover/filter transitions
      // and can call resize() when the container is in a transient 0-size state,
      // which sets the Mapbox canvas to 0×0 and snaps all markers to top-left.
      const handleWindowResize = () => { mapRef.current?.resize(); };
      window.addEventListener('resize', handleWindowResize);

      // Store cleanup ref so the return fn can remove the listener
      map._ventureResizeCleanup = () => window.removeEventListener('resize', handleWindowResize);

    }).catch(() => setMapErr('load-failed'));

    return () => {
      mapRef.current?._ventureResizeCleanup?.();
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      map?.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line

  // Keep onSpotClick in a ref so changing the callback never re-creates markers
  const onSpotClickRef = useRef(onSpotClick);
  useEffect(() => { onSpotClickRef.current = onSpotClick; });

  // Store inner element map so we can update focus highlight without recreating markers
  const innerElemsRef = useRef({}); // spotId → inner DOM element

  /* ── Update markers ───────────────────────────────────────────────────── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    import('mapbox-gl').then(({ default: mapboxgl }) => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      innerElemsRef.current = {};

      const visible = filterInterest
        ? spots.filter(s => (s.interests ?? []).includes(filterInterest))
        : spots;

      visible.forEach(spot => {
        if (!spot.lat || !spot.lng || spot.coordsMissing) return;
        const level    = getHiddennessLevel(spot.hiddennessScore ?? 1);
        const isFocused = spot.id === focusSpotId;
        const size     = isFocused ? 34 : 26;

        // ── Outer element ─────────────────────────────────────────────────
        // Mapbox GL positions markers by setting `transform: translate3d(x,y,0)`
        // on this element. NEVER set `transform` here — it overrides the
        // positioning transform and sends every marker to (0,0) top-left.
        const el = document.createElement('div');
        Object.assign(el.style, {
          width:      size + 'px',
          height:     size + 'px',
          cursor:     'pointer',
          userSelect: 'none',
          zIndex:     isFocused ? '10' : '1',
        });

        // ── Inner element ─────────────────────────────────────────────────
        // All visual styling lives here. Scale animation goes on `inner`,
        // never on `el`, so hover effects never touch Mapbox's transform.
        const inner = document.createElement('div');
        Object.assign(inner.style, {
          width:          '100%',
          height:         '100%',
          borderRadius:   '50%',
          background:     level.color,
          border:         isFocused ? '2px solid #fff' : '2px solid rgba(0,0,0,0.4)',
          boxShadow:      isFocused
            ? `0 0 0 3px ${level.color}60, 0 0 18px ${level.color}80, 0 2px 8px rgba(0,0,0,0.5)`
            : `0 0 8px ${level.color}60, 0 2px 4px rgba(0,0,0,0.4)`,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontSize:       isFocused ? '11px' : '10px',
          fontWeight:     '700',
          color:          '#000',
          transition:     'transform 0.15s ease, box-shadow 0.15s ease',
          pointerEvents:  'none', // let the outer el handle click/hover
        });
        inner.textContent = spot.hiddennessScore;
        el.appendChild(inner);

        el.onmouseenter = () => { inner.style.transform = 'scale(1.25)'; };
        el.onmouseleave = () => { inner.style.transform = 'scale(1)'; };
        el.onclick      = () => onSpotClickRef.current?.(spot);

        const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat([spot.lng, spot.lat])
          .addTo(map);
        markersRef.current.push(marker);
        innerElemsRef.current[spot.id] = inner;
      });

      // Fit bounds to all visible spots (only on initial load, not focus change)
      if (!focusSpotId) {
        const withCoords = visible.filter(s => s.lat && s.lng && !s.coordsMissing);
        if (withCoords.length > 1) {
          const lats = withCoords.map(s => s.lat);
          const lngs = withCoords.map(s => s.lng);
          map.fitBounds(
            [[Math.min(...lngs) - 0.005, Math.min(...lats) - 0.005],
             [Math.max(...lngs) + 0.005, Math.max(...lats) + 0.005]],
            { padding: 60, maxZoom: 15, duration: 600 }
          );
        } else if (withCoords.length === 1) {
          map.flyTo({ center: [withCoords[0].lng, withCoords[0].lat], zoom: 14 });
        }
      }
    });
  }, [spots, ready, filterInterest]); // eslint-disable-line — onSpotClick intentionally via ref

  /* ── Fly to focused spot ──────────────────────────────────────────────── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !focusSpotId) return;
    const spot = spots.find(s => s.id === focusSpotId);
    if (!spot?.lat || !spot?.lng || spot.coordsMissing) return;
    map.flyTo({ center: [spot.lng, spot.lat], zoom: 15, duration: 500 });
  }, [focusSpotId, ready]); // eslint-disable-line

  /* ── Error / loading states ───────────────────────────────────────────── */
  if (mapErr === 'no-token') {
    return (
      <div style={{ position:'absolute', inset:0, background:'#111', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, padding:24, textAlign:'center' }}>
        <span style={{ fontSize:'2.5rem' }}>🗺️</span>
        <p style={{ color:'#f5f5f5', fontWeight:600 }}>Mapbox token needed</p>
        <p style={{ color:'#555', fontSize:'0.82rem', maxWidth:280, lineHeight:1.65 }}>
          Add your free token to <code style={{ color:'#f59e0b' }}>.env.local</code>:
          <br /><code style={{ color:'#f59e0b', fontSize:'0.75rem' }}>NEXT_PUBLIC_MAPBOX_TOKEN=pk.ey…</code>
        </p>
        <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" style={{ padding:'8px 18px', background:'#f59e0b', color:'#000', borderRadius:8, fontSize:'0.82rem', fontWeight:600, textDecoration:'none' }}>
          Get free token →
        </a>
      </div>
    );
  }

  // Both wrapper and container use position:absolute inset:0.
  // This fills the nearest positioned ancestor (the flex panel with
  // position:relative in the trips page) without relying on CSS height
  // inheritance through flex children.
  return (
    <div style={{ position:'absolute', inset:0 }}>
      <div ref={containerRef} style={{ position:'absolute', inset:0 }} />
      {!ready && (
        <div style={{ position:'absolute', inset:0, background:'#0a0a0a', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width:28, height:28, borderRadius:'50%', border:'2px solid #222', borderTopColor:'#f59e0b', animation:'spin 0.8s linear infinite' }} />
        </div>
      )}
    </div>
  );
}
