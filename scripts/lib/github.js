/**
 * getGitHubProject
 */

export async function getGitHubProject({ id }) {
  return fetch(`https://api.github.com/repos/${id}`).then(r => r.json());
}