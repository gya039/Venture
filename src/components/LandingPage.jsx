'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { HIDDENNESS_LEVELS, getHiddennessLevel } from '@/constants/hiddenness';

/* ── Data ─────────────────────────────────────────────────────────────────── */
const CITIES = ['Amsterdam', 'Prague', 'Barcelona', 'Lisbon', 'Vienna', 'Rome', 'Budapest', 'Tokyo', 'Berlin', 'Kyoto'];

const DEMO_SPOTS = [
  {
    city: 'Amsterdam', countryCode: 'NL',
    name: 'NDSM Wharf',
    score: 8,
    description: 'A former shipyard turned creative arts district north of the IJ river. Home to street art, indie bars, a weekend flea market and the best skyline views in the city.',
    whyHidden: 'Requires a free 15-minute ferry from Central Station — most tourists never bother.',
    interests: ['art', 'nightlife', 'photography'],
    price: null,
  },
  {
    city: 'Prague', countryCode: 'CZ',
    name: 'Žižkov TV Tower',
    score: 6,
    description: 'The most bizarre building in Prague — a communist-era transmission tower covered in giant crawling babies. Has a rotating restaurant and views that blow Charles Bridge out of the water.',
    whyHidden: "It's deliberately ugly. Guidebooks skip it. That's why it's always empty.",
    interests: ['photography', 'art', 'food'],
    price: 10,
  },
  {
    city: 'Rome', countryCode: 'IT',
    name: 'Quartiere Coppedè',
    score: 9,
    description: 'A tiny Art Nouveau neighbourhood squeezed between embassy buildings. Fairy-tale architecture, spider-web gates and almost zero tourists — 5 minutes from Piazza Buenos Aires.',
    whyHidden: "Hidden between major roads with no signage. Even many Romans don't know it exists.",
    interests: ['art', 'photography', 'landmarks'],
    price: null,
  },
  {
    city: 'Lisbon', countryCode: 'PT',
    name: 'LX Factory',
    score: 7,
    description: "A 19th-century industrial complex reinvented as Lisbon's coolest creative hub. Sunday market, independent restaurants, a bookshop under a crane, and almost no tour buses.",
    whyHidden: "It's technically 'in' the guidebooks, but always buried on page 9 under Belém.",
    interests: ['markets', 'food', 'art'],
    price: null,
  },
];

const TICKER_CITIES = [
  'Amsterdam', 'Prague', 'Barcelona', 'Lisbon', 'Vienna', 'Rome',
  'Budapest', 'Berlin', 'Tokyo', 'Kyoto', 'Porto', 'Seville',
  'Dubrovnik', 'Tallinn', 'Ljubljana', 'Ghent', 'Kotor', 'Valletta',
  'Tbilisi', 'Sarajevo', 'Plovdiv', 'Nicosia', 'Chiang Mai', 'Oaxaca',
];

const INSIGHTS = [
  { stat: '83%', detail: 'of travellers say their best travel memory was something they stumbled onto by accident.' },
  { stat: '4.2h', detail: 'is the average time spent researching a trip on TripAdvisor — finding the same 10 places everyone else finds.' },
  { stat: '$0.01', detail: 'is what it costs to research an entire city with Venture. Reddit did it for free. We just organised it.' },
  { stat: '3–5', detail: "pages deep into a Reddit thread is where you'll find the spots that actually make a trip unforgettable." },
];

const HOW_IT_WORKS = [
  { step: '01', icon: '✈️', title: 'Add your trip', body: 'Drop in your city, dates and what you\'re into — hiking, food, nightlife, whatever. Multi-city trips welcome.' },
  { step: '02', icon: '🔍', title: 'AI does the research', body: 'We scan Reddit threads, travel blogs and local forums. Every spot gets a Hiddenness Score from 1–10. Takes ~20 seconds.' },
  { step: '03', icon: '🗺️', title: 'Plan your days', body: 'Drag spots into your day planner, see them on a map, and find out if a city pass actually saves you money.' },
];

/* ── Flag emoji ──────────────────────────────────────────────────────────── */
function flag(code) {
  if (!code || code.length !== 2) return '🌍';
  return [...code.toUpperCase()].map(c => String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0))).join('');
}

