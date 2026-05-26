'use client';

import Link from 'next/link';

const CITIES = ['Amsterdam','Lisbon','Tokyo','Barcelona','Rome','Prague','Vienna','Budapest'];
const STATS = [
  { value:'83%', label:'of great memories are unplanned' },
  { value:'4.2h', label:'wasted on TripAdvisor per trip' },
  { value:'~$0',  label:'cost per AI-researched city' },
  { value:'10×',  label:'faster than manual research' },
];
const HOW = [
  { n:'01', title:'Add your trip',  body:'Tell us where and when. Single city or multi-stop.' },
  { n:'02', title:'AI researches',  body:'We scan Reddit, travel blogs and local sources for hidden gems.' },
  { n:'03', title:'Explore & plan', body:'Browse scored spots, build your day plan, check the map.' },
];
const DEMO_SPOTS = [
  { name:'Begijnhof',         city:'Amsterdam', score:7, tag:'Hidden Gem',   color:'#22c55e', desc:'A secret courtyard from 1346 — surrounded by medieval houses, missed by 90% of visitors.' },
  { name:'LX Factory',        city:'Lisbon',    score:8, tag:'Local Secret', color:'#f59e0b', desc:'Industrial complex turned creative village. Sunday market, rooftop restaurants, zero tourist buses.' },
  { name:'Trafaria',          city:'Lisbon',    score:9, tag:'Local Secret', color:'#f59e0b', desc:'10-min ferry from Lisbon reveals an untouched fishing village. Locals only, zero Airbnb.' },
  { name:'Prater Biergarten', city:'Berlin',    score:6, tag:'Worth Knowing',color:'#3b82f6', desc:"Berlin oldest beer garden (1837) behind an unmarked door in Prenzlauer Berg." },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight:'100dvh', background:'var(--bg)', overflowX:'hidden' }}>

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <nav style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'16px 24px', borderBottom:'1px solid var(--border)',
        position:'sticky', top:0, zIndex:50,
        background:'rgba(10,10,10,0.92)', backdropFilter:'blur(16px)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{
            width:30, height:30, borderRadius:8,
            background:'linear-gradient(135deg,#f59e0b,#f97316)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:800, color:'#000', fontSize:'0.95rem',
          }}>V</div>
          <span style={{ fontWeight:700, fontSize:'1.05rem', letterSpacing:'-0.02em' }}>Venture</span>
        </div>
        <Link href="/auth" style={{
          padding:'8px 18px', background:'var(--accent)', color:'#000',
          borderRadius:8, fontWeight:700, fontSize:'0.82rem', textDecoration:'none',
        }}>Get started</Link>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section style={{ padding:'72px 24px 60px', textAlign:'center', maxWidth:640, margin:'0 auto' }}>
        <div style={{
          display:'inline-flex', alignItems:'center', gap:6,
          padding:'5px 14px', borderRadius:20,
          background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.2)',
          fontSize:'0.75rem', color:'var(--accent)', fontWeight:600,
          marginBottom:24, letterSpacing:'0.04em',
        }}>
          ✦ AI-POWERED TRAVEL RESEARCH
        </div>

        <h1 style={{
          fontSize:'clamp(2rem,6vw,3.2rem)', fontWeight:800,
          letterSpacing:'-0.03em', lineHeight:1.15, marginBottom:20,
        }}>
          Find places tourists{' '}
          <span style={{
            background:'linear-gradient(135deg,#f59e0b,#f97316)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          }}>never find</span>
        </h1>

        <p style={{
          fontSize:'1.05rem', color:'var(--text-secondary)', lineHeight:1.7,
          maxWidth:480, margin:'0 auto 36px',
        }}>
          Venture scans Reddit, travel blogs and local sources to surface hidden gems — scored by how off-the-beaten-path they actually are.
        </p>

        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/auth" style={{
            padding:'14px 32px', background:'var(--accent)', color:'#000',
            borderRadius:12, fontWeight:700, fontSize:'0.95rem', textDecoration:'none',
            boxShadow:'0 4px 20px rgba(245,158,11,0.3)',
          }}>Start planning free →</Link>
          <a href="#how" style={{
            padding:'14px 24px', background:'var(--card)', color:'var(--text-secondary)',
            borderRadius:12, fontWeight:600, fontSize:'0.9rem',
            textDecoration:'none', border:'1px solid var(--border)',
          }}>How it works</a>
        </div>

        <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap', marginTop:32 }}>
          {CITIES.map(c => (
            <span key={c} style={{
              padding:'4px 12px', borderRadius:20,
              background:'var(--card)', border:'1px solid var(--border)',
              fontSize:'0.74rem', color:'var(--text-muted)',
            }}>{c}</span>
          ))}
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <section style={{
        display:'grid', gridTemplateColumns:'repeat(2,1fr)',
        gap:1, background:'var(--border)',
        borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)',
      }}>
        {STATS.map(s => (
          <div key={s.value} style={{ background:'var(--bg)', padding:'28px 20px', textAlign:'center' }}>
            <p style={{ fontSize:'1.8rem', fontWeight:800, color:'var(--accent)', letterSpacing:'-0.03em' }}>{s.value}</p>
            <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:4, lineHeight:1.4 }}>{s.label}</p>
          </div>
        ))}
      </section>

      {/* ── Demo spots ───────────────────────────────────────────── */}
      <section style={{ padding:'64px 20px', maxWidth:680, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <h2 style={{ fontSize:'1.6rem', fontWeight:800, letterSpacing:'-0.02em', marginBottom:8 }}>
            What we find for you
          </h2>
          <p style={{ color:'var(--text-muted)', fontSize:'0.9rem' }}>Real spots, real scores. Not the Eiffel Tower.</p>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {DEMO_SPOTS.map(spot => (
            <div key={spot.name} style={{
              background:'var(--card)', border:'1px solid var(--border)',
              borderRadius:14, padding:'16px 18px',
              borderLeft:`3px solid ${spot.color}`,
            }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:8 }}>
                <div>
                  <h3 style={{ fontSize:'0.95rem', fontWeight:700 }}>{spot.name}</h3>
                  <p style={{ fontSize:'0.74rem', color:'var(--text-muted)', marginTop:2 }}>{spot.city}</p>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4, flexShrink:0 }}>
                  <span style={{
                    fontSize:'0.68rem', fontWeight:700, color:spot.color,
                    background:`${spot.color}18`, border:`1px solid ${spot.color}30`,
                    borderRadius:6, padding:'2px 8px', whiteSpace:'nowrap',
                  }}>{spot.tag}</span>
                  <span style={{ fontSize:'0.75rem', color:'var(--text-muted)', fontWeight:600 }}>{spot.score}/10</span>
                </div>
              </div>
              <p style={{ fontSize:'0.82rem', color:'var(--text-secondary)', lineHeight:1.6 }}>{spot.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section id="how" style={{
        padding:'64px 20px',
        background:'var(--card)',
        borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)',
      }}>
        <div style={{ maxWidth:560, margin:'0 auto' }}>
          <h2 style={{ fontSize:'1.6rem', fontWeight:800, letterSpacing:'-0.02em', marginBottom:36, textAlign:'center' }}>
            How it works
          </h2>
          <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
            {HOW.map(step => (
              <div key={step.n} style={{ display:'flex', gap:20, alignItems:'flex-start' }}>
                <div style={{
                  width:40, height:40, borderRadius:12, flexShrink:0,
                  background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.2)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontWeight:800, color:'var(--accent)', fontSize:'0.72rem',
                }}>{step.n}</div>
                <div>
                  <h3 style={{ fontWeight:700, fontSize:'0.95rem', marginBottom:4 }}>{step.title}</h3>
                  <p style={{ fontSize:'0.83rem', color:'var(--text-secondary)', lineHeight:1.6 }}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section style={{ padding:'72px 24px', textAlign:'center' }}>
        <h2 style={{ fontSize:'1.8rem', fontWeight:800, letterSpacing:'-0.02em', marginBottom:12 }}>
          Ready to explore differently?
        </h2>
        <p style={{ color:'var(--text-muted)', marginBottom:28, fontSize:'0.9rem' }}>
          Free to use. No credit card. Just better travel.
        </p>
        <Link href="/auth" style={{
          padding:'14px 36px', background:'var(--accent)', color:'#000',
          borderRadius:12, fontWeight:700, fontSize:'0.95rem', textDecoration:'none',
          boxShadow:'0 4px 24px rgba(245,158,11,0.3)', display:'inline-block',
        }}>
          Get started — it is free →
        </Link>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer style={{
        padding:'24px', textAlign:'center',
        borderTop:'1px solid var(--border)',
        fontSize:'0.75rem', color:'var(--text-muted)',
      }}>
        2026 Venture · AI-powered hidden gems travel planner
      </footer>
    </div>
  );
}
