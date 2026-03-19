import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function summarizeCommits(commits: string): Promise<string> {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `You are a developer's personal journal writer. Based on these recent git commits, write a short, warm, conversational summary of what this developer has been working on. 

Write it like a friend catching up — natural, human, no bullet points, no numbered lists, no headers. Just 3-4 sentences max. Talk directly to the developer using "you".

For example: "This week you were deep in the authentication flow, squashing a stubborn login bug and tightening up the security layer. You also gave the navbar a fresh coat of paint and made sure everything plays nicely on mobile. Solid week of work."

Here are the commits:
${commits}

Now write the summary. No intro, no sign-off, just the summary itself.`,
      },
    ],
  });

  return response.choices[0].message.content ?? "";
}