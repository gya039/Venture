'use client';

// Force dynamic rendering — this page requires Firebase Auth (browser-only)
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

const googleProvider = new GoogleAuthProvider();

/** Google "G" logo SVG */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
      <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  );
}

export default function AuthPage() {
  const [mode, setMode]       = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const clearError = () => setError('');

  const friendlyError = (code) => {
    const map = {
      'auth/invalid-credential':    'Email or password is incorrect.',
      'auth/user-not-found':         'No account with that email.',
      'auth/wrong-password':         'Password is incorrect.',
      'auth/email-already-in-use':   'An account with that email already exists.',
      'auth/weak-password':          'Password must be at least 6 characters.',
      'auth/invalid-email':          'Please enter a valid email address.',
      'auth/popup-closed-by-user':    'Sign-in popup closed. Please try again.',
      'auth/network-request-failed':  'Network error. Check your connection.',
      'auth/operation-not-allowed':   'Email/password sign-in is not enabled. Enable it in Firebase Console → Authentication → Sign-in method.',
      'auth/configuration-not-found': 'Firebase Auth is not configured. Check your .env.local keys.',
      'auth/too-many-requests':       'Too many attempts. Please wait a moment and try again.',
      'auth/internal-error':          'Firebase internal error. Check the browser console for details.',
    };
    return map[code] ?? `Error: ${code ?? 'unknown'}`;
  };

  // Use full-page navigation to avoid Next.js 16 HMR router race condition
  const goToDashboard = () => { window.location.href = '/'; };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    clearError();
    setLoading(true);
    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      goToDashboard();
    } catch (err) {
      setError(friendlyError(err.code));
      setLoading(false); // only reset on error — success navigates away
    }
  };

  const handleGoogle = async () => {
    clearError();
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      goToDashboard();
    } catch (err) {
      setError(friendlyError(err.code));
      setLoading(false);
    }
  };

  /* ── Styles (inline — no CSS module dependency for a single page) ──────── */
  const s = {
    container: {
      minHeight: '100dvh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 20px',
    },
    card: {
      width: '100%',
      maxWidth: '360px',
      display: 'flex',
      flexDirection: 'column',
      gap: '0',
    },
    logo: {
      textAlign: 'center',
      marginBottom: '36px',
    },
    logoText: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.03em',
      color: 'var(--text-primary)',
      display: 'block',
    },
    tagline: {
      fontSize: '0.85rem',
      color: 'var(--text-muted)',
      marginTop: '4px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    input: {
      width: '100%',
      padding: '12px 14px',
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--text-primary)',
      fontSize: '0.95rem',
      outline: 'none',
      transition: 'border-color 0.15s',
    },
    errorBox: {
      padding: '10px 12px',
      background: 'rgba(239,68,68,0.1)',
      border: '1px solid rgba(239,68,68,0.3)',
      borderRadius: 'var(--radius-sm)',
      color: '#f87171',
      fontSize: '0.82rem',
    },
    button: {
      width: '100%',
      padding: '13px',
      background: 'var(--accent)',
      color: '#000',
      border: 'none',
      borderRadius: 'var(--radius-sm)',
      fontWeight: 700,
      fontSize: '0.95rem',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.7 : 1,
      transition: 'background 0.15s',
      marginTop: '4px',
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      margin: '20px 0',
      color: 'var(--text-muted)',
      fontSize: '0.75rem',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: 'var(--border)',
    },
    googleButton: {
      width: '100%',
      padding: '12px',
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--text-primary)',
      fontWeight: 500,
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.7 : 1,
      transition: 'border-color 0.15s, background 0.15s',
    },
    toggle: {
      textAlign: 'center',
      marginTop: '24px',
      fontSize: '0.83rem',
      color: 'var(--text-secondary)',
    },
    link: {
      background: 'none',
      border: 'none',
      color: 'var(--accent)',
      fontWeight: 600,
      fontSize: 'inherit',
      cursor: 'pointer',
      padding: 0,
    },
  };

  return (
    <div style={s.container}>
      <div style={s.card}>
        {/* Logo */}
        <div style={s.logo}>
          <span style={s.logoText}>Venture</span>
          <p style={s.tagline}>Hidden gems travel planner</p>
        </div>

        {/* Email / password form */}
        <form onSubmit={handleEmailAuth} style={s.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={s.input}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={(e)  => (e.target.style.borderColor = 'var(--border)')}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={s.input}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={(e)  => (e.target.style.borderColor = 'var(--border)')}
            required
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          />

          {error && <div style={s.errorBox}>{error}</div>}

          <button
            type="submit"
            style={s.button}
            disabled={loading}
            onMouseEnter={(e) => { if (!loading) e.target.style.background = 'var(--accent-hover)'; }}
            onMouseLeave={(e) => { if (!loading) e.target.style.background = 'var(--accent)'; }}
          >
            {loading
              ? '…'
              : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div style={s.divider}>
          <div style={s.dividerLine} />
          <span>or</span>
          <div style={s.dividerLine} />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          style={s.googleButton}
          disabled={loading}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#555';
            e.currentTarget.style.background  = 'var(--card-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.background  = 'var(--card)';
          }}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Toggle sign in / sign up */}
        <p style={s.toggle}>
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            style={s.link}
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); clearError(); }}
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
