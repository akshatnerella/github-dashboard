'use client';

import { motion } from 'framer-motion';
import { Github, FileText, Linkedin } from 'lucide-react';

const integrations = [
  { name: 'GitHub', icon: Github },
  { name: 'Notion', icon: FileText },
  { name: 'LinkedIn', icon: Linkedin },
];

export function Integrations() {
  return (
    <section className="relative z-10 py-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-ink-2 text-lg mb-8">Works seamlessly with</p>
          
          <div className="flex justify-center items-center gap-8 md:gap-12">
            {integrations.map((integration, index) => {
              const Icon = integration.icon;
              return (
                <motion.div
                  key={integration.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="glass-card relative px-6 py-4 hover:scale-105 transition-transform group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-ink-2 group-hover:text-ink transition-colors" />
                    <span className="text-ink-2 font-medium group-hover:text-ink transition-colors">
                      {integration.name}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}