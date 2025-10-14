import mongoose from "mongoose";

const AuditEventSchema = new mongoose.Schema({
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  actionType: {
    type: String,
    enum: ["USER_ROLE_CHANGED", "PAYROLL_RUN", "GOAL_APPROVED", "SALARY_UPDATED"],
    required: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.AuditEvent || mongoose.model("AuditEvent", AuditEventSchema);
