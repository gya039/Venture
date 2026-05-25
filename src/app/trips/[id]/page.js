'use client';
// Trip Detail — Week 2 will build Research/Days/Pass tabs.
// Stub placeholder.

import { useParams } from 'next/navigation';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';

export default function TripDetailPage() {
  const { id } = useParams();
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingBottom: '80px' }}>
      <header style={{ padding: '20px', paddingTop: 'calc(20px + env(safe-area-inset-top))', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>← Back</Link>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Trip Detail</h1>
      </header>
      <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✈️</div>
        <p style={{ fontSize: '0.85rem' }}>Trip ID: {id}</p>
        <p style={{ marginTop: '8px' }}>Research · Days · Pass tabs — coming in Week 2</p>
      </div>
      <BottomNav />
    </div>
  );
}
