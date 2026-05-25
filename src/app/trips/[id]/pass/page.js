'use client';
// Day Pass Calculator — Week 4.
import { useParams } from 'next/navigation';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
export default function PassPage() {
  const { id } = useParams();
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingBottom: '80px' }}>
      <header style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href={`/trips/${id}`} style={{ color: 'var(--text-secondary)' }}>← Back</Link>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Day Pass Calculator</h1>
      </header>
      <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎟️</div>
        <p>Day pass calculator — coming in Week 4</p>
      </div>
      <BottomNav />
    </div>
  );
}
