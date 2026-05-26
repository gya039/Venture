'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTrips } from '@/hooks/useTrips';
import TripCard from '@/components/TripCard';
import Sidebar from '@/components/Sidebar';
import InstallBanner from '@/components/InstallBanner';

/* ── Dashboard ──────────────────────────────────────────────────────────────── */
function Dashboard() {
  const { trips, loading } = useTrips();

  const now = new Date(); now.setHours(0, 0, 0, 0);
  const upcoming = trips.filter(t => !t.destinations?.[0]?.startDate || new Date(t.destinations[0].startDate + 'T00:00:00') >= now);
  const past     = trips.filter(t =>  t.destinations?.[0]?.startDate && new Date(t.destinations[0].startDate + 'T00:00:00') < now);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />

      <main style={{ flex: 1, minWidth: 0, padding: '40px 48px', maxWidth: 900 }}>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>My Trips</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {loading ? '' : `${trips.length} trip${trips.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <Link href="/trips/new" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', background: 'var(--accent)', color: '#000',
            borderRadius: 8, fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none',
          }}>
            + New Trip
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: 120, borderRadius: 12, background: 'var(--card)', border: '1px solid var(--border)', animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '80px 24px', textAlign: 'center', gap: 20,
            border: '1px dashed var(--border)', borderRadius: 16,
          }}>
            <div style={{ fontSize: '3rem' }}>✈️</div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>No trips yet</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 320 }}>
                Plan your next adventure. Our AI scans Reddit, travel blogs and local sources to surface the hidden gems tourists miss.
              </p>
            </div>
            <Link href="/trips/new" style={{
              padding: '12px 28px', background: 'var(--accent)', color: '#000',
              borderRadius: 8, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
            }}>
              Plan my first trip →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {upcoming.length > 0 && (
              <section>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
                  Upcoming · {upcoming.length}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
                  {upcoming.map(t => <TripCard key={t.id} trip={t} />)}
                </div>
              </section>
            )}
            {past.length > 0 && (
              <section>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
                  Past · {past.length}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12, opacity: 0.55 }}>
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

/* ── Landing ────────────────────────────────────────────────────────────────── */
function Landing() {
  const CITIES = ['Amsterdam', 'Lisbon', 'Tokyo', 'Barcelona', 'Rome', 'Prague', 'Vienna', 'Budapest', 'Berlin', 'Kyoto'];
  const STATS = [['83%', 'of great memories are unplanned'], ['4.2h', 'wasted on TripAdvisor per trip'], ['10×', 'faster than manual research'], ['~£0', 'cost per AI-researched city']];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Top nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 64,
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(16px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#f59e0b,#f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#000', fontSize: '0.85rem' }}>V</div>
          <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>Venture</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/auth" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Sign in</Link>
          <Link href="/auth" style={{ padding: '8px 18px', background: 'var(--accent)', color: '#000', borderRadius: 7, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>Get started free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '96px 24px 80px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 20, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 600, marginBottom: 28, letterSpacing: '0.06em' }}>
          ✦ AI-POWERED TRAVEL RESEARCH
        </div>
        <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 24 }}>
          Find places tourists{' '}
          <span style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>never find</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 520, margin: '0 auto 40px' }}>
          AI scans Reddit, travel blogs and local sources to surface hidden gems — scored by how off-the-beaten-path they actually are.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 40 }}>
          <Link href="/auth" style={{ padding: '14px 36px', background: 'var(--accent)', color: '#000', borderRadius: 10, fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 4px 24px rgba(245,158,11,0.3)' }}>
            Start planning free →
          </Link>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {CITIES.map(c => (
            <span key={c} style={{ padding: '4px 12px', borderRadius: 20, background: 'var(--card)', border: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c}</span>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {STATS.map(([v, l]) => (
            <div key={v} style={{ padding: '36px 24px', textAlign: 'center', borderRight: '1px solid var(--border)' }}>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.03em', marginBottom: 6 }}>{v}</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '80px 24px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 48, textAlign: 'center' }}>How it works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {[
            ['01', 'Add your trip', 'Enter a city and dates. Multi-city trips supported.'],
            ['02', 'AI researches it', 'We scan hundreds of sources to find spots locals actually visit.'],
            ['03', 'Explore your gems', 'Browse spots by hiddenness score, build your day plan, check pass value.'],
          ].map(([num, title, desc]) => (
            <div key={num} style={{ padding: '28px 24px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: 12 }}>{num}</div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: '1px solid var(--border)', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 }}>Ready to explore differently?</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: '0.9rem' }}>Free to use. No credit card required.</p>
        <Link href="/auth" style={{ padding: '14px 40px', background: 'var(--accent)', color: '#000', borderRadius: 10, fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 4px 24px rgba(245,158,11,0.3)', display: 'inline-block' }}>
          Get started free →
        </Link>
      </section>

      <footer style={{ padding: '24px 48px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
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
  return <Dashboard />;
}
