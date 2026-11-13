import mongoose from "mongoose";
const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Easy" },
  tags: [String],
  acceptance: { type: Number, default: 0 },
  description: String,
  examples: [{ input: String, output: String, explanation: String }],
  constraints: [String],
  starterCode: { type: Map, of: String },
  testCases: [{ input: String, expectedOutput: String, hidden: { type: Boolean, default: false } }],
  editorial: { approach: String, complexity: String, videoUrl: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });
export default mongoose.model("Problem", problemSchema);
