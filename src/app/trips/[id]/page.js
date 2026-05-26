'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getTrip, addSpotToDayPlan } from '@/lib/db';
import { useDestination } from '@/hooks/useDestination';
import { useDayPlanner } from '@/hooks/useDayPlanner';
import { runResearch } from '@/lib/functions';
import SpotCard from '@/components/SpotCard';
import ResearchLoader from '@/components/ResearchLoader';
import CountdownBadge from '@/components/CountdownBadge';
import DayPlanColumn from '@/components/DayPlanColumn';
import DayPassCalculator from '@/components/DayPassCalculator';
import MapView from '@/components/MapView';
import Sidebar from '@/components/Sidebar';
import { INTERESTS } from '@/constants/interests';

/* ── Helpers ──────────────────────────────────────────────────────────────── */
function fmtDate(iso) {
  if (!iso) return '';
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short',
  });
}

function flagEmoji(code) {
  if (!code || code.length !== 2) return '🌍';
  return [...code.toUpperCase()].map((c) =>
    String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0))
  ).join('');
}

/* ── Tab button ───────────────────────────────────────────────────────────── */
function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background:   'none',
        border:       'none',
        padding:      '10px 0',
        fontSize:     '0.85rem',
        fontWeight:   active ? 600 : 400,
        color:        active ? 'var(--text-primary)' : 'var(--text-muted)',
        cursor:       'pointer',
        borderBottom: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
        transition:   'color 0.15s, border-color 0.15s',
        whiteSpace:   'nowrap',
      }}
    >
      {label}
    </button>
  );
}

