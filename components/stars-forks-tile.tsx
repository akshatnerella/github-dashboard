'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork } from 'lucide-react';

import { tileStyles } from '@/styles/tileStyles'; // Adjust the import based on your project structure

type StarsForksTileProps = {
  stars: number;
  forks: number;
  className?: string;
};

export function StarsForksTile({ stars, forks, className = '' }: StarsForksTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={['glass-tile glass-decor p-4', className].join(' ')}
    >
      {/* décor */}
      <div aria-hidden className="absolute inset-0 -z-10 rounded-3xl 
        bg-[linear-gradient(180deg,rgba(255,255,255,.07),transparent_45%)]" />
      <div aria-hidden className="absolute -inset-1 -z-10 rounded-[26px] ring-1 ring-white/10" />

      {/* content */}
      <div className="grid grid-cols-2 gap-4 h-full items-center text-center">
        {/* Stars */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="grid place-items-center rounded-full p-2 bg-gradient-to-br from-yellow-300 to-amber-400">
              <Star className="w-5 h-5 text-white" />
            </span>
            <span className="text-[15px] font-medium text-slate-800">Stars</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">{stars.toLocaleString()}</div>
        </div>

        {/* Forks */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="grid place-items-center rounded-full p-2 bg-gradient-to-br from-indigo-400 to-sky-400">
              <GitFork className="w-5 h-5 text-white" />
            </span>
            <span className="text-[15px] font-medium text-slate-800">Forks</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">{forks.toLocaleString()}</div>
        </div>
      </div>
    </motion.div>
  );
}