import Link from 'next/link';
import CountdownBadge from './CountdownBadge';

/** Converts ISO country code (e.g. "NL") to flag emoji */
function flagEmoji(countryCode) {
  if (!countryCode) return '✈️';
  return [...countryCode.toUpperCase()].map((c) =>
    String.fromCodePoint(c.codePointAt(0) + 127397)
  ).join('');
}

/** "10 Jul 2026" */
function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * TripCard
 * Displays a single trip (single or multi-city) on the Dashboard.
 *
 * Props:
 *   trip  — shape from useTrips (id, name, isMultiCity, destinations[])
 */
export default function TripCard({ trip }) {
  const { id, name, isMultiCity, destinations } = trip;
  const first = destinations[0];
  const last  = destinations[destinations.length - 1];

  // Average research progress across all destinations
  const progress =
    destinations.reduce((s, d) => s + (d.researchProgress ?? 0), 0) / destinations.length;

  const displayName = name
    ?? (isMultiCity
      ? destinations.map((d) => d.city).join(' + ')
      : first.city);

  const cardStyle = {
    display: 'block',
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '16px',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'border-color 0.15s, background 0.15s',
    cursor: 'pointer',
  };

  return (
    <Link href={`/trips/${id}`} style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent)';
        e.currentTarget.style.background = 'var(--card-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.background = 'var(--card)';
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <span style={{ fontSize: '2rem', lineHeight: 1, flexShrink: 0 }}>
          {isMultiCity ? '✈️' : flagEmoji(first.countryCode)}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginBottom: '2px',
          }}>
            {displayName}
          </h2>
          {isMultiCity && (
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>
              {destinations.map((d) => d.city).join(' · ')}
            </p>
          )}
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {fmt(first.startDate)} → {fmt(last.endDate)}
          </p>
        </div>
      </div>

      {/* Countdown */}
      <div style={{ marginTop: '10px' }}>
        <CountdownBadge date={first.startDate} />
      </div>

      {/* Research progress bar */}
      <div style={{ marginTop: '10px' }}>
        <div style={{
          height: '4px',
          background: 'var(--border)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${Math.round(progress * 100)}%`,
            background: progress === 0 ? 'transparent' : progress === 1 ? 'var(--accent)' : 'var(--accent)',
            borderRadius: '2px',
            transition: 'width 0.3s ease',
          }} />
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
          {progress === 0 ? 'No research yet' : progress === 1 ? '✓ Research complete' : 'Research in progress'}
        </span>
      </div>
    </Link>
  );
}
