'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Users, Code, Star, GitBranch, Calendar } from 'lucide-react';

const mockTiles = [
  {
    id: 1,
    icon: Star,
    title: 'Project Stars',
    value: '2.4k',
    trend: '+12%',
    color: 'text-yellow-400',
  },
  {
    id: 2,
    icon: Users,
    title: 'Contributors',
    value: '23',
    trend: '+3 this week',
    color: 'text-blue-400',
  },
  {
    id: 3,
    icon: Code,
    title: 'Languages',
    value: 'TypeScript, React',
    trend: '85% TS',
    color: 'text-violet-400',
  },
  {
    id: 4,
    icon: GitBranch,
    title: 'Active Branches',
    value: '7',
    trend: '2 merged today',
    color: 'text-green-400',
  },
  {
    id: 5,
    icon: Calendar,
    title: 'Last Activity',
    value: '2 hours ago',
    trend: 'Main branch',
    color: 'text-pink-400',
  },
];

export function AnimatedTilesPeek() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockTiles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [shouldReduceMotion, isPaused]);

  const visibleTiles = [
    mockTiles[currentIndex],
    mockTiles[(currentIndex + 1) % mockTiles.length],
    mockTiles[(currentIndex + 2) % mockTiles.length],
  ];

  return (
    <section className="relative z-10 py-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-ink mb-4">
            Beautiful dashboard tiles, auto-generated
          </h2>
          <p className="text-ink-2 text-lg">
            Get insights at a glance with our intelligent project analytics
          </p>
        </motion.div>

        <div
          className="flex justify-center gap-6 overflow-hidden px-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {visibleTiles.map((tile, index) => {
            const Icon = tile.icon;
            return (
              <motion.div
                key={`${tile.id}-${currentIndex}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card glass-highlight relative w-64 p-6 group hover:scale-105 transition-transform"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg bg-white/10 ${tile.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium text-ink">{tile.title}</h3>
                </div>
                
                <div className="space-y-2">
                  <p className="text-2xl font-semibold text-ink">{tile.value}</p>
                  <p className="text-sm text-ink-2">{tile.trend}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {mockTiles.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400/60 ${
                Math.floor(currentIndex / 3) === Math.floor(index / 3)
                  ? 'bg-violet-400'
                  : 'bg-white/30'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}