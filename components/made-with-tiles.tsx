'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { tileStyles } from '@/styles/tileStyles'; // Adjust the import based on your project structure

type MadeWithTilesProps = {
  href?: string;        // defaults to tiles.nerella.me
  className?: string;   // e.g. "col-span-2 row-span-2"
  showSubtext?: boolean; // show the URL line (default true)
};

export function MadeWithTiles({
  href = 'https://tiles.nerella.me',
  className = '',
  showSubtext = true,
}: MadeWithTilesProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 6, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={['glass-tile glass-decor p-4', className].join(' ')}
      aria-label="Made with Tiles — tiles.nerella.me"
    >
      {/* décor behind content */}
      <div aria-hidden className="absolute inset-0 -z-10 rounded-3xl bg-[linear-gradient(180deg,rgba(255,255,255,.07),transparent_45%)]" />
      <div aria-hidden className="absolute -inset-1 -z-10 rounded-[26px] ring-1 ring-white/10" />

      {/* content */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        {/* gradient logo bubble */}
        <div className="relative grid place-items-center rounded-2xl p-2.5 bg-gradient-to-br from-sky-300 to-fuchsia-300 ring-1 ring-white/40 shadow-sm">
          <TilesLogo className="h-5 w-5 text-white" />
          {/* subtle sheen */}
          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,.45),transparent_55%)] mix-blend-screen" />
        </div>

        <div className="text-[13px] font-semibold leading-none text-slate-900">
          Made with Tiles
        </div>
        {showSubtext && (
          <div className="text-[11px] leading-none text-slate-700/90">
            tiles.nerella.me
          </div>
        )}
      </div>
    </motion.a>
  );
}

/** Simple “tiles” mark: 2×2 rounded squares */
function TilesLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="3"  y="3"  width="8" height="8" rx="2" />
      <rect x="13" y="3"  width="8" height="8" rx="2" opacity="0.9" />
      <rect x="3"  y="13" width="8" height="8" rx="2" opacity="0.9" />
      <rect x="13" y="13" width="8" height="8" rx="2" opacity="0.85" />
    </svg>
  );
}
