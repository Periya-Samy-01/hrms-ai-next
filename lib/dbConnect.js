import mongoose from "mongoose";

let cachedConnection = null;

export async function connectDB() {
  if (cachedConnection) {
    console.log("✅ Using existing MongoDB connection");
    return cachedConnection;
  }

  try {
    console.log("🔌 Creating new MongoDB connection");
    const db = await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
    cachedConnection = db;
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);
    throw new Error("Database connection failed");
  }
}
