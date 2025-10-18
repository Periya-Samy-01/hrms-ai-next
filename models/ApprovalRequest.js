import mongoose from "mongoose";

const ApprovalRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["Leave", "Expense", "Goal"],
    required: true,
  },
  details: {
    // For Leave
    startDate: Date,
    endDate: Date,
    reason: String,
    // For Goals
    title: String,
    description: String,
    // For Expenses
    amount: Number,

  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Denied", "Rejected"],
    default: "Pending",
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // Dynamically reference the model specified in `referenceModel`
    refPath: 'referenceModel'
  },
  referenceModel: {
    type: String,
    required: true,
    enum: ['LeaveRequest', 'Goal']
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ApprovalRequest || mongoose.model("ApprovalRequest", ApprovalRequestSchema);