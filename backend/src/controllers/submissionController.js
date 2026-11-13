import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";
import { executeCode } from "../services/judge0.js";
async function run(req, res, submit) {
  const { problemId, sourceCode, language } = req.body;
  const problem = await Problem.findById(problemId);
  if (!problem) return res.status(404).json({ message: "Problem not found" });
  const cases = (problem.testCases || []).filter(t => submit ? true : !t.hidden);
  if (!cases.length) return res.status(400).json({ message: "No test cases configured for this problem" });
  const results = [];
  for (const test of cases) {
    const result = await executeCode({ sourceCode, language, stdin: test.input });
    const actual = (result.stdout || "").trim();
    const expected = (test.expectedOutput || "").trim();
    results.push({ status: result.status, passed: result.status === "Accepted" && actual === expected, input: test.hidden ? "Hidden test" : test.input, expected: test.hidden ? undefined : expected, actual: test.hidden ? undefined : actual, stderr: result.stderr || result.compileOutput, time: result.time, memory: result.memory });
    if (result.status !== "Accepted" || actual !== expected) break;
  }
  const accepted = results.length === cases.length && results.every(r => r.passed);
  if (submit) {
    await Submission.create({ user: req.user._id, problem: problem._id, language, sourceCode, status: accepted ? "Accepted" : (results.at(-1)?.status === "Accepted" ? "Wrong Answer" : results.at(-1)?.status || "Error"), runtime: Number(results.at(-1)?.time || 0), memory: Number(results.at(-1)?.memory || 0) });
  }
  res.json({ verdict: accepted ? "Accepted" : results.at(-1)?.status === "Accepted" ? "Wrong Answer" : results.at(-1)?.status, passed: results.filter(r => r.passed).length, total: cases.length, results });
}
export const runCode = (req, res) => run(req, res, false);
export const submitCode = (req, res) => run(req, res, true);
export async function mySubmissions(req, res) {
  const submissions = await Submission.find({ user: req.user._id }).populate("problem", "title slug difficulty").sort({ createdAt: -1 }).limit(100);
  res.json({ submissions });
}
