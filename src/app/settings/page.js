'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import BottomNav from '@/components/BottomNav';

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/auth');
  };

  const row = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 0',
    borderBottom: '1px solid var(--border)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingBottom: '80px' }}>
      <header style={{ padding: '20px', paddingTop: 'calc(20px + env(safe-area-inset-top))' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Settings</h1>
      </header>

      <div style={{ padding: '0 20px' }}>

        {/* Account */}
        <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>Account</p>
        <div style={row}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {user?.email ?? '—'}
          </span>
        </div>

        {/* Preferences */}
        <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '24px', marginBottom: '2px' }}>Preferences</p>
        <div style={row}>
          <span>Currency</span>
          <span style={{ color: 'var(--text-secondary)' }}>GBP £ ›</span>
        </div>
        <div style={row}>
          <span>Default interests</span>
          <span style={{ color: 'var(--text-secondary)' }}>›</span>
        </div>

        {/* Research */}
        <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '24px', marginBottom: '2px' }}>Research</p>
        <div style={row}>
          <div>
            <p>Clear cached research</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Forces re-fetch on next visit to each city</p>
          </div>
          <button style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-secondary)', padding: '6px 10px', fontSize: '0.78rem', cursor: 'pointer' }}>
            Clear
          </button>
        </div>

        {/* Auth */}
        <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={handleSignOut}
            style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left', padding: '4px 0' }}
          >
            Sign out →
          </button>
          <button
            style={{ background: 'none', border: 'none', color: 'var(--error)', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', padding: '4px 0' }}
          >
            Delete account →
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