/* ── Animated section wrapper (fade-in-up on scroll) ─────────────────────── */
function Section({ children, style = {}, delay = 0 }) {
  const ref  = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el  = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity:          vis ? 1 : 0,
        transform:        vis ? 'translateY(0)' : 'translateY(28px)',
        transition:       `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Demo SpotCard (self-contained for landing, no Firestore deps) ─────────── */
function DemoSpotCard({ spot, index }) {
  const [flipped, setFlipped] = useState(false);
  const level = getHiddennessLevel(spot.score);
  const pct   = Math.round((spot.score / 10) * 100);

  return (
    <div
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped(f => !f)}
      style={{
        background:    'var(--card)',
        borderRadius:  '14px',
        border:        '1px solid var(--border)',
        borderLeft:    `3px solid ${level.color}`,
        padding:       '18px',
        cursor:        'pointer',
        minWidth:      '280px',
        maxWidth:      '320px',
        flexShrink:    0,
        position:      'relative',
        overflow:      'hidden',
        transition:    'transform 0.2s ease, box-shadow 0.2s ease',
        transform:     flipped ? 'translateY(-4px)' : 'none',
        boxShadow:     flipped ? `0 12px 40px ${level.color}25` : 'none',
        animation:     `fadeInUp 0.5s ease ${index * 120}ms both`,
      }}
    >
      {/* City badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <span style={{ fontSize: '0.85rem' }}>{flag(spot.countryCode)}</span>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>{spot.city}</span>
      </div>

      {/* Name */}
      <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '10px', lineHeight: 1.3 }}>{spot.name}</p>

      {/* Hiddenness */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: level.color, boxShadow: `0 0 6px ${level.color}80`, flexShrink: 0 }} />
        <span style={{ color: level.color, fontSize: '0.75rem', fontWeight: 600 }}>{level.label}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{spot.score}/10</span>
      </div>
      <div style={{ height: 3, borderRadius: 2, background: 'var(--border)', marginBottom: '12px' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 2, background: level.color, transition: 'width 0.8s ease' }} />
      </div>

      {/* Body text — flips between description & why hidden */}
      <p style={{
        fontSize:    '0.8rem',
        color:       flipped ? 'var(--accent)' : 'var(--text-secondary)',
        lineHeight:  1.6,
        transition:  'color 0.3s ease',
        minHeight:   '72px',
      }}>
        {flipped
          ? `💡 ${spot.whyHidden}`
          : spot.description}
      </p>

      {/* Price */}
      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          {flipped ? 'hover to flip back' : 'hover to see why it\'s hidden'}
        </span>
        {spot.price != null
          ? <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>€{spot.price}/pp</span>
          : <span style={{ fontSize: '0.75rem', color: 'var(--green)' }}>Free</span>
        }
      </div>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [cityIdx, setCityIdx]   = useState(0);
  const [fading,  setFading]    = useState(false);

  /* City cycler */
  useEffect(() => {
    const iv = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCityIdx(i => (i + 1) % CITIES.length);
        setFading(false);
      }, 300);
    }, 2200);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text-primary)', overflowX: 'hidden' }}>

      {/* ════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════ */}
      <section style={{ position: 'relative', minHeight: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Animated gradient blobs */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        }}>
          <div style={{
            position: 'absolute', width: '70vw', height: '70vw', maxWidth: 600, maxHeight: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)',
            top: '-15vw', right: '-15vw',
            animation: 'float 10s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', width: '50vw', height: '50vw', maxWidth: 440, maxHeight: 440,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(251,191,36,0.10) 0%, transparent 70%)',
            bottom: '5vh', left: '-10vw',
            animation: 'floatReverse 12s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', width: '30vw', height: '30vw', maxWidth: 280, maxHeight: 280,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
            top: '40vh', left: '20vw',
            animation: 'float 15s ease-in-out infinite 3s',
          }} />
        </div>

        {/* Nav */}
        <nav style={{
          position:       'relative', zIndex: 10,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '20px 24px',
          paddingTop:     'calc(20px + env(safe-area-inset-top))',
        }}>
          <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.03em' }}>Venture</span>
          <Link href="/auth" style={{
            padding:      '8px 18px',
            borderRadius: '8px',
            border:       '1px solid var(--border)',
            color:        'var(--text-secondary)',
            fontSize:     '0.85rem',
            textDecoration: 'none',
            transition:   'border-color 0.15s, color 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            Sign in
          </Link>
        </nav>

        {/* Hero content */}
        <div style={{
          flex:           1,
          display:        'flex',
          flexDirection:  'column',
          justifyContent: 'center',
          padding:        '0 24px 60px',
          position:       'relative', zIndex: 10,
          maxWidth:       720,
          animation:      'fadeInUp 0.8s ease both',
        }}>
          {/* Eyebrow */}
          <div style={{
            display:      'inline-flex',
            alignItems:   'center',
            gap:          '6px',
            padding:      '5px 12px',
            borderRadius: '20px',
            border:       '1px solid rgba(245,158,11,0.3)',
            background:   'rgba(245,158,11,0.08)',
            marginBottom: '24px',
            width:        'fit-content',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.05em' }}>
              AI-powered travel research
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize:      'clamp(2.4rem, 8vw, 4.5rem)',
            fontWeight:    800,
            lineHeight:    1.1,
            letterSpacing: '-0.03em',
            marginBottom:  '20px',
          }}>
            The places most<br />
            <span style={{ color: 'var(--accent)' }}>tourists never find.</span>
          </h1>

          {/* City cycler */}
          <p style={{
            fontSize:     'clamp(1rem, 3.5vw, 1.3rem)',
            color:        'var(--text-secondary)',
            lineHeight:   1.6,
            marginBottom: '36px',
            maxWidth:     520,
          }}>
            Hidden gems in{' '}
            <span style={{
              color:      'var(--text-primary)',
              fontWeight: 600,
              display:    'inline-block',
              opacity:    fading ? 0 : 1,
              transform:  fading ? 'translateY(6px)' : 'translateY(0)',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              minWidth:   '100px',
            }}>
              {CITIES[cityIdx]}
            </span>
            {' '}— and every city you travel to.
            <br />
            Sourced from Reddit, ranked by how hidden they actually are.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/auth" style={{
              padding:        '14px 28px',
              background:     'var(--accent)',
              color:          '#000',
              borderRadius:   '10px',
              fontWeight:     700,
              fontSize:       '0.95rem',
              textDecoration: 'none',
              transition:     'background 0.15s, transform 0.15s',
              display:        'inline-block',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'none'; }}
            >
              Start exploring free →
            </Link>
            <a href="#how-it-works" style={{
              padding:        '14px 28px',
              background:     'transparent',
              color:          'var(--text-secondary)',
              border:         '1px solid var(--border)',
              borderRadius:   '10px',
              fontWeight:     500,
              fontSize:       '0.95rem',
              textDecoration: 'none',
              transition:     'border-color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position:  'absolute', bottom: '24px', left: '50%',
          transform: 'translateX(-50%)',
          color:     'var(--text-muted)', fontSize: '0.75rem',
          display:   'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
          animation: 'fadeIn 1s ease 1.5s both',
          zIndex:    10,
        }}>
          <span>scroll</span>
          <span style={{ animation: 'float 1.5s ease-in-out infinite', display: 'block' }}>↓</span>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          TRAVEL INSIGHTS
      ════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid var(--border)' }}>
        <Section>
          <p style={{
            fontSize:      '0.72rem',
            fontWeight:    600,
            color:         'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom:  '16px',
          }}>
            Travel insights
          </p>
          <h2 style={{
            fontSize:      'clamp(1.6rem, 5vw, 2.6rem)',
            fontWeight:    800,
            letterSpacing: '-0.02em',
            lineHeight:    1.2,
            marginBottom:  '48px',
            maxWidth:      600,
          }}>
            Everyone shows you<br />
            <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>the same 10 places.</span>
          </h2>
        </Section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {INSIGHTS.map((ins, i) => (
            <Section key={i} delay={i * 80}>
              <div style={{
                background:    'var(--card)',
                borderRadius:  '14px',
                border:        '1px solid var(--border)',
                padding:       '24px',
                height:        '100%',
              }}>
                <p style={{
                  fontSize:      'clamp(2rem, 6vw, 3rem)',
                  fontWeight:    800,
                  color:         'var(--accent)',
                  letterSpacing: '-0.03em',
                  lineHeight:    1,
                  marginBottom:  '12px',
                }}>
                  {ins.stat}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {ins.detail}
                </p>
              </div>
            </Section>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding: '80px 24px', borderTop: '1px solid var(--border)' }}>
        <Section>
          <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
            How it works
          </p>
          <h2 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '48px', maxWidth: 500 }}>
            From city name to hidden gems in 20 seconds.
          </h2>
        </Section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {HOW_IT_WORKS.map((step, i) => (
            <Section key={i} delay={i * 100}>
              <div style={{
                background:   'var(--card)',
                borderRadius: '14px',
                border:       '1px solid var(--border)',
                padding:      '28px 24px',
                position:     'relative',
                overflow:     'hidden',
              }}>
                {/* Step number watermark */}
                <span style={{
                  position:   'absolute',
                  top:        '-8px', right: '16px',
                  fontSize:   '5rem',
                  fontWeight: 900,
                  color:      'rgba(245,158,11,0.06)',
                  lineHeight: 1,
                  userSelect: 'none',
                }}>
                  {step.step}
                </span>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '16px' }}>{step.icon}</span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px' }}>{step.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{step.body}</p>
              </div>
            </Section>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          DEMO SPOT CARDS
      ════════════════════════════════════════════ */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--border)' }}>
        <Section style={{ padding: '0 24px' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
            Real examples
          </p>
          <h2 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Spots Venture would find for you.
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '36px' }}>
            Hover a card to reveal why most tourists miss it.
          </p>
        </Section>

        {/* Horizontally scrollable card row */}
        <div style={{
          display:        'flex',
          gap:            '16px',
          overflowX:      'auto',
          padding:        '8px 24px 24px',
          scrollbarWidth: 'none',
        }}>
          {DEMO_SPOTS.map((spot, i) => (
            <DemoSpotCard key={i} spot={spot} index={i} />
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          HIDDENNESS SCALE
      ════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid var(--border)' }}>
        <Section>
          <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
            The Hiddenness Scale
          </p>
          <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '10px' }}>
            Every spot scored 1–10.
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '40px', maxWidth: 480, lineHeight: 1.6 }}>
            Not just "is it good" — but how discovered it already is. Tourist traps included, honestly labelled.
          </p>
        </Section>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: 540 }}>
          {HIDDENNESS_LEVELS.map((level, i) => (
            <Section key={i} delay={i * 60}>
              <div style={{
                display:      'flex',
                alignItems:   'center',
                gap:          '14px',
                background:   'var(--card)',
                borderRadius: '10px',
                border:       '1px solid var(--border)',
                borderLeft:   `3px solid ${level.color}`,
                padding:      '14px 16px',
              }}>
                <span style={{
                  width:     10, height: 10, borderRadius: '50%',
                  background: level.color,
                  flexShrink: 0,
                  boxShadow:  `0 0 8px ${level.color}60`,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem', color: level.color }}>{level.label}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{level.min}–{level.max}/10</span>
                  </div>
                  <div style={{ height: 3, borderRadius: 2, background: 'var(--border)' }}>
                    <div style={{
                      width:      `${Math.round((level.max / 10) * 100)}%`,
                      height:     '100%',
                      borderRadius: 2,
                      background: level.color,
                      opacity:    0.8,
                    }} />
                  </div>
                </div>
              </div>
            </Section>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CITY TICKER
      ════════════════════════════════════════════ */}
      <section style={{ padding: '60px 0', borderTop: '1px solid var(--border)', overflow: 'hidden' }}>
        <Section style={{ padding: '0 24px', marginBottom: '28px' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Works everywhere you want to go
          </p>
        </Section>

        {/* Ticker row */}
        <div style={{ overflow: 'hidden', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
          <div style={{
            display:   'flex',
            width:     'max-content',
            animation: 'marquee 30s linear infinite',
          }}>
            {[...TICKER_CITIES, ...TICKER_CITIES].map((city, i) => (
              <span key={i} style={{
                padding:    '8px 24px',
                margin:     '0 2px',
                background: i % 3 === 0 ? 'rgba(245,158,11,0.08)' : 'var(--card)',
                border:     '1px solid var(--border)',
                borderRadius: '6px',
                fontSize:   '0.85rem',
                color:      i % 3 === 0 ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: i % 3 === 0 ? 600 : 400,
                whiteSpace: 'nowrap',
              }}>
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════ */}
      <section style={{ padding: '100px 24px', borderTop: '1px solid var(--border)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div aria-hidden style={{
          position:  'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(245,158,11,0.08) 0%, transparent 70%)',
        }} />
        <Section style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize:      'clamp(1.8rem, 6vw, 3.2rem)',
            fontWeight:    800,
            letterSpacing: '-0.03em',
            lineHeight:    1.15,
            marginBottom:  '16px',
          }}>
            Ready to travel<br />
            <span style={{ color: 'var(--accent)' }}>differently?</span>
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '36px', maxWidth: 400, margin: '0 auto 36px' }}>
            Free to use. Takes 30 seconds to add your first trip. Research costs about the price of a coffee — for your whole trip.
          </p>
          <Link href="/auth" style={{
            display:        'inline-block',
            padding:        '16px 36px',
            background:     'var(--accent)',
            color:          '#000',
            borderRadius:   '12px',
            fontWeight:     800,
            fontSize:       '1.05rem',
            textDecoration: 'none',
            letterSpacing:  '-0.01em',
            transition:     'background 0.15s, transform 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'none'; }}
          >
            Start exploring free →
          </Link>
          <p style={{ marginTop: '16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            No credit card. No signup fees. Just better trips.
          </p>
        </Section>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop:  '1px solid var(--border)',
        padding:    '28px 24px',
        display:    'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap:   'wrap',
        gap:        '12px',
      }}>
        <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em' }}>Venture</span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Hidden gems travel planner · Built with ❤️</span>
      </footer>

    </div>
  );
}
