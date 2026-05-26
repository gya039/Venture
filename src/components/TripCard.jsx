'use client';

import Link from 'next/link';

function flagEmoji(code) {
  if (!code || code.length !== 2) return '🌍';
  return [...code.toUpperCase()].map(c =>
    String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0))
  ).join('');
}

function fmtDate(d) {
  if (!d) return '';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr + 'T00:00:00') - new Date()) / 86400000);
  return diff;
}

// Deterministic gradient per city name
const GRADIENTS = [
  ['#f59e0b', '#ef4444'],
  ['#3b82f6', '#8b5cf6'],
  ['#10b981', '#3b82f6'],
  ['#f59e0b', '#f97316'],
  ['#ec4899', '#8b5cf6'],
  ['#14b8a6', '#22c55e'],
];
function cityGradient(city = '') {
  const i = city.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % GRADIENTS.length;
  return GRADIENTS[i];
}

export default function TripCard({ trip }) {
  const { id, name, isMultiCity, destinations = [] } = trip;
  const first = destinations[0];
  const last  = destinations[destinations.length - 1];
  if (!first) return null;

  const displayName = name ?? (isMultiCity
    ? destinations.map(d => d.city).join(' · ')
    : first.city);

  const [c1, c2] = cityGradient(first.city);
  const days = daysUntil(first.startDate);
  const researchDone = destinations.every(d => d.researchDone);
  const tripDays = first.startDate && first.endDate
    ? Math.max(1, Math.round((new Date(last.endDate) - new Date(first.startDate)) / 86400000) + 1)
    : null;

  return (
    <Link href={`/trips/${id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        overflow: 'hidden',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.4)`;
          e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = 'var(--border)';
        }}
      >
        {/* Gradient banner */}
        <div style={{
          height: 80,
          background: `linear-gradient(135deg, ${c1}22, ${c2}33)`,
          borderBottom: `1px solid ${c1}22`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 18px',
          gap: 14,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Big flag/emoji watermark */}
          <div style={{
            position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
            fontSize: '4rem', opacity: 0.18, userSelect: 'none',
          }}>
            {isMultiCity ? '✈️' : flagEmoji(first.countryCode)}
          </div>

          {/* Flag icon */}
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: `linear-gradient(135deg, ${c1}, ${c2})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', flexShrink: 0,
            boxShadow: `0 4px 12px ${c1}44`,
          }}>
            {isMultiCity ? '✈️' : flagEmoji(first.countryCode)}
          </div>

          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
              {displayName}
            </h2>
            {isMultiCity && (
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', marginTop: 1 }}>
                {destinations.map(d => d.city).join(' → ')}
              </p>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            {/* Date range */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {fmtDate(first.startDate)} – {fmtDate(last.endDate)}
              </span>
              {tripDays && (
                <span style={{
                  fontSize: '0.68rem', color: 'var(--text-muted)',
                  background: 'var(--bg)', border: '1px solid var(--border)',
                  borderRadius: 20, padding: '1px 7px',
                }}>
                  {tripDays}d
                </span>
              )}
            </div>

            {/* Countdown */}
            {days !== null && (
              <span style={{
                fontSize: '0.72rem', fontWeight: 600,
                color: days <= 7 ? '#ef4444' : days <= 30 ? '#f59e0b' : 'var(--text-muted)',
                background: days <= 7 ? 'rgba(239,68,68,0.1)' : days <= 30 ? 'rgba(245,158,11,0.1)' : 'var(--bg)',
                border: `1px solid ${days <= 7 ? 'rgba(239,68,68,0.2)' : days <= 30 ? 'rgba(245,158,11,0.2)' : 'var(--border)'}`,
                borderRadius: 20, padding: '2px 8px',
              }}>
                {days < 0 ? 'Ongoing' : days === 0 ? 'Today!' : `${days}d away`}
              </span>
            )}
          </div>

          {/* Destination pills (multi-city) */}
          {isMultiCity && destinations.length > 1 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {destinations.map(d => (
                <span key={d.id} style={{
                  fontSize: '0.7rem', padding: '3px 9px',
                  background: 'var(--bg)', border: '1px solid var(--border)',
                  borderRadius: 20, color: 'var(--text-secondary)',
                }}>
                  {flagEmoji(d.countryCode)} {d.city}
                </span>
              ))}
            </div>
          )}

          {/* Status row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              fontSize: '0.72rem', fontWeight: 500,
              color: researchDone ? '#22c55e' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              {researchDone ? '✓ Research done' : '○ Research pending'}
            </span>
            <span style={{
              fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 3,
            }}>
              Open →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
