import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchGitHubData } from '@/lib/github-api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { owner, repo } = req.query;
  if (typeof owner !== 'string' || typeof repo !== 'string') {
    return res.status(400).json({ error: 'Missing owner or repo' });
  }
  try {
    const data = await fetchGitHubData(owner, repo);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch GitHub data' });
  }
}
