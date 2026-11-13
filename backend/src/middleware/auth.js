import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { isRevoked } from "../utils/tokenDenylist.js";
export async function protect(req, res, next) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
    if (!token || await isRevoked(token)) return res.status(401).json({ message: "Please log in" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ message: "Account not found" });
    next();
  } catch { return res.status(401).json({ message: "Invalid or expired session" }); }
}
export function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Admin access required" });
  next();
}
