'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Github, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { normalizeRepoUrl, saveRecentRepo } from '@/lib/validateRepo';
import { useRepoCache } from '../lib/repoCache';

export function Hero() {
  const [repoUrl, setRepoUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { cacheRepoData } = useRepoCache();
  const router = useRouter();

  const isValidRepo = normalizeRepoUrl(repoUrl) !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidRepo) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const repoInfo = normalizeRepoUrl(repoUrl)!;
      const repoData = await fetch(`/api/github?owner=${repoInfo.owner}&repo=${repoInfo.repo}`).then((res) => res.json());

      cacheRepoData(repoData); // Cache the fetched data
      router.push(`/try?repo=${repoInfo.owner}/${repoInfo.repo}`);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepoUrl(e.target.value);
    if (error) setError('');
  };

  return (
    <section className="relative z-10 flex items-center justify-center min-h-screen"> {/* Centered hero */}
      <div className="mx-auto max-w-7xl px-4 md:px-6 flex flex-col items-center"> {/* Added flex and items-center */}
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-semibold tracking-tight text-ink mb-4"
          >
            Live, shareable dashboards for{' '}
            <span className="bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
              everything you build
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-ink-2 mb-8 leading-relaxed"
          >
            Paste a public GitHub repo to generate a gorgeous project showcase in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card glass-highlight relative mx-auto max-w-2xl p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-center"> {/* Added items-center */}
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                    <Github className="h-5 w-5 text-ink-2" />
                  </div>
                  <Input
                    type="url"
                    placeholder="https://github.com/owner/repo"
                    value={repoUrl}
                    onChange={handleInputChange}
                    className="pl-12 h-12 glass-card border-white/30 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/20 placeholder:text-ink-2/60"
                    aria-label="GitHub repository URL"
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? 'repo-error' : 'repo-help'}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!isValidRepo || isLoading}
                  className="h-12 px-8 glass-button brand-gradient hover:scale-105 transition-transform focus:ring-2 focus:ring-violet-400/60 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Try Tiles with this repository"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      Try it now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              {error && (
                <div
                  id="repo-error"
                  className="flex items-center gap-2 text-red-400 text-sm"
                  role="alert"
                  aria-live="polite"
                >
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <p
                id="repo-help"
                className="text-ink-2/70 text-sm"
              >
                No OAuth needed for public repos
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}