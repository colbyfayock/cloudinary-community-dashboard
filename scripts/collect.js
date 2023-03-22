// https://github.com/npm/registry/blob/master/docs/download-counts.md

import { promises as fs } from 'fs';

import projects from '../projects.json' assert { type: 'json' };

const date = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
const dateWeekBefore = new Date(date - 7 * 24 * 60 * 60 * 1000);

const results = await Promise.all(projects.map(async ({ id, npm, github }) => {
  const projectNpm = await fetch(`https://registry.npmjs.org/${npm}`).then(r => r.json());
  const latest = projectNpm?.['dist-tags']?.latest;
  const lastPublished = projectNpm?.time?.[latest];

  const projectGitHub = await fetch(`https://api.github.com/repos/${github}`).then(r => r.json());

  const rangeStart = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const rangeEnd = `${dateWeekBefore.getFullYear()}-${dateWeekBefore.getMonth()}-${dateWeekBefore.getDate()}`

  // const sevenDaysAgo: Date = new Date()  

  const { downloads: downloadsByVersion } = await fetch(`https://api.npmjs.org/versions/${npm.replace('/', '%2F')}/last-week`).then(r => r.json());
  // const { downloads: downloadsTotal } = await fetch(`https://api.npmjs.org/downloads/point/last-week/${npm.replace('/', '%2F')}`).then(r => r.json());
  const { downloads: downloadsTotal } = await fetch(`https://api.npmjs.org/downloads/point/${rangeEnd}:${rangeStart}/${npm.replace('/', '%2F')}`).then(r => r.json());

  console.log('npm', npm)
  console.log('downloadsTotal', downloadsTotal)

  return {
    id,
    npm,
    github,
    latest,
    lastPublished,
    downloadsByVersion,
    downloadsTotal,
    stars: projectGitHub.stargazers_count
  }
}));

await fs.writeFile(`./reports/${date.toISOString()}.json`, JSON.stringify(results, null, 2));