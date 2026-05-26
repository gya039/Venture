import { Inter } from 'next/font/google';
import './globals.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import DevSwKiller from '@/components/DevSwKiller';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Venture — Hidden Gems Travel Planner',
  description:
    'Discover the places most tourists never find. AI-powered hidden gems for every trip.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Venture',
  },
};

// Next.js 16: viewport + themeColor live in generateViewport, not metadata
export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
    themeColor: '#0a0a0a',
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Critical CSS — paints background instantly before globals.css loads (prevents white flash) */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --bg: #0a0a0a; --card: #141414; --border: #222;
            --text-primary: #f5f5f5; --accent: #f59e0b;
          }
          html, body { background: #0a0a0a; color: #f5f5f5; margin: 0; }
        `}} />
        {/* Favicons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16.png" />
        {/* PWA iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Venture" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === 'development' && <DevSwKiller />}
      </body>
    </html>
  );
}
