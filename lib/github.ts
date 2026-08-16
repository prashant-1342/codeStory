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
  const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
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

export interface RepoHealth {
  openIssues: number;
  openPRs: number;
  license: string | null;
  hasReadme: boolean;
  hasCI: boolean;
  hasTests: boolean;
}

export async function getRepoHealth(accessToken: string, owner: string, repo: string): Promise<RepoHealth> {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/vnd.github.v3+json",
  };

  const [repoInfoRes, pullsRes, contentsRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=100`, { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, { headers }),
  ]);

  if (!repoInfoRes.ok) throw new Error("Failed to fetch repo info");

  const repoInfo = await repoInfoRes.json();
  const pulls = pullsRes.ok ? await pullsRes.json() : [];
  const contents = contentsRes.ok ? await contentsRes.json() : [];

  const openPRs = Array.isArray(pulls) ? pulls.length : 0;
  const openIssues = Math.max(0, (repoInfo.open_issues_count ?? 0) - openPRs);
  const license = repoInfo.license?.spdx_id ?? null;

  const hasReadme = Array.isArray(contents) && contents.some(
    (item: any) => item.name.toLowerCase().startsWith("readme")
  );

  const hasTests = Array.isArray(contents) && contents.some(
    (item: any) => {
      const name = item.name.toLowerCase();
      if (item.type === "dir" && (name === "test" || name === "tests" || name === "__tests__")) {
        return true;
      }
      if (item.type === "file" && (
        name.startsWith("jest.config") ||
        name.startsWith("vitest.config") ||
        name.startsWith("playwright.config") ||
        name.startsWith("cypress.config")
      )) {
        return true;
      }
      return false;
    }
  );

  const hasDotGithub = Array.isArray(contents) && contents.some(
    (item: any) => item.type === "dir" && item.name === ".github"
  );

  let hasCI = false;
  if (hasDotGithub) {
    const workflowsRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/.github/workflows`,
      { headers }
    );
    if (workflowsRes.ok) {
      const workflows = await workflowsRes.json();
      hasCI = Array.isArray(workflows) && workflows.length > 0;
    }
  }

  return {
    openIssues,
    openPRs,
    license,
    hasReadme,
    hasCI,
    hasTests,
  };
}