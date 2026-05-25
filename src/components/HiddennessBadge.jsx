// HiddennessBadge — Week 2
// Coloured label + score bar for a spot's hiddenness rating.
// Stub — will be built in Week 2.

import { getHiddennessLevel } from '@/constants/hiddenness';

export default function HiddennessBadge({ score }) {
  const level = getHiddennessLevel(score ?? 1);
  return (
    <span style={{ color: level.color, fontSize: '0.78rem', fontWeight: 600 }}>
      {level.label} · {score}/10
    </span>
  );
}
