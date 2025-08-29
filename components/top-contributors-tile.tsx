'use client';

import { motion } from 'framer-motion';
import * as React from 'react';
import { tileStyles } from '../styles/tileStyles';

type Contributor = {
  login: string;
  avatar_url?: string | null;
  contributions?: string | number | null;
  html_url?: string | null;
};

type ContributorsLeaderboard = {
  top: Contributor[];
  source?: string;
  last_modified?: string;
};

type TopContributorsTileProps = {
  contributors?: ContributorsLeaderboard;
  className?: string;   // override grid spans
  showHeader?: boolean; // default true
  maxPrimary?: number;  // how many regular cards before "+N others" (default 3)
  repoContributorsUrl?: string; // optional: link target for the "others" chip
};

export function TopContributorsTile({
  contributors = { top: [] },
  className = '',
  showHeader = true,
  maxPrimary = 3,
  repoContributorsUrl,
}: TopContributorsTileProps) {
  const list = React.useMemo(() => {
    const arr = (contributors?.top ?? [])
      .filter(Boolean)
      .map((c) => ({
        ...c,
        contributions: Number(c.contributions ?? 0),
      }))
      .sort((a, b) => (b.contributions as number) - (a.contributions as number));
    return arr;
  }, [contributors]);

  const primary = list.slice(0, maxPrimary);
  const others = list.slice(maxPrimary);
  const cols = others.length > 0 ? 4 : Math.min(3, primary.length || 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={['glass-tile glass-decor p-4', className].join(' ')}
      aria-label="Top contributors"
    >
      {/* decorations behind content */}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-[linear-gradient(180deg,rgba(255,255,255,.07),transparent_45%)]" />
      <div className="pointer-events-none absolute -inset-1 -z-10 rounded-[26px] ring-1 ring-white/10" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-transparent opacity-30" />

      {showHeader && (
        <>
          <div className="flex items-center gap-2">
            <span className="text-xl">👥</span>
            <h3 className="text-[20px] font-semibold text-slate-900 pt-1">Top Contributors</h3>
          </div>
          <div className="my-1 h-px bg-white/10" />
        </>
      )}

      {list.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="grid grid-cols-2 gap-2">
          {primary.map((c, i) => (
            <li key={c.login || i}>
              <ContributorCard c={c} rank={i} />
            </li>
          ))}

          {others.length > 0 && (
            <li>
              <OthersStack others={others} />
            </li>
          )}
        </ul>
      )}
    </motion.div>
  );
}

/* ----------------- subcomponents ----------------- */

function ContributorCard({ c, rank }: { c: Contributor; rank: number }) {
  const commits = formatCommits(Number(c.contributions ?? 0));
  const href = c.html_url || (c.login ? `https://github.com/${c.login}` : undefined);

  return (
    <a
      href={href}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5
                 transition hover:border-white/20 hover:bg-white/10 text-slate-900 min-h-[56px]"
    >
      <div className="relative shrink-0">
        <Avatar login={c.login} src={c.avatar_url || undefined} />
        {rank === 0 && (
          <span className="absolute -right-1 -top-1 text-base leading-none drop-shadow-sm" aria-hidden>
            👑
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        {/* more room + proper truncation */}
        <div className="truncate text-[15px] font-semibold !text-slate-900">
          {c.login ?? 'unknown'}
        </div>
        <div className="text-xs font-medium !text-slate-700">{commits}</div>
      </div>
    </a>
  );
}

function Avatar({ src, login }: { src?: string; login?: string }) {
  const initials = (login ? login[0] : '?').toUpperCase();
  return src ? (
    <div className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-white/30">
      {/* keep square, then object-cover to prevent oval warping */}
      <img
        src={src}
        alt={login ? `${login} avatar` : 'avatar'}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  ) : (
    <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-violet-400/50 to-sky-300/50 text-[12px] font-bold text-white ring-1 ring-white/30">
      {initials}
    </div>
  );
}

function OthersStack({
  others,
  href,
}: {
  others: Contributor[];
  href?: string;
}) {
  const firstThree = others.slice(0, 3);
  const extra = Math.max(0, others.length - firstThree.length);

  const Inner = (
    <div className="flex items-center gap-6 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5">
      <div className="relative h-10">
        {/* overlapping avatars */}
        <div className="relative h-10 w-[72px]">
          {firstThree.map((p, i) => (
            <div
              key={p.login || i}
              className="absolute top-0"
              style={{ left: `${i * 18}px` }}
            >
              <Avatar login={p.login} src={p.avatar_url || undefined} />
            </div>
          ))}
          {extra > 0 && (
            <div className="absolute top-0 left-[54px] grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white/90 text-xs font-semibold text-slate-800">
              +{extra}
            </div>
          )}
        </div>
      </div>
      <div className="min-w-0">
        <div className="text-[14px] font-semibold text-slate-900">Other</div>
        <div className="text-xs text-slate-700">contributors</div>
      </div>
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block transition hover:border-white/20 hover:bg-white/10">
      {Inner}
    </a>
  ) : (
    Inner
  );
}

function EmptyState() {
  return (
    <div className="flex h-[60px] items-center justify-center rounded-2xl border border-white/10 bg-white/5">
      <p className="text-sm text-[#6B7280]">No contributor data yet</p>
    </div>
  );
}

/* ----------------- helpers ----------------- */

function formatCommits(n: number): string {
  if (!n || n <= 0) return '—';
  return `${n} ${n === 1 ? 'commit' : 'commits'}`;
}
