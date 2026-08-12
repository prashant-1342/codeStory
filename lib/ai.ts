import Groq from "groq-sdk";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

let groqClient: Groq | null = null;
let anthropicClient: Anthropic | null = null;
let googleGenAI: GoogleGenerativeAI | null = null;

function getGroqClient(): Groq | null {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

function getGeminiClient(): GoogleGenerativeAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!googleGenAI) {
    googleGenAI = new GoogleGenerativeAI(apiKey);
  }
  return googleGenAI;
}

export async function generateCompletion(prompt: string, jsonMode: boolean = false): Promise<string> {
  const errors: Error[] = [];

  try {
    const groq = getGroqClient();
    if (!groq) {
      throw new Error("GROQ_API_KEY is not defined in environment variables.");
    }
    console.log("Attempting generation with Groq...");
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    });

    const result = response.choices[0]?.message?.content;
    if (result) {
      console.log("Groq generation successful.");
      return result;
    }
    throw new Error("Groq returned an empty response.");
  } catch (error: any) {
    console.warn("Groq failed, falling back. Error:", error?.message || error);
    errors.push(error);
  }

  try {
    const anthropic = getAnthropicClient();
    if (!anthropic) {
      throw new Error("ANTHROPIC_API_KEY is not defined in environment variables.");
    }
    console.log("Attempting generation with Anthropic (Claude)...");
    
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1524,
      messages: [{ role: "user", content: prompt }],
    });

    if (response.content && response.content[0] && response.content[0].type === "text") {
      console.log("Anthropic generation successful.");
      return response.content[0].text;
    }
    throw new Error("Anthropic returned an empty or non-text response.");
  } catch (error: any) {
    console.warn("Anthropic failed, falling back. Error:", error?.message || error);
    errors.push(error);
  }

  try {
    const gemini = getGeminiClient();
    if (!gemini) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables.");
    }
    console.log("Attempting generation with Gemini...");
    const model = gemini.getGenerativeModel({
      model: "gemini-3.5-flash",
      ...(jsonMode ? { generationConfig: { responseMimeType: "application/json" } } : {}),
    });

    const response = await model.generateContent(prompt);
    const text = response.response.text();
    if (text) {
      console.log("Gemini generation successful.");
      return text;
    }
    throw new Error("Gemini returned an empty response.");
  } catch (error: any) {
    console.warn("Gemini failed. Error:", error?.message || error);
    errors.push(error);
  }

  throw new Error(
    `All AI completion attempts failed. Errors:\n` +
    errors.map((e, idx) => `[${idx + 1}] ${e.message}`).join("\n")
  );
}
