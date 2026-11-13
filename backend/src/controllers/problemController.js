import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";
export async function listProblems(req, res) {
  const { search, difficulty, tag } = req.query;
  const filter = {};
  if (difficulty && difficulty !== "All") filter.difficulty = difficulty;
  if (tag) filter.tags = tag;
  if (search) filter.title = { $regex: search, $options: "i" };
  const problems = await Problem.find(filter).select("-testCases").sort({ createdAt: 1 });
  let solved = new Set();
  if (req.user) {
    const ids = await Submission.distinct("problem", { user: req.user._id, status: "Accepted" });
    solved = new Set(ids.map(String));
  }
  res.json({ problems: problems.map(p => ({ ...p.toObject(), solved: solved.has(String(p._id)) })) });
}
export async function getProblem(req, res) {
  const p = await Problem.findOne({ slug: req.params.slug }).select("-testCases");
  if (!p) return res.status(404).json({ message: "Problem not found" });
  res.json({ problem: p });
}
export async function createProblem(req, res) {
  const problem = await Problem.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ problem });
}
export async function updateProblem(req, res) {
  const p = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!p) return res.status(404).json({ message: "Problem not found" });
  res.json({ problem: p });
}
export async function deleteProblem(req, res) {
  await Problem.findByIdAndDelete(req.params.id);
  res.json({ message: "Problem deleted" });
}
