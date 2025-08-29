"use client";

import { motion } from 'framer-motion';
import { GitBranch, Clock, BadgeCheck, HardDrive } from 'lucide-react';
import * as React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { tileStyles } from '../styles/tileStyles';

type RepoMetaTileProps = {
  lastPush?: string;
  defaultBranch?: string;
  license?: string;
  sizeKB?: number;
  className?: string;
};

export function RepoMetaTile({
  lastPush,
  defaultBranch = '—',
  license = '—',
  sizeKB = 0,
  className = '',
}: RepoMetaTileProps) {
  const formattedLastPush = lastPush
    ? formatDistanceToNow(new Date(lastPush), { addSuffix: true }).replace('about ', '')
    : 'N/A';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={["glass-tile glass-decor p-4", className].join(" ")}
    >
      <dl className="grid grid-cols-2 gap-5 pt-1.5">
        <MetaItem icon={<Clock className="w-4 h-4 text-gray-600" />} label="Last Push" value={formattedLastPush} />
        <MetaItem icon={<GitBranch className="w-4 h-4 text-gray-600" />} label="Branch" value={defaultBranch} />
        <MetaItem icon={<BadgeCheck className="w-4 h-4 text-gray-600" />} label="License" value={license} />
        <MetaItem icon={<HardDrive className="w-4 h-4 text-gray-600" />} label="Size" value={`${sizeKB} KB`} />
      </dl>
    </motion.div>
  );
}

function MetaItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <div>{icon}</div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-sm font-medium text-gray-800 truncate">{value}</span>
      </div>
    </div>
  );
}
