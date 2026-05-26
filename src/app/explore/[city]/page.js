'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { getCachedSpots } from '@/lib/db';
import { useAuth } from '@/hooks/useAuth';

const CITY_META = {
  amsterdam:   { country: 'Netherlands', tagline: 'Canals, culture and the streets tourists miss', gradient: ['#667eea', '#764ba2'], emoji: '🇳🇱' },
  lisbon:      { country: 'Portugal',    tagline: 'Sun-soaked tiles and Atlantic soul',            gradient: ['#f093fb', '#f5576c'], emoji: '🇵🇹' },
  prague:      { country: 'Czech Republic', tagline: 'Gothic spires and hidden courtyards',        gradient: ['#4facfe', '#00f2fe'], emoji: '🇨🇿' },
  vienna:      { country: 'Austria',     tagline: 'Imperial grandeur beyond the tourist trail',    gradient: ['#43e97b', '#38f9d7'], emoji: '🇦🇹' },
  barcelona:   { country: 'Spain',       tagline: 'Architecture, beach and a city that never sleeps', gradient: ['#fa709a', '#fee140'], emoji: '🇪🇸' },
  budapest:    { country: 'Hungary',     tagline: 'Thermal baths, ruin bars and the Danube',       gradient: ['#a18cd1', '#fbc2eb'], emoji: '🇭🇺' },
  berlin:      { country: 'Germany',     tagline: 'Underground culture and reinvented spaces',     gradient: ['#fccb90', '#d57eeb'], emoji: '🇩🇪' },
  rome:        { country: 'Italy',       tagline: 'Two thousand years hiding in plain sight',      gradient: ['#f6d365', '#fda085'], emoji: '🇮🇹' },
  copenhagen:  { country: 'Denmark',     tagline: 'Hygge, design and Nordic calm',                 gradient: ['#89f7fe', '#66a6ff'], emoji: '🇩🇰' },
  tokyo:       { country: 'Japan',       tagline: 'Infinite layers of chaos and tranquility',      gradient: ['#ff9a9e', '#fecfef'], emoji: '🇯🇵' },
  kyoto:       { country: 'Japan',       tagline: 'Bamboo groves, temples and forgotten gardens',  gradient: ['#a1c4fd', '#c2e9fb'], emoji: '🇯🇵' },
  porto:       { country: 'Portugal',    tagline: 'Port wine, azulejos and Atlantic light',        gradient: ['#ffecd2', '#fcb69f'], emoji: '🇵🇹' },
};

const CATEGORIES = ['All', 'Food & Drink', 'Art & Culture', 'Nature', 'Nightlife', 'History', 'Shopping', 'Hidden'];

function GemCard({ spot }) {
  const score = spot.hiddennessScore ?? 0;
  const color = score >= 80 ? '#2D6A4F' : score >= 60 ? '#D4A84B' : '#2563EB';
  const label = spot.hiddennessLabel ?? (score >= 80 ? 'Very Hidden' : score >= 60 ? 'Off-beat' : 'Local favourite');

  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: '20px',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      transition: 'box-shadow 0.15s, transform 0.15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.3 }}>{spot.name}</h3>
        <span style={{
          flexShrink: 0, fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px',
          borderRadius: 20, background: `${color}15`, color, border: `1px solid ${color}30`,
          whiteSpace: 'nowrap',
        }}>{label}</span>
      </div>
      {spot.description && (
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {spot.description}
        </p>
      )}
      {spot.address && (
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {spot.address}
        </p>
      )}
      {spot.entryPrice != null && (
        <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary)' }}>
          {spot.entryPrice === 0 ? 'Free entry' : `~${spot.currency ?? '€'}${spot.entryPrice}`}
        </p>
      )}
    </div>
  );
}

