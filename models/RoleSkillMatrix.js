const mongoose = require('mongoose');

const RoleSkillMatrixSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
    unique: true,
  },
  requiredSkills: [
    {
      skillId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
        required: true,
      },
      requiredProficiency: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        required: true,
      },
    },
  ],
});

module.exports = mongoose.models.RoleSkillMatrix || mongoose.model('RoleSkillMatrix', RoleSkillMatrixSchema);