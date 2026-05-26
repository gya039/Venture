'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTrips } from '@/hooks/useTrips';
import TripCard from '@/components/TripCard';
import Sidebar from '@/components/Sidebar';
import InstallBanner from '@/components/InstallBanner';

/* ── Guest home (signed out, inside app shell) ──────────────────────────────── */
function GuestHome() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <main style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
      }}>
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          {/* Logo mark */}
          <div style={{
            width: 64, height: 64, borderRadius: 16, margin: '0 auto 28px',
            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, color: '#000', fontSize: '1.6rem',
            boxShadow: '0 8px 32px rgba(245,158,11,0.3)',
          }}>V</div>

          <h1 style={{
            fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em',
            marginBottom: 14, color: 'var(--text-primary)',
          }}>
            Welcome to Venture
          </h1>
          <p style={{
            color: 'var(--text-secondary)', lineHeight: 1.75,
            marginBottom: 36, fontSize: '0.975rem',
          }}>
            Sign in to plan trips, save hidden gems, and build day-by-day itineraries. AI researches any city in seconds.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            <Link href="/auth" style={{
              padding: '12px 32px', background: 'var(--accent)', color: '#000',
              borderRadius: 10, fontWeight: 700, fontSize: '0.95rem',
              boxShadow: '0 4px 20px rgba(245,158,11,0.25)', transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
            >Sign in →</Link>
            <Link href="/explore" style={{
              padding: '12px 22px', background: 'transparent', color: 'var(--text-secondary)',
              borderRadius: 10, fontWeight: 600, fontSize: '0.9rem',
              border: '1px solid var(--border)', transition: 'border-color 0.15s, color 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >Browse cities</Link>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Free forever · No credit card required</p>

          {/* Feature hints */}
          <div style={{
            marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14,
          }}>
            {[
              { icon: '✦', label: 'AI research', desc: 'Any city, 20 scored spots in seconds' },
              { icon: '🗺️', label: 'Map view', desc: 'Pins colour-coded by hiddenness' },
              { icon: '📅', label: 'Day plans', desc: 'Morning · Afternoon · Evening slots' },
            ].map(f => (
              <div key={f.label} style={{
                padding: '16px 12px', background: 'var(--card)',
                border: '1px solid var(--border)', borderRadius: 14, textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.4rem', marginBottom: 8 }}>{f.icon}</div>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>{f.label}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Dashboard (signed in) ──────────────────────────────────────────────────── */
function Dashboard({ user }) {
  const { trips, loading } = useTrips();
  const firstName = user?.email?.split('@')[0] ?? 'there';

  const now = new Date(); now.setHours(0, 0, 0, 0);
  const upcoming = trips.filter(t => !t.destinations?.[0]?.startDate || new Date(t.destinations[0].startDate + 'T00:00:00') >= now);
  const past     = trips.filter(t =>  t.destinations?.[0]?.startDate && new Date(t.destinations[0].startDate + 'T00:00:00') < now);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />

      <main style={{ flex: 1, minWidth: 0, padding: '40px 48px', maxWidth: 960 }}>

        {/* Greeting */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6, color: 'var(--text-primary)' }}>
            {greeting}, {firstName} ✦
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {loading ? '' : trips.length === 0
              ? "Let's plan your first adventure."
              : `You have ${upcoming.length} upcoming trip${upcoming.length !== 1 ? 's' : ''}.`}
          </p>
        </div>

        {/* Stats row */}
        {!loading && trips.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 40 }}>
            {[
              { label: 'Trips planned',   value: trips.length },
              { label: 'Upcoming',        value: upcoming.length },
              { label: 'Cities explored', value: new Set(trips.flatMap(t => t.destinations?.map(d => d.city) ?? [])).size },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 16, padding: '20px 24px',
              }}>
                <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.03em', marginBottom: 4 }}>{value}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
          <Link href="/trips/new" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', background: 'var(--accent)', color: '#000',
            borderRadius: 10, fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none',
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Trip
          </Link>
          <Link href="/explore" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', background: 'transparent', color: 'var(--text-secondary)',
            borderRadius: 10, fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none',
            border: '1px solid var(--border)', transition: 'border-color 0.15s, color 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
            Explore cities
          </Link>
        </div>

        {/* Trips */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton" style={{ height: 110, animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '72px 24px', textAlign: 'center', gap: 20,
            background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20,
          }}>
            <div style={{ fontSize: '3.5rem' }}>✈️</div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>No trips yet</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 340 }}>
                Plan your next adventure. AI surfaces hidden gems that tourists miss.
              </p>
            </div>
            <Link href="/trips/new" style={{
              padding: '12px 28px', background: 'var(--accent)', color: '#000',
              borderRadius: 10, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
            }}>
              Plan my first trip →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {upcoming.length > 0 && (
              <section>
                <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
                  Upcoming · {upcoming.length}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
                  {upcoming.map(t => <TripCard key={t.id} trip={t} />)}
                </div>
              </section>
            )}
            {past.length > 0 && (
              <section>
                <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
                  Past · {past.length}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12, opacity: 0.5 }}>
                  {past.map(t => <TripCard key={t.id} trip={t} />)}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <InstallBanner />
    </div>
  );
}

/* ── Root ───────────────────────────────────────────────────────────────────── */
export default function RootPage() {
  const { user, loading } = useAuth();
  // While Firebase confirms the session, show the guest home (avoids landing page flash)
  if (loading) return <GuestHome />;
  if (!user)   return <GuestHome />;
  return <Dashboard user={user} />;
}
