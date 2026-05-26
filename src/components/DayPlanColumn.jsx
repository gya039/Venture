'use client';

import Link from 'next/link';
import { getHiddennessLevel } from '@/constants/hiddenness';

/* ── Helpers ──────────────────────────────────────────────────────────────── */
function fmtDate(iso) {
  if (!iso) return '';
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short',
  });
}

const TIME_ICON = { morning: '🌅', afternoon: '☀️', evening: '🌙' };
const TIME_LABEL = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' };

/* ── Day spot row ─────────────────────────────────────────────────────────── */
function DaySpotRow({ spot, tripId }) {
  const level = getHiddennessLevel(spot.hiddennessScore ?? 1);
  const href  = `/spots/${spot.id}?city=${encodeURIComponent(spot.city ?? '')}&tripId=${tripId ?? ''}`;

  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        display:      'flex',
        alignItems:   'center',
        gap:          '12px',
        padding:      '10px 14px',
        background:   'var(--bg)',
        borderRadius: '8px',
        border:       '1px solid var(--border)',
        transition:   'background 0.15s',
      }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--card-hover)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg)')}
      >
        {/* Time badge */}
        <div style={{
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          gap:            '2px',
          flexShrink:     0,
          width:          '42px',
        }}>
          <span style={{ fontSize: '1rem' }}>{TIME_ICON[spot.timeOfDay] ?? '📍'}</span>
          <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {TIME_LABEL[spot.timeOfDay] ?? spot.timeOfDay}
          </span>
        </div>

        {/* Colour dot */}
        <span style={{
          width:     8, height: 8, borderRadius: '50%',
          background: level.color,
          flexShrink: 0,
          boxShadow:  `0 0 5px ${level.color}60`,
        }} />

        {/* Spot info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize:     '0.85rem',
            fontWeight:   600,
            color:        'var(--text-primary)',
            overflow:     'hidden',
            textOverflow: 'ellipsis',
            whiteSpace:   'nowrap',
          }}>
            {spot.name}
          </p>
          <p style={{ fontSize: '0.72rem', color: level.color, fontWeight: 500, marginTop: '1px' }}>
            {level.label}
          </p>
        </div>

        {/* Price */}
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          {spot.entryPrice != null ? (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>€{spot.entryPrice}</span>
          ) : (
            <span style={{ fontSize: '0.72rem', color: 'var(--green)' }}>Free</span>
          )}
        </div>

        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', flexShrink: 0 }}>›</span>
      </div>
    </Link>
  );
}

/* ── DayPlanColumn ────────────────────────────────────────────────────────── */
export default function DayPlanColumn({ day, tripId, onAddSpot }) {
  const dayLabel = fmtDate(day.planDate);

  return (
    <div style={{
      background:    'var(--card)',
      borderRadius:  '12px',
      border:        '1px solid var(--border)',
      overflow:      'hidden',
    }}>
      {/* Day header */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        '12px 16px',
        borderBottom:   '1px solid var(--border)',
        background:     'var(--card)',
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Day {day.dayNumber}
          </span>
          {dayLabel && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
              {dayLabel}
            </span>
          )}
        </div>
        {day.totalCost > 0 && (
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            ~€{day.totalCost}/pp
          </span>
        )}
      </div>

      {/* Spots */}
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {day.spots.length === 0 ? (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
            No spots yet
          </p>
        ) : (
          day.spots.map(spot => (
            <DaySpotRow key={spot.dayPlanSpotId} spot={spot} tripId={tripId} />
          ))
        )}

        {/* Add spot button */}
        <button
          onClick={() => onAddSpot?.(day.id, day.dayNumber)}
          style={{
            width:          '100%',
            padding:        '9px',
            marginTop:      '4px',
            background:     'transparent',
            border:         '1px dashed var(--border)',
            borderRadius:   '8px',
            color:          'var(--text-muted)',
            fontSize:       '0.78rem',
            cursor:         'pointer',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            '5px',
            transition:     'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <span>+</span> Add spot to Day {day.dayNumber}
        </button>
      </div>
    </div>
  );
}
