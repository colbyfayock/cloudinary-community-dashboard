import { promises as fs } from 'fs';

import { getNpmProject, getNpmDownloads, getNpmLastDay } from './lib/npm.js';
import { getGitHubProject } from './lib/github.js';
import { getVideosByIds, getPlaylistVideoIds } from './lib/youtube.js';
import { YOUTUBE_PLAYLIST_ID_DEV_HINTS } from './data/youtube.js';

import projects from '../projects.json' assert { type: 'json' };

// Determine the date range to use for npm based off of
// the npm "last day" standard

const { end } = await getNpmLastDay();
const npmDateEnd = new Date(end);

// Get the current date

const date = new Date(Date.now());

// Collect reports for all tracked libraries / projects

const reportsProjects = await Promise.all(projects.map(async ({ id, npm, github }) => {

  /**
   * NPM
   */

  const projectNpm = await getNpmProject({ id: npm });
  const latest = projectNpm?.['dist-tags']?.latest;
  const lastPublished = projectNpm?.time?.[latest];

  // Get all downloads for the last day
  
  const downloads = await getNpmDownloads({
    id: npm,
    range: npmDateEnd.toISOString().split('T')[0]
  });

  /**
   * GitHub
   */

  // Get the GitHub project info

  const projectGitHub = await getGitHubProject({ id: github });

  return {
    id,
    latest,
    lastPublished,
    downloads: {
      count: downloads,
      date: npmDateEnd.toISOString()
    },
    stars: {
      count: projectGitHub.stargazers_count,
      date: date.toISOString()
    }
  }
}));

const videosDevHints = await getPlaylistVideoIds(YOUTUBE_PLAYLIST_ID_DEV_HINTS);
const videosData = await getVideosByIds(videosDevHints.map(({ contentDetails }) => contentDetails.videoId));

const reportsYouTube = videosData.map(video => {
  return {
    id: video.id,
    category: 'Dev Hints',
    likes: {
      count: video.statistics.likeCount,
      date: date.toISOString()
    },
    publishedAt: video.snippet.publishedAt,
    tags: video.snippet.tags,
    thumbnails: video.snippet.thumbnails,
    title: video.snippet.title,
    url: `https://www.youtube.com/watch?v=${video.id}`,
    views: {
      count: video.statistics.viewCount,
      date: date.toISOString()
    }
  }
})

const reports = {
  projects: reportsProjects,
  youtube: reportsYouTube
}

await fs.writeFile(`./reports/daily/${date.toISOString()}.json`, JSON.stringify(reports, null, 2));