'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTrips } from '@/hooks/useTrips';
import TripCard from '@/components/TripCard';
import BottomNav from '@/components/BottomNav';
import InstallBanner from '@/components/InstallBanner';

/* ── Dashboard ──────────────────────────────────────────────────────────────── */
function Dashboard({ user }) {
  const { trips, loading } = useTrips();

  const now = new Date(); now.setHours(0,0,0,0);
  const upcoming = trips.filter(t => !t.destinations?.[0]?.startDate || new Date(t.destinations[0].startDate + 'T00:00:00') >= now);
  const past     = trips.filter(t =>  t.destinations?.[0]?.startDate && new Date(t.destinations[0].startDate + 'T00:00:00') < now);

  return (
    <div style={{ minHeight:'100dvh', background:'var(--bg)', paddingBottom:'calc(80px + env(safe-area-inset-bottom))' }}>

      <header style={{
        padding:'0 20px', paddingTop:'calc(18px + env(safe-area-inset-top))', paddingBottom:18,
        borderBottom:'1px solid var(--border)',
        position:'sticky', top:0, zIndex:50,
        background:'rgba(10,10,10,0.92)', backdropFilter:'blur(16px)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#f59e0b,#f97316)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:'#000', fontSize:'1rem' }}>V</div>
          <span style={{ fontSize:'1.15rem', fontWeight:700, letterSpacing:'-0.02em' }}>Venture</span>
        </div>
        <Link href="/settings" style={{ width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:8, background:'var(--card)', border:'1px solid var(--border)', color:'var(--text-secondary)', textDecoration:'none' }}>⚙️</Link>
      </header>

      <main style={{ padding:'24px 16px', display:'flex', flexDirection:'column', gap:24 }}>
        {loading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[1,2].map(i => (
              <div key={i} style={{ height:160, borderRadius:16, background:'var(--card)', border:'1px solid var(--border)', animation:'pulse 1.6s ease-in-out infinite', animationDelay:`${i*0.15}s` }} />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'60px 24px', textAlign:'center', gap:16 }}>
            <div style={{ width:80, height:80, borderRadius:24, background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.2rem' }}>✈️</div>
            <div>
              <p style={{ fontWeight:700, fontSize:'1.1rem', marginBottom:6 }}>No trips yet</p>
              <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', lineHeight:1.6, maxWidth:240 }}>Plan your next adventure. We find the hidden gems tourists miss.</p>
            </div>
            <Link href="/trips/new" style={{ padding:'12px 28px', background:'var(--accent)', color:'#000', borderRadius:12, fontWeight:700, fontSize:'0.9rem', textDecoration:'none', marginTop:4 }}>
              Plan my first trip →
            </Link>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <section>
                <p style={{ fontSize:'0.72rem', fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>Upcoming · {upcoming.length}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {upcoming.map(t => <TripCard key={t.id} trip={t} />)}
                </div>
              </section>
            )}
            {past.length > 0 && (
              <section>
                <p style={{ fontSize:'0.72rem', fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>Past · {past.length}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:10, opacity:0.6 }}>
                  {past.map(t => <TripCard key={t.id} trip={t} />)}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <div style={{ position:'fixed', bottom:'calc(var(--nav-height) + env(safe-area-inset-bottom) + 12px)', left:'50%', transform:'translateX(-50%)', zIndex:40 }}>
        <Link href="/trips/new" style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 24px', background:'var(--accent)', color:'#000', borderRadius:50, fontWeight:700, fontSize:'0.9rem', textDecoration:'none', boxShadow:'0 4px 20px rgba(245,158,11,0.4)', whiteSpace:'nowrap' }}>
          <span>+</span> New Trip
        </Link>
      </div>

      <BottomNav />
      <InstallBanner />
    </div>
  );
}

/* ── Landing ────────────────────────────────────────────────────────────────── */
function Landing() {
  const CITIES = ['Amsterdam','Lisbon','Tokyo','Barcelona','Rome','Prague','Vienna','Budapest'];
  return (
    <div style={{ minHeight:'100dvh', background:'var(--bg)', overflowX:'hidden' }}>
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 24px', borderBottom:'1px solid var(--border)', position:'sticky', top:0, zIndex:50, background:'rgba(10,10,10,0.92)', backdropFilter:'blur(16px)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:'linear-gradient(135deg,#f59e0b,#f97316)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:'#000', fontSize:'0.95rem' }}>V</div>
          <span style={{ fontWeight:700, fontSize:'1.05rem', letterSpacing:'-0.02em' }}>Venture</span>
        </div>
        <Link href="/auth" style={{ padding:'8px 18px', background:'var(--accent)', color:'#000', borderRadius:8, fontWeight:700, fontSize:'0.82rem', textDecoration:'none' }}>Get started</Link>
      </nav>

      <section style={{ padding:'72px 24px 60px', textAlign:'center', maxWidth:640, margin:'0 auto' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 14px', borderRadius:20, background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.2)', fontSize:'0.75rem', color:'var(--accent)', fontWeight:600, marginBottom:24 }}>✦ AI-POWERED TRAVEL RESEARCH</div>
        <h1 style={{ fontSize:'clamp(2rem,6vw,3.2rem)', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1.15, marginBottom:20 }}>
          Find places tourists{' '}
          <span style={{ background:'linear-gradient(135deg,#f59e0b,#f97316)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>never find</span>
        </h1>
        <p style={{ fontSize:'1.05rem', color:'var(--text-secondary)', lineHeight:1.7, maxWidth:480, margin:'0 auto 36px' }}>
          AI scans Reddit, travel blogs and local sources to surface hidden gems — scored by how off-the-beaten-path they are.
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginBottom:32 }}>
          <Link href="/auth" style={{ padding:'14px 32px', background:'var(--accent)', color:'#000', borderRadius:12, fontWeight:700, fontSize:'0.95rem', textDecoration:'none', boxShadow:'0 4px 20px rgba(245,158,11,0.3)' }}>Start planning free →</Link>
        </div>
        <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap' }}>
          {CITIES.map(c => <span key={c} style={{ padding:'4px 12px', borderRadius:20, background:'var(--card)', border:'1px solid var(--border)', fontSize:'0.74rem', color:'var(--text-muted)' }}>{c}</span>)}
        </div>
      </section>

      <section style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:1, background:'var(--border)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
        {[['83%','of great memories are unplanned'],['4.2h','wasted on TripAdvisor per trip'],['~$0','cost per AI-researched city'],['10×','faster than manual research']].map(([v,l]) => (
          <div key={v} style={{ background:'var(--bg)', padding:'28px 20px', textAlign:'center' }}>
            <p style={{ fontSize:'1.8rem', fontWeight:800, color:'var(--accent)', letterSpacing:'-0.03em' }}>{v}</p>
            <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:4, lineHeight:1.4 }}>{l}</p>
          </div>
        ))}
      </section>

      <section style={{ padding:'64px 24px', textAlign:'center' }}>
        <h2 style={{ fontSize:'1.6rem', fontWeight:800, letterSpacing:'-0.02em', marginBottom:12 }}>Ready to explore differently?</h2>
        <p style={{ color:'var(--text-muted)', marginBottom:28, fontSize:'0.9rem' }}>Free to use. No credit card required.</p>
        <Link href="/auth" style={{ padding:'14px 36px', background:'var(--accent)', color:'#000', borderRadius:12, fontWeight:700, fontSize:'0.95rem', textDecoration:'none', boxShadow:'0 4px 24px rgba(245,158,11,0.3)', display:'inline-block' }}>Get started free →</Link>
      </section>

      <footer style={{ padding:'24px', textAlign:'center', borderTop:'1px solid var(--border)', fontSize:'0.75rem', color:'var(--text-muted)' }}>2026 Venture</footer>
    </div>
  );
}

/* ── Root ───────────────────────────────────────────────────────────────────── */
export default function RootPage() {
  const { user, loading } = useAuth();

  // Show landing immediately while auth resolves — no spinner
  if (loading && !user) return <Landing />;
  if (!user)             return <Landing />;
  return <Dashboard user={user} />;
}
