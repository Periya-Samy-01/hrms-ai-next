import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { connectDB } from '../lib/dbConnect.js';

const seedDB = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected.');

    console.log('Clearing existing users...');
    await User.deleteMany({});
    console.log('Users cleared.');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const manager = new User({
      name: 'Test Manager',
      email: 'manager@example.com',
      password: hashedPassword,
      role: 'manager',
    });

    await manager.save();
    console.log('✅ Database seeded with a manager user.');
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

seedDB();