export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  default_branch: string;
}

export interface GitHubContributor {
  login: string;
  avatar_url: string;
  contributions: number;
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
  };
}

export async function fetchGitHubData(owner: string, repo: string): Promise<TileData> {
  const baseUrl = 'https://api.github.com/repos';
  const repoUrl = `${baseUrl}/${owner}/${repo}`;
  
  try {
    // Fetch all data concurrently
    const [repoResponse, contributorsResponse, languagesResponse, commitsResponse, pullsResponse] = await Promise.all([
      fetch(`${repoUrl}`),
      fetch(`${repoUrl}/contributors?per_page=10`),
      fetch(`${repoUrl}/languages`),
      fetch(`${repoUrl}/commits?per_page=5`),
      fetch(`${repoUrl}/pulls?state=open&per_page=100`)
    ]);

    // Check if all requests were successful
    if (!repoResponse.ok) {
      throw new Error(`Repository not found: ${repoResponse.status}`);
    }

    const [repoData, contributorsData, languagesData, commitsData, pullsData]: [
      GitHubRepo,
      GitHubContributor[],
      GitHubLanguages,
      GitHubCommit[],
      any[]
    ] = await Promise.all([
      repoResponse.json(),
      contributorsResponse.ok ? contributorsResponse.json() : [],
      languagesResponse.ok ? languagesResponse.json() : {},
      commitsResponse.ok ? commitsResponse.json() : [],
      pullsResponse.ok ? pullsResponse.json() : []
    ]);

    const now = new Date().toISOString();

    // Process languages data
    const totalBytes = Object.values(languagesData).reduce((sum, bytes) => sum + bytes, 0);
    const languages = Object.entries(languagesData).map(([name, bytes]) => ({
      name,
      bytes: bytes.toString(),
      pct: totalBytes > 0 ? ((bytes / totalBytes) * 100).toFixed(1) : '0.0'
    }));

    // Process timeline events
    const events = commitsData.map(commit => ({
      date: commit.commit.author.date,
      title: commit.commit.message.split('\n')[0], // First line only
      type: 'commit_spike',
      url: commit.html_url
    }));

    // Process contributors
    const contributors = contributorsData.map(contributor => ({
      login: contributor.login,
      avatar_url: contributor.avatar_url,
      contributions: contributor.contributions.toString()
    }));

    return {
      title: {
        text: repoData.name,
        source: 'deterministic',
        last_modified: now
      },
      tagline: {
        text: repoData.description || `${repoData.name} - A GitHub repository`,
        source: 'deterministic',
        last_modified: now
      },
      kpis: {
        stars: repoData.stargazers_count.toString(),
        forks: repoData.forks_count.toString(),
        open_issues: repoData.open_issues_count.toString(),
        open_prs: pullsData.length.toString(),
        watchers: repoData.watchers_count.toString(),
        source: 'deterministic',
        last_modified: now
      },
      timeline: {
        events,
        source: 'deterministic',
        last_modified: now
      },
      contributors_leaderboard: {
        top: contributors,
        source: 'deterministic',
        last_modified: now
      },
      tech_stack: {
        languages,
        source: 'deterministic',
        last_modified: now
      },
      repo_link: {
        repo_name: repoData.name,
        full_name: repoData.full_name,
        html_url: repoData.html_url,
        logo: 'github',
        description: repoData.description || '',
        source: 'deterministic',
        last_modified: now
      },
      readme: {
        url: `${repoData.html_url}#readme`,
        source: 'deterministic',
        last_modified: now
      }
    };
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    throw error;
  }
}