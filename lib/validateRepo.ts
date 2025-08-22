export const GH_REGEX = 
  /^(?:https?:\/\/)?(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+)(?:\/)?$/i;

export interface RepoInfo {
  owner: string;
  repo: string;
}

export function normalizeRepoUrl(input: string): RepoInfo | null {
  const s = input.trim();
  if (!s) return null;
  
  const pref = s.startsWith('http') ? s : `https://${s}`;
  const match = pref.match(GH_REGEX);
  
  return match ? { owner: match[1], repo: match[2] } : null;
}

export function saveRecentRepo(owner: string, repo: string): void {
  try {
    const repoKey = `${owner}/${repo}`;
    const recent = getRecentRepos();
    const filtered = recent.filter(r => r !== repoKey);
    const updated = [repoKey, ...filtered].slice(0, 5);
    
    localStorage.setItem('ls_recent_repos', JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save recent repo:', error);
  }
}

export function getRecentRepos(): string[] {
  try {
    const stored = localStorage.getItem('ls_recent_repos');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to get recent repos:', error);
    return [];
  }
}