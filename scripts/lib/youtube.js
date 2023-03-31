import * as dotenv from 'dotenv';
import { google } from 'googleapis';

import { YOUTUBE_CHANNEL_ID_CLOUDINARY } from '../data/youtube.js';

dotenv.config();

const youtube = google.youtube('v3');

/**
 * getVideosByIds
 */

export async function getVideosByIds(ids) {
  const results = await youtube.videos.list({
    auth: process.env.GOOGLE_API_KEY,
    part: 'snippet,contentDetails,statistics',
    id: ids.join(','),
    maxResults: 999,
  });
  return results.data.items;
}

/**
 * getPlaylistVideoIds
 */

export async function getPlaylistVideoIds(playlistId) {
  const results = await youtube.playlistItems.list({
    auth: process.env.GOOGLE_API_KEY,
    part: 'contentDetails',
    maxResults: 999,
    playlistId
  });
  return results.data.items;
}

/**
 * searchVideos
 */

export async function searchVideos(keyword) {
  const results = await youtube.search.list({
    auth: process.env.GOOGLE_API_KEY,
    part: 'snippet',
    q: keyword,
    maxResults: 999,
    channelId: YOUTUBE_CHANNEL_ID_CLOUDINARY,
    type: 'video'
  });
  return results.data.items;
}