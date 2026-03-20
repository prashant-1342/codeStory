"use client";

import { useEffect, useState } from "react";
import { GithubCommit } from "@/lib/github";

interface FileStats {
  filename: string;
  changes: number;
}

interface Props {
  commits: GithubCommit[];
  owner: string;
  repo: string;
}

export default function MostChangedFiles({ commits, owner, repo }: Props) {
  const [files, setFiles] = useState<FileStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFiles() {
      const res = await fetch("/api/github/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commits, owner, repo }),
      });
      const data = await res.json();
      setFiles(data.files ?? []);
      setLoading(false);
    }
    fetchFiles();
  }, [repo]);

  const max = files[0]?.changes ?? 1;

  return (
    <div className="bg-white border-2 border-gray-900 rounded-xl p-6 flex flex-col gap-4 shadow-[3px_3px_0px_0px_#1a1a1a]">
      <div className="flex items-center justify-between">
        <span className="text-gray-900 font-black text-sm uppercase tracking-widest">
          Most Changed Files
        </span>
        <span className="text-gray-400 text-xs font-medium">last 10 commits</span>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="h-3 bg-gray-100 rounded w-3/5 animate-pulse" />
              <div className="h-2 bg-gray-100 rounded w-full animate-pulse" />
            </div>
          ))}
        </div>
      ) : files.length === 0 ? (
        <p className="text-gray-400 text-sm">No file data available</p>
      ) : (
        <div className="flex flex-col gap-3">
          {files.map((file) => {
            const shortName = file.filename.split("/").pop() ?? file.filename;
            const fullPath = file.filename;
            const pct = Math.round((file.changes / max) * 100);

            return (
              <div key={file.filename} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-xs font-bold font-mono truncate max-w-[80%]" title={fullPath}>
                    {shortName}
                  </span>
                  <span className="text-amber-700 text-xs font-black">{file.changes}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-gray-300 text-xs font-mono truncate">{fullPath}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}