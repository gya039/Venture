'use client';
// Map View — Week 3 will build Mapbox integration.
import { useParams } from 'next/navigation';
import Link from 'next/link';
export default function MapPage() {
  const { id } = useParams();
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)' }}>
      <header style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href={`/trips/${id}`} style={{ color: 'var(--text-secondary)' }}>← Back</Link>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Map View</h1>
      </header>
      <div style={{ height: 'calc(100dvh - 60px)', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        🗺️ Mapbox — Week 3
      </div>
    </div>
  );
}
