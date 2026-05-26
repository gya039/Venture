'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { updateUserPrefs } from '@/lib/db';
import Sidebar from '@/components/Sidebar';

const CURRENCIES = [
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'Fr', label: 'Swiss Franc' },
  { code: 'SEK', symbol: 'kr', label: 'Swedish Krona' },
];

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{title}</p>
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        {children}
      </div>
    </section>
  );
}

function Row({ label, sublabel, children, last }) {
  return (
    <div style={{
      padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderBottom: last ? 'none' : '1px solid var(--border)',
    }}>
      <div>
        <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{label}</p>
        {sublabel && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 1 }}>{sublabel}</p>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currency, setCurrency] = useState('GBP');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/auth');
  };

  const handleCurrencyChange = async (code) => {
    setCurrency(code);
    if (!user) return;
    setSaving(true);
    try {
      await updateUserPrefs(user.uid, { currency: code });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />

      <main style={{ flex: 1, minWidth: 0, padding: '40px 48px', maxWidth: 680 }}>

        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>Settings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage your account and preferences</p>
        </div>

        {/* Account */}
        <Section title="Account">
          <Row label="Email" last>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{user?.email ?? '—'}</span>
          </Row>
        </Section>

        {/* Preferences */}
        <Section title="Preferences">
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Currency</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 1 }}>Used for price display across the app</p>
              </div>
              {saved && <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600 }}>✓ Saved</span>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
              {CURRENCIES.map(({ code, symbol, label }) => (
                <button
                  key={code}
                  onClick={() => handleCurrencyChange(code)}
                  style={{
                    padding: '10px 12px', borderRadius: 10,
                    border: `1.5px solid ${currency === code ? 'var(--primary)' : 'var(--border)'}`,
                    background: currency === code ? 'var(--primary)' : '#fff',
                    color: currency === code ? '#fff' : 'var(--text-primary)',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  <p style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 1 }}>{symbol} {code}</p>
                  <p style={{ fontSize: '0.7rem', opacity: 0.7 }}>{label}</p>
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Research */}
        <Section title="Research">
          <Row label="Clear cached research" sublabel="Forces re-fetch on next visit to each city" last>
            <button style={{
              background: 'none', border: '1px solid var(--border)', borderRadius: 8,
              color: 'var(--text-secondary)', padding: '7px 14px',
              fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500,
              transition: 'border-color 0.15s',
            }}>
              Clear
            </button>
          </Row>
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          {[
            { label: 'Trip reminders', sub: 'Get notified before your trip starts' },
            { label: 'New gems nearby', sub: 'When new spots are added for your cities', last: true },
          ].map(({ label, sub, last }) => (
            <Row key={label} label={label} sublabel={sub} last={last}>
              <div style={{
                width: 44, height: 24, borderRadius: 12,
                background: 'var(--border)', cursor: 'not-allowed', position: 'relative',
              }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: 3, boxShadow: 'var(--shadow-sm)' }} />
              </div>
            </Row>
          ))}
        </Section>

        {/* Danger zone */}
        <Section title="Danger zone">
          <button
            onClick={handleSignOut}
            style={{
              width: '100%', background: 'none', border: 'none',
              padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
              borderBottom: '1px solid var(--border)', textAlign: 'left',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--border-subtle)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Sign out
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
          <button style={{
            width: '100%', background: 'none', border: 'none',
            padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            color: 'var(--error)', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left',
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,38,38,0.04)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Delete account
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </Section>

      </main>
    </div>
  );
}
