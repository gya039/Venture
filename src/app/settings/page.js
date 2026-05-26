'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/Sidebar';

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/auth');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />

      <main style={{ flex: 1, minWidth: 0, padding: '40px 48px', maxWidth: 640 }}>

        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>Settings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage your account and preferences</p>
        </div>

        {/* Account */}
        <section style={{ marginBottom: 32 }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Account</p>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 2 }}>Email</p>
                <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{user?.email ?? '—'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section style={{ marginBottom: 32 }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Preferences</p>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            {[
              { label: 'Currency', value: 'GBP £' },
              { label: 'Default interests', value: 'Not set' },
            ].map(({ label, value }, i, arr) => (
              <div key={label} style={{
                padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer',
              }}>
                <span style={{ fontSize: '0.9rem' }}>{label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {value}
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Research */}
        <section style={{ marginBottom: 32 }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Research</p>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: 2 }}>Clear cached research</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Forces re-fetch on next visit to each city</p>
            </div>
            <button style={{
              background: 'none', border: '1px solid var(--border)', borderRadius: 7,
              color: 'var(--text-secondary)', padding: '7px 14px',
              fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500,
            }}>
              Clear
            </button>
          </div>
        </section>

        {/* Danger zone */}
        <section>
          <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Account actions</p>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <button
              onClick={handleSignOut}
              style={{
                width: '100%', background: 'none', border: 'none',
                padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                borderBottom: '1px solid var(--border)', textAlign: 'left',
              }}
            >
              Sign out
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
            <button style={{
              width: '100%', background: 'none', border: 'none',
              padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              color: 'var(--error)', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left',
            }}>
              Delete account
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}
