import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getCommits, getRepos } from "@/lib/github";
import { GithubCommit, GithubRepo } from "@/lib/github";
import AISummaryCard from "@/components/dashboard/AISummaryCard";

export default async function RepoPage({ params }: { params: Promise<{ repoName: string }> }) {
  const { repoName } = await params;
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const repos: GithubRepo[] = await getRepos(session.accessToken!);
  const repo = repos.find((r) => r.name === repoName);

  if (!repo) redirect("/dashboard");

  const commits: GithubCommit[] = await getCommits(
    session.accessToken!,
    repo.owner.login,
    repo.name
  );

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-8">

        <a href="/dashboard" className="text-white/30 hover:text-white/60 text-sm transition-colors w-fit">
          ← Dashboard
        </a>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">{repo.name}</h1>
              {repo.language && (
                <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                  {repo.language}
                </span>
              )}
            </div>
            {repo.description && (
              <p className="text-white/40 text-sm">{repo.description}</p>
            )}
          </div>
          <div className="flex items-center gap-4 text-white/30 text-sm">
            <span>⭐ {repo.stargazers_count}</span>
            <span>🍴 {repo.forks_count}</span>
          </div>
        </div>

        <AISummaryCard commits={commits} repoName={repo.name} />

        <div className="flex flex-col gap-3">
          <h2 className="text-white/70 text-sm font-medium uppercase tracking-widest">
            Recent Commits
          </h2>
          <div className="flex flex-col gap-2">
            {commits.map((commit) => (
              <div
                key={commit.sha}
                className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 flex flex-col gap-1 hover:border-white/[0.15] transition-all duration-200"
              >
                <p className="text-white text-sm font-medium line-clamp-1">
                  {commit.commit.message.split("\n")[0]}
                </p>
                <div className="flex items-center gap-3 text-white/30 text-xs">
                  <span>{commit.commit.author.name}</span>
                  <span>·</span>
                  <span>{new Date(commit.commit.author.date).toLocaleDateString()}</span>
                  <span>·</span>
                  <span className="font-mono">{commit.sha.slice(0, 7)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
} 