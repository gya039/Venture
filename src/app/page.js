'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTrips } from '@/hooks/useTrips';
import TripCard from '@/components/TripCard';
import Sidebar from '@/components/Sidebar';
import InstallBanner from '@/components/InstallBanner';

/* ── Dashboard ──────────────────────────────────────────────────────────────── */
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
          <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
            {greeting}, {firstName} ✦
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {loading ? '' : trips.length === 0 ? "Let's plan your first adventure." : `You have ${upcoming.length} upcoming trip${upcoming.length !== 1 ? 's' : ''}.`}
          </p>
        </div>

        {/* Stats row */}
        {!loading && trips.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 40 }}>
            {[
              { label: 'Trips planned', value: trips.length },
              { label: 'Upcoming', value: upcoming.length },
              { label: 'Cities explored', value: new Set(trips.flatMap(t => t.destinations?.map(d => d.city) ?? [])).size },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: '#fff', border: '1px solid var(--border)',
                borderRadius: 14, padding: '20px 24px',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'Fraunces, Georgia, serif', color: 'var(--primary)', letterSpacing: '-0.02em', marginBottom: 4 }}>{value}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
          <Link href="/trips/new" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', background: 'var(--primary)', color: '#fff',
            borderRadius: 10, fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none',
            boxShadow: 'var(--shadow-sm)', transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Trip
          </Link>
          <Link href="/explore" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', background: '#fff', color: 'var(--text-primary)',
            borderRadius: 10, fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none',
            border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
          }}>
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
              <div key={i} style={{ height: 110, borderRadius: 14, background: 'var(--border)', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '72px 24px', textAlign: 'center', gap: 20,
            background: '#fff', border: '1px solid var(--border)', borderRadius: 20,
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ fontSize: '3.5rem' }}>✈️</div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>No trips yet</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 340 }}>
                Plan your next adventure. Our AI scans Reddit, travel blogs and local sources to surface the hidden gems tourists miss.
              </p>
            </div>
            <Link href="/trips/new" style={{
              padding: '12px 28px', background: 'var(--primary)', color: '#fff',
              borderRadius: 10, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
              boxShadow: 'var(--shadow-md)',
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12, opacity: 0.6 }}>
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

/* ── Landing (guest) ────────────────────────────────────────────────────────── */
function Landing() {
  const FEATURED = [
    { city: 'Tokyo',     emoji: '🇯🇵', tag: 'Chaos & Calm',    gradient: ['#ff9a9e','#fecfef'] },
    { city: 'Lisbon',    emoji: '🇵🇹', tag: 'Sun & History',   gradient: ['#f093fb','#f5576c'] },
    { city: 'Barcelona', emoji: '🇪🇸', tag: 'Art & Beach',     gradient: ['#fa709a','#fee140'] },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 64px', height: 64,
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(250,249,246,0.95)', backdropFilter: 'blur(16px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#1B2B4B,#2D4270)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Fraunces,serif', fontWeight: 700, color: '#D4A84B', fontSize: '0.85rem' }}>V</div>
          <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: '1rem', color: 'var(--primary)', letterSpacing: '-0.01em' }}>Venture</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/explore" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Explore</Link>
          <Link href="/auth" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Sign in</Link>
          <Link href="/auth" style={{ padding: '8px 18px', background: 'var(--primary)', color: '#fff', borderRadius: 8, fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' }}>Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '100px 24px 80px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 20, background: 'rgba(212,168,75,0.1)', border: '1px solid rgba(212,168,75,0.3)', fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 700, marginBottom: 28, letterSpacing: '0.08em' }}>
          ✦ AI-POWERED TRAVEL RESEARCH
        </div>
        <h1 style={{ fontSize: 'clamp(2.6rem,6vw,4rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 24, color: 'var(--primary)' }}>
          Find places tourists{' '}
          <span style={{ color: 'var(--accent)' }}>never find</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 520, margin: '0 auto 40px' }}>
          AI scans Reddit, travel blogs and local sources to surface hidden gems — scored by how off-the-beaten-path they actually are.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          <Link href="/auth" style={{ padding: '14px 36px', background: 'var(--primary)', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: 'var(--shadow-md)' }}>
            Start planning free →
          </Link>
          <Link href="/explore" style={{ padding: '14px 28px', background: '#fff', color: 'var(--text-primary)', borderRadius: 10, fontWeight: 600, fontSize: '1rem', textDecoration: 'none', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            Browse cities
          </Link>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Free to use · No credit card required</p>
      </section>

      {/* Featured cities */}
      <section style={{ padding: '0 24px 80px', maxWidth: 860, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>Featured destinations</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {FEATURED.map(({ city, emoji, tag, gradient: [c1, c2] }) => (
            <Link key={city} href={`/explore/${city.toLowerCase()}`} style={{ textDecoration: 'none' }}>
              <div style={{
                borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-md)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              >
                <div style={{ height: 120, background: `linear-gradient(135deg,${c1},${c2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)' }} />
                  <span style={{ position: 'relative', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>{emoji}</span>
                </div>
                <div style={{ padding: '14px 16px', background: '#fff' }}>
                  <h3 style={{ fontFamily: 'Fraunces,serif', fontSize: '1rem', fontWeight: 700, marginBottom: 4, color: 'var(--primary)' }}>{city}</h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'var(--border-subtle)', padding: '2px 8px', borderRadius: 20 }}>{tag}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 48, textAlign: 'center' }}>How it works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
            {[
              ['01', 'Add your trip', 'Enter a city and your dates. Multi-city trips supported.'],
              ['02', 'AI researches it', 'We scan hundreds of sources to find what locals actually visit.'],
              ['03', 'Explore your gems', 'Browse spots by hiddenness score, build day plans, check pass value.'],
            ].map(([num, title, desc]) => (
              <div key={num} style={{ textAlign: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary)', color: '#D4A84B', fontFamily: 'Fraunces,serif', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>{num}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 }}>Ready to explore differently?</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: '0.9rem' }}>Free to use. No credit card required.</p>
        <Link href="/auth" style={{ padding: '14px 40px', background: 'var(--primary)', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: 'var(--shadow-md)', display: 'inline-block' }}>
          Get started free →
        </Link>
      </section>

      <footer style={{ padding: '24px 64px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <span>© 2026 Venture</span>
        <span>AI-powered travel research</span>
      </footer>
    </div>
  );
}

/* ── Root ───────────────────────────────────────────────────────────────────── */
export default function RootPage() {
  const { user, loading } = useAuth();
  if (loading && !user) return <Landing />;
  if (!user) return <Landing />;
  return <Dashboard user={user} />;
}
