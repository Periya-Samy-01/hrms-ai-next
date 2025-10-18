import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Goal from '../models/Goal.js';
import ApprovalRequest from '../models/ApprovalRequest.js';
import { connectDB } from '../lib/dbConnect.js';

const seedDB = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected.');

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Goal.deleteMany({});
    await ApprovalRequest.deleteMany({});
    console.log('Existing data cleared.');

    const usersData = [
      { name: 'Jane Doe', email: 'manager@example.com', role: 'manager', profile: { jobTitle: 'Engineering Manager' } },
      { name: 'John Smith', email: 'john.smith@example.com', role: 'employee', profile: { jobTitle: 'Frontend Developer' } },
      { name: 'Emily White', email: 'emily.white@example.com', role: 'hr', profile: { jobTitle: 'HR Specialist' } },
      { name: 'Admin User', email: 'admin@example.com', role: 'admin', profile: { jobTitle: 'System Administrator' } }
    ];

    // Hash passwords and create users
    const createdUsers = await Promise.all(
      usersData.map(async (userData) => {
        const password = await bcrypt.hash('password123', 10);
        const user = new User({ ...userData, password });
        return user.save();
      })
    );
    console.log(`${createdUsers.length} users created.`);

    // --- Structure the team ---
    const manager = createdUsers.find(u => u.email === 'manager@example.com');
    const employees = createdUsers.filter(u => u.email !== 'manager@example.com' && u.email !== 'admin@example.com');

    // Assign employees to manager's team and set their manager
    manager.team = employees.map(e => e._id);
    await manager.save();

    for (const employee of employees) {
      employee.manager = manager._id;
      await employee.save();
    }
    console.log('Manager and team assigned.');

    // --- Create Goals for employees ---
    const johnSmith = createdUsers.find(u => u.email === 'john.smith@example.com');
    const emilyWhite = createdUsers.find(u => u.email === 'emily.white@example.com');

    const goals = [
      // Goal for John Smith - Pending Approval
      {
        title: 'Complete Next.js Advanced Tutorial',
        description: 'Finish the official advanced Next.js course to improve frontend skills.',
        employeeId: johnSmith._id,
        managerId: manager._id,
        status: 'Pending Approval',
        deadline: new Date('2025-12-31'),
      },
      // Goal for John Smith - Active
      {
        title: 'Refactor Authentication Flow',
        description: 'Improve the performance and security of the user authentication module.',
        employeeId: johnSmith._id,
        managerId: manager._id,
        status: 'Active',
        progress: 40,
        deadline: new Date('2025-11-30'),
      },
      // Goal for Emily White - Pending Approval
      {
        title: 'Design New Database Schema for Analytics',
        description: 'Create a scalable and efficient database schema for the new analytics feature.',
        employeeId: emilyWhite._id,
        managerId: manager._id,
        status: 'Pending Approval',
        deadline: new Date('2026-01-15'),
      },
       // Goal for Emily White - Completed
      {
        title: 'Optimize API Response Times',
        description: 'Reduce the average API response time by 20% through query optimization.',
        employeeId: emilyWhite._id,
        managerId: manager._id,
        status: 'Completed',
        progress: 100,
        deadline: new Date('2025-10-01'),
      },
    ];

    const createdGoals = await Goal.insertMany(goals);
    console.log(`${createdGoals.length} goals created.`);

    // Link goals to users and create approval requests
    for (const goal of createdGoals) {
      await User.findByIdAndUpdate(goal.employeeId, {
        $push: { performanceGoals: goal._id },
      });

      if (goal.status === 'Pending Approval') {
        const approvalRequest = new ApprovalRequest({
          requester: goal.employeeId,
          manager: goal.managerId,
          type: 'Goal',
          details: {
            title: goal.title,
            description: goal.description,
          },
          referenceId: goal._id,
          referenceModel: 'Goal',
        });
        await approvalRequest.save();
      }
    }
    console.log('Goals linked and approval requests created.');

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

seedDB();