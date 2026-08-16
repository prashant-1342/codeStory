"use client";

import { useState } from "react";
import Link from "next/link";
import { GithubRepo } from "@/lib/github";

interface RepoListProps {
  repos: GithubRepo[];
}

export default function RepoList({ repos }: RepoListProps) {
  const [visibleCount, setVisibleCount] = useState(6);

  const displayedRepos = repos.slice(0, visibleCount);
  const hasMore = repos.length > visibleCount;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedRepos.map((repo) => (
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

      {hasMore && (
        <div className="flex justify-center mt-2">
          <button
            onClick={() => setVisibleCount((prev) => prev + 10)}
            className="text-xs font-black uppercase tracking-wider bg-white border-2 border-gray-900 px-6 py-3 rounded-lg shadow-[3px_3px_0px_0px_#1a1a1a] hover:shadow-[1px_1px_0px_0px_#1a1a1a] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200 text-gray-900"
          >
            Show More Repositories
          </button>
        </div>
      )}
    </div>
  );
}
