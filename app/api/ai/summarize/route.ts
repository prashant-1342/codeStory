import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { summarizeCommits } from "@/lib/claude";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { commits, repoName } = await req.json();

  const username = (session as any)?.username ?? session.user?.name!;
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekStartDate = weekStart.toISOString().split("T")[0];

  const existing = await supabaseAdmin
    .from("summaries")
    .select("summary")
    .eq("github_username", username)
    .eq("repo_name", repoName)
    .eq("week_start", weekStartDate)
    .single();

  if (existing.data) {
    return Response.json({ summary: existing.data.summary });
  }

  const commitsText = commits
    .slice(0, 20)
    .map((c: any) => `- ${c.commit.message}`)
    .join("\n");

  const summary = await summarizeCommits(commitsText);

  await supabaseAdmin.from("summaries").insert({
    github_username: username,
    repo_name: repoName,
    summary,
    week_start: weekStartDate,
  });
  return Response.json({ summary });
}

