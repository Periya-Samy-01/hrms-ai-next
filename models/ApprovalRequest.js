import mongoose from "mongoose";

const ApprovalRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["Leave", "Expense"],
    required: true,
  },
  details: {
    startDate: Date,
    endDate: Date,
    amount: Number,
    description: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Denied"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ApprovalRequest || mongoose.model("ApprovalRequest", ApprovalRequestSchema);