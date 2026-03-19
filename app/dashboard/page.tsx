import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getRepos, getCommits } from "@/lib/github";
import { GithubRepo } from "@/lib/github";
import Link from "next/link";

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
    <main className="min-h-screen bg-[#f5f0e8] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
              <span className="text-[#f5f0e8] text-xs font-black tracking-tighter">CS</span>
            </div>
            <span className="text-gray-900 font-black text-xl tracking-tight uppercase">
              Code<span className="text-amber-600">Story</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm font-medium">
              Hey, {session.user?.name?.split(" ")[0]} 👋
            </span>
            <img
              src={session.user?.image ?? ""}
              alt="avatar"
              className="w-9 h-9 rounded-full border-2 border-gray-900"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
            Your Story<span className="text-amber-600">.</span>
          </h1>
          <p className="text-gray-500">Here's what you've been building lately</p>
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
              className="bg-white border-2 border-gray-900 rounded-xl p-5 flex flex-col gap-1 shadow-[3px_3px_0px_0px_#1a1a1a]"
            >
              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.label}</span>
              <span className="text-gray-900 text-2xl font-black">{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-900 font-black text-lg uppercase tracking-widest">
              Your Repos
            </h2>
            <span className="text-gray-400 text-sm">{repos.length} total</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {repos.map((repo: GithubRepo) => (
              <Link
                key={repo.id}
                href={`/repos/${repo.name}`}
                className="bg-white border-2 border-gray-900 rounded-xl p-5 flex flex-col gap-3 shadow-[3px_3px_0px_0px_#1a1a1a] hover:shadow-[5px_5px_0px_0px_#92400e] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-black uppercase tracking-tight">{repo.name}</span>
                  {repo.language && (
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full uppercase">
                      {repo.language}
                    </span>
                  )}
                </div>
                {repo.description && (
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                    {repo.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-gray-400 text-xs font-medium">
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>🍴 {repo.forks_count}</span>
                  <span>Updated {new Date(repo.pushed_at).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}