import { Github } from 'lucide-react';
import { motion } from 'framer-motion';
import * as React from 'react';

import { tileStyles } from '@/styles/tileStyles';

type TitleTileProps = {
  title: string;
  subtitle: string;
  className?: string;
};

export function TitleTile({ title, subtitle, className = '' }: TitleTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={[tileStyles.glassTileBase, 'p-4', className].join(' ')}
    >
      {/* décor overlays */}
      <div aria-hidden className="absolute inset-0 -z-10 rounded-3xl bg-[linear-gradient(180deg,rgba(255,255,255,.07),transparent_45%)]" />
      <div aria-hidden className="absolute -inset-1 -z-10 rounded-[26px] ring-1 ring-white/10" />

      {/* content */}
      <div className="flex items-start gap-3">
        <div
          className="grid place-items-center overflow-hidden rounded-full bg-gradient-to-br from-violet-400 to-sky-300 p-3 shrink-0"
          aria-hidden="true"
        >
          <Github className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-5xl font-bold bg-gradient-to-br from-violet-400 to-sky-300 bg-clip-text text-transparent truncate leading-tight">
            {title}
          </h1>
          <p className="text-base text-slate-800 line-clamp-2">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
}
