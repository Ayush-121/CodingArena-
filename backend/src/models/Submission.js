import mongoose from "mongoose";
const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
  language: String,
  sourceCode: String,
  status: { type: String, enum: ["Accepted", "Wrong Answer", "Runtime Error", "Compilation Error", "Time Limit Exceeded", "Error"], default: "Error" },
  runtime: Number,
  memory: Number,
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });
export default mongoose.model("Submission", submissionSchema);