export default function CityDetailPage() {
  const { city: citySlug } = useParams();
  const { user } = useAuth();
  const cityKey = decodeURIComponent(citySlug ?? '').toLowerCase();
  const meta = CITY_META[cityKey] ?? {
    country: '', tagline: 'Hidden gems waiting to be discovered',
    gradient: ['#1B2B4B', '#2D4270'], emoji: '🌍',
  };
  const cityName = cityKey.charAt(0).toUpperCase() + cityKey.slice(1);

  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    if (!cityName) return;
    setLoading(true);
    getCachedSpots(cityName)
      .then(setSpots)
      .catch(() => setSpots([]))
      .finally(() => setLoading(false));
  }, [cityName]);

  const filtered = activeCategory === 'All'
    ? spots
    : spots.filter(s => (s.interests ?? []).some(i => i.toLowerCase().includes(activeCategory.toLowerCase())));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Hero */}
        <div style={{
          background: `linear-gradient(135deg, ${meta.gradient[0]}, ${meta.gradient[1]})`,
          padding: '60px 48px 48px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Link href="/explore" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem',
              marginBottom: 20, textDecoration: 'none',
            }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Explore
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <span style={{ fontSize: '3rem' }}>{meta.emoji}</span>
              <div>
                <h1 style={{ fontSize: '2.8rem', fontWeight: 700, color: '#fff', fontFamily: 'Fraunces, Georgia, serif', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  {cityName}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', marginTop: 4 }}>{meta.country}</p>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.05rem', maxWidth: 480, lineHeight: 1.6 }}>
              {meta.tagline}
            </p>
            {spots.length > 0 && (
              <div style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '6px 14px', backdropFilter: 'blur(8px)' }}>
                <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>✦ {spots.length} hidden gems found</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: '40px 48px', maxWidth: 1000 }}>
          {/* Category filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '7px 16px', borderRadius: 20,
                  border: `1px solid ${activeCategory === cat ? 'var(--primary)' : 'var(--border)'}`,
                  background: activeCategory === cat ? 'var(--primary)' : '#fff',
                  color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
                  fontSize: '0.82rem', fontWeight: activeCategory === cat ? 600 : 400,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gems grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{ height: 160, borderRadius: 14, background: 'var(--border)', animation: 'pulse 1.5s infinite', animationDelay: `${i*0.1}s` }} />
              ))}
            </div>
          ) : spots.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 24px' }}>
              <p style={{ fontSize: '2.5rem', marginBottom: 16 }}>🔍</p>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 8 }}>No gems cached yet</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 28, maxWidth: 360, margin: '0 auto 28px' }}>
                Start a trip to {cityName} and our AI will research hidden gems from Reddit, travel blogs, and local sources.
              </p>
              <Link href={`/trips/new?city=${encodeURIComponent(cityName)}`} style={{
                display: 'inline-block', padding: '12px 28px',
                background: 'var(--primary)', color: '#fff',
                borderRadius: 10, fontWeight: 600, fontSize: '0.9rem',
              }}>
                Plan a trip to {cityName} →
              </Link>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {(filtered.length > 0 ? filtered : spots).map(spot => (
                  <GemCard key={spot.id} spot={spot} />
                ))}
              </div>
              {filtered.length === 0 && activeCategory !== 'All' && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 32, fontSize: '0.9rem' }}>
                  No gems in this category yet.{' '}
                  <button onClick={() => setActiveCategory('All')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>Show all</button>
                </p>
              )}
            </>
          )}
        </div>

        {/* Sticky CTA */}
        <div style={{
          position: 'sticky', bottom: 0,
          background: 'rgba(250,249,246,0.95)', backdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--border)',
          padding: '16px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Ready to explore {cityName}?</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AI researches it in under a minute</p>
          </div>
          <Link href={`/trips/new?city=${encodeURIComponent(cityName)}`} style={{
            padding: '11px 24px', background: 'var(--primary)', color: '#fff',
            borderRadius: 10, fontWeight: 700, fontSize: '0.875rem',
            textDecoration: 'none', whiteSpace: 'nowrap',
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
          >
            Plan a trip here →
          </Link>
        </div>
      </div>
    </div>
  );
}
