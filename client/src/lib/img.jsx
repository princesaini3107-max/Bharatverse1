import { useState } from 'react';

// Deterministic heritage-toned gradient from a string, so every card has a
// distinct, pleasant placeholder even when a photo fails to load offline.
const PALETTES = [
  ['#E4841B', '#B23A63'],
  ['#0E9C86', '#1E1B3A'],
  ['#C56A10', '#9C5210'],
  ['#B23A63', '#6D2C57'],
  ['#0A7A6A', '#0E9C86'],
  ['#E4841B', '#C56A10'],
  ['#3A3560', '#0E9C86'],
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export function gradientFor(seed = '') {
  const [a, b] = PALETTES[hash(seed) % PALETTES.length];
  return `linear-gradient(135deg, ${a}, ${b})`;
}

/**
 * Image with a graceful gradient+initial fallback. Works offline: if the photo
 * URL fails (no network / dead link), we show a labelled gradient tile instead
 * of a broken image icon.
 */
export function SmartImage({ src, alt = '', seed, className = '', label }) {
  const [failed, setFailed] = useState(!src);
  const key = seed || alt || 'bharatverse';
  if (failed) {
    return (
      <div
        className={`flex items-center justify-center text-white ${className}`}
        style={{ background: gradientFor(key) }}
        role="img"
        aria-label={alt}
      >
        <span className="px-3 text-center font-display text-lg font-semibold drop-shadow-sm">
          {label || alt || 'BharatVerse'}
        </span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
