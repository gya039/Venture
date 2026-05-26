'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTrips } from '@/hooks/useTrips';
import TripCard from '@/components/TripCard';
import BottomNav from '@/components/BottomNav';
import LandingPage from '@/components/LandingPage';
import InstallBanner from '@/components/InstallBanner';

/* ── Dashboard (signed-in view) ───────────────────────────────────────────── */
function Dashboard() {
  const { trips, loading } = useTrips();

  return (
    <div style={{
      minHeight:     '100dvh',
      background:    'var(--bg)',
      paddingBottom: 'calc(var(--nav-height) + env(safe-area-inset-bottom))',
    }}>
      <header style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        '20px 20px 0',
        paddingTop:     'calc(20px + env(safe-area-inset-top))',
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Venture</h1>
        <Link href="/settings" style={{
          width:        '36px', height: '36px',
          display:      'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '8px',
          background:   'var(--card)',
          border:       '1px solid var(--border)',
          color:        'var(--text-secondary)',
          fontSize:     '1rem',
        }} aria-label="Settings">
          ⚙️
        </Link>
      </header>

      <div style={{ padding: '24px 20px 12px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.01em' }}>
          Upcoming Trips
        </h2>
      </div>

      <main style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} style={{
              height:     '110px',
              background: 'var(--card)',
              borderRadius: '12px',
              border:     '1px solid var(--border)',
              animation:  'pulse 1.5s ease-in-out infinite',
              animationDelay: `${i * 0.1}s`,
            }} />
          ))
        ) : trips.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✈️</div>
            <p style={{ fontSize: '0.9rem' }}>No trips yet.</p>
            <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Add your first trip below.</p>
          </div>
        ) : (
          trips.map((trip) => <TripCard key={trip.id} trip={trip} />)
        )}
      </main>

      <div style={{ padding: '20px' }}>
        <Link href="/trips/new" style={{
          display:        'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          width:          '100%', padding: '14px',
          background:     'var(--accent)', color: '#000',
          borderRadius:   'var(--radius-md)',
          fontWeight:     700, fontSize: '0.95rem',
          letterSpacing:  '0.01em',
          textDecoration: 'none',
          transition:     'background 0.15s',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent)')}
        >
          <span style={{ fontSize: '1.1rem' }}>+</span>
          Add Trip
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}

/* ── Root page — routes between landing & dashboard ──────────────────────── */
export default function RootPage() {
  const { user, loading } = useAuth();

  // Brief loading state while Firebase resolves auth
  if (loading) {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          border: '2px solid var(--border)',
          borderTopColor: 'var(--accent)',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  return (
    <>
      {user ? <Dashboard /> : <LandingPage />}
      {user && <InstallBanner />}
    </>
  );
}
