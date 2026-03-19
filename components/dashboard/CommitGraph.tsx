"use client";

import { GithubCommit } from "@/lib/github";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Props {
  commits: GithubCommit[];
}

function processCommits(commits: GithubCommit[]) {
  const last30Days: { [key: string]: number } = {};

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    last30Days[key] = 0;
  }

  commits.forEach((commit) => {
    const date = commit.commit.author.date.split("T")[0];
    if (last30Days[date] !== undefined) last30Days[date]++;
  });

  return Object.entries(last30Days).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    commits: count,
  }));
}

export default function CommitGraph({ commits }: Props) {
  const data = processCommits(commits);

  return (
    <div className="bg-white border-2 border-gray-900 rounded-xl p-6 flex flex-col gap-4 shadow-[3px_3px_0px_0px_#1a1a1a]">
      <div className="flex items-center justify-between">
        <span className="text-gray-900 font-black text-sm uppercase tracking-widest">
          Commit Activity
        </span>
        <span className="text-gray-400 text-xs font-medium">last 30 days</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={6}>
          <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.05)" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            width={20}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "2px solid #1a1a1a",
              borderRadius: "8px",
              color: "#111827",
              fontSize: "12px",
              fontWeight: "bold",
              boxShadow: "3px 3px 0px #1a1a1a",
            }}
            cursor={{ fill: "rgba(0,0,0,0.03)" }}
          />
          <Bar dataKey="commits" fill="#d97706" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}