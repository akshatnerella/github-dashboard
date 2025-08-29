'use client';

import { motion } from 'framer-motion';
import * as React from 'react';

type Heading = { text: string; href?: string };
type ReadmeTileProps = {
  readmeUrl?: string;        // e.g. https://github.com/owner/repo#readme
  repoUrl?: string;          // e.g. https://github.com/owner/repo
  description?: string;      // fallback text if we don’t fetch README
  headings?: Heading[];      // optional: top 2–4 README anchors you pre-compute
  className?: string;        // override grid spans
  showHeader?: boolean;      // default true
  maxExcerptChars?: number;  // default 180
};

export function ReadmeTile({
  readmeUrl,
  repoUrl,
  description,
  headings = [],
  className = '',
  showHeader = true,
  maxExcerptChars = 180,
}: ReadmeTileProps) {
  const excerpt = React.useMemo(
    () => (description ? truncate(description, maxExcerptChars) : null),
    [description, maxExcerptChars]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={[
        // default span for overview layout
        'col-span-6 row-span-2',
        'w-full h-full isolate',
        'relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl',
        'shadow-[0_24px_80px_rgba(13,16,27,.35)] px-6 py-5',
        className,
      ].join(' ')}
      aria-label="Project README"
    >
      {/* decorations behind content (no overlay glow on text) */}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-[linear-gradient(180deg,rgba(255,255,255,.07),transparent_45%)]" />
      <div className="pointer-events-none absolute -inset-1 -z-10 rounded-[26px] ring-1 ring-white/10" />

      {showHeader && (
        <>
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <h3 className="text-[18px] font-semibold text-slate-900">README</h3>
          </div>
          <div className="my-3 h-px bg-white/10" />
        </>
      )}

      {/* Body */}
      <div className="flex h-[calc(100%-72px)] flex-col justify-between">
        <div className="space-y-3">
          {excerpt ? (
            <p className="text-[15px] leading-6 text-slate-800">
              {excerpt}
            </p>
          ) : (
            <p className="text-[15px] leading-6 text-slate-500">
              No README summary available.
            </p>
          )}

          {/* Optional headings/anchors */}
          {headings.length > 0 && (
            <ul className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {headings.slice(0, 4).map((h, i) => (
                <li key={`${h.text}-${i}`}>
                  <a
                    href={h.href || readmeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2
                               text-sm text-slate-900 transition hover:border-white/20 hover:bg-white/10"
                  >
                    <span className="text-base">#</span>
                    <span className="truncate">{h.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* CTAs */}
        <div className="mt-4 flex items-center gap-3">
          {readmeUrl && (
            <a
              href={readmeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2
                         text-sm font-semibold text-slate-900 transition hover:border-white/25 hover:bg-white/15"
            >
              Open README
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-80">
                <path d="M7 17L17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          )}
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2
                         text-sm font-medium text-slate-800 transition hover:border-white/20 hover:bg-white/10"
            >
              Open Repo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ----------------- helpers ----------------- */

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  // try to cut on a word boundary close to max
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…';
}
