import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending Approval", "Active", "Completed", "Needs Revision"],
    default: "Pending Approval",
  },
  progress: { type: Number, default: 0 },
  deadline: { type: Date },
});

export default mongoose.models.Goal || mongoose.model("Goal", GoalSchema);