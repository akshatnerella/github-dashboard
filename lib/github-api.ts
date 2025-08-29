// lib/github-api.ts
// Deterministic GitHub API helpers for Tiles dashboard
// Uses GITHUB_TOKEN from .env.local if present (server-side only)

export interface GitHubRepo {
  license?: {
    key: string;
    name: string;
    spdx_id: string;
    url: string | null;
    node_id: string;
  };
  size: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  default_branch: string;

  // (Not returned by GitHub — these were your convenience shapes; we won't rely on them in fetches)
  directory_map: {
    top: Array<{
      name: string;
      url: string;
      file_count: number | null;
      bytes: number | null;
    }>;
    source: string;
    last_modified: string;
  };

  quality_signals: {
    has_readme: boolean;
    has_tests: boolean;
    has_docs: boolean;
    has_workflows: boolean;
    has_license: boolean;
    has_editorconfig: boolean;
    source: string;
    last_modified: string;
  };
}

export interface GitHubContributor {
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      date: string;
    };
  };
  html_url: string;
}

export interface GitHubLanguages {
  [key: string]: number;
}

export interface TileData {
  default_branch?: string;
  license?: string;
  size?: number;
  title: {
    text: string;
    source: string;
    last_modified: string;
  };
  tagline: {
    text: string;
    source: string;
    last_modified: string;
  };
  kpis: {
    stars: string;
    forks: string;
    open_issues: string;
    open_prs: string;
    watchers: string;
    source: string;
    last_modified: string;
  };
  timeline: {
    events: Array<{
      date: string;
      title: string;
      type: string;
      url: string;
    }>;
    source: string;
    last_modified: string;
  };
  contributors_leaderboard: {
    top: Array<{
      login: string;
      avatar_url: string;
      contributions: string;
    }>;
    source: string;
    last_modified: string;
  };
  tech_stack: {
    languages: Array<{
      name: string;
      bytes: string;
      pct: string;
    }>;
    source: string;
    last_modified: string;
  };
  repo_link: {
    repo_name: string;
    full_name: string;
    html_url: string;
    logo: string;
    description: string;
    source: string;
    last_modified: string;
  };
  readme: {
    url: string;
    source: string;
    last_modified: string;
    raw_data: string;
  };
  topics?: {
    items: string[];
    source: string;
    last_modified: string;
  };
  directory_map: {
    top: Array<{
      name: string;
      url: string;
      file_count: number | null;
      bytes: number | null;
    }>;
    source: 'git_tree' | 'git_tree_truncated' | 'contents_sample' | 'none';
    last_modified: string;
  };
  commit_calendar?: {
    weeks: number;
    start_date_utc: string;
    end_date_utc: string;
    max_count: number;
    daily: Record<string, number>;
    source: 'commits_window';
    last_modified: string;
  };
}

const GH = 'https://api.github.com';

