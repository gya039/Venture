'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { createTrip, generateDayPlans } from '@/lib/db';
import InterestPicker from '@/components/InterestPicker';
import BottomNav from '@/components/BottomNav';

const emptyDest = () => ({ city: '', countryCode: '', startDate: '', endDate: '' });

/* ── Shared style tokens ──────────────────────────────────────────────────── */
const INPUT = {
  width:        '100%',
  padding:      '11px 14px',
  background:   'var(--card)',
  border:       '1px solid var(--border)',
  borderRadius: '8px',
  color:        'var(--text-primary)',
  fontSize:     '0.9rem',
  outline:      'none',
  boxSizing:    'border-box',
  transition:   'border-color 0.15s',
};

const LABEL = {
  display:       'block',
  fontSize:      '0.72rem',
  fontWeight:    600,
  color:         'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  marginBottom:  '6px',
};

const onFocus = (e) => (e.target.style.borderColor = 'var(--accent)');
const onBlur  = (e) => (e.target.style.borderColor = 'var(--border)');

export default function NewTripPage() {
  const { user } = useAuth();

  const [tripName,   setTripName]   = useState('');
  const [isMulti,    setIsMulti]    = useState(false);
  const [dests,      setDests]      = useState([emptyDest()]);
  const [interests,  setInterests]  = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  /* ── Destination helpers ──────────────────────────────────────────────── */
  const addDest    = () => { if (dests.length < 6) setDests([...dests, emptyDest()]); };
  const removeDest = (i) => setDests(dests.filter((_, idx) => idx !== i));
  const updateDest = (i, field, val) =>
    setDests(dests.map((d, idx) => (idx === i ? { ...d, [field]: val } : d)));

  /* ── Submit ───────────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { setError('You must be signed in to create a trip.'); return; }

    const missing = dests.find((d) => !d.city.trim() || !d.startDate || !d.endDate);
    if (missing) { setError('Please fill in city and dates for every destination.'); return; }

    const badDates = dests.find((d) => d.startDate >= d.endDate);
    if (badDates) { setError('End date must be after start date for each destination.'); return; }

    setError('');
    setLoading(true);

    try {
      const { tripId, destIds } = await createTrip({
        userId:      user.uid,
        name:        tripName.trim() || null,
        isMultiCity: isMulti,
        interests,
        destinations: dests.map((d) => ({
          city:        d.city.trim(),
          countryCode: d.countryCode.trim().toUpperCase().slice(0, 2) || null,
          startDate:   d.startDate,
          endDate:     d.endDate,
        })),
      });

      // Generate day-plan slot docs for each destination
      await Promise.all(
        dests.map((d, i) =>
          generateDayPlans(destIds[i], user.uid, tripId, d.startDate, d.endDate)
        )
      );

      // Navigate to trip detail — research auto-triggers there
      window.location.href = `/trips/${tripId}`;
    } catch (err) {
      console.error('createTrip error:', err);
      setError(err.message ?? 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  /* ── Render ───────────────────────────────────────────────────────────── */
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingBottom: '100px' }}>

      {/* Header */}
      <header style={{
        display:      'flex',
        alignItems:   'center',
        gap:          '12px',
        padding:      '20px',
        paddingTop:   'calc(20px + env(safe-area-inset-top))',
        borderBottom: '1px solid var(--border)',
      }}>
        <Link href="/" style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1 }}>←</Link>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 600 }}>New Trip</h1>
      </header>

      <form onSubmit={handleSubmit} style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* ── Trip name ─────────────────────────────────────────────────── */}
        <div>
          <label style={LABEL}>Trip name <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
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

        {/* ── Trip type ─────────────────────────────────────────────────── */}
        <div>
          <label style={LABEL}>Trip type</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
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
                    padding:       '14px 10px',
                    borderRadius:  '10px',
                    border:        `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                    background:    active ? 'rgba(245,158,11,0.08)' : 'var(--card)',
                    color:         active ? 'var(--accent)' : 'var(--text-secondary)',
                    fontWeight:    active ? 600 : 400,
                    fontSize:      '0.85rem',
                    cursor:        'pointer',
                    display:       'flex',
                    flexDirection: 'column',
                    alignItems:    'center',
                    gap:           '5px',
                    transition:    'border-color 0.15s, background 0.15s',
                  }}
                >
                  <span style={{ fontSize: '1.3rem' }}>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Destinations ──────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {!isMulti && <label style={LABEL}>Destination</label>}

          {dests.map((dest, idx) => (
            <div
              key={idx}
              style={{
                background:    'var(--card)',
                border:        '1px solid var(--border)',
                borderRadius:  '12px',
                padding:       '16px',
              }}
            >
              {/* Multi-city header */}
              {isMulti && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={LABEL}>Destination {idx + 1}</span>
                  {dests.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDest(idx)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.78rem' }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}

              {/* City + flag code */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 72px', gap: '8px', marginBottom: '10px' }}>
                <div>
                  <label style={{ ...LABEL, marginBottom: '5px' }}>City</label>
                  <input
                    type="text"
                    placeholder="Amsterdam"
                    value={dest.city}
                    onChange={(e) => updateDest(idx, 'city', e.target.value)}
                    style={INPUT}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    required
                  />
                </div>
                <div>
                  <label style={{ ...LABEL, marginBottom: '5px' }}>Flag</label>
                  <input
                    type="text"
                    placeholder="NL"
                    value={dest.countryCode}
                    onChange={(e) => updateDest(idx, 'countryCode', e.target.value.slice(0, 2))}
                    style={{ ...INPUT, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                    maxLength={2}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
              </div>

              {/* Dates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ ...LABEL, marginBottom: '5px' }}>Start date</label>
                  <input
                    type="date"
                    value={dest.startDate}
                    onChange={(e) => updateDest(idx, 'startDate', e.target.value)}
                    style={{ ...INPUT, colorScheme: 'dark' }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    required
                  />
                </div>
                <div>
                  <label style={{ ...LABEL, marginBottom: '5px' }}>End date</label>
                  <input
                    type="date"
                    value={dest.endDate}
                    onChange={(e) => updateDest(idx, 'endDate', e.target.value)}
                    style={{ ...INPUT, colorScheme: 'dark' }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    required
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add another destination */}
          {isMulti && dests.length < 6 && (
            <button
              type="button"
              onClick={addDest}
              style={{
                width:          '100%',
                padding:        '13px',
                border:         '1px dashed var(--border)',
                borderRadius:   '12px',
                background:     'transparent',
                color:          'var(--text-secondary)',
                fontSize:       '0.85rem',
                cursor:         'pointer',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            '6px',
                transition:     'border-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <span style={{ fontSize: '1.1rem' }}>+</span>
              Add another destination
            </button>
          )}
        </div>

        {/* ── Interests ─────────────────────────────────────────────────── */}
        <div>
          <label style={LABEL}>What are you into?</label>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.5 }}>
            Research will be biased toward your picks — but won't exclude great finds outside them.
          </p>
          <InterestPicker selected={interests} onChange={setInterests} />
        </div>

        {/* ── Error ─────────────────────────────────────────────────────── */}
        {error && (
          <div style={{
            padding:    '10px 14px',
            background: 'rgba(239,68,68,0.08)',
            border:     '1px solid rgba(239,68,68,0.3)',
            borderRadius:'8px',
            color:      '#f87171',
            fontSize:   '0.82rem',
            lineHeight: 1.5,
          }}>
            {error}
          </div>
        )}

        {/* ── Submit ────────────────────────────────────────────────────── */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width:        '100%',
            padding:      '14px',
            background:   'var(--accent)',
            color:        '#000',
            border:       'none',
            borderRadius: '10px',
            fontWeight:   700,
            fontSize:     '0.95rem',
            cursor:       loading ? 'not-allowed' : 'pointer',
            opacity:      loading ? 0.7 : 1,
            transition:   'background 0.15s',
          }}
          onMouseEnter={(e) => { if (!loading) e.target.style.background = 'var(--accent-hover)'; }}
          onMouseLeave={(e) => { if (!loading) e.target.style.background = 'var(--accent)'; }}
        >
          {loading ? 'Creating trip…' : '✈️  Create Trip'}
        </button>

      </form>

      <BottomNav />
    </div>
  );
}
