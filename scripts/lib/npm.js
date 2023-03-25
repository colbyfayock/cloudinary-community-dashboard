/**
 * getNpmDownloads
 */

export async function getNpmDownloads({ id, rangeType = 'point', range = 'last-week' }) {
  const { downloads } = await fetch(`https://api.npmjs.org/downloads/${rangeType}/${range}/${id.replace('/', '%2F')}`).then(r => r.json());
  return downloads;
}

/**
 * getNpmDownloadsByVersion
 */

export async function getNpmDownloadsByVersion({ id, range = 'last-week' }) {
  const { downloads } = await fetch(`https://api.npmjs.org/versions/${id.replace('/', '%2F')}/${range}`).then(r => r.json());
  return downloads;
}


/**
 * getNpmProject
 */

export async function getNpmProject({ id }) {
  return fetch(`https://registry.npmjs.org/${id}`).then(r => r.json());
}