'use client';

import { motion } from 'framer-motion';
import { Sparkles, Palette, Share2 } from 'lucide-react';

const benefits = [
  {
    icon: Sparkles,
    title: 'Auto-summaries',
    description: 'We parse your repo and draft highlights automatically.',
  },
  {
    icon: Palette,
    title: 'Beautiful tiles',
    description: 'Polished showcase-ready components.',
  },
  {
    icon: Share2,
    title: 'Share anywhere',
    description: 'Public link for your project updates.',
  },
];

export function Benefits() {
  return (
    <section className="relative z-10 py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-4">
            Everything you need to showcase your work
          </h2>
          <p className="text-ink-2 text-lg max-w-2xl mx-auto">
            From parsing your code to creating beautiful presentations, we handle the details so you can focus on building.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card glass-highlight relative p-8 text-center group hover:scale-105 transition-transform"
              >
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-violet-500/20 to-blue-500/20 mb-6">
                  <Icon className="h-8 w-8 text-violet-400" />
                </div>
                
                <h3 className="text-xl font-semibold text-ink mb-3">
                  {benefit.title}
                </h3>
                
                <p className="text-ink-2 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}