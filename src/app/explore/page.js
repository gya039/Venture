'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

const FEATURED = [
  { city: 'Amsterdam', country: 'Netherlands', code: 'NL', gems: 24, tag: 'Canals & Culture',   g1: '#1a1a2e', g2: '#16213e' },
  { city: 'Lisbon',    country: 'Portugal',    code: 'PT', gems: 31, tag: 'Sun & History',       g1: '#2d1b69', g2: '#11998e' },
  { city: 'Prague',    country: 'Czech Republic', code: 'CZ', gems: 28, tag: 'Gothic & Beer',    g1: '#0f2027', g2: '#203a43' },
  { city: 'Vienna',    country: 'Austria',     code: 'AT', gems: 22, tag: 'Music & Coffee',      g1: '#005c97', g2: '#363795' },
  { city: 'Barcelona', country: 'Spain',       code: 'ES', gems: 35, tag: 'Art & Beach',         g1: '#4a00e0', g2: '#8e2de2' },
  { city: 'Budapest',  country: 'Hungary',     code: 'HU', gems: 27, tag: 'Baths & Ruin Bars',   g1: '#6a1a4c', g2: '#c06c84' },
  { city: 'Berlin',    country: 'Germany',     code: 'DE', gems: 40, tag: 'Underground & Art',   g1: '#232526', g2: '#414345' },
  { city: 'Rome',      country: 'Italy',       code: 'IT', gems: 33, tag: 'Ancient & Food',      g1: '#7b2d00', g2: '#c45e00' },
  { city: 'Copenhagen',country: 'Denmark',     code: 'DK', gems: 19, tag: 'Design & Hygge',      g1: '#0d324d', g2: '#7f5a83' },
  { city: 'Tokyo',     country: 'Japan',       code: 'JP', gems: 48, tag: 'Chaos & Calm',        g1: '#0f0c29', g2: '#302b63' },
  { city: 'Kyoto',     country: 'Japan',       code: 'JP', gems: 29, tag: 'Temples & Zen',       g1: '#134e5e', g2: '#71b280' },
  { city: 'Porto',     country: 'Portugal',    code: 'PT', gems: 21, tag: 'Wine & Tiles',        g1: '#c0392b', g2: '#f39c12', isNew: true },
];

function CityCard({ city, country, code, gems, tag, g1, g2, isNew }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/explore/${encodeURIComponent(city.toLowerCase())}`}
      style={{ textDecoration: 'none', display: 'block' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        borderRadius: 16, overflow: 'hidden',
        border: `1px solid ${hovered ? 'rgba(245,158,11,0.25)' : 'var(--border)'}`,
        background: 'var(--card)',
        transition: 'transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 36px rgba(0,0,0,0.5)' : 'none',
        cursor: 'pointer',
      }}>
        {/* Gradient banner */}
        <div style={{
          height: 120,
          background: `linear-gradient(135deg, ${g1}, ${g2})`,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          padding: '12px 14px', position: 'relative', overflow: 'hidden',
        }}>
          {/* Country code watermark */}
          <span style={{
            fontSize: '2rem', fontWeight: 800, color: 'rgba(255,255,255,0.18)',
            letterSpacing: '-0.02em', lineHeight: 1, userSelect: 'none',
          }}>{code}</span>

          {/* Gems badge */}
          <span style={{
            background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', fontSize: '0.65rem', fontWeight: 700,
            padding: '3px 9px', borderRadius: 20,
          }}>{gems} gems</span>

          {isNew && (
            <span style={{
              position: 'absolute', bottom: 10, left: 14,
              fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.05em',
              background: 'var(--teal)', color: '#000', borderRadius: 20, padding: '2px 7px',
            }}>NEW</span>
          )}

          {/* Hover overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.18s ease',
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>Explore →</span>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '14px 16px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 2, color: 'var(--text-primary)' }}>{city}</h3>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 10 }}>{country}</p>
          <span style={{
            display: 'inline-block', padding: '3px 10px', borderRadius: 20,
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
            color: 'var(--text-secondary)', fontSize: '0.68rem', fontWeight: 500,
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

      <main style={{ flex: 1, minWidth: 0, padding: '40px 48px', overflowY: 'auto' }}>
        <div style={{ maxWidth: 1100 }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>Explore</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Click any city to browse hidden gems — no account needed
            </p>
          </div>

          {/* Search hint */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px',
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 12, marginBottom: 32,
            color: 'var(--text-muted)', fontSize: '0.85rem',
          }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0, opacity: 0.5 }}>
              <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
            Search coming soon — browse destinations below or{' '}
            <Link href="/trips/new" style={{ color: 'var(--accent)', fontWeight: 500 }}>create a trip</Link>
            {' '}for any city worldwide
          </div>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16, marginBottom: 40,
          }}>
            {FEATURED.map(dest => <CityCard key={dest.city} {...dest} />)}
          </div>

          {/* CTA */}
          <div style={{
            padding: '28px 32px',
            background: 'var(--card)',
            border: '1px solid rgba(245,158,11,0.15)',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
          }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>
                Don't see your city?
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Venture works for any city worldwide. Start a trip and our AI will research it.
              </p>
            </div>
            <Link href="/trips/new" style={{
              flexShrink: 0, padding: '10px 22px',
              background: 'var(--accent)', color: '#000',
              borderRadius: 10, fontWeight: 700, fontSize: '0.875rem',
              textDecoration: 'none', whiteSpace: 'nowrap',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
            >
              Plan a custom trip →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
