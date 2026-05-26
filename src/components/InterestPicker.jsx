'use client';
// InterestPicker — used on Add Trip screen (Week 2).
// Stub — will be built in Week 2.

import { INTERESTS } from '@/constants/interests';

export default function InterestPicker({ selected = [], onChange }) {
  const toggle = (id) => {
    const next = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];
    onChange?.(next);
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {INTERESTS.map(({ id, icon, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => toggle(id)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: `1px solid ${selected.includes(id) ? 'var(--accent)' : 'var(--border)'}`,
            background: selected.includes(id) ? 'rgba(245,158,11,0.1)' : 'var(--card)',
            color: selected.includes(id) ? 'var(--accent)' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
