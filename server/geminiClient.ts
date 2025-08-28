import { GoogleGenerativeAI } from "@google/generative-ai";

export function createGemini() {
  const apiKey =
    process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GOOGLE_GEMINI_API_KEY");
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  });
}
