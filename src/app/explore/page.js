'use client';

import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

const FEATURED = [
  { city: 'Amsterdam', country: 'Netherlands', emoji: '🇳🇱', gems: 24, tag: 'Canals & Culture',      gradient: ['#667eea', '#764ba2'] },
  { city: 'Lisbon',    country: 'Portugal',    emoji: '🇵🇹', gems: 31, tag: 'Sun & History',         gradient: ['#f093fb', '#f5576c'] },
  { city: 'Prague',    country: 'Czech Republic', emoji: '🇨🇿', gems: 28, tag: 'Gothic & Beer',      gradient: ['#4facfe', '#00f2fe'] },
  { city: 'Vienna',    country: 'Austria',     emoji: '🇦🇹', gems: 22, tag: 'Music & Coffee',        gradient: ['#43e97b', '#38f9d7'] },
  { city: 'Barcelona', country: 'Spain',       emoji: '🇪🇸', gems: 35, tag: 'Art & Beach',           gradient: ['#fa709a', '#fee140'] },
  { city: 'Budapest',  country: 'Hungary',     emoji: '🇭🇺', gems: 27, tag: 'Baths & Ruin Bars',     gradient: ['#a18cd1', '#fbc2eb'] },
  { city: 'Berlin',    country: 'Germany',     emoji: '🇩🇪', gems: 40, tag: 'Underground & Art',     gradient: ['#fccb90', '#d57eeb'] },
  { city: 'Rome',      country: 'Italy',       emoji: '🇮🇹', gems: 33, tag: 'Ancient & Food',        gradient: ['#f6d365', '#fda085'] },
  { city: 'Copenhagen', country: 'Denmark',    emoji: '🇩🇰', gems: 19, tag: 'Design & Hygge',        gradient: ['#89f7fe', '#66a6ff'] },
  { city: 'Tokyo',     country: 'Japan',       emoji: '🇯🇵', gems: 48, tag: 'Chaos & Calm',          gradient: ['#ff9a9e', '#fecfef'] },
  { city: 'Kyoto',     country: 'Japan',       emoji: '🇯🇵', gems: 29, tag: 'Temples & Zen',         gradient: ['#a1c4fd', '#c2e9fb'] },
  { city: 'Porto',     country: 'Portugal',    emoji: '🇵🇹', gems: 21, tag: 'Wine & Tiles',          gradient: ['#ffecd2', '#fcb69f'] },
];

function CityCard({ city, country, emoji, gems, tag, gradient }) {
  const [c1, c2] = gradient;
  return (
    <Link href={`/explore/${encodeURIComponent(city.toLowerCase())}`} style={{ textDecoration: 'none' }}>
      <div style={{
        borderRadius: 16, overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        transition: 'box-shadow 0.2s, transform 0.2s',
        background: '#fff',
        cursor: 'pointer',
      }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        {/* Gradient banner */}
        <div style={{
          height: 130,
          background: `linear-gradient(135deg, ${c1}, ${c2})`,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          padding: '12px 14px', position: 'relative',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)' }} />
          <span style={{ fontSize: '2.8rem', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>{emoji}</span>
          <span style={{
            position: 'relative', zIndex: 1,
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff', fontSize: '0.68rem', fontWeight: 700,
            padding: '3px 9px', borderRadius: 20,
          }}>
            {gems} gems
          </span>
        </div>

        {/* Info */}
        <div style={{ padding: '14px 16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'Fraunces, Georgia, serif', marginBottom: 2, color: 'var(--primary)' }}>{city}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>{country}</p>
          <span style={{
            display: 'inline-block', padding: '3px 10px', borderRadius: 20,
            background: 'var(--border-subtle)', color: 'var(--text-secondary)',
            fontSize: '0.7rem', fontWeight: 500,
          }}>{tag}</span>
        </div>
      </div>
    </Link>
  );
}

export default function ExplorePage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />

      <main style={{ flex: 1, minWidth: 0, padding: '40px 48px' }}>
        <div style={{ maxWidth: 1100 }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>Explore</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Click any city to browse hidden gems — no account needed
            </p>
          </div>

          {/* Search hint */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px', background: '#fff',
            border: '1px solid var(--border)', borderRadius: 12,
            marginBottom: 32, color: 'var(--text-muted)', fontSize: '0.85rem',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
            Search coming soon — browse destinations below or create a trip for any city worldwide
          </div>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 20,
            marginBottom: 40,
          }}>
            {FEATURED.map(dest => <CityCard key={dest.city} {...dest} />)}
          </div>

          {/* CTA */}
          <div style={{
            padding: '32px 36px',
            background: 'linear-gradient(135deg, #1B2B4B, #2D4270)',
            borderRadius: 16, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
          }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'Fraunces, Georgia, serif', marginBottom: 6, color: '#fff' }}>
                Don't see your city?
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                Venture works for any city worldwide. Start a trip and our AI will research it.
              </p>
            </div>
            <Link href="/trips/new" style={{
              flexShrink: 0, padding: '12px 24px',
              background: 'var(--accent)', color: '#1B2B4B',
              borderRadius: 10, fontWeight: 700, fontSize: '0.875rem',
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}>
              Plan a custom trip →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