/* ── Main ─────────────────────────────────────────────────────────────────── */
export default function TripDetailPage() {
  const { id: tripId }      = useParams();
  const { user, authReady } = useAuth();

  const [trip,          setTrip]         = useState(null);
  const [tripLoading,   setTripLoading]  = useState(true);
  const [tripError,     setTripError]    = useState(null);
  const [selectedIdx,   setSelectedIdx]  = useState(0);
  const [activeTab,     setActiveTab]    = useState('Research');
  const [filterInterest,setFilterInterest]=useState('');
  const [isResearching, setIsResearching]= useState(false);
  const [researchError, setResearchError]= useState(null);

  // Selected spot (drives map focus + inline expansion)
  const [selectedSpotId, setSelectedSpotId] = useState(null);

  // Add-to-day modal
  const [addSpotModal,  setAddSpotModal] = useState(null);
  const [spotSearch,    setSpotSearch]   = useState('');
  const [addingSpot,    setAddingSpot]   = useState(null);
  const [addedSpots,    setAddedSpots]   = useState(new Set());

  /* ── Load trip ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!tripId || !authReady) return;
    getTrip(tripId)
      .then((t) => { setTrip(t); if (!t) setTripError('Trip not found.'); })
      .catch((err) => setTripError(err.message))
      .finally(() => setTripLoading(false));
  }, [tripId, authReady]);

  /* ── Destination + spots ────────────────────────────────────────────────── */
  const selectedDest = trip?.destinations?.[selectedIdx] ?? null;
  const { spots, loading: spotsLoading, refetch }       = useDestination(selectedDest?.id);
  const { days,  loading: daysLoading,  refetch: refetchDays } = useDayPlanner(selectedDest?.id, selectedDest?.city);

  /* ── Research ───────────────────────────────────────────────────────────── */
  const triggerResearch = useCallback(async (force = false) => {
    if (!selectedDest) return;
    setIsResearching(true);
    setResearchError(null);
    try {
      await runResearch(selectedDest.city, trip?.interests ?? [], selectedDest.id, force);
      await refetch();
    } catch (err) {
      console.error('Research error:', err);
      setResearchError(err.message ?? 'Research failed. Please try again.');
    } finally {
      setIsResearching(false);
    }
  }, [selectedDest, trip, refetch]);

  useEffect(() => {
    if (spotsLoading || isResearching || researchError) return;
    if (!selectedDest) return;
    if (spots.length > 0) return;
    triggerResearch();
  }, [selectedDest?.id, spots.length, spotsLoading, isResearching]); // eslint-disable-line

  // Reset filter + selection on dest change
  useEffect(() => { setFilterInterest(''); setSelectedSpotId(null); }, [selectedDest?.id]);

  /* ── Derived (memoised — stable refs prevent MapView marker re-creation) ─── */
  const filteredSpots = useMemo(
    () => filterInterest
      ? spots.filter((s) => (s.interests ?? []).includes(filterInterest))
      : spots,
    [spots, filterInterest]
  );

  const presentInterests = useMemo(
    () => INTERESTS.filter((i) => spots.some((s) => (s.interests ?? []).includes(i.id))),
    [spots]
  );

  const selectedSpot = spots.find(s => s.id === selectedSpotId) ?? null;

  const handleSpotClick = useCallback(
    (spot) => setSelectedSpotId(spot.id),
    [] // setSelectedSpotId is stable
  );

  /* ── Loading / error shell ──────────────────────────────────────────────── */
  if (tripLoading || !authReady) {
    return (
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading…</div>
        </div>
      </div>
    );
  }

  if (tripError || !trip) {
    return (
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '40px 48px' }}>
          <p style={{ color: 'var(--text-muted)' }}>{tripError ?? 'Trip not found.'}</p>
          <Link href="/" style={{ color: 'var(--accent)', fontSize: '0.85rem', marginTop: 12, display: 'inline-block' }}>← Back to trips</Link>
        </div>
      </div>
    );
  }

  /* ── Header info ────────────────────────────────────────────────────────── */
  const firstDest = trip.destinations[0];
  const lastDest  = trip.destinations[trip.destinations.length - 1];
  const headerTitle = trip.name
    ?? (trip.isMultiCity
        ? trip.destinations.map((d) => d.city).join(' · ')
        : `${flagEmoji(firstDest?.countryCode)} ${firstDest?.city}`);
  const dateRange = `${fmtDate(firstDest?.startDate)} – ${fmtDate(lastDest?.endDate)}`;

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <Sidebar />

      {/* ── Right panel ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <header style={{
          flexShrink:   0,
          padding:      '16px 28px 0',
          background:   'var(--bg)',
          borderBottom: '1px solid var(--border)',
        }}>
          {/* breadcrumb */}
          <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Trips
            </Link>
          </div>

          {/* Title + date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>
              {headerTitle}
            </h1>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{dateRange}</span>
            <CountdownBadge date={firstDest?.startDate} />
          </div>

          {/* Destination tabs (multi-city) */}
          {trip.isMultiCity && trip.destinations.length > 1 && (
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 10, paddingBottom: 2 }}>
              {trip.destinations.map((dest, idx) => (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => setSelectedIdx(idx)}
                  style={{
                    padding:      '5px 12px',
                    borderRadius: 8,
                    border:       `1px solid ${selectedIdx === idx ? 'var(--accent)' : 'var(--border)'}`,
                    background:   selectedIdx === idx ? 'rgba(212,168,75,0.1)' : 'var(--card)',
                    color:        selectedIdx === idx ? 'var(--accent)' : 'var(--text-secondary)',
                    fontWeight:   selectedIdx === idx ? 600 : 400,
                    fontSize:     '0.8rem',
                    cursor:       'pointer',
                    whiteSpace:   'nowrap',
                    flexShrink:   0,
                  }}
                >
                  {flagEmoji(dest.countryCode)} {dest.city}
                </button>
              ))}
            </div>
          )}

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 20 }}>
            {['Research', 'Days', 'Pass'].map((t) => (
              <Tab key={t} label={t} active={activeTab === t} onClick={() => setActiveTab(t)} />
            ))}
          </div>
        </header>

        {/* ── Tab content ─────────────────────────────────────────────── */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', minHeight: 0 }}>

          {/* ════════════════ RESEARCH ════════════════ */}
          {activeTab === 'Research' && (
            <>
              {/* Left: spot list */}
              <div style={{
                width:      380,
                flexShrink: 0,
                display:    'flex',
                flexDirection: 'column',
                borderRight: '1px solid var(--border)',
                overflow:   'hidden',
              }}>

                {/* Filter chips + research status */}
                <div style={{
                  flexShrink: 0,
                  padding:    '12px 16px',
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--bg)',
                }}>
                  {/* Research error banner */}
                  {researchError && !isResearching && (
                    <div style={{
                      padding:      '8px 10px',
                      background:   'rgba(220,38,38,0.07)',
                      border:       '1px solid rgba(220,38,38,0.2)',
                      borderRadius: 8,
                      marginBottom: 8,
                      display:      'flex',
                      alignItems:   'center',
                      justifyContent: 'space-between',
                      gap: 8,
                    }}>
                      <p style={{ fontSize: '0.75rem', color: '#ef4444', lineHeight: 1.4, flex: 1 }}>
                        {researchError}
                      </p>
                      <button
                        type="button"
                        onClick={() => triggerResearch()}
                        style={{
                          background:   'none',
                          border:       '1px solid rgba(220,38,38,0.3)',
                          borderRadius: 6,
                          color:        '#ef4444',
                          fontSize:     '0.72rem',
                          padding:      '3px 8px',
                          cursor:       'pointer',
                          flexShrink:   0,
                        }}
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {/* Interest filter chips */}
                  {!isResearching && spots.length > 0 && presentInterests.length > 0 && (
                    <div style={{ display: 'flex', gap: 5, overflowX: 'auto', paddingBottom: 2 }}>
                      <button
                        type="button"
                        onClick={() => setFilterInterest('')}
                        style={{
                          padding:      '4px 10px',
                          borderRadius: 20,
                          border:       `1px solid ${filterInterest === '' ? 'var(--accent)' : 'var(--border)'}`,
                          background:   filterInterest === '' ? 'rgba(212,168,75,0.1)' : 'transparent',
                          color:        filterInterest === '' ? 'var(--accent)' : 'var(--text-muted)',
                          fontSize:     '0.72rem',
                          fontWeight:   filterInterest === '' ? 600 : 400,
                          cursor:       'pointer',
                          flexShrink:   0,
                          whiteSpace:   'nowrap',
                        }}
                      >
                        All
                      </button>
                      {presentInterests.map((i) => (
                        <button
                          key={i.id}
                          type="button"
                          onClick={() => setFilterInterest(filterInterest === i.id ? '' : i.id)}
                          style={{
                            padding:      '4px 10px',
                            borderRadius: 20,
                            border:       `1px solid ${filterInterest === i.id ? 'var(--accent)' : 'var(--border)'}`,
                            background:   filterInterest === i.id ? 'rgba(212,168,75,0.1)' : 'transparent',
                            color:        filterInterest === i.id ? 'var(--accent)' : 'var(--text-muted)',
                            fontSize:     '0.72rem',
                            fontWeight:   filterInterest === i.id ? 600 : 400,
                            cursor:       'pointer',
                            flexShrink:   0,
                            whiteSpace:   'nowrap',
                            display:      'flex',
                            alignItems:   'center',
                            gap:          3,
                          }}
                        >
                          <span>{i.icon}</span>
                          <span>{i.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Spot count */}
                  {!isResearching && filteredSpots.length > 0 && (
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 6 }}>
                      {filteredSpots.length} spot{filteredSpots.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                {/* Spot list (scrollable) */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {isResearching && (
                    <div style={{ padding: '16px' }}>
                      <ResearchLoader city={selectedDest?.city} />
                    </div>
                  )}

                  {!isResearching && filteredSpots.map((spot) => (
                    <SpotCard
                      key={spot.id}
                      spot={spot}
                      destId={selectedDest?.id}
                      tripId={tripId}
                      active={selectedSpotId === spot.id}
                      onSelect={() => setSelectedSpotId(selectedSpotId === spot.id ? null : spot.id)}
                    />
                  ))}

                  {!isResearching && spots.length > 0 && filteredSpots.length === 0 && (
                    <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <p style={{ fontSize: '0.82rem' }}>No spots match this filter.</p>
                      <button
                        type="button"
                        onClick={() => setFilterInterest('')}
                        style={{ marginTop: 8, background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.78rem' }}
                      >
                        Show all
                      </button>
                    </div>
                  )}

                  {/* Refresh research */}
                  {!isResearching && spots.length > 0 && (
                    <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
                      <button
                        type="button"
                        onClick={() => triggerResearch(true)}
                        disabled={isResearching}
                        style={{
                          width:        '100%',
                          background:   'none',
                          border:       '1px solid var(--border)',
                          borderRadius: 8,
                          color:        'var(--text-muted)',
                          fontSize:     '0.75rem',
                          padding:      '7px',
                          cursor:       'pointer',
                        }}
                      >
                        🔄 Refresh Research
                      </button>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>
                        ~$0.02 · re-runs AI
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: map */}
              <div style={{ flex: 1, position: 'relative', background: '#0a0a0a', minWidth: 0 }}>
                <MapView
                  spots={filteredSpots}
                  onSpotClick={handleSpotClick}
                  filterInterest=""
                  focusSpotId={selectedSpotId}
                />

                {/* Selected spot info chip */}
                {selectedSpot && (
                  <div style={{
                    position:     'absolute',
                    bottom:       16,
                    left:         16,
                    right:        16,
                    background:   'rgba(255,255,255,0.97)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 12,
                    padding:      '12px 14px',
                    boxShadow:    '0 4px 20px rgba(0,0,0,0.25)',
                    border:       '1px solid var(--border)',
                    display:      'flex',
                    alignItems:   'flex-start',
                    gap:          10,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {selectedSpot.name}
                      </p>
                      {selectedSpot.address && (
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>📍 {selectedSpot.address}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedSpotId(null)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1, flexShrink: 0, padding: 2 }}
                    >
                      ×
                    </button>
                  </div>
                )}

                {/* Research overlay (no spots yet) */}
                {isResearching && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(10,10,10,0.65)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(2px)',
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #333', borderTopColor: 'var(--accent)', animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} />
                      <p style={{ color: '#ccc', fontSize: '0.82rem' }}>Researching {selectedDest?.city}…</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ════════════════ DAYS ════════════════ */}
          {activeTab === 'Days' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
              {daysLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[1,2,3].map(i => (
                    <div key={i} style={{ height: 100, background: 'var(--card)', borderRadius: 12, border: '1px solid var(--border)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                  ))}
                </div>
              ) : days.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 10 }}>📅</div>
                  <p style={{ fontSize: '0.85rem' }}>No day plans yet.</p>
                  <p style={{ fontSize: '0.78rem', marginTop: 6, lineHeight: 1.5 }}>Create a trip with dates to auto-generate day slots.</p>
                </div>
              ) : (
                <>
                  {/* Running total */}
                  {(() => {
                    const total = days.reduce((s, d) => s + d.totalCost, 0);
                    const n     = days.reduce((s, d) => s + d.spots.length, 0);
                    return total > 0 ? (
                      <div style={{ background: 'var(--card)', borderRadius: 10, border: '1px solid var(--border)', padding: '10px 14px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{n} spot{n !== 1 ? 's' : ''} planned</p>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 1 }}>Running total</p>
                        </div>
                        <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent)' }}>~€{total}/pp</p>
                      </div>
                    ) : null;
                  })()}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {days.map(day => (
                      <DayPlanColumn
                        key={day.id}
                        day={day}
                        tripId={tripId}
                        onAddSpot={(dayPlanId, dayNumber) => {
                          setAddSpotModal({ dayPlanId, dayNumber });
                          setSpotSearch('');
                          setAddedSpots(new Set());
                        }}
                      />
                    ))}
                  </div>
                  {spots.length === 0 && (
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                      <button type="button" onClick={() => setActiveTab('Research')} style={{ background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                        Research spots first →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ════════════════ PASS ════════════════ */}
          {activeTab === 'Pass' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
              <div style={{ maxWidth: 560 }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>City Pass Calculator</h2>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: 16 }}>
                  Should you buy a tourist pass? We crunch your day plan to find out.
                </p>
                {daysLoading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[1,2].map(i => <div key={i} style={{ height: 72, background: 'var(--card)', borderRadius: 10, border: '1px solid var(--border)', animation: 'pulse 1.5s ease-in-out infinite' }} />)}
                  </div>
                ) : (
                  <DayPassCalculator
                    city={selectedDest?.city}
                    days={days}
                    tripDays={(() => {
                      if (!selectedDest?.startDate || !selectedDest?.endDate) return 1;
                      const ms = new Date(selectedDest.endDate) - new Date(selectedDest.startDate);
                      return Math.max(1, Math.round(ms / 86400000) + 1);
                    })()}
                  />
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Add-spot-to-day modal ────────────────────────────────────────── */}
      {addSpotModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setAddSpotModal(null); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }}
        >
          <div style={{ width: '100%', background: 'var(--card)', borderRadius: '16px 16px 0 0', padding: 20, paddingBottom: 'calc(20px + env(safe-area-inset-bottom))', maxHeight: '75dvh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Add to Day {addSpotModal.dayNumber}</p>
              <button type="button" onClick={() => setAddSpotModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>×</button>
            </div>
            <input
              type="text"
              placeholder="Search spots…"
              value={spotSearch}
              onChange={(e) => setSpotSearch(e.target.value)}
              autoFocus
              style={{ width: '100%', padding: '9px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none', marginBottom: 12, boxSizing: 'border-box' }}
            />
            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {spots
                .filter((s) => !spotSearch || s.name.toLowerCase().includes(spotSearch.toLowerCase()))
                .map((spot) => {
                  const added  = addedSpots.has(spot.id);
                  const adding = addingSpot === spot.id;
                  return (
                    <button
                      key={spot.id}
                      type="button"
                      disabled={adding || added}
                      onClick={async () => {
                        setAddingSpot(spot.id);
                        try {
                          await addSpotToDayPlan(addSpotModal.dayPlanId, spot.id, spot.city, 'morning');
                          setAddedSpots((prev) => new Set([...prev, spot.id]));
                          refetchDays();
                        } catch (err) { console.error(err); }
                        finally { setAddingSpot(null); }
                      }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '10px 12px', background: added ? 'rgba(45,106,79,0.08)' : 'var(--bg)', border: `1px solid ${added ? 'rgba(45,106,79,0.3)' : 'var(--border)'}`, borderRadius: 8, cursor: added || adding ? 'default' : 'pointer', textAlign: 'left' }}
                    >
                      <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)', flex: 1 }}>{spot.name}</span>
                      <span style={{ fontSize: '0.72rem', color: added ? 'var(--green)' : 'var(--text-muted)', flexShrink: 0 }}>
                        {added ? '✓ Added' : adding ? '…' : '+ Add'}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
