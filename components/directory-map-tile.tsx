'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { FolderTree } from 'lucide-react';
import { tileStyles } from '@/styles/tileStyles'; // Adjust the import based on your project structure

type DirItem = {
  name: string;
  file_count: number | null;
  bytes: number | null;
};

type DirectoryMapTileProps = {
  directories: DirItem[];
  className?: string;
  title?: string; // default "Directory Map"
};

export function DirectoryMapTile({
  directories,
  className = '',
  title = 'Directory Map',
}: DirectoryMapTileProps) {
  // Fallback if no counts/bytes: just render list
  const dirs = (directories || []).slice(0, 6); // limit to top 6 for cleanliness
  const maxFiles = Math.max(...dirs.map((d) => d.file_count || 0), 1);

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
      <div className="mb-2 flex items-center gap-2">
        <FolderTree className="h-4 w-4 text-slate-700" />
        <h3 className="text-[17px] font-semibold leading-none text-slate-900">{title}</h3>
      </div>

      {dirs.length === 0 ? (
        <div className="flex h-[120px] items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <p className="text-sm text-[#6B7280]">No directory data</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {dirs.map((d, i) => {
            const files = d.file_count ?? 0;
            const pct = Math.round((files / maxFiles) * 100);
            return (
              <li key={d.name}>
                <div className="flex items-center justify-between text-[13px] font-medium text-slate-800">
                  <span className="truncate">{d.name}/</span>
                  <span className="tabular-nums">{files || '—'}</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/20 relative">
                  {/* Non-fill gradient */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-transparent opacity-30" />
                  {/* Filled part */}
                  <div
                    className={`absolute h-full rounded-full bg-gradient-to-r from-sky-300/70 to-indigo-300/70 external-class-for-styles`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </motion.div>
  );
}
