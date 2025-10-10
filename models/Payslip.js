import mongoose from 'mongoose';

const PayslipSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  totalDeductions: {
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
}, { timestamps: true });

export default mongoose.models.Payslip || mongoose.model('Payslip', PayslipSchema);