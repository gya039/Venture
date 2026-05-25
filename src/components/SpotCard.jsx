// SpotCard — Week 2
// Displays a researched spot in the Trip Detail research list.
// Stub — will be built in Week 2.

export default function SpotCard({ spot }) {
  return (
    <div style={{ padding: '16px', background: 'var(--card)', borderRadius: '10px', border: '1px solid var(--border)' }}>
      <strong>{spot?.name ?? '—'}</strong>
    </div>
  );
}
