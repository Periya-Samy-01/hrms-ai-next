import mongoose from 'mongoose';

const SalaryStructureSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  baseSalary: {
    type: Number,
    required: true,
  },
  payFrequency: {
    type: String,
    enum: ['Monthly', 'Bi-Weekly'],
    required: true,
  },
  effectiveDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.models.SalaryStructure || mongoose.model('SalaryStructure', SalaryStructureSchema);