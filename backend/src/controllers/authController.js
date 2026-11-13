import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { revoke } from "../utils/tokenDenylist.js";
const cookieOptions = () => ({ httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", maxAge: 7 * 86400000 });
const issue = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
export async function register(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password || password.length < 8) return res.status(400).json({ message: "Username, email and password (8+ characters) are required" });
  if (await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] })) return res.status(409).json({ message: "Email or username already exists" });
  const user = await User.create({ username, email, password: await bcrypt.hash(password, 12) });
  const token = issue(user._id);
  res.cookie("token", token, cookieOptions()).status(201).json({ user: { id: user._id, username, email, role: user.role } });
}
export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() }).select("+password");
  if (!user || !await bcrypt.compare(password || "", user.password)) return res.status(401).json({ message: "Invalid email or password" });
  res.cookie("token", issue(user._id), cookieOptions()).json({ user: { id: user._id, username: user.username, email: user.email, role: user.role } });
}
export async function logout(req, res) {
  const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
  if (token) { try { const d = jwt.decode(token); await revoke(token, Math.max(1, d.exp - Math.floor(Date.now()/1000))); } catch {} }
  res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" }).json({ message: "Logged out" });
}
export async function me(req, res) {
  res.json({ user: { id: req.user._id, username: req.user.username, email: req.user.email, role: req.user.role } });
}
