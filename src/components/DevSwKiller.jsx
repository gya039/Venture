'use client';
import { useEffect } from 'react';

// Kills stale service workers in development so normal reload always gets fresh code
export default function DevSwKiller() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister());
      });
    }
  }, []);
  return null;
}
