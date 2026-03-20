"use client";

import { useEffect, useState } from "react";
import { GithubCommit } from "@/lib/github";

interface Stats {
  totalAdditions: number;
  totalDeletions: number;
  totalChanges: number;
}

interface Props {
  commits: GithubCommit[];
  owner: string;
  repo: string;
}

export default function RepoStats({ commits, owner, repo }: Props) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch("/api/github/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commits, owner, repo }),
      });
      const data = await res.json();
      setStats(data.stats);
      setLoading(false);
    }
    fetchStats();
  }, [repo]);

  const statCards = stats
    ? [
        { label: "Lines Added", value: `+${stats.totalAdditions.toLocaleString()}`, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
        { label: "Lines Deleted", value: `-${stats.totalDeletions.toLocaleString()}`, color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
        { label: "Total Changes", value: stats.totalChanges.toLocaleString(), color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
        { label: "Commits", value: commits.length.toString(), color: "text-gray-900", bg: "bg-gray-50", border: "border-gray-200" },
      ]
    : [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {loading
        ? [...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border-2 border-gray-200 rounded-xl p-5 flex flex-col gap-2 animate-pulse">
              <div className="h-2 bg-gray-100 rounded w-2/3" />
              <div className="h-6 bg-gray-100 rounded w-1/2" />
            </div>
          ))
        : statCards.map((s) => (
            <div
              key={s.label}
              className={`${s.bg} border-2 ${s.border} rounded-xl p-5 flex flex-col gap-1 shadow-[2px_2px_0px_0px_#1a1a1a]`}
            >
              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                {s.label}
              </span>
              <span className={`${s.color} text-xl font-black`}>{s.value}</span>
            </div>
          ))}
    </div>
  );
}