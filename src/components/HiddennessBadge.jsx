'use client';

import { getHiddennessLevel } from '@/constants/hiddenness';

/**
 * HiddennessBadge — coloured dot + label + optional score bar.
 *
 * Props:
 *   score     {number}  1–10
 *   showBar   {boolean} default true — show the filled score bar
 *   size      {'sm'|'md'} default 'md'
 */
export default function HiddennessBadge({ score, showBar = true, size = 'md' }) {
  const level = getHiddennessLevel(score ?? 1);
  const pct   = Math.round(((score ?? 1) / 10) * 100);
  const sm    = size === 'sm';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: sm ? '3px' : '5px' }}>
      {/* Dot + label + score */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{
          width:        sm ? '6px' : '8px',
          height:       sm ? '6px' : '8px',
          borderRadius: '50%',
          background:   level.color,
          flexShrink:   0,
          boxShadow:    `0 0 6px ${level.color}60`,
        }} />
        <span style={{
          color:      level.color,
          fontSize:   sm ? '0.72rem' : '0.78rem',
          fontWeight: 600,
          letterSpacing: '0.01em',
        }}>
          {level.label}
        </span>
        <span style={{
          color:    'var(--text-muted)',
          fontSize: sm ? '0.7rem' : '0.75rem',
        }}>
          {score}/10
        </span>
      </div>

      {/* Score bar */}
      {showBar && (
        <div style={{
          height:       '3px',
          borderRadius: '2px',
          background:   'var(--border)',
          overflow:     'hidden',
        }}>
          <div style={{
            width:        `${pct}%`,
            height:       '100%',
            borderRadius: '2px',
            background:   level.color,
            transition:   'width 0.5s ease',
          }} />
        </div>
      )}
    </div>
  );
}
