const mongoose = require('mongoose');

const EmployeeSkillSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true,
  },
  currentProficiency: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    required: true,
  },
});

module.exports = mongoose.models.EmployeeSkill || mongoose.model('EmployeeSkill', EmployeeSkillSchema);