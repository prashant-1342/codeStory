"use client";

import { useEffect, useState } from "react";

interface Personality {
  title: string;
  description: string;
}

interface Stats {
  peakHour: number;
  peakDay: string;
  totalCommits: number;
  feats: number;
  fixes: number;
  refactors: number;
  timeOfDay: string;
}

export default function CodingPersonality() {
  const [personality, setPersonality] = useState<Personality | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPersonality() {
      const res = await fetch("/api/ai/personality");
      const data = await res.json();
      setPersonality(data.personality);
      setStats(data.stats);
      setLoading(false);
    }
    fetchPersonality();
  }, []);

  const formatHour = (h: number) => {
    if (h === 0) return "12am";
    if (h === 12) return "12pm";
    return h < 12 ? `${h}am` : `${h - 12}pm`;
  };

  return (
    <div className="bg-amber-50 border-2 border-amber-600 rounded-xl p-6 flex flex-col gap-4 shadow-[3px_3px_0px_0px_#92400e]">
      <span className="text-amber-700 text-xs font-black uppercase tracking-widest">
        ◈ Your Coding Personality
      </span>

      {loading ? (
        <div className="flex flex-col gap-2">
          <div className="h-6 bg-amber-200/60 rounded w-2/3 animate-pulse" />
          <div className="h-3 bg-amber-200/60 rounded w-full animate-pulse" />
          <div className="h-3 bg-amber-200/60 rounded w-4/5 animate-pulse" />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <h3 className="text-amber-900 text-2xl font-black tracking-tight">
              {personality?.title}
            </h3>
            <p className="text-amber-800/70 text-sm leading-relaxed">
              {personality?.description}
            </p>
          </div>

          {stats && (
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { label: "Peak Time", value: formatHour(stats.peakHour) },
                { label: "Best Day", value: stats.peakDay?.slice(0, 3) },
                { label: "Commits", value: stats.totalCommits },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-amber-200 rounded-lg p-3 flex flex-col gap-1">
                  <span className="text-amber-600 text-xs font-bold uppercase tracking-widest">{s.label}</span>
                  <span className="text-amber-900 font-black text-lg">{s.value}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}