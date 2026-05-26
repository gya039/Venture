'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { createTrip, generateDayPlans } from '@/lib/db';
import InterestPicker from '@/components/InterestPicker';
import Sidebar from '@/components/Sidebar';

const emptyDest = (city = '') => ({ city, countryCode: '', startDate: '', endDate: '' });

const INPUT = {
  width: '100%', padding: '10px 14px',
  background: 'var(--bg)', border: '1px solid var(--border)',
  borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.875rem',
  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
};
const LABEL = {
  display: 'block', fontSize: '0.72rem', fontWeight: 600,
  color: 'var(--text-muted)', textTransform: 'uppercase',
  letterSpacing: '0.07em', marginBottom: 6,
};
const onFocus = (e) => (e.target.style.borderColor = 'var(--accent)');
const onBlur  = (e) => (e.target.style.borderColor = 'var(--border)');

export default function NewTripPage() {
  const { user, authReady } = useAuth();

  const [tripName,  setTripName]  = useState('');
  const [isMulti,   setIsMulti]   = useState(false);
  const [dests,     setDests]     = useState([emptyDest()]);
  const [interests, setInterests] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  // Read ?city= param from URL on mount (avoids useSearchParams/Suspense requirement)
  useEffect(() => {
    const city = new URLSearchParams(window.location.search).get('city');
    if (city) setDests([emptyDest(city)]);
  }, []);

  const addDest    = () => { if (dests.length < 6) setDests([...dests, emptyDest()]); };
  const removeDest = (i) => setDests(dests.filter((_, idx) => idx !== i));
  const updateDest = (i, field, val) =>
    setDests(dests.map((d, idx) => (idx === i ? { ...d, [field]: val } : d)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { setError('You must be signed in to create a trip.'); return; }
    if (!authReady) { setError('Still verifying your account — please try again in a moment.'); return; }

    const missing = dests.find((d) => !d.city.trim() || !d.startDate || !d.endDate);
    if (missing) { setError('Please fill in city and dates for every destination.'); return; }

    const badDates = dests.find((d) => d.startDate >= d.endDate);
    if (badDates) { setError('End date must be after start date.'); return; }

    setError('');
    setLoading(true);

    try {
      const { tripId, destIds } = await createTrip({
        userId: user.uid,
        name: tripName.trim() || null,
        isMultiCity: isMulti,
        interests,
        destinations: dests.map((d) => ({
          city: d.city.trim(),
          countryCode: d.countryCode.trim().toUpperCase().slice(0, 2) || null,
          startDate: d.startDate,
          endDate: d.endDate,
        })),
      });

      await Promise.all(
        dests.map((d, i) => generateDayPlans(destIds[i], user.uid, tripId, d.startDate, d.endDate))
      );

      window.location.href = `/trips/${tripId}`;
    } catch (err) {
      console.error('createTrip error:', err);
      setError(err.message ?? 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />

      <main style={{ flex: 1, minWidth: 0, padding: '40px 48px' }}>
        <div style={{ maxWidth: 600 }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
            <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem' }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Trips
            </Link>
            <span style={{ color: 'var(--border)' }}>/</span>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.02em' }}>New Trip</h1>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Trip name */}
            <div>
              <label style={LABEL}>
                Trip name <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Summer Euro Trip"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                style={INPUT}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            {/* Trip type */}
            <div>
              <label style={LABEL}>Trip type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { value: false, label: 'Single city', icon: '📍' },
                  { value: true,  label: 'Multi-city',  icon: '🗺️' },
                ].map((opt) => {
                  const active = isMulti === opt.value;
                  return (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => { setIsMulti(opt.value); if (!opt.value) setDests([dests[0]]); }}
                      style={{
                        padding: '13px 10px', borderRadius: 8,
                        border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                        background: active ? 'rgba(245,158,11,0.08)' : 'var(--card)',
                        color: active ? 'var(--accent)' : 'var(--text-secondary)',
                        fontWeight: active ? 600 : 400, fontSize: '0.875rem', cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Destinations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {!isMulti && <label style={LABEL}>Destination</label>}
              {dests.map((dest, idx) => (
                <div key={idx} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                  {isMulti && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <span style={LABEL}>Destination {idx + 1}</span>
                      {dests.length > 1 && (
                        <button type="button" onClick={() => removeDest(idx)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.78rem' }}>
                          Remove
                        </button>
                      )}
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 72px', gap: 8, marginBottom: 10 }}>
                    <div>
                      <label style={{ ...LABEL, marginBottom: 5 }}>City</label>
                      <input type="text" placeholder="Amsterdam" value={dest.city}
                        onChange={(e) => updateDest(idx, 'city', e.target.value)}
                        style={INPUT} onFocus={onFocus} onBlur={onBlur} required />
                    </div>
                    <div>
                      <label style={{ ...LABEL, marginBottom: 5 }}>Flag</label>
                      <input type="text" placeholder="NL" value={dest.countryCode}
                        onChange={(e) => updateDest(idx, 'countryCode', e.target.value.slice(0, 2))}
                        style={{ ...INPUT, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                        maxLength={2} onFocus={onFocus} onBlur={onBlur} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <label style={{ ...LABEL, marginBottom: 5 }}>Start date</label>
                      <input type="date" value={dest.startDate}
                        onChange={(e) => updateDest(idx, 'startDate', e.target.value)}
                        style={{ ...INPUT, colorScheme: 'dark' }} onFocus={onFocus} onBlur={onBlur} required />
                    </div>
                    <div>
                      <label style={{ ...LABEL, marginBottom: 5 }}>End date</label>
                      <input type="date" value={dest.endDate}
                        onChange={(e) => updateDest(idx, 'endDate', e.target.value)}
                        style={{ ...INPUT, colorScheme: 'dark' }} onFocus={onFocus} onBlur={onBlur} required />
                    </div>
                  </div>
                </div>
              ))}
              {isMulti && dests.length < 6 && (
                <button type="button" onClick={addDest}
                  style={{
                    width: '100%', padding: 13, border: '1px dashed var(--border)',
                    borderRadius: 10, background: 'transparent', color: 'var(--text-secondary)',
                    fontSize: '0.875rem', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                  + Add another destination
                </button>
              )}
            </div>

            {/* Interests */}
            <div>
              <label style={LABEL}>What are you into? <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
                Biases research toward your picks — won't exclude great finds outside them.
              </p>
              <InterestPicker selected={interests} onChange={setInterests} />
            </div>

            {/* Error */}
            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#f87171', fontSize: '0.85rem', lineHeight: 1.5 }}>
                {error}
              </div>
            )}

            {/* Auth warning */}
            {user && !authReady && (
              <div style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, color: 'var(--accent)', fontSize: '0.82rem' }}>
                Verifying your session…
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !authReady}
              style={{
                width: '100%', padding: '13px', background: loading || !authReady ? 'rgba(245,158,11,0.5)' : 'var(--accent)',
                color: '#000', border: 'none', borderRadius: 8,
                fontWeight: 700, fontSize: '0.95rem',
                cursor: loading || !authReady ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Creating trip…' : !authReady ? 'Verifying session…' : '✈️  Create Trip'}
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}
