"use client";

import { useEffect, useState } from "react";
import { GithubCommit } from "@/lib/github";

export default function AISummaryCard({ commits, repoName }: { commits: GithubCommit[], repoName: string }) {
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("success");

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch("/api/ai/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commits, repoName }),
        });
        const data = await res.json();
        setStatus(data.status || "success");
        setSummary(data.summary || "");
      } catch (err) {
        console.error(err);
        setStatus("error");
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, [repoName]);

  const getRelativeTimeString = (dateString: string): string => {
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
  };

  let parsedSummary: {
    features?: string[];
    bugFixes?: string[];
    refactoring?: string[];
    config?: string[];
  } = {};

  try {
    if (summary) {
      parsedSummary = JSON.parse(summary);
    }
  } catch (err) {
    console.error("Failed to parse summary JSON", err);
    parsedSummary = {
      features: ["Updates this week"]
    };
  }

  const categoryHeaders: Record<string, string> = {
    features: "🚀 Features",
    bugFixes: "🐛 Bug Fixes",
    refactoring: "♻️ Refactoring",
    config: "⚙️ Config",
  };

  const hasItems = Object.values(parsedSummary).some(
    (arr) => Array.isArray(arr) && arr.length > 0
  );

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
      ) : status === "no_commits" ? (
        <p className="text-amber-800 text-sm font-bold italic">No commits yet.</p>
      ) : status === "no_commits_this_week" || !hasItems ? (
        <div className="flex flex-col gap-1.5">
          <p className="text-amber-900 text-sm font-black uppercase tracking-wider">No new commits this week</p>
          {commits[0]?.commit.author.date && (
            <p className="text-amber-800 text-xs leading-relaxed">
              Last activity: <span className="font-bold">{getRelativeTimeString(commits[0].commit.author.date)}</span>
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {Object.entries(parsedSummary).map(([key, items]) => {
            if (!Array.isArray(items) || items.length === 0) return null;
            const header = categoryHeaders[key] || key;
            return (
              <div key={key} className="flex flex-col gap-2">
                <p className="text-amber-900 text-sm font-black uppercase tracking-wider">{header}</p>
                <ul className="list-none flex flex-col gap-1.5 pl-1">
                  {items.map((item, idx) => (
                    <li key={idx} className="text-amber-800 text-sm leading-relaxed flex items-start gap-2">
                      <span className="text-amber-600 font-bold select-none">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}