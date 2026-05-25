'use client';
// Spot Detail — Week 2.
import { useParams } from 'next/navigation';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
export default function SpotDetailPage() {
  const { id } = useParams();
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingBottom: '80px' }}>
      <header style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/" style={{ color: 'var(--text-secondary)' }}>← Back</Link>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Spot Detail</h1>
      </header>
      <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Spot ID: {id}</p>
        <p style={{ marginTop: '8px' }}>Spot detail — coming in Week 2</p>
      </div>
      <BottomNav />
    </div>
  );
}
