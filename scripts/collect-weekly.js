// https://github.com/npm/registry/blob/master/docs/download-counts.md

import { promises as fs } from 'fs';

import { getNpmDownloads, getNpmDownloadsByVersion } from './lib/npm.js';

import projects from '../projects.json' assert { type: 'json' };

const date = new Date(Date.now());
const dateEnd = new Date(date - 1 * 24 * 60 * 60 * 1000);
const dateStart = new Date(dateEnd - 7 * 24 * 60 * 60 * 1000);

const results = await Promise.all(projects.map(async ({ id, npm }) => {  
  const downloads = await getNpmDownloads({
    id: npm,
    range: `${dateStart.toISOString().split('T')[0]}:${dateEnd.toISOString().split('T')[0]}`
  });

  const downloadsByVersion = await getNpmDownloadsByVersion({
    id: npm,
    range: 'last-week'
  });

  const versions = Object.keys(downloadsByVersion).reduce((prev, curr) => {
    prev[curr] = {
      downloads: downloadsByVersion[curr]
    }
    return prev;
  }, {});

  return {
    id,
    dateStart: dateStart.toISOString(),
    dateEnd: dateEnd.toISOString(),
    downloads,
    versions,
  }
}));

await fs.writeFile(`./reports/weekly/${new Date(Date.now()).toISOString()}.json`, JSON.stringify(results, null, 2));