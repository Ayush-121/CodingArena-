import { GoogleGenerativeAI } from "@google/generative-ai";
export async function askAI({ question, code = "", language = "javascript", problem = "" }) {
  if (!process.env.GEMINI_API_KEY) throw new Error("Gemini is not configured. Add GEMINI_API_KEY.");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `You are CodeArena AI, a patient DSA mentor. Help the learner understand rather than blindly copy.
Problem context: ${problem}
Language: ${language}
User code:
${code}
Question: ${question}
Give a concise explanation, a useful hint or debugging steps, and time/space complexity when relevant.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}
