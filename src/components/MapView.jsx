'use client';
// MapView — Week 3
// Mapbox GL JS wrapper. Dynamically imported to avoid SSR issues.
// Stub — will be built in Week 3.

export default function MapView({ spots, center }) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#1a1a1a',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-muted)',
      fontSize: '0.85rem',
    }}>
      🗺️ Map — Week 3
    </div>
  );
}
