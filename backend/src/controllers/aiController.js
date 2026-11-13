import { askAI } from "../services/ai.js";
export async function assist(req, res) {
  const { question, code, language, problem } = req.body;
  if (!question?.trim()) return res.status(400).json({ message: "Ask a question first" });
  const answer = await askAI({ question, code, language, problem });
  res.json({ answer });
}
