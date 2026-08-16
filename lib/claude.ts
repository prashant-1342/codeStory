import { generateCompletion } from "./ai";

export async function summarizeCommits(commits: string): Promise<string> {
  const prompt = `You are a developer tool that generates a clean changelog from git commits.
You must analyze these commits and group them into categories.

Write clean, grammatically correct, well-spaced bullet points. Always include a space between words — never concatenate words together.

You must respond in this exact JSON format with no extra text or explanations:
{
  "features": ["bullet point 1", "bullet point 2"],
  "bugFixes": ["bullet point 1", "bullet point 2"],
  "refactoring": ["bullet point 1"],
  "config": ["bullet point 1"]
}

Rules:
- Each bullet should be a complete, grammatically correct sentence fragment starting with a past-tense verb (Added, Fixed, Switched, Updated, etc.)
- Keep each bullet under ~15 words for scannability.
- No markdown syntax (no *, -, **bold**) inside the JSON string values — plain text only.
- Only include categories that have at least one item. If a category has no items, omit it or return an empty array.

Here are the commits:
${commits}`;

  try {
    const responseText = await generateCompletion(prompt, true);
    JSON.parse(responseText);
    return responseText;
  } catch (err) {
    console.warn("First attempt failed to parse as JSON, retrying...", err);
    try {
      const retryPrompt = `${prompt}\n\nStricter instruction: Respond with valid JSON only. Do not include any explanation or prose outside the JSON.`;
      const retryResponseText = await generateCompletion(retryPrompt, true);
      JSON.parse(retryResponseText);
      return retryResponseText;
    } catch (retryErr) {
      console.error("Retry also failed, falling back to generic update JSON", retryErr);
      return JSON.stringify({
        features: ["Updates this week"]
      });
    }
  }
}