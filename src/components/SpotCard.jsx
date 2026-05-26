'use client';

import Link from 'next/link';
import HiddennessBadge from './HiddennessBadge';
import { getHiddennessLevel } from '@/constants/hiddenness';
import { INTERESTS } from '@/constants/interests';

/**
 * SpotCard — a researched place in the Trip Detail research list.
 *
 * Props:
 *   spot    {object}  Firestore spot doc
 *   destId  {string}  destination ID (passed through to Spot Detail URL)
 *   tripId  {string}  trip ID (passed through to Spot Detail URL)
 */
export default function SpotCard({ spot, destId, tripId }) {
  const level = getHiddennessLevel(spot?.hiddennessScore ?? 1);

  const href = `/spots/${spot.id}?city=${encodeURIComponent(spot.city ?? '')}&destId=${destId ?? ''}&tripId=${tripId ?? ''}`;

  // Up to 3 matching interest icons
  const interestIcons = (spot.interests ?? [])
    .map((id) => INTERESTS.find((i) => i.id === id))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          background:    'var(--card)',
          borderRadius:  '12px',
          border:        '1px solid var(--border)',
          borderLeft:    `3px solid ${level.color}`,
          padding:       '14px 16px',
          display:       'flex',
          flexDirection: 'column',
          gap:           '8px',
          transition:    'background 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--card-hover)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--card)')}
      >
        {/* Name + chevron */}
        <div style={{
          display:        'flex',
          alignItems:     'flex-start',
          justifyContent: 'space-between',
          gap:            '8px',
        }}>
          <p style={{
            fontWeight:  600,
            fontSize:    '0.95rem',
            color:       'var(--text-primary)',
            lineHeight:  1.3,
          }}>
            {spot.name}
          </p>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', flexShrink: 0, marginTop: '1px' }}>
            ›
          </span>
        </div>

        {/* Hiddenness badge + score bar */}
        <HiddennessBadge score={spot.hiddennessScore} showBar />

        {/* Description (2 lines max) */}
        {spot.description && (
          <p style={{
            fontSize:          '0.82rem',
            color:             'var(--text-secondary)',
            lineHeight:        1.55,
            display:           '-webkit-box',
            WebkitLineClamp:   2,
            WebkitBoxOrient:   'vertical',
            overflow:          'hidden',
          }}>
            {spot.description}
          </p>
        )}

        {/* Footer: interest icons + entry price */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          marginTop:      '2px',
        }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {interestIcons.map((i) => (
              <span key={i.id} title={i.label} style={{ fontSize: '0.85rem' }}>
                {i.icon}
              </span>
            ))}
          </div>

          {spot.entryPrice != null ? (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              €{spot.entryPrice}/pp
            </span>
          ) : (
            <span style={{ fontSize: '0.75rem', color: 'var(--green)' }}>Free</span>
          )}
        </div>
      </div>
    </Link>
  );
}
