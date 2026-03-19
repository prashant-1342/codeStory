import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function summarizeCommits(commits: string): Promise<string> {
  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 1024,
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

  return message.content[0].type === "text" ? message.content[0].text : "";
}