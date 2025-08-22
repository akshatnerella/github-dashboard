'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative z-10 mt-20"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="glass-card relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          
          <div className="flex flex-col md:flex-row justify-between items-center py-8 px-6">
            <p className="text-ink-2 text-sm mb-4 md:mb-0">
              © LogSpace {currentYear}. All rights reserved.
            </p>
            
            <nav className="flex space-x-6">
              {['Terms', 'Privacy', 'Contact'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-ink-2 text-sm hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400/60 rounded px-2 py-1"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}