function ghHeaders(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function fetchJson(url: string): Promise<any> {
  const r = await fetch(url, { headers: ghHeaders(), cache: 'no-store' });
  if (!r.ok) throw new Error(`${url} → ${r.status}`);
  return r.json();
}

async function tryJson(url: string): Promise<any | null> {
  try {
    return await fetchJson(url);
  } catch {
    return null;
  }
}

function decodeBase64Utf8(b64: string): string {
  try {
    // Node.js
    // @ts-ignore
    if (typeof Buffer !== 'undefined') return Buffer.from(b64, 'base64').toString('utf-8');
  } catch {}
  try {
    // Browser
    // atob gives latin1; decodeURIComponent(escape()) converts to utf-8
    // eslint-disable-next-line no-undef
    return decodeURIComponent(escape(atob(b64)));
  } catch {
    return '';
  }
}

// ------------------------------------------------------------------
// Main composite fetch used by your dashboard (kept close to original)
// ------------------------------------------------------------------
export async function fetchGitHubData(owner: string, repo: string): Promise<TileData> {
  const repoUrl = `${GH}/repos/${owner}/${repo}`;

  try {
    // parallel fetches
    const [
      repoData,
      contributorsData,
      languagesData,
      commitsData,
      pullsData,
      contentsData,
      topicsData,
    ] = await Promise.all([
      fetchJson(repoUrl) as Promise<GitHubRepo>,
      tryJson(`${repoUrl}/contributors?per_page=10`) as Promise<GitHubContributor[] | null>,
      tryJson(`${repoUrl}/languages`) as Promise<GitHubLanguages | null>,
      tryJson(`${repoUrl}/commits?per_page=5`) as Promise<GitHubCommit[] | null>,
      tryJson(`${repoUrl}/pulls?state=open&per_page=100`) as Promise<any[] | null>,
      tryJson(`${repoUrl}/contents`) as Promise<any[] | null>,
      tryJson(`${repoUrl}/topics`) as Promise<any | null>,
    ]);

    const commit_calendar = await fetchCommitCalendar(owner, repo, 12);

    const now = new Date().toISOString();

    // Languages → list (you’ll trim to top 2 + other in derive step/UI)
    const langObj = languagesData || {};
    const totalBytes = Object.values(langObj).reduce((sum: number, bytes: number) => sum + bytes, 0);
    const languages = Object.entries(langObj).map(([name, bytes]) => ({
      name,
      bytes: String(bytes),
      pct: totalBytes > 0 ? ((bytes / totalBytes) * 100).toFixed(1) : '0.0',
    }));

    // Commits → timeline events (first line of message)
    const commits = Array.isArray(commitsData) ? commitsData : [];
    const events = commits.map((c) => ({
      date: c.commit.author.date,
      title: (c.commit.message || '').split('\n')[0],
      type: 'commit_spike',
      url: c.html_url,
    }));

    // Contributors leaderboard
    const contributors = Array.isArray(contributorsData) ? contributorsData : [];
    const contributorsTop = contributors.map((u) => ({
      login: u.login,
      avatar_url: u.avatar_url,
      contributions: String(u.contributions),
    }));

    // Directory map (root-only; counts/bytes null unless you recurse)
    const contents = Array.isArray(contentsData) ? contentsData : [];
    const files = contents.map((i) => (typeof i?.name === 'string' ? i.name.toLowerCase() : ''));
    // Not returned in TileData, but you computed quality signals here:
    const quality_signals = {
      has_readme: files.some((f) => f.startsWith('readme')),
      has_tests: files.includes('tests') || files.includes('test'),
      has_docs: files.includes('docs'),
      has_workflows: files.includes('.github') || files.includes('workflows'),
      has_license: files.some((f) => f.startsWith('license')),
      has_editorconfig: files.includes('.editorconfig'),
    };

    // README raw (optional)
    const readmeJson = await tryJson(`${repoUrl}/readme`);
    const readmeRaw = readmeJson?.content ? decodeBase64Utf8(readmeJson.content) : '';

    // Pulls
    const pulls = Array.isArray(pullsData) ? pullsData : [];

    // Topics
    const topics = await fetchTopics(owner, repo);

    // Directory Map
    const directory_map = await fetchDirectoryMap(owner, repo, repoData.default_branch, 8);

    return {
      default_branch: repoData.default_branch,
      license: repoData.license?.spdx_id || repoData.license?.name || '—',
      size: repoData.size,

      title: {
        text: repoData.name,
        source: 'deterministic',
        last_modified: now,
      },

      tagline: {
        text: repoData.description || `${repoData.name} - A GitHub repository`,
        source: 'deterministic',
        last_modified: now,
      },

      kpis: {
        stars: String(repoData.stargazers_count),
        forks: String(repoData.forks_count),
        open_issues: String(repoData.open_issues_count),
        open_prs: String(pulls.length),
        watchers: String(repoData.watchers_count),
        source: 'deterministic',
        last_modified: now,
      },

      timeline: {
        events,
        source: 'deterministic',
        last_modified: now,
      },

      contributors_leaderboard: {
        top: contributorsTop,
        source: 'deterministic',
        last_modified: now,
      },

      tech_stack: {
        languages,
        source: 'deterministic',
        last_modified: now,
      },

      repo_link: {
        repo_name: repoData.name,
        full_name: repoData.full_name,
        html_url: repoData.html_url,
        logo: 'github',
        description: repoData.description || '',
        source: 'deterministic',
        last_modified: now,
      },

      readme: {
        url: `${repoData.html_url}#readme`,
        source: 'deterministic',
        last_modified: now,
        raw_data: readmeRaw,
      },

      topics: {
        items: topics,
        source: 'deterministic',
        last_modified: now,
      },

      directory_map,

      commit_calendar: {
        ...commit_calendar,
        source: 'commits_window',
        last_modified: now,
      },
    };
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    throw error;
  }
}

// ------------------------------------------------------------------
// Topics (fixed): uses GA endpoint + graceful fallback to repo.topics
// ------------------------------------------------------------------
export async function fetchTopics(owner: string, repo: string): Promise<string[]> {
  const topicsUrl = `${GH}/repos/${owner}/${repo}/topics`;
  const repoUrl = `${GH}/repos/${owner}/${repo}`;

  try {
    const topicsRes = await fetch(topicsUrl, { headers: ghHeaders(), cache: 'no-store' });
    if (topicsRes.ok) {
      const data = await topicsRes.json();
      return Array.isArray(data?.names) ? data.names : [];
    }

    // fallback to repo.topics
      const repoRes = await fetch(repoUrl, { headers: ghHeaders(), cache: 'no-store' });
    if (repoRes.ok) {
      const repoJson = await repoRes.json();
      return Array.isArray(repoJson?.topics) ? repoJson.topics : [];
    }

    console.warn('fetchTopics: both /topics and repo fallback failed', {
      topicsStatus: topicsRes.status,
      repoStatus: repoRes.status,
    });
    return [];
  } catch (err) {
    console.error('fetchTopics error:', err);
    return [];
  }
}

// ------------------------------------------------------------------
// Directory map (fixed): deterministic fetch of top-level directory contents
// ------------------------------------------------------------------
export async function fetchDirectoryMap(
  owner: string,
  repo: string,
  branch?: string,
  topN: number = 8
): Promise<{
  top: Array<{ name: string; url: string; file_count: number | null; bytes: number | null }>;
  source: 'git_tree' | 'git_tree_truncated' | 'contents_sample' | 'none';
  last_modified: string;
}> {
  const now = new Date().toISOString();
  let source: 'git_tree' | 'git_tree_truncated' | 'contents_sample' | 'none' = 'none';
  let buckets: Record<string, { files: number; bytes: number }> = {};

  try {
    const repoJson = await fetchJson(`${GH}/repos/${owner}/${repo}`);
    const ref = branch || repoJson.default_branch || 'main';

    const treeJson = await fetchJson(`${GH}/repos/${owner}/${repo}/git/trees/${ref}?recursive=1`);

    if (Array.isArray(treeJson.tree)) {
      for (const n of treeJson.tree) {
        if (n.type !== 'blob') continue;
        const top = n.path.includes('/') ? n.path.split('/')[0] : '(root)';
        const b = (buckets[top] ||= { files: 0, bytes: 0 });
        b.files += 1;
        if (typeof n.size === 'number') b.bytes += n.size;
      }
      source = treeJson.truncated ? 'git_tree_truncated' : 'git_tree';
    }

    if (Object.keys(buckets).length === 0 || source === 'git_tree_truncated') {
      const contents = await tryJson(`${GH}/repos/${owner}/${repo}/contents?ref=${ref}`);
      const topDirs = Array.isArray(contents)
        ? contents.filter((x) => x.type === 'dir').slice(0, 24)
        : [];

      for (const dir of topDirs) {
        const list = await tryJson(`${GH}/repos/${owner}/${repo}/contents/${encodeURIComponent(dir.name)}?ref=${ref}`);
        const files = Array.isArray(list) ? list.filter((x) => x.type === 'file') : [];
        const name = dir.name || '(root)';
        buckets[name] = {
          files: files.length,
          bytes: files.reduce((s, f) => s + (typeof f.size === 'number' ? f.size : 0), 0),
        };
      }

      if (!buckets['(root)']) {
        const rootFiles = Array.isArray(contents) ? contents.filter((x) => x.type === 'file') : [];
        if (rootFiles.length > 0) {
          buckets['(root)'] = {
            files: rootFiles.length,
            bytes: rootFiles.reduce((s, f) => s + (typeof f.size === 'number' ? f.size : 0), 0),
          };
        }
      }

      if (Object.keys(buckets).length > 0) source = source === 'git_tree_truncated' ? 'git_tree_truncated' : 'contents_sample';
    }

    const rows = Object.entries(buckets).map(([name, v]) => ({
      name,
      url:
        name === '(root)'
          ? `https://github.com/${owner}/${repo}/tree/${branch || repoJson.default_branch}`
          : `https://github.com/${owner}/${repo}/tree/${branch || repoJson.default_branch}/${name}`,
      file_count: v.files ?? null,
      bytes: v.bytes ?? null,
    }));

    rows.sort((a, b) => {
      if ((b.file_count ?? 0) !== (a.file_count ?? 0)) return (b.file_count ?? 0) - (a.file_count ?? 0);
      if ((b.bytes ?? 0) !== (a.bytes ?? 0)) return (b.bytes ?? 0) - (a.bytes ?? 0);
      return a.name.localeCompare(b.name);
    });

    return {
      top: rows.slice(0, topN),
      source,
      last_modified: now,
    };
  } catch (e) {
    console.warn('fetchDirectoryMap failed', e);
    return { top: [], source: 'none', last_modified: now };
  }
}

// ------------------------------------------------------------------
// Commit calendar: fetch daily commit counts for the trailing N weeks
// ------------------------------------------------------------------
export type CommitCalendar = {
  weeks: number;
  start_date_utc: string;       // ISO midnight (UTC) for the first day
  end_date_utc: string;         // ISO midnight (UTC) for the last day
  max_count: number;            // max commits in any day in window
  daily: Record<string, number>;// "YYYY-MM-DD" -> count
};

export async function fetchCommitCalendar(
  owner: string,
  repo: string,
  weeks: number = 12
): Promise<CommitCalendar> {
  const days = weeks * 7;
  const endUtcMid = new Date();
  endUtcMid.setUTCHours(0, 0, 0, 0);
  const startUtcMid = new Date(endUtcMid);
  startUtcMid.setUTCDate(endUtcMid.getUTCDate() - (days - 1));

  const sinceParam = startUtcMid.toISOString();
  const untilParam = new Date(endUtcMid.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString();

  const daily: Record<string, number> = {};
  let maxCount = 0;
  const maxPages = 5;

  try {
    for (let page = 1; page <= maxPages; page++) {
      const commits = await tryJson(
        `${GH}/repos/${owner}/${repo}/commits?since=${sinceParam}&until=${untilParam}&per_page=100&page=${page}`
      );

      if (!Array.isArray(commits) || commits.length === 0) break;

      for (const commit of commits) {
        const date = commit?.commit?.author?.date;
        if (!date) continue;

        const dayKey = new Date(date).toISOString().split('T')[0];
        daily[dayKey] = (daily[dayKey] || 0) + 1;
        maxCount = Math.max(maxCount, daily[dayKey]);
      }

      if (commits.length < 100) break;
    }
  } catch (error) {
    console.warn('fetchCommitCalendar failed', error);
  }

  return {
    weeks,
    start_date_utc: startUtcMid.toISOString(),
    end_date_utc: endUtcMid.toISOString(),
    max_count: maxCount,
    daily,
  };
}
