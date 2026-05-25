// DayPlanColumn — Week 3
// One day's column in the Day Planner.
// Stub — will be built in Week 3.

export default function DayPlanColumn({ dayPlan, spots }) {
  return (
    <div style={{ padding: '16px', background: 'var(--card)', borderRadius: '10px', border: '1px solid var(--border)' }}>
      <strong>Day {dayPlan?.dayNumber}</strong>
    </div>
  );
}
