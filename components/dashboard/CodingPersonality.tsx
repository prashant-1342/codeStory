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

  const renderDescription = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-extrabold text-amber-950">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-amber-50 border-2 border-gray-900 rounded-xl p-6 flex flex-col gap-4 shadow-[3px_3px_0px_0px_#1a1a1a]">
      <div className="flex items-center gap-1.5">
        <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <span className="text-amber-700 text-xs font-black uppercase tracking-widest">
          Your Coding Personality
        </span>
      </div>

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
            <p className="text-amber-800/75 text-sm leading-relaxed">
              {personality && renderDescription(personality.description)}
            </p>
          </div>

          {stats && (
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { label: "Peak Time", value: formatHour(stats.peakHour) },
                { label: "Best Day", value: stats.peakDay?.slice(0, 3) },
                { label: "Feat:Fix Ratio", value: `${stats.feats}:${stats.fixes}` },
              ].map((s) => (
                <div key={s.label} className="bg-amber-100/60 border-0 rounded-lg p-3 flex flex-col gap-1">
                  <span className="text-amber-600 text-[10px] sm:text-xs font-bold uppercase tracking-widest">{s.label}</span>
                  <span className="text-amber-900 font-black text-base sm:text-lg">{s.value}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}