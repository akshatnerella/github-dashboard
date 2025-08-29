'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { tileStyles } from '@/styles/tileStyles';

type Commit = {
  sha?: string;
  title: string;
  author?: string;
  date: string; // ISO
};

type CommitHistoryTileProps = {
  commits: Commit[];
  className?: string;
  showHeader?: boolean;
  maxItems?: number;      // default 5
  showRelative?: boolean; // default true
  timeZone?: string;      // default 'UTC'
};

export function CommitHistoryTile({
  commits,
  className = '',
  showHeader = true,
  maxItems = 5,
  showRelative = true,
  timeZone = 'UTC',
}: CommitHistoryTileProps) {
  const items = React.useMemo(() => (commits || []).slice(0, maxItems), [commits, maxItems]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={['glass-tile glass-decor p-4', className].join(' ')}
      aria-label="Recent activity"
    >
      {/* décor behind content */}
      <div aria-hidden className={[tileStyles.glossiness, tileStyles.rounding].join(' ')} />
      <div aria-hidden className={tileStyles.frosting} />

      {showHeader && (
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[18px]">📅</span>
          <h3 className={tileStyles.header}>Recent Activity</h3>
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex h-[120px] items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <p className={tileStyles.bodyText}>No recent commits</p>
        </div>
      ) : (
        <div className="relative">
          {/* left rail: centered in the 22px rail column */}
          <div aria-hidden className={tileStyles.rail} />

          {/* list: two columns [22px rail/node | content], no extra padding */}
          <ul className="relative z-10 space-y-2 pl-0 pr-1">
            {items.map((c, i) => (
              <Row
                key={(c.sha ?? '') + i}
                commit={c}
                index={i}
                timeZone={timeZone}
                showRelative={showRelative}
              />
            ))}
          </ul>

          {/* bottom fade */}
          <div aria-hidden className={tileStyles.fade} />
        </div>
      )}
    </motion.div>
  );
}

/* ----------------- Row ----------------- */

function Row({
  commit,
  index,
  timeZone,
  showRelative,
}: {
  commit: Commit;
  index: number;
  timeZone: string;
  showRelative: boolean;
}) {
  const abs = formatDate(commit.date, timeZone);
  const rel = showRelative ? formatRelative(commit.date) : null;
  const shaShort = commit.sha ? commit.sha.slice(0, 7) : null;
  const [g1, g2] = dotGradient(index);

  return (
    // grid: first col is 22px (rail & node), second is content
    <li className="grid grid-cols-[22px_1fr] gap-2">
      {/* node, vertically nudged so its center lines up with first text line */}
      <div className="flex items-start justify-center">
        <span
          className="block h-3.5 w-3.5 rounded-full ring-2 ring-white/60 translate-y-[13px]"
          style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}
        />
      </div>

      {/* content bubble */}
      <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
        <div
          className="truncate text-[15px] font-semibold leading-[20px] text-slate-900"
          title={commit.title}
        >
          {commit.title}
        </div>

        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[12px] leading-[18px] text-slate-700">
          <span className="tabular-nums">{abs}</span>
          {rel && (
            <>
              <TinyDot />
              <span>{rel}</span>
            </>
          )}
          {shaShort && (
            <>
              <TinyDot />
              <span className="font-mono">{shaShort}</span>
            </>
          )}
          {commit.author && (
            <>
              <TinyDot />
              <span className="truncate">{commit.author}</span>
            </>
          )}
        </div>
      </div>
    </li>
  );
}

/* ----------------- tiny inline separator dot ----------------- */
function TinyDot() {
  return <span className="inline-block h-[5px] w-[5px] rounded-full bg-slate-400/80 align-middle" />;
}

/* ----------------- helpers ----------------- */

function dotGradient(i: number): [string, string] {
  const p: [string, string][] = [
    ['#7CB8FF', '#8B7CFF'],
    ['#8B7CFF', '#F59BCB'],
    ['#5EEAD4', '#22D3EE'],
    ['#FDE68A', '#FCA5A5'],
  ];
  return p[i % p.length];
}

function formatDate(input?: string | Date, tz: string = 'UTC') {
  if (!input) return '—';
  const d = input instanceof Date ? input : new Date(input);
  const date = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: tz,
  }).format(d);
  const time = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: tz,
  }).format(d);
  return `${date} • ${time} ${tz}`;
}

function formatRelative(input?: string | Date) {
  if (!input) return null;
  const d = input instanceof Date ? input : new Date(input);
  const s = Math.max(1, Math.floor((Date.now() - d.getTime()) / 1000));
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ];
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  for (const [unit, sec] of steps) {
    const v = Math.floor(s / sec);
    if (Math.abs(v) >= (unit === 'second' ? 0 : 1)) return rtf.format(-v, unit);
  }
  return 'just now';
}