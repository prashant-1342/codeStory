"use client";

import { RepoHealth } from "@/lib/github";

interface RepoHealthSnapshotProps {
  health: RepoHealth;
  lastCommitDate?: string;
}

function getRelativeTimeString(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function RepoHealthSnapshot({ health, lastCommitDate }: RepoHealthSnapshotProps) {
  return (
    <div className="bg-white border-2 border-gray-900 rounded-xl p-5 shadow-[3px_3px_0px_0px_#1a1a1a] flex flex-col gap-4">
      <h2 className="text-gray-900 font-black text-lg uppercase tracking-widest">
        Repo Health Snapshot
      </h2>

      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
            health.openIssues === 0
              ? "text-emerald-700 bg-emerald-100 border-emerald-200"
              : "text-amber-700 bg-amber-100 border-amber-200"
          }`}
        >
          {health.openIssues === 0 ? "No Open Issues" : `${health.openIssues} Open ${health.openIssues === 1 ? "Issue" : "Issues"}`}
        </span>

        <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border text-gray-600 bg-gray-100 border-gray-200">
          {health.openPRs} Open {health.openPRs === 1 ? "PR" : "PRs"}
        </span>

        <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border text-gray-600 bg-gray-100 border-gray-200">
          Last Commit: {lastCommitDate ? getRelativeTimeString(lastCommitDate) : "N/A"}
        </span>

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
            health.license
              ? "text-emerald-700 bg-emerald-100 border-emerald-200"
              : "text-gray-500 bg-gray-100 border-gray-200"
          }`}
        >
          {health.license ? `License: ${health.license}` : "No License"}
        </span>

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
            health.hasReadme
              ? "text-emerald-700 bg-emerald-100 border-emerald-200"
              : "text-gray-500 bg-gray-100 border-gray-200"
          }`}
        >
          {health.hasReadme ? "✓ README" : "Missing README"}
        </span>

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
            health.hasCI
              ? "text-emerald-700 bg-emerald-100 border-emerald-200"
              : "text-gray-500 bg-gray-100 border-gray-200"
          }`}
        >
          {health.hasCI ? "✓ CI Configured" : "No CI"}
        </span>

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
            health.hasTests
              ? "text-emerald-700 bg-emerald-100 border-emerald-200"
              : "text-gray-500 bg-gray-100 border-gray-200"
          }`}
        >
          {health.hasTests ? "✓ Tests Configured" : "No Tests"}
        </span>
      </div>
    </div>
  );
}
