import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getRepoStats } from "@/lib/github";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { commits, owner, repo } = await req.json();
  const stats = await getRepoStats(session.accessToken!, owner, repo, commits);

  return Response.json({ stats });
}