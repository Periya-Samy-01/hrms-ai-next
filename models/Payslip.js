import mongoose from "mongoose";

const PayslipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  payPeriodStartDate: {
    type: Date,
    required: true,
  },
  payPeriodEndDate: {
    type: Date,
    required: true,
  },
  grossEarnings: {
    type: Number,
    required: true,
  },
  deductions: {
    type: Number,
    required: true,
  },
  netPay: {
    type: Number,
    required: true,
  },
  breakdown: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Payslip || mongoose.model("Payslip", PayslipSchema);
