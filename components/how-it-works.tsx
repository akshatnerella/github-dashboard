'use client';

import { motion } from 'framer-motion';
import { Link2, Bot, ExternalLink } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Link2,
    title: 'Paste repo',
    description: 'Drop in any public GitHub repository URL. Our system instantly validates and begins analyzing your project structure, README, and codebase.',
  },
  {
    number: '02',
    icon: Bot,
    title: 'AI builds tiles',
    description: 'Advanced AI parses your repository metadata, commit history, languages, contributors, and project health to generate stunning visual tiles automatically.',
  },
  {
    number: '03',
    icon: ExternalLink,
    title: 'Share your dashboard',
    description: 'Receive a beautiful, responsive dashboard with a shareable public URL. Perfect for portfolios, team updates, or project presentations.',
  },
];

export function HowItWorks() {
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
            How it works
          </h2>
          <p className="text-ink-2 text-lg">
            Three simple steps to create your project showcase
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative text-center"
              >
                {/* Connection line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-violet-400/50 to-blue-400/50 transform -translate-y-1/2" />
                )}
                
                <div className="glass-card glass-highlight relative p-8 group hover:scale-105 transition-transform">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 mb-6 relative z-10">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold">
                    {step.number}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-ink mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-ink-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}