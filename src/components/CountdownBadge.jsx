'use client';

import { useState, useEffect } from 'react';

/**
 * CountdownBadge
 * Shows "⏱ X days away" — updates live every minute.
 *
 * Props:
 *   date  {string|Date}  — ISO date string or Date object (start date of the trip)
 */
export default function CountdownBadge({ date }) {
  const [days, setDays] = useState(null);

  useEffect(() => {
    const calculate = () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const target = new Date(date);
      target.setHours(0, 0, 0, 0);
      const diff = Math.round((target - now) / (1000 * 60 * 60 * 24));
      setDays(diff);
    };

    calculate();
    const id = setInterval(calculate, 60_000);
    return () => clearInterval(id);
  }, [date]);

  if (days === null) return null;

  let label;
  let color;

  if (days < 0) {
    label = 'Past';
    color = 'var(--text-muted)';
  } else if (days === 0) {
    label = '🎉 Today!';
    color = 'var(--accent)';
  } else if (days === 1) {
    label = '⏱ Tomorrow';
    color = 'var(--accent)';
  } else if (days <= 7) {
    label = `⏱ ${days} days away`;
    color = 'var(--accent)';
  } else {
    label = `⏱ ${days} days away`;
    color = 'var(--text-secondary)';
  }

  return (
    <span
      style={{
        fontSize: '0.78rem',
        fontWeight: 500,
        color,
        letterSpacing: '0.01em',
      }}
    >
      {label}
    </span>
  );
}
