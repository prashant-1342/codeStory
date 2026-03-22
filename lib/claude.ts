import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function summarizeCommits(commits: string): Promise<string> {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `You are a developer tool that generates a clean changelog from git commits.

Analyze these commits and group them into categories. Only include categories that actually have commits. Use exactly these category names and emojis if they apply:

🚀 Features — new things added
🐛 Bug Fixes — things that were broken and fixed
♻️ Refactoring — code restructured or improved
🎨 UI/Design — visual or styling changes
⚙️ Config — setup, dependencies, configuration changes

Rules:
- Each point starts with a past tense verb like "Added", "Fixed", "Updated", "Removed"
- Max 3 points per category
- Be specific and technical, no hype or motivation
- If a commit doesn't fit any category skip it
- No intro, no sign-off, just the changelog

Here are the commits:
${commits}`,
      },
    ],
  });

  return response.choices[0].message.content ?? "";
}