import { promises as fs } from 'fs';

import { getNpmDownloads, getNpmDownloadsByVersion, getNpmLastDay } from './lib/npm.js';

import projects from '../projects.json' assert { type: 'json' };

// Determine the date range to use for npm based off of
// the npm "last day" standard

const { end } = await getNpmLastDay();
const npmDateEnd = new Date(end);
const npmDateStart = new Date(npmDateEnd - 7 * 24 * 60 * 60 * 1000);

// Get the current date

const date = new Date(Date.now());

// Collect reports

const reports = await Promise.all(projects.map(async ({ id, npm }) => {  

  /**
   * NPM
   */

  // Get all of the npm downloads for the last week

  const downloads = await getNpmDownloads({
    id: npm,
    range: `${npmDateStart.toISOString().split('T')[0]}:${npmDateEnd.toISOString().split('T')[0]}`
  });

  // Find all downloads broken down by version. This however is only
  // available as "last week" and does not provide any historical data
  // beyond that "last week"

  const downloadsByVersion = await getNpmDownloadsByVersion({
    id: npm,
    range: 'last-week'
  });

  // Reformat the data to make it easier to parse and understand correctly in the UI

  const versions = Object.keys(downloadsByVersion).reduce((prev, curr) => {
    prev[curr] = {
      downloads: {
        count: downloadsByVersion[curr],
        dateStart: npmDateStart.toISOString(),
        dateEnd: npmDateEnd.toISOString(),
      }
    }
    return prev;
  }, {});

  return {
    id,
    downloads: {
      count: downloads,
      dateStart: npmDateStart.toISOString(),
      dateEnd: npmDateEnd.toISOString(),
    },
    versions,
  }
}));

await fs.writeFile(`./reports/weekly/${date.toISOString()}.json`, JSON.stringify(reports, null, 2));