/**
 * Generate PWA icons for Venture using sharp (already a Next.js dependency).
 * Run with: node scripts/gen-icons.mjs
 */
import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir  = join(__dirname, '..', 'public', 'icons');

mkdirSync(iconsDir, { recursive: true });

// SVG source — dark background + amber "V" compass rose mark
function svgIcon(size) {
  const pad  = Math.round(size * 0.12);
  const r    = Math.round(size * 0.22); // corner radius
  const cx   = size / 2;
  const cy   = size / 2;

  // "V" path — vertically centred, ~60% of icon height
  const vTop    = Math.round(size * 0.22);
  const vBottom = Math.round(size * 0.76);
  const vMid    = Math.round(size * 0.55);
  const vLeft   = Math.round(size * 0.2);
  const vRight  = Math.round(size * 0.8);
  const vCenter = cx;
  const sw      = Math.max(2, Math.round(size * 0.09)); // stroke width

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1000"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#bg)"/>
  <!-- Amber glow disc -->
  <circle cx="${cx}" cy="${cy}" r="${Math.round(size * 0.32)}" fill="rgba(245,158,11,0.10)"/>
  <!-- V letterform -->
  <polyline
    points="${vLeft},${vTop} ${vCenter},${vBottom} ${vRight},${vTop}"
    fill="none"
    stroke="url(#accent)"
    stroke-width="${sw}"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <!-- Dot above the V — like a compass needle tip -->
  <circle cx="${vCenter}" cy="${Math.round(size * 0.14)}" r="${Math.round(sw * 0.75)}" fill="#f59e0b"/>
</svg>`;
}

async function makeIcon(size, filename) {
  const svg = Buffer.from(svgIcon(size));
  await sharp(svg)
    .png()
    .toFile(join(iconsDir, filename));
  console.log(`✓  ${filename} (${size}×${size})`);
}

await makeIcon(192,  'icon-192.png');
await makeIcon(512,  'icon-512.png');
await makeIcon(180,  'apple-touch-icon.png');
await makeIcon(32,   'favicon-32.png');
await makeIcon(16,   'favicon-16.png');

console.log('\n✅  All icons generated in public/icons/');
