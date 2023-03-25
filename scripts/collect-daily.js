// https://github.com/npm/registry/blob/master/docs/download-counts.md

import { promises as fs } from 'fs';

import { getNpmProject, getNpmDownloads } from './lib/npm.js';
import { getGitHubProject } from './lib/github.js';

import projects from '../projects.json' assert { type: 'json' };

const date = new Date(Date.now());
const dateEnd = new Date(date - 1 * 24 * 60 * 60 * 1000);

const results = await Promise.all(projects.map(async ({ id, npm, github }) => {
  const projectNpm = await getNpmProject({ id: npm });
  const latest = projectNpm?.['dist-tags']?.latest;
  const lastPublished = projectNpm?.time?.[latest];
  
  const downloads = await getNpmDownloads({
    id: npm,
    range: dateEnd.toISOString().split('T')[0]
  });

  const projectGitHub = await getGitHubProject({ id: github });

  return {
    id,
    latest,
    lastPublished,
    downloads,
    stars: projectGitHub.stargazers_count
  }
}));

await fs.writeFile(`./reports/daily/${new Date(Date.now()).toISOString()}.json`, JSON.stringify(results, null, 2));