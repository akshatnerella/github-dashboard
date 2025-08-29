import * as React from 'react';
import { motion } from 'framer-motion';
import { fetchTopics } from '../lib/github-api';
import { tileStyles } from '../styles/tileStyles';

type TopicsTileProps = {
  topics: string[];            // raw repo topics
  maxVisible?: number;         // total chips to render including the "+N" chip if needed (default 6)
  className?: string;
  title?: string;              // heading text (default "Topics")
  owner?: string;              // GitHub repo owner
  repo?: string;               // GitHub repo name
};

export function TopicsTile({
  topics,
  maxVisible = 6,
  className = '',
  title = 'Topics',
  owner,
  repo,
}: TopicsTileProps) {
  const [fetchedTopics, setFetchedTopics] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (owner && repo) {
      fetchTopics(owner, repo)
        .then((data) => setFetchedTopics(data))
        .catch((error) => console.error('Failed to fetch topics:', error));
    }
  }, [owner, repo]);

  // Ensure stable array
  const list = fetchedTopics.length > 0 ? fetchedTopics : topics;
  const hasOverflow = list.length > maxVisible;
  const visibleCount = hasOverflow ? Math.max(0, 3) : list.length; // Changed maxVisible logic to show 3 topics and +
  const visible = list.slice(0, visibleCount);
  const hiddenCount = hasOverflow ? list.length - visibleCount : 0;

  // Soft pastel gradient classes to rotate across chips
  const pastel = [
    'from-sky-300/60 to-indigo-300/60',
    'from-fuchsia-300/60 to-purple-300/60',
    'from-emerald-300/60 to-teal-300/60',
    'from-amber-300/60 to-orange-300/60',
    'from-rose-300/60 to-pink-300/60',
    'from-cyan-300/60 to-sky-300/60',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={['glass-tile glass-decor p-4', className].join(' ')}
    >
      {/* Decorative layers (behind content) */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 -z-10 ${tileStyles.rounding} ${tileStyles.glossiness}`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute -inset-[1px] -z-10 ${tileStyles.rounding} ${tileStyles.frosting}`}
      />

      {/* Header */}
      <div className="flex items-center justify-between mt-1">
        <h3 className="text-[20px] font-semibold text-slate-900">
          🏷️ {title}
        </h3>
      </div>
      <div className="h-px w-full bg-white/20" />

      {/* Chips */}
      <div className="flex flex-wrap gap-2">
        {visible.length === 0 ? (
          <p className="text-sm text-gray-500">No topics available</p>
        ) : (
          visible.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="inline-flex items-center rounded-full px-3 py-2 text-sm font-medium text-slate-800 bg-white/40 backdrop-blur-sm ring-1 ring-white/30 relative overflow-hidden"
            >
              <span
                aria-hidden
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-sky-300/60 to-indigo-300/60 opacity-45"
              />
              <span className="leading-none truncate">{t}</span>
            </span>
          ))
        )}

        {hasOverflow && (
          <span
            className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-slate-800 bg-white/40 backdrop-blur-sm ring-1 ring-white/30 relative overflow-hidden"
            aria-label={`${hiddenCount} more topics`}
            title={`${hiddenCount} more topics`}
          >
            <span
              aria-hidden
              className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-slate-200/60 to-slate-300/60 opacity-45"
            />
            <span className="leading-none truncate">+{hiddenCount}</span>
          </span>
        )}
      </div>
    </motion.div>
  );
}
