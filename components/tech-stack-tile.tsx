'use client';

import { motion } from 'framer-motion';
import * as React from 'react';
import { tileStyles } from '../styles/tileStyles';

type Lang = { name: string; pct: number; bytes: number }; // Updated to match repoData.languages format
type TechStackTileProps = {
  languages?: Lang[];
  className?: string;
  showHeader?: boolean;
};

export function TechStackTile({
  languages = [],
  className = '',
  showHeader = true,
}: TechStackTileProps) {
  const rows = React.useMemo(() => normalizeLanguages(languages), [languages]);

  console.log('Languages prop received:', languages); // Debug log to verify the `languages` prop

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={['glass-tile glass-decor p-4', className].join(' ')}
      aria-label="Tech stack"
    >
      {/* --- decoration BEHIND content --- */}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,.07),transparent_45%)]" />
      <div className="pointer-events-none absolute -inset-1 -z-10 rounded-[30px] ring-1 ring-white/10" />
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-[28px] bg-white/6 backdrop-blur-sm" />

      {/* --- content ABOVE decoration --- */}
      <div className="relative z-10">
        {/* Header */}
        {showHeader && (
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[18px]">🛠️</span>
            <h3 className="text-[20px] font-semibold leading-none text-slate-900">Tech Stack</h3>
          </div>
        )}

        {rows.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-2">
            {rows.map((l, i) => (
              <LanguageRow key={l.name} lang={l} index={i} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ----------------- subcomponents ----------------- */

function LanguageRow({ lang, index }: { lang: NormalizedLang; index: number }) {
  const pct = Math.max(0, Math.min(100, lang.pct));
  const label = pct.toFixed(pct < 10 && pct > 0 ? 1 : 0) + '%';
  const gradient = gradientByIndex(index);

  return (
    <div className="min-w-0 py-2">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-1">
        {/* name */}
        <span className="truncate text-[14px] font-semibold text-slate-900 w-20">{lang.name}</span>

        {/* bar */}
        <div className="relative h-4 w-full overflow-hidden rounded-full border border-white/15 bg-transparent">
          {/* subtle inner shadow on track */}
          <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_2px_6px_rgba(0,0,0,.06)]" />

          {/* pastel fill */}
          <div
            className={["h-full rounded-full bg-gradient-to-r transition-[width] duration-700 ease-out", gradient].join(" ")}
            style={{ width: `${pct}%` }}
            aria-hidden
          />

          {/* non-fill part with reduced opacity */}
          <div
            className={["absolute inset-0 rounded-full bg-gradient-to-r", gradient].join(" ")}
            style={{ opacity: 0.15 }}
            aria-hidden
          />

          {/* glossy top sheen */}
          <div className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,.45),rgba(255,255,255,0)_55%)] mix-blend-screen" />

          {/* leading edge glow */}
          <div
            className="pointer-events-none absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full blur-[6px] bg-white/20 transition-[left] duration-700 ease-out"
            style={{ left: `calc(${pct}% - 10px)`, opacity: pct < 4 ? 0 : 1 }}
            aria-hidden
          />
        </div>

        {/* pct */}
        <span className="w-10 text-right text-sm font-semibold text-slate-900">{label}</span>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-[112px] items-center justify-center rounded-2xl border border-white/10 bg-white/5">
      <p className="text-sm text-[#6B7280]">No language data available</p>
    </div>
  );
}

/* ----------------- helpers ----------------- */
type NormalizedLang = { name: string; pct: number };

function normalizeLanguages(list: Lang[]): NormalizedLang[] {
  if (!Array.isArray(list) || list.length === 0) return []; // Ensure list is an array

  // Map languages to include percentages and bytes
  const withPct = list.map((l) => ({
    name: l.name,
    pct: parseFloat(l.pct as unknown as string) || 0, // Ensure pct is parsed as a number
    bytes: parseInt(l.bytes as unknown as string, 10) || 0, // Ensure bytes is parsed as a number
  }));

  console.log('Parsed languages:', withPct); // Debug log to verify parsing

  // Calculate total percentage
  const sumPct = withPct.reduce((s, l) => s + (l.pct || 0), 0);
  let rows: NormalizedLang[];

  if (sumPct <= 0) {
    // If percentages are not provided, calculate based on bytes
    const totalBytes = withPct.reduce((s, l) => s + l.bytes, 0) || 1;
    rows = withPct.map((l) => ({ name: l.name, pct: clamp((l.bytes / totalBytes) * 100, 0, 100) }));
  } else {
    // Clamp percentages to ensure they are within 0-100
    rows = withPct.map((l) => ({ name: l.name, pct: clamp(l.pct, 0, 100) }));
  }

  // Sort rows by percentage in descending order
  rows.sort((a, b) => b.pct - a.pct);

  // Combine least significant items into "Other" if more than 3 items
  if (rows.length > 3) {
    const top = rows.slice(0, 2); // Take the top 2 items
    const otherPct = rows.slice(2).reduce((s, l) => s + l.pct, 0); // Combine the rest into "Other"
    top.push({ name: 'Other', pct: clamp(otherPct, 0, 100) });
    rows = top;
  }

  // Normalize percentages to ensure they sum to 100
  const total = rows.reduce((s, l) => s + l.pct, 0) || 1;
  return rows.map((l) => ({ ...l, pct: (l.pct / total) * 100 }));
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function gradientByIndex(i: number): string {
  switch (i) {
    case 0: return 'from-sky-300/90 via-indigo-300/80 to-fuchsia-300/90';
    case 1: return 'from-emerald-300/90 via-teal-300/80 to-cyan-300/90';
    case 2: return 'from-amber-300/90 via-orange-300/80 to-yellow-300/90';
    default: return 'from-rose-300/90 via-pink-300/80 to-fuchsia-300/90';
  }
}