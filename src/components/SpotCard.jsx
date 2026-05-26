'use client';

import Link from 'next/link';
import { getHiddennessLevel } from '@/constants/hiddenness';
import { INTERESTS } from '@/constants/interests';

/**
 * SpotCard — compact row in the trip Research list.
 *
 * Props:
 *   spot      {object}   Firestore spot doc
 *   destId    {string}
 *   tripId    {string}
 *   active    {boolean}  Expands description / detail
 *   onSelect  {fn}       Called when the row is clicked
 */
export default function SpotCard({ spot, destId, tripId, active = false, onSelect }) {
  const level = getHiddennessLevel(spot?.hiddennessScore ?? 1);
  const pct   = Math.round(((spot?.hiddennessScore ?? 1) / 10) * 100);

  const href = `/spots/${spot.id}?city=${encodeURIComponent(spot.city ?? '')}&destId=${destId ?? ''}&tripId=${tripId ?? ''}`;

  const interestIcons = (spot.interests ?? [])
    .map((id) => INTERESTS.find((i) => i.id === id))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div
      onClick={onSelect}
      style={{
        background:   active ? 'rgba(212,168,75,0.05)' : 'transparent',
        borderLeft:   `3px solid ${active ? level.color : 'transparent'}`,
        borderBottom: '1px solid var(--border)',
        padding:      active ? '12px 16px 14px 13px' : '10px 16px 10px 13px',
        cursor:       'pointer',
        transition:   'background 0.12s',
        userSelect:   'none',
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--card-hover)'; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      {/* Row 1: name + price + chevron */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
        <p style={{
          fontWeight:   600,
          fontSize:     '0.875rem',
          color:        'var(--text-primary)',
          lineHeight:   1.3,
          flex:         1,
          overflow:     'hidden',
          textOverflow: 'ellipsis',
          whiteSpace:   'nowrap',
        }}>
          {spot.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {spot.entryPrice != null ? (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
              €{spot.entryPrice}/pp
            </span>
          ) : (
            <span style={{ fontSize: '0.72rem', color: 'var(--green)', fontWeight: 600 }}>Free</span>
          )}
          <span style={{
            color:      active ? level.color : 'var(--text-muted)',
            fontSize:   '0.8rem',
            lineHeight: 1,
            display:    'inline-block',
            transform:  active ? 'rotate(90deg)' : 'none',
            transition: 'transform 0.15s, color 0.15s',
          }}>›</span>
        </div>
      </div>

      {/* Row 2: hiddenness dot + label + bar + interest icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{
          width:        6,
          height:       6,
          borderRadius: '50%',
          background:   level.color,
          flexShrink:   0,
          boxShadow:    active ? `0 0 5px ${level.color}80` : 'none',
        }} />
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: level.color, whiteSpace: 'nowrap' }}>
          {level.label}
        </span>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
          {spot.hiddennessScore}/10
        </span>
        <div style={{ width: 48, height: 2, background: 'var(--border)', borderRadius: 1, overflow: 'hidden', flexShrink: 0 }}>
          <div style={{ width: `${pct}%`, height: '100%', background: level.color, borderRadius: 1 }} />
        </div>
        {interestIcons.length > 0 && (
          <div style={{ display: 'flex', gap: 2, marginLeft: 'auto' }}>
            {interestIcons.map((i) => (
              <span key={i.id} title={i.label} style={{ fontSize: '0.7rem' }}>{i.icon}</span>
            ))}
          </div>
        )}
      </div>

      {/* Expanded panel */}
      {active && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
          {spot.description && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 7 }}>
              {spot.description}
            </p>
          )}
          {spot.whyHidden && (
            <p style={{
              fontSize:    '0.75rem',
              color:       'var(--text-muted)',
              lineHeight:  1.55,
              fontStyle:   'italic',
              marginBottom: 8,
            }}>
              💡 {spot.whyHidden}
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
            {spot.address && (
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                📍 {spot.address}
              </span>
            )}
            <Link
              href={href}
              onClick={(e) => e.stopPropagation()}
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                gap:            3,
                fontSize:       '0.78rem',
                fontWeight:     600,
                color:          'var(--accent)',
                textDecoration: 'none',
                marginLeft:     'auto',
              }}
            >
              Full details →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
