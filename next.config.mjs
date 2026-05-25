/**
 * next.config.mjs — Venture
 *
 * PWA NOTE: next-pwa and @ducanh2912/next-pwa both inject webpack config
 * which conflicts with Next.js 16's default Turbopack bundler.
 * Week 4 will wire up Serwist (Turbopack-native service worker) for full PWA.
 * The /public/manifest.json and meta tags are already in place.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
