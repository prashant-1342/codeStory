import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getCommits, getRepos } from "@/lib/github";
import { GithubCommit, GithubRepo } from "@/lib/github";
import AISummaryCard from "@/components/dashboard/AISummaryCard";
import CommitGraph from "@/components/dashboard/CommitGraph";
import MostChangedFiles from "@/components/dashboard/MostChangedFiles";
import RepoStats from "@/components/dashboard/RepoStats";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

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
    <main className="min-h-screen bg-[#f5f0e8] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
      />

      <Navbar />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10 flex flex-col gap-8">

        <Link href="/dashboard" className="text-gray-400 hover:text-gray-900 text-sm font-bold uppercase tracking-wide transition-colors w-fit">
          ← Dashboard
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
                {repo.name}<span className="text-amber-600">.</span>
              </h1>
              {repo.language && (
                <span className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full uppercase">
                  {repo.language}
                </span>
              )}
            </div>
            {repo.description && (
              <p className="text-gray-400 text-sm max-w-lg">{repo.description}</p>
            )}
          </div>
          <div className="flex items-center gap-4 text-gray-400 text-sm font-medium">
            <span>⭐ {repo.stargazers_count}</span>
            <span>🍴 {repo.forks_count}</span>
          </div>
        </div>

        <RepoStats commits={commits} owner={repo.owner.login} repo={repo.name} />

        <AISummaryCard commits={commits} repoName={repo.name} />

        <CommitGraph commits={commits} />

        <MostChangedFiles commits={commits} owner={repo.owner.login} repo={repo.name} />

        <div className="flex flex-col gap-4">
          <h2 className="text-gray-900 font-black text-lg uppercase tracking-widest">
            Recent Commits
          </h2>
          <div className="flex flex-col gap-3">
            {commits.map((commit) => (
              <div
                key={commit.sha}
                className="bg-white border-2 border-gray-900 rounded-xl p-4 flex flex-col gap-1 shadow-[3px_3px_0px_0px_#1a1a1a] hover:shadow-[4px_4px_0px_0px_#92400e] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200"
              >
                <p className="text-gray-900 text-sm font-bold line-clamp-1">
                  {commit.commit.message.split("\n")[0]}
                </p>
                <div className="flex items-center gap-3 text-gray-400 text-xs font-medium">
                  <span>{commit.commit.author.name}</span>
                  <span>·</span>
                  <span>{new Date(commit.commit.author.date).toLocaleDateString()}</span>
                  <span>·</span>
                  <span className="font-mono bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-amber-700">
                    {commit.sha.slice(0, 7)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}