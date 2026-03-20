import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCommitFiles } from "@/lib/github";

const ignored = [
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "package.json",
  ".gitignore",
  ".env",
];


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { commits, owner, repo } = await req.json();

  const fileCounts: { [key: string]: number } = {};

  await Promise.all(
    commits.slice(0, 10).map(async (commit: { sha: string }) => {
      const files = await getCommitFiles(session.accessToken!, owner, repo, commit.sha);
      files.forEach((f) => {
        fileCounts[f.filename] = (fileCounts[f.filename] ?? 0) + f.changes;
      });
    })
  );

  const sorted = Object.entries(fileCounts)
   .filter(([filename]) => !ignored.some((f) => filename.endsWith(f)))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([filename, changes]) => ({ filename, changes }));

  return Response.json({ files: sorted });
}