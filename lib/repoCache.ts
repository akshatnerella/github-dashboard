import { useState, useEffect } from 'react';

let cachedRepoData: any = null;

export function useRepoCache() {
  const [repoData, setRepoData] = useState(cachedRepoData);

  const cacheRepoData = (data: any) => {
    cachedRepoData = data;
    setRepoData(data);
  };

  useEffect(() => {
    if (!repoData) {
      const fetchRepoData = async () => {
        const params = new URLSearchParams(window.location.search);
        const repo = params.get('repo');
        console.log('Fetching repo data for:', repo); // Debugging log
        if (repo && repo.trim() !== '') {
          const repoParts = repo.split('/');
          if (repoParts.length === 2) {
            const [owner, repoName] = repoParts;
            try {
              const encodedOwner = encodeURIComponent(owner.trim());
              const encodedRepo = encodeURIComponent(repoName.trim());
              const response = await fetch(
                `/api/github?owner=${encodedOwner}&repo=${encodedRepo}`
              );
              console.log('API response status:', response.status); // Debugging log
              if (response.ok) {
                const data = await response.json();
                console.log('Fetched repo data:', data); // Debugging log
                cacheRepoData(data);
              } else {
                console.error('Failed to fetch repo data:', response.statusText);
              }
            } catch (error) {
              console.error('Error fetching repo data:', error);
            }
          } else {
            console.error('Invalid repo format. Expected owner/repo.');
          }
        } else {
          console.error('Invalid or missing repo parameter in URL');
        }
      };
      fetchRepoData();
    }
  }, [repoData]);

  return { repoData, cacheRepoData };
}
