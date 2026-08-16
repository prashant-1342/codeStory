import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getRepos, getCommits } from "@/lib/github";
import { generateCompletion } from "@/lib/ai";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getTimeOfDay(hour: number) {
  if (hour < 6) return "late night";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const repos = await getRepos(session.accessToken!);
  const allCommits = await Promise.all(
    repos.slice(0, 5).map((repo: any) =>
      getCommits(session.accessToken!, repo.owner.login, repo.name)
    )
  );

  const commits = allCommits.flat();
  const hours = Array(24).fill(0);
  const days = Array(7).fill(0);
  let feats = 0, fixes = 0, refactors = 0;

  commits.forEach((commit: any) => {
    const date = new Date(commit.commit.author.date);
    hours[date.getHours()]++;
    days[date.getDay()]++;
    const msg = commit.commit.message.toLowerCase();
    if (msg.startsWith("feat")) feats++;
    else if (msg.startsWith("fix")) fixes++;
    else if (msg.startsWith("refactor")) refactors++;
  });

  const peakHour = hours.indexOf(Math.max(...hours));
  const peakDay = dayNames[days.indexOf(Math.max(...days))];
  const totalCommits = commits.length;
  const timeOfDay = getTimeOfDay(peakHour);

  const prompt = `You are a fun developer personality analyzer. Based on these coding stats, give this developer a creative personality type title and a 2 sentence description.

Stats:
- Total commits: ${totalCommits}
- Peak coding hour: ${peakHour}:00 (${timeOfDay} coder)
- Most active day: ${peakDay}
- Feature commits: ${feats}
- Bug fix commits: ${fixes}
- Refactor commits: ${refactors}

Rules:
- Give a creative title like "The Midnight Architect" or "The Weekend Warrior" or "The Bug Slayer"
- 2 sentences max describing their coding personality
- Be specific using the actual stats
- Fun but professional tone
- No hype, no "great work"

Respond in this exact JSON format with no extra text:
{"title": "...", "description": "..."}`;

  const text = await generateCompletion(prompt, true);

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return Response.json({ personality: parsed, stats: { peakHour, peakDay, totalCommits, feats, fixes, refactors, timeOfDay } });
  } catch {
    return Response.json({
      personality: { title: "The Dedicated Developer", description: "You show up and get things done." },
      stats: {}
    });
  }
}