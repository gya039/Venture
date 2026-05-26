'use client';

/**
 * ResearchLoader — animated skeleton shown while AI research runs.
 * Props:
 *   city {string}  City name to display in the status line
 */
export default function ResearchLoader({ city }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '4px 0' }}>

      {/* Status line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <span style={{
          width:        '8px',
          height:       '8px',
          borderRadius: '50%',
          background:   'var(--accent)',
          flexShrink:   0,
          animation:    'pulse 1.2s ease-in-out infinite',
        }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Researching hidden gems{city ? ` in ${city}` : ''}…
        </p>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', lineHeight: 1.5 }}>
        Scanning Reddit, travel blogs, and local forums. This takes ~15–30 seconds.
      </p>

      {/* Skeleton cards */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            height:           i === 1 ? '90px' : i === 3 ? '76px' : '84px',
            background:       'var(--card)',
            borderRadius:     '12px',
            border:           '1px solid var(--border)',
            borderLeft:       '3px solid var(--border)',
            animation:        'pulse 1.5s ease-in-out infinite',
            animationDelay:   `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}
