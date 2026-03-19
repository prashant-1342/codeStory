import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function summarizeCommits(commits: string): Promise<string> {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `You are a helpful assistant that summarizes GitHub commit activity in plain English.
    
Here are the recent commits:
${commits}

Please provide:
1. A brief 2-3 sentence overall summary of what was worked on
2. Key changes made
3. Most active areas of the codebase

Keep it simple and non-technical, like explaining to a friend what you built this week.`,
      },
    ],
  });

  return response.choices[0].message.content ?? "";
}