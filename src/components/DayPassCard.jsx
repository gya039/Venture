// DayPassCard — Week 4
// Shows day pass verdict ("Worth it — saves €XX" or "Not worth it").
// Stub — will be built in Week 4.

export default function DayPassCard({ result }) {
  if (!result) return null;
  return (
    <div style={{ padding: '16px', background: 'var(--card)', borderRadius: '10px', border: '1px solid var(--border)' }}>
      {result.worthIt
        ? `✅ Worth it — saves €${result.savings.toFixed(0)}`
        : `❌ Not worth it (saves €${result.savings.toFixed(0)})`}
    </div>
  );
}
