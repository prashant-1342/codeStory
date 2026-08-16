import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { summarizeCommits } from "@/lib/claude";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { commits, repoName } = await req.json();

  const username = (session as any)?.username ?? session.user?.name!;

  if (!commits || commits.length === 0) {
    return Response.json({ status: "no_commits" });
  }

  const latestCommitDateStr = new Date(commits[0].commit.author.date).toISOString().split("T")[0];

  const existing = await supabaseAdmin
    .from("summaries")
    .select("summary")
    .eq("github_username", username)
    .eq("repo_name", repoName)
    .eq("week_start", latestCommitDateStr)
    .single();

  if (existing.data) {
    return Response.json({ status: "success", summary: existing.data.summary });
  }

  const commitsText = commits
    .slice(0, 30)
    .map((c: any) => `- ${c.commit.message}`)
    .join("\n");

  const summary = await summarizeCommits(commitsText);

  await supabaseAdmin.from("summaries").insert({
    github_username: username,
    repo_name: repoName,
    summary,
    week_start: latestCommitDateStr,
  });

  return Response.json({ status: "success", summary });
}

