import User from "../models/User.js";
import Submission from "../models/Submission.js";
export async function publicProfile(req, res) {
  const user = await User.findOne({ username: req.params.username }).select("username createdAt avatar");
  if (!user) return res.status(404).json({ message: "User not found" });
  const rows = await Submission.find({ user: user._id });
  const accepted = rows.filter(s => s.status === "Accepted");
  res.json({ profile: { username: user.username, joinedAt: user.createdAt, solved: new Set(accepted.map(s => String(s.problem))).size, submissions: rows.length, acceptanceRate: rows.length ? Math.round(accepted.length/rows.length*100) : 0 } });
}
