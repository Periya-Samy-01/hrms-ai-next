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