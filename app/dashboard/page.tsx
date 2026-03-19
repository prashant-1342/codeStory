import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getRepos, getCommits } from "@/lib/github";
import { GithubRepo } from "@/lib/github";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const repos: GithubRepo[] = await getRepos(session.accessToken!);

  const recentCommits = await Promise.all(
    repos.slice(0, 3).map((repo: GithubRepo) =>
      getCommits(session.accessToken!, repo.owner.login, repo.name)
    )
  );

  const totalCommits = recentCommits.flat().length;

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Hey, {session.user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-white/40 text-sm mt-1">
              Here's what you've been building
            </p>
          </div>
          <img
            src={session.user?.image ?? ""}
            alt="avatar"
            className="w-10 h-10 rounded-full border border-white/10"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Repos", value: repos.length },
            { label: "Recent Commits", value: totalCommits },
            { label: "Top Language", value: repos[0]?.language ?? "N/A" },
            { label: "Last Active", value: new Date(repos[0]?.pushed_at).toLocaleDateString() },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 flex flex-col gap-1"
            >
              <span className="text-white/40 text-xs">{stat.label}</span>
              <span className="text-white text-xl font-semibold">{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-white/70 text-sm font-medium uppercase tracking-widest">
            Your Repos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {repos.map((repo: GithubRepo) => (
              <a
                key={repo.id}
                href={`/repos/${repo.name}`}
                className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 flex flex-col gap-3 hover:border-indigo-500/40 hover:bg-white/[0.05] transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{repo.name}</span>
                  {repo.language && (
                    <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                      {repo.language}
                    </span>
                  )}
                </div>
                {repo.description && (
                  <p className="text-white/40 text-sm leading-relaxed line-clamp-2">
                    {repo.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-white/30 text-xs">
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>🍴 {repo.forks_count}</span>
                  <span>Updated {new Date(repo.pushed_at).toLocaleDateString()}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}