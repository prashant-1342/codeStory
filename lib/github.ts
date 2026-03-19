export async function getRepos(accessToken: string) {
  const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=10", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch repos");
  return response.json();
}

export async function getCommits(accessToken: string, owner: string, repo: string) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?per_page=30`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch commits");
  return response.json();
}

export async function getCommitDetail(accessToken: string, owner: string, repo: string, sha: string) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch commit detail");
  return response.json();
}