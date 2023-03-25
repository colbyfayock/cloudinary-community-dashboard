// https://github.com/npm/registry/blob/master/docs/download-counts.md

import { promises as fs } from 'fs';

import projects from '../projects.json' assert { type: 'json' };

const range = 'last-week';

const results = await Promise.all(projects.map(async ({ id, npm, github }) => {
  // Collect npmjs.org stats

  const projectNpm = await getNpmProject({ id: npm });
  const latest = projectNpm?.['dist-tags']?.latest;
  const lastPublished = projectNpm?.time?.[latest];
  
  const downloads = await getNpmDownloads({
    id: npm,
    range
  });

  const downloadsByVersion = await getNpmDownloadsByVersion({
    id: npm,
    range
  });

  const versions = Object.keys(downloadsByVersion).reduce((prev, curr) => {
    prev[curr] = {
      downloads: downloadsByVersion[curr]
    }
    return prev;
  }, {});

  // Get GitHub project info

  const projectGitHub = await getGitHubProject({ id: github });

  return {
    id,
    npm,
    github,
    latest,
    lastPublished,
    downloads,
    versions,
    range,
    stars: projectGitHub.stargazers_count
  }
}));

await fs.writeFile(`./reports/${new Date(Date.now()).toISOString()}.json`, JSON.stringify(results, null, 2));

/**
 * getNpmDownloads
 */

async function getNpmDownloads({ id, rangeType = 'point', range = 'last-week' }) {
  const { downloads } = await fetch(`https://api.npmjs.org/downloads/${rangeType}/${range}/${id.replace('/', '%2F')}`).then(r => r.json());
  return downloads;
}

/**
 * getNpmDownloadsByVersion
 */

async function getNpmDownloadsByVersion({ id, range = 'last-week' }) {
  const { downloads } = await fetch(`https://api.npmjs.org/versions/${id.replace('/', '%2F')}/${range}`).then(r => r.json());
  return downloads;
}


/**
 * getNpmProject
 */

async function getNpmProject({ id }) {
  return fetch(`https://registry.npmjs.org/${id}`).then(r => r.json());
}

/**
 * getGitHubProject
 */

async function getGitHubProject({ id }) {
  return fetch(`https://api.github.com/repos/${id}`).then(r => r.json());
}