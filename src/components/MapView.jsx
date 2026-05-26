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
 */
export default function MapView({ spots = [], centerLat, centerLng, onSpotClick, filterInterest = '' }) {
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
      map.on('load', () => { mapRef.current = map; setReady(true); });
    }).catch(() => setMapErr('load-failed'));

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      map?.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line

  /* ── Update markers ───────────────────────────────────────────────────── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    import('mapbox-gl').then(({ default: mapboxgl }) => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      const visible = filterInterest
        ? spots.filter(s => (s.interests ?? []).includes(filterInterest))
        : spots;

      visible.forEach(spot => {
        if (!spot.lat || !spot.lng || spot.coordsMissing) return;
        const level = getHiddennessLevel(spot.hiddennessScore ?? 1);

        const el = document.createElement('div');
        Object.assign(el.style, {
          width: '28px', height: '28px', borderRadius: '50%',
          background: level.color,
          border: '2px solid rgba(0,0,0,0.5)',
          boxShadow: `0 0 10px ${level.color}80, 0 2px 6px rgba(0,0,0,0.5)`,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '10px', fontWeight: '700', color: '#000',
          transition: 'transform 0.15s ease',
          userSelect: 'none',
        });
        el.textContent        = spot.hiddennessScore;
        el.onmouseenter       = () => (el.style.transform = 'scale(1.35)');
        el.onmouseleave       = () => (el.style.transform = 'scale(1)');
        el.onclick            = () => onSpotClick?.(spot);

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([spot.lng, spot.lat])
          .addTo(map);
        markersRef.current.push(marker);
      });

      // Fit bounds to visible spots
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
    });
  }, [spots, ready, filterInterest, onSpotClick]);

  /* ── Error / loading states ───────────────────────────────────────────── */
  if (mapErr === 'no-token') {
    return (
      <div style={{ width:'100%', height:'100%', background:'#111', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, padding:24, textAlign:'center' }}>
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

  return (
    <div style={{ position:'relative', width:'100%', height:'100%' }}>
      <div ref={containerRef} style={{ width:'100%', height:'100%' }} />
      {!ready && (
        <div style={{ position:'absolute', inset:0, background:'#0a0a0a', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width:28, height:28, borderRadius:'50%', border:'2px solid #222', borderTopColor:'#f59e0b', animation:'spin 0.8s linear infinite' }} />
        </div>
      )}
    </div>
  );
}
