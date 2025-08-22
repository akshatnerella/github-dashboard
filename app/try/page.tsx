'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertTriangle, Edit3, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BackgroundCanvas } from '@/components/background-canvas';
import { DashboardTiles } from '@/components/dashboard-tiles';
import { fetchGitHubData, TileData } from '@/lib/github-api';

function TryPageContent() {
  const searchParams = useSearchParams();
  const repo = searchParams.get('repo');
  const [isLoading, setIsLoading] = useState(true);
  const [tilesData, setTilesData] = useState<TileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (repoPath: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [owner, repoName] = repoPath.split('/');
      if (!owner || !repoName) {
        throw new Error('Invalid repository format. Expected: owner/repo');
      }
      
      const data = await fetchGitHubData(owner, repoName);
      setTilesData(data);
    } catch (err) {
      console.error('Error fetching repository data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch repository data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (repo) {
      fetchData(repo);
    }
  }, [repo, fetchData]);

  const handleSaveAsPNG = () => {
    // TODO: Implement PNG export functionality
    console.log('Save as PNG clicked');
  };

  const handleEditDashboard = () => {
    // TODO: Implement edit dashboard functionality (paid feature)
    console.log('Edit dashboard clicked');
  };

  if (!repo) {
    return (
      <div className="relative min-h-screen">
        <BackgroundCanvas />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-ink mb-4">
              No repository specified
            </h1>
            <p className="text-ink-2">Please provide a valid GitHub repository URL.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <BackgroundCanvas />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-5xl mx-auto">
          {/* 16:9 Dashboard Container - larger, but leaves space for buttons */}
          <div
            className="relative w-full mx-auto max-w-6xl max-h-[90vh] aspect-[16/9]"
            style={{}}
          >
            <div className="absolute inset-0 glass-card glass-highlight overflow-hidden">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-full"
              >
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-2 border-violet-400/30 border-t-violet-400 rounded-full mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold text-ink mb-2">
                    Analyzing {repo}
                  </h2>
                  <p className="text-ink-2">
                    Creating your beautiful dashboard...
                  </p>
                </div>
              </motion.div>
            ) : (
              error ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center justify-center h-full"
                >
                  <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-ink mb-2">
                      Unable to load repository
                    </h2>
                    <p className="text-ink-2 mb-4">{error}</p>
                    <Button onClick={() => repo && fetchData(repo)} className="glass-button brand-gradient">
                      Try Again
                    </Button>
                  </div>
                </motion.div>
              ) : tilesData ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="h-full"
                >
                  <DashboardTiles tiles={tilesData} />
                </motion.div>
              ) : null
            )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={handleEditDashboard}
              className="glass-button border-white/30 hover:bg-white/20 text-ink-2 hover:text-ink"
              variant="outline"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Dashboard
            </Button>
            <Button
              onClick={handleSaveAsPNG}
              className="glass-button brand-gradient"
            >
              <Download className="h-4 w-4 mr-2" />
              Save as PNG
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TryPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-2 border-violet-400/30 border-t-violet-400 rounded-full" />
      </div>
    }>
      <TryPageContent />
    </Suspense>
  );
}