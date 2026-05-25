'use client';
// ResearchLoader — skeleton + "Researching..." animation shown while AI research runs.
// Stub with basic skeleton — will be polished in Week 2.

export default function ResearchLoader() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '4px 0' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>
        🔍 Researching hidden gems…
      </p>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            height: '80px',
            background: 'var(--card)',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            animation: 'pulse 1.5s ease-in-out infinite',
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}
