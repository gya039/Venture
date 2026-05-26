'use client';

import Link from 'next/link';
import BottomNav from '@/components/BottomNav';

const FEATURED = [
  { city: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', gems: 24, tag: 'Canals & Culture' },
  { city: 'Lisbon',    country: 'Portugal',    flag: '🇵🇹', gems: 31, tag: 'Sun & History' },
  { city: 'Prague',    country: 'Czech Republic', flag: '🇨🇿', gems: 28, tag: 'Gothic & Beer' },
  { city: 'Vienna',    country: 'Austria',     flag: '🇦🇹', gems: 22, tag: 'Music & Coffee' },
  { city: 'Barcelona', country: 'Spain',       flag: '🇪🇸', gems: 35, tag: 'Art & Beach' },
  { city: 'Budapest',  country: 'Hungary',     flag: '🇭🇺', gems: 27, tag: 'Baths & Ruin Bars' },
  { city: 'Berlin',    country: 'Germany',     flag: '🇩🇪', gems: 40, tag: 'Underground & Art' },
  { city: 'Rome',      country: 'Italy',       flag: '🇮🇹', gems: 33, tag: 'Ancient & Food' },
  { city: 'Copenhagen', country: 'Denmark',    flag: '🇩🇰', gems: 19, tag: 'Design & Hygge' },
  { city: 'Tokyo',     country: 'Japan',       flag: '🇯🇵', gems: 48, tag: 'Chaos & Calm' },
  { city: 'Kyoto',     country: 'Japan',       flag: '🇯🇵', gems: 29, tag: 'Temples & Zen' },
  { city: 'Porto',     country: 'Portugal',    flag: '🇵🇹', gems: 21, tag: 'Wine & Tiles' },
];

const GRADIENTS = [
  ['#f59e0b','#ef4444'], ['#3b82f6','#8b5cf6'], ['#10b981','#3b82f6'],
  ['#f59e0b','#f97316'], ['#ec4899','#8b5cf6'], ['#14b8a6','#22c55e'],
];
function grad(city) {
  const i = city.split('').reduce((a,c) => a + c.charCodeAt(0), 0) % GRADIENTS.length;
  return GRADIENTS[i];
}

export default function ExplorePage() {
  return (
    <div style={{
      minHeight: '100dvh', background: 'var(--bg)',
      paddingBottom: 'calc(80px + env(safe-area-inset-bottom))',
    }}>

      {/* Header */}
      <header style={{
        padding: '0 20px',
        paddingTop: 'calc(18px + env(safe-area-inset-top))',
        paddingBottom: 18,
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(16px)',
      }}>
        <h1 style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Explore</h1>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 3 }}>
          Popular destinations with hidden gems ready to discover
        </p>
      </header>

      <main style={{ padding: '20px 16px' }}>

        {/* Search hint */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 14px', background: 'var(--card)',
          border: '1px solid var(--border)', borderRadius: 12,
          marginBottom: 20, color: 'var(--text-muted)', fontSize: '0.85rem',
        }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <span>Search coming soon — start a trip to research any city</span>
        </div>

        {/* City grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 10,
        }}>
          {FEATURED.map(dest => {
            const [c1, c2] = grad(dest.city);
            return (
              <Link
                key={dest.city}
                href={`/trips/new?city=${encodeURIComponent(dest.city)}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: 'var(--card)', border: '1px solid var(--border)',
                  borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
                  transition: 'transform 0.15s, border-color 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  {/* Gradient top */}
                  <div style={{
                    height: 64,
                    background: `linear-gradient(135deg, ${c1}33, ${c2}44)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem',
                    position: 'relative',
                  }}>
                    {dest.flag}
                    <div style={{
                      position: 'absolute', top: 6, right: 8,
                      fontSize: '0.6rem', fontWeight: 700,
                      color: c1, background: `${c1}22`,
                      border: `1px solid ${c1}33`,
                      borderRadius: 20, padding: '1px 6px',
                    }}>
                      {dest.gems} gems
                    </div>
                  </div>

                  <div style={{ padding: '10px 12px' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 2 }}>{dest.city}</p>
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{dest.tag}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: 24, padding: '20px', background: 'var(--card)',
          border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, textAlign: 'center',
        }}>
          <p style={{ fontWeight: 700, marginBottom: 6, fontSize: '0.9rem' }}>
            Don't see your city?
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.5 }}>
            Venture works for any city worldwide. Start a trip and our AI will research it.
          </p>
          <Link href="/trips/new" style={{
            display: 'inline-block', padding: '10px 22px',
            background: 'var(--accent)', color: '#000',
            borderRadius: 10, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none',
          }}>
            Plan a custom trip →
          </Link>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
