import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Goal from '../models/Goal.js';
import SalaryStructure from '../models/SalaryStructure.js';
import { connectDB } from '../lib/dbConnect.js';

const seedDB = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected.');

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Goal.deleteMany({});
    await SalaryStructure.deleteMany({});
    console.log('Existing data cleared.');

    const password = 'password123';

    // Create users individually to ensure password hashing is correct for each
    const usersToCreate = [
      {
        name: 'John Smith',
        email: 'john.smith@example.com',
        role: 'manager',
        profile: { jobTitle: 'Frontend Developer' },
      },
      {
        name: 'Emily White',
        email: 'emily.white@example.com',
        role: 'hr',
        profile: { jobTitle: 'HR Specialist' },
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        profile: { jobTitle: 'System Administrator' },
      },
      {
        name: 'Jane Doe',
        email: 'manager@example.com',
        role: 'manager',
        profile: { jobTitle: 'Engineering Manager' },
      },
    ];

    const createdUsers = [];
    for (const userData of usersToCreate) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ ...userData, password: hashedPassword });
      await user.save();
      createdUsers.push(user);
    }

    const manager = createdUsers.find(u => u.email === 'manager@example.com');
    const employees = createdUsers.filter(u => u.email !== 'manager@example.com' && u.role !== 'admin');

    manager.team = employees.map(e => e._id);
    await manager.save();

    console.log(`${createdUsers.length} users created.`);
    const createdEmployees = employees;
    console.log(`${createdEmployees.length} employees created.`);

    // Assign employees to manager's team
    manager.team = createdEmployees.map(e => e._id);
    await manager.save();
    console.log('Manager created and team assigned.');

    // Create Goals for employees
    const goals = [
      // Goal for John Smith - Pending Approval
      {
        title: 'Complete Next.js Advanced Tutorial',
        description: 'Finish the official advanced Next.js course to improve frontend skills.',
        employeeId: createdEmployees[0]._id,
        managerId: manager._id,
        status: 'Pending Approval',
        deadline: new Date('2025-12-31'),
      },
      // Goal for John Smith - Active
      {
        title: 'Refactor Authentication Flow',
        description: 'Improve the performance and security of the user authentication module.',
        employeeId: createdEmployees[0]._id,
        managerId: manager._id,
        status: 'Active',
        progress: 40,
        deadline: new Date('2025-11-30'),
      },
      // Goal for Emily White - Pending Approval
      {
        title: 'Design New Database Schema for Analytics',
        description: 'Create a scalable and efficient database schema for the new analytics feature.',
        employeeId: createdEmployees[1]._id,
        managerId: manager._id,
        status: 'Pending Approval',
        deadline: new Date('2026-01-15'),
      },
       // Goal for Emily White - Completed
      {
        title: 'Optimize API Response Times',
        description: 'Reduce the average API response time by 20% through query optimization.',
        employeeId: createdEmployees[1]._id,
        managerId: manager._id,
        status: 'Completed',
        progress: 100,
        deadline: new Date('2025-10-01'),
      },
    ];

    const createdGoals = await Goal.insertMany(goals);
    console.log(`${createdGoals.length} goals created.`);

    // Link goals to users
    for (const goal of createdGoals) {
      await User.findByIdAndUpdate(goal.employeeId, {
        $push: { performanceGoals: goal._id },
      });
    }
    console.log('Goals linked to respective employees.');

    // Create Salary Structures
    const salaryStructures = [
      {
        employeeId: createdEmployees[0]._id,
        baseSalary: 75000,
        payFrequency: 'Monthly',
      },
      {
        employeeId: createdEmployees[1]._id,
        baseSalary: 85000,
        payFrequency: 'Monthly',
      },
    ];

    await SalaryStructure.insertMany(salaryStructures);
    console.log(`${salaryStructures.length} salary structures created.`);

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