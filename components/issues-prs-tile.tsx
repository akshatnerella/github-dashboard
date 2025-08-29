import * as React from 'react';
import { motion } from 'framer-motion';
import { GitPullRequest, AlertCircle, CheckCircle2 } from 'lucide-react';

type IssuesPrsTileProps = {
  openIssues: number | string;
  openPRs: number | string;
  repoUrl: string;
  className?: string;
  title?: string;
};

export function IssuesPrsTile({
  openIssues,
  openPRs,
  repoUrl,
  className = '',
  title = 'Issues & PRs',
}: IssuesPrsTileProps) {
  const issues = Number(openIssues ?? 0);
  const prs = Number(openPRs ?? 0);
  const total = Math.max(1, issues + prs);

  const issuesPct = Math.round((issues / total) * 100);
  const prsPct = Math.min(100, Math.max(0, Math.round((prs / total) * 100)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={['glass-tile glass-decor p-4', className].join(' ')}
    >
      {/* décor */}
      <div aria-hidden className="absolute inset-0 -z-10 rounded-3xl bg-[linear-gradient(180deg,rgba(255,255,255,.07),transparent_45%)]" />
      <div aria-hidden className="absolute -inset-1 -z-10 rounded-[26px] ring-1 ring-white/10" />

      {/* header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[20px] font-semibold leading-none text-slate-900">{title}</h3>
        <a
          href={`${repoUrl}/issues`}
          target="_blank"
          rel="noreferrer"
          className="text-[12px] font-medium text-slate-700 hover:text-slate-900 underline/30"
        >
          Open on GitHub
        </a>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {/* Issues block */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-500" />
            <span className="text-sm font-semibold text-slate-900">Open Issues</span>
          </div>
          <div className="mt-2 flex items-end justify-between">
            <span className="text-2xl font-bold tabular-nums text-slate-900">{issues}</span>
            <span className="text-[12px] text-slate-700">{issuesPct}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/20" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={issuesPct} title="Open Issues Progress">
            <div className={`h-full rounded-full bg-gradient-to-r from-rose-300/80 to-pink-300/80 w-[${issuesPct}%]`} />
          </div>
          <a
            href={`${repoUrl}/issues?q=is%3Aissue+is%3Aopen`}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block text-[12px] text-slate-700 hover:text-slate-900 underline/30"
          >
            View issues
          </a>
        </div>

        {/* PRs block */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2">
            <GitPullRequest className="h-4 w-4 text-sky-600" />
            <span className="text-sm font-semibold text-slate-900">Open PRs</span>
          </div>
          <div className="mt-2 flex items-end justify-between">
            <span className="text-2xl font-bold tabular-nums text-slate-900">{prs}</span>
            <span className="text-[12px] text-slate-700">{prsPct}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/20" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={prsPct} title="Open PRs Progress">
            <div className={`h-full rounded-full bg-gradient-to-r from-sky-300/80 to-indigo-300/80 w-[${prsPct}%]`} />
          </div>
          <a
            href={`${repoUrl}/pulls?q=is%3Apr+is%3Aopen`}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block text-[12px] text-slate-700 hover:text-slate-900 underline/30"
          >
            View pull requests
          </a>
        </div>
      </div>

      {/* footer */}
      <div className="mt-3 flex items-center gap-2 text-[12px] text-slate-700">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
        <span>{total === 1 ? '1 item tracked' : `${total} items tracked`} • Issues + PRs</span>
      </div>
    </motion.div>
  );
}
