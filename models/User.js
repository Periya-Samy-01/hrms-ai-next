import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "hr", "manager", "employee"],
    default: "employee",
  },
  profile: {
    jobTitle: { type: String, default: "Employee" },
    photoUrl: { type: String, default: "https://i.pravatar.cc/150" },
  },
  leaveBalances: {
    annual: { type: Number, default: 20 },
    sick: { type: Number, default: 10 },
  },
  performanceGoals: [
    {
      goal: String,
      status: {
        type: String,
        enum: ["Not Started", "In Progress", "Completed"],
        default: "Not Started",
      },
    },
  ],
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
