require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDB } = require('../lib/dbConnect');
const User = require('../models/User').default;
const Announcement = require('../models/Announcement').default;
const ApprovalRequest = require('../models/ApprovalRequest').default;

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Database connected. Clearing old data...');

    // Clear existing data
    await User.deleteMany({});
    await Announcement.deleteMany({});
    await ApprovalRequest.deleteMany({});
    console.log('Old data cleared.');

    // Create users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const manager = await User.create({
      name: 'Jane Smith',
      email: 'manager@example.com',
      password: hashedPassword,
      role: 'manager',
      profile: {
        jobTitle: 'Engineering Manager',
        photoUrl: 'https://i.pravatar.cc/150?u=manager'
      },
      leaveBalances: { annual: 15, sick: 5 },
    });

    const employee1 = await User.create({
      name: 'Alex Doe',
      email: 'employee1@example.com',
      password: hashedPassword,
      role: 'employee',
      profile: {
        jobTitle: 'Senior Software Engineer',
        photoUrl: 'https://i.pravatar.cc/150?u=employee1'
      },
      leaveBalances: { annual: 10, sick: 8 },
      performanceGoals: [
        { goal: 'Launch Project Phoenix', status: 'Completed' },
        { goal: 'Improve API response time by 15%', status: 'In Progress' },
      ],
      manager: manager._id,
    });

    const employee2 = await User.create({
      name: 'John Doe',
      email: 'employee2@example.com',
      password: hashedPassword,
      role: 'employee',
      profile: {
        jobTitle: 'Software Engineer',
        photoUrl: 'https://i.pravatar.cc/150?u=employee2'
      },
      leaveBalances: { annual: 12, sick: 3 },
      performanceGoals: [
        { goal: 'Complete Security Training', status: 'Not Started' },
      ],
      manager: manager._id,
    });

    manager.team.push(employee1._id, employee2._id);
    await manager.save();
    console.log('Users created.');

    // Create announcements
    await Announcement.create([
      { title: 'Annual Performance Review Cycle', content: 'The annual performance review cycle is starting next week. Please complete your self-assessment by October 15th.' },
      { title: 'Open Enrollment for Health Insurance', content: 'Open enrollment for 2026 health insurance plans is now open. The deadline to enroll is November 20th.' },
    ]);
    console.log('Announcements created.');

    // Create approval requests
    await ApprovalRequest.create([
      {
        requester: employee1._id,
        manager: manager._id,
        type: 'Leave',
        details: {
          startDate: new Date('2025-12-20'),
          endDate: new Date('2025-12-22'),
          description: 'Vacation',
        },
      },
      {
        requester: employee2._id,
        manager: manager._id,
        type: 'Expense',
        details: {
          amount: 250,
          description: 'New monitor for development',
        },
      },
    ]);
    console.log('Approval requests created.');

    console.log('Database seeded successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed.');
  }
};

seedDatabase();