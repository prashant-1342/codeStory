"use client";

import { useEffect, useState } from "react";
import { GithubCommit } from "@/lib/github";

export default function AISummaryCard({ commits, repoName }: { commits: GithubCommit[], repoName: string }) {
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commits, repoName }),
      });
      const data = await res.json();
      setSummary(data.summary);
      setLoading(false);
    }

    fetchSummary();
  }, [repoName]);

  return (
    <div className="bg-white/[0.03] border border-indigo-500/20 rounded-xl p-6 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-indigo-400 text-sm font-medium">🤖 AI Summary</span>
        <span className="text-white/20 text-xs">· this week</span>
      </div>
      {loading ? (
        <div className="flex flex-col gap-2">
          <div className="h-3 bg-white/[0.05] rounded-full w-full animate-pulse" />
          <div className="h-3 bg-white/[0.05] rounded-full w-4/5 animate-pulse" />
          <div className="h-3 bg-white/[0.05] rounded-full w-3/5 animate-pulse" />
        </div>
      ) : (
        <p className="text-white/70 text-sm leading-relaxed">{summary}</p>
      )}
    </div>
  );
}