'use client';
// Add Trip — Week 2 will build the full form.
// Stub placeholder.

import Link from 'next/link';
import BottomNav from '@/components/BottomNav';

export default function NewTripPage() {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingBottom: '80px' }}>
      <header style={{ padding: '20px', paddingTop: 'calc(20px + env(safe-area-inset-top))', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>← Back</Link>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 600 }}>New Trip</h1>
      </header>
      <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🗺️</div>
        <p>Add Trip form — coming in Week 2</p>
      </div>
      <BottomNav />
    </div>
  );
}
