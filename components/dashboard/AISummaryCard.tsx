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

  const lines = summary.split("\n").filter((l) => l.trim() !== "");

  return (
    <div className="bg-amber-50 border-2 border-amber-600 rounded-xl p-6 flex flex-col gap-4 shadow-[3px_3px_0px_0px_#92400e]">
      <div className="flex items-center gap-2">
        <span className="text-amber-700 text-xs font-black uppercase tracking-widest">
          ◈ Changelog
        </span>
        <span className="text-amber-400 text-xs font-medium">· this week</span>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          <div className="h-3 bg-amber-200/60 rounded-full w-full animate-pulse" />
          <div className="h-3 bg-amber-200/60 rounded-full w-4/5 animate-pulse" />
          <div className="h-3 bg-amber-200/60 rounded-full w-3/5 animate-pulse" />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {lines.map((line, i) => {
            const isHeader = !line.startsWith("•") && !line.startsWith("-");
            return (
              <div key={i}>
                {isHeader ? (
                  <p className="text-amber-900 text-sm font-black">{line}</p>
                ) : (
                  <p className="text-amber-800 text-sm leading-relaxed pl-3">
                    {line.replace(/^[•-]\s*/, "→ ")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}