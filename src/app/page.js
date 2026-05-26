'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTrips } from '@/hooks/useTrips';
import TripCard from '@/components/TripCard';
import BottomNav from '@/components/BottomNav';
import LandingPage from '@/components/LandingPage';
import InstallBanner from '@/components/InstallBanner';

/* ── Dashboard ──────────────────────────────────────────────────────────────── */
function Dashboard() {
  const { trips, loading } = useTrips();

  const upcoming = trips.filter(t => {
    const d = t.destinations?.[0]?.startDate;
    return d ? new Date(d + 'T00:00:00') >= new Date(new Date().setHours(0,0,0,0)) : true;
  });
  const past = trips.filter(t => {
    const d = t.destinations?.[0]?.startDate;
    return d ? new Date(d + 'T00:00:00') < new Date(new Date().setHours(0,0,0,0)) : false;
  });

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>

      {/* Header */}
      <header style={{
        padding: '0 20px',
        paddingTop: 'calc(18px + env(safe-area-inset-top))',
        paddingBottom: 18,
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', fontWeight: 800, color: '#000', letterSpacing: '-0.05em',
          }}>V</div>
          <span style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Venture</span>
        </div>
        <Link href="/settings" style={{
          width: 34, height: 34,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 8, background: 'var(--card)', border: '1px solid var(--border)',
          color: 'var(--text-secondary)', fontSize: '1rem', textDecoration: 'none',
        }}>
          ⚙️
        </Link>
      </header>

      <main style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {loading ? (
          /* Skeleton */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2].map(i => (
              <div key={i} style={{
                height: 160, borderRadius: 16, background: 'var(--card)',
                border: '1px solid var(--border)',
                animation: 'pulse 1.6s ease-in-out infinite',
                animationDelay: `${i * 0.15}s`,
              }} />
            ))}
          </div>
        ) : trips.length === 0 ? (
          /* Empty state */
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '60px 24px', textAlign: 'center', gap: 16,
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: 24,
              background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(249,115,22,0.1))',
              border: '1px solid rgba(245,158,11,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.2rem',
            }}>✈️</div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 6 }}>No trips yet</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 240 }}>
                Plan your next adventure. We'll find the hidden gems the tourists miss.
              </p>
            </div>
            <Link href="/trips/new" style={{
              padding: '12px 28px', background: 'var(--accent)', color: '#000',
              borderRadius: 12, fontWeight: 700, fontSize: '0.9rem',
              textDecoration: 'none', marginTop: 4,
            }}>
              Plan my first trip →
            </Link>
          </div>
        ) : (
          <>
            {/* Upcoming */}
            {upcoming.length > 0 && (
              <section>
                <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                  Upcoming · {upcoming.length}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {upcoming.map(t => <TripCard key={t.id} trip={t} />)}
                </div>
              </section>
            )}

            {/* Past */}
            {past.length > 0 && (
              <section>
                <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                  Past · {past.length}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, opacity: 0.65 }}>
                  {past.map(t => <TripCard key={t.id} trip={t} />)}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Floating Add Trip button */}
      {!loading && (
        <div style={{
          position: 'fixed', bottom: 'calc(var(--nav-height) + env(safe-area-inset-bottom) + 12px)',
          left: '50%', transform: 'translateX(-50%)', zIndex: 40,
        }}>
          <Link href="/trips/new" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 24px',
            background: 'var(--accent)', color: '#000',
            borderRadius: 50, fontWeight: 700, fontSize: '0.9rem',
            textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(245,158,11,0.4)',
            whiteSpace: 'nowrap',
          }}>
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>+</span>
            New Trip
          </Link>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

/* ── Root ───────────────────────────────────────────────────────────────────── */
export default function RootPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100dvh', background: 'var(--bg)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 13,
          background: 'linear-gradient(135deg, #f59e0b, #f97316)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem', fontWeight: 800, color: '#000',
        }}>V</div>
        <div style={{
          width: 24, height: 24, borderRadius: '50%',
          border: '2px solid var(--border)', borderTopColor: 'var(--accent)',
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
