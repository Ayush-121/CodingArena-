import Submission from "../models/Submission.js";
import Problem from "../models/Problem.js";
export async function myAnalytics(req, res) {
  const rows = await Submission.find({ user: req.user._id }).populate("problem", "difficulty tags title").sort({ createdAt: 1 });
  const accepted = rows.filter(x => x.status === "Accepted");
  const solvedIds = [...new Set(accepted.map(x => String(x.problem?._id)))];
  const byTopic = {};
  for (const s of rows) for (const tag of (s.problem?.tags || [])) {
    byTopic[tag] ||= { attempts: 0, accepted: 0, solvedIds: new Set() };
    byTopic[tag].attempts++;
    if (s.status === "Accepted") { byTopic[tag].accepted++; byTopic[tag].solvedIds.add(String(s.problem?._id)); }
  }
  const activity = {};
  for (const s of rows) {
    const day = s.createdAt.toISOString().slice(0, 10);
    activity[day] = (activity[day] || 0) + 1;
  }
  const totalProblems = await Problem.countDocuments();
  const difficulty = ["Easy", "Medium", "Hard"].map(level => ({ name: level, value: new Set(accepted.filter(s => s.problem?.difficulty === level).map(s => String(s.problem._id))).size }));
  const topics = Object.entries(byTopic).map(([name, v]) => ({ name, attempts: v.attempts, accepted: v.accepted, solved: v.solvedIds.size, rate: Math.round(v.accepted / v.attempts * 100) })).sort((a,b) => a.rate - b.rate);
  const dates = Object.keys(activity).sort();
  let streak = 0, cursor = new Date(); cursor.setUTCHours(0,0,0,0);
  while (activity[cursor.toISOString().slice(0,10)]) { streak++; cursor.setUTCDate(cursor.getUTCDate()-1); }
  res.json({ stats: { solved: solvedIds.length, totalProblems, submissions: rows.length, accepted: accepted.length, acceptanceRate: rows.length ? Math.round(accepted.length / rows.length * 100) : 0, streak, rank: Math.max(1, 10000 - solvedIds.length * 17) }, activity, difficulty, topics, recent: rows.slice(-8).reverse().map(s => ({ _id: s._id, status: s.status, language: s.language, createdAt: s.createdAt, problem: s.problem ? { _id: s.problem._id, title: s.problem.title, slug: s.problem.slug, difficulty: s.problem.difficulty } : null })) });
}
