export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  owner: {
    login: string;
  };
}

export interface GithubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

export async function getRepos(accessToken: string): Promise<GithubRepo[]> {
  const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=10", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch repos");
  return response.json() as Promise<GithubRepo[]>;
}

export async function getCommits(accessToken: string, owner: string, repo: string): Promise<GithubCommit[]> {
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
  return response.json() as Promise<GithubCommit[]>;
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
export interface GithubCommitFile {
  filename: string;
  changes: number;
  additions: number;
  deletions: number;
}

export async function getCommitFiles(accessToken: string, owner: string, repo: string, sha: string): Promise<GithubCommitFile[]> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) return [];
  const data = await response.json();
  return data.files ?? [];
}

export interface RepoStats {
  totalAdditions: number;
  totalDeletions: number;
  totalChanges: number;
}

export async function getRepoStats(accessToken: string, owner: string, repo: string, commits: GithubCommit[]): Promise<RepoStats> {
  const details = await Promise.all(
    commits.slice(0, 15).map((c) =>
      fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${c.sha}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }).then((r) => r.json())
    )
  );

  return details.reduce(
    (acc, detail) => ({
      totalAdditions: acc.totalAdditions + (detail.stats?.additions ?? 0),
      totalDeletions: acc.totalDeletions + (detail.stats?.deletions ?? 0),
      totalChanges: acc.totalChanges + (detail.stats?.total ?? 0),
    }),
    { totalAdditions: 0, totalDeletions: 0, totalChanges: 0 }
  );
}