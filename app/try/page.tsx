"use client";

import { BackgroundCanvas } from '@/components/background-canvas';
import { TitleTile } from '@/components/title-tile';
import { RepoMetaTile } from '@/components/repo-meta-tile';
import { TechStackTile } from '@/components/tech-stack-tile';
import { TopContributorsTile } from '@/components/top-contributors-tile';
import { CommitHistoryTile } from '@/components/commit-history-tile';
import { TopicsTile } from '@/components/topics-tile';
import { IssuesPrsTile } from '@/components/issues-prs-tile';
import { DirectoryMapTile } from '@/components/directory-map-tile';
import { StarsForksTile } from '@/components/stars-forks-tile';
import { MadeWithTiles } from '@/components/made-with-tiles';
import { useRepoCache } from '@/lib/repoCache';
import { useEffect, useState } from 'react';
import { toPng } from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';

// Extend the Window interface to include repoName
declare global {
  interface Window {
    repoName?: string;
  }
}

export default function TryPage() {
  const { repoData } = useRepoCache();

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('Copied to clipboard!');

  useEffect(() => {
    if (repoData) {
      console.log('Raw repo data:', repoData);
    }
  }, [repoData]);

  if (!repoData) {
    return <div>Loading...</div>;
  }

  const { title, tagline } = repoData;

  const showToastFor = (msg: string, ms = 2000) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), ms);
  };

  const handleCopyAsPng = async () => {
    const node = document.getElementById('dashboard-root');
    if (!node) {
      console.error('dashboard-root not found');
      return;
    }

    try {
      node.style.background = 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)';

      if ('fonts' in document) {
        // @ts-ignore
        await (document as any).fonts.ready;
      }

      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: 'transparent',
        filter: (n: Node) =>
          !(n instanceof HTMLElement && n.dataset?.excludeFromExport === 'true'),
      });

      const res = await fetch(dataUrl);
      const blob = await res.blob();

      const ClipboardItemAny = (window as any).ClipboardItem;
      if (ClipboardItemAny && navigator.clipboard?.write) {
        const item = new ClipboardItemAny({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        console.log('Image copied to clipboard');
        showToastFor('Copied to clipboard!');
      } else {
        const a = document.createElement('a');
        const repoName = window.repoName || 'tiles-dashboard';
        a.download = `${repoName}.png`;
        a.href = dataUrl;
        a.click();
        console.warn('Clipboard API not supported; downloaded instead.');
        showToastFor('Downloaded PNG');
      }
    } catch (err) {
      console.error('Failed to copy PNG to clipboard', err);
      showToastFor('Copy failed');
    } finally {
      node.style.background = '';
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden flex flex-col items-center justify-center">
      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50
                       px-5 py-2 rounded-xl shadow-lg border border-white/30
                       backdrop-blur-xl text-sm font-medium text-slate-900
                       bg-gradient-to-r from-pink-200/80 via-purple-200/80 to-sky-200/80"
            role="status"
            aria-live="polite"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background */}
      <div data-exclude-from-export="true">
        <BackgroundCanvas />
      </div>

      {/* 16:9 dashboard */}
      <div
        id="dashboard-root"
        className="w-[72vw] h-[calc(72vw*9/16)] bg-white/10 backdrop-blur-lg rounded-lg mb-8 flex items-center justify-center border border-white/20"
      >
        <div className="relative w-full h-full grid grid-cols-16 grid-rows-9 gap-2 p-2 box-border">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-10" />
          <div className="col-span-8 row-span-2">
            <TitleTile
              title={title?.text || 'No title available'}
              subtitle={tagline?.text || 'No tagline available'}
              className="col-span-8 row-span-2"
            />
          </div>
          <TechStackTile
            languages={repoData.tech_stack.languages || []}
            className="col-span-4 row-start-3 row-span-3"
          />
          <TopContributorsTile
            contributors={repoData.contributors_leaderboard || { top: [], source: '', last_modified: '' }}
            className="col-span-6 row-start-3 row-span-3"
          />
          <CommitHistoryTile
            commits={repoData.timeline?.events || []}
            className="col-span-6 row-start-3 row-span-5"
          />
          <TopicsTile
            topics={[]}
            className="col-span-4 row-span-2"
            owner={repoData.repo_link.full_name.split('/')[0]}
            repo={repoData.repo_link.full_name.split('/')[1]}
          />
          <RepoMetaTile
            defaultBranch={repoData.default_branch || 'N/A'}
            license={repoData.license || 'N/A'}
            sizeKB={repoData.size || 0}
            lastPush={repoData.timeline?.events?.[0]?.date || ''}
            className="col-span-4 row-span-2"
          />
          <IssuesPrsTile
            openIssues={repoData.kpis.open_issues}
            openPRs={repoData.kpis.open_prs}
            repoUrl={repoData.repo_link.html_url}
            className="col-span-5 row-span-4"
          />
          <DirectoryMapTile
            directories={repoData.directory_map.top}
            className="col-span-5 row-span-4"
          />
          <StarsForksTile
            stars={parseInt(repoData.kpis.stars, 10)}
            forks={parseInt(repoData.kpis.forks, 10)}
            className="col-span-4 row-span-2"
          />
          <MadeWithTiles className="col-span-2 row-span-2" />
        </div>
      </div>

      {/* Actions */}
      <div className="w-full flex justify-center">
        <div className="flex gap-4 pb-8">
          <button
            onClick={() => alert('Coming soon')}
            className="glass-card glass-highlight rounded-lg px-4 py-2 text-base font-semibold flex items-center gap-2 shadow border border-violet-400/30 backdrop-blur-md transition hover:bg-violet-300/20 hover:border-violet-500/40 btn-gradient-violet"
          >
            {/* Minimal outline pen SVG */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="text-violet-600 mr-1"><path d="M13.5 3.5l3 3-10 10H3.5v-3l10-10z"/><path d="M12 5l3 3"/></svg>
            Edit Dashboard
          </button>

          <button
            onClick={handleCopyAsPng}
            className="glass-card glass-highlight rounded-lg px-4 py-2 text-base font-semibold flex items-center gap-2 shadow border border-pink-400/30 backdrop-blur-md transition hover:bg-pink-200/40 hover:border-pink-400/50"
          >
            {/* Clipboard icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600 mr-1">
              <rect x="9" y="7" width="10" height="13" rx="2" ry="2"></rect>
              <path d="M15 7V5a2 2 0 0 0-2-2h-4.5a2 2 0 0 0-2 2v11"></path>
              <path d="M12 12h4"></path>
              <path d="M12 16h4"></path>
            </svg>
            Copy as PNG
          </button>
        </div>
      </div>
    </div>
  );
}
