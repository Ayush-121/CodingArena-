import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  avatar: String,
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });
export default mongoose.model("User", userSchema);
