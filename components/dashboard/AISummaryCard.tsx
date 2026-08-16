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
          {Object.keys(parsedSummary).length === 0 && (
            <p className="text-amber-800 text-sm italic">No updates recorded this week.</p>
          )}
        </div>
      )}
    </div>
  );
}