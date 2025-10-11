import mongoose from "mongoose";

export async function connectDB() {
  // Use Mongoose's built-in connection state checker
  if (mongoose.connection.readyState >= 1) {
    console.log("✅ Using existing MongoDB connection");
    return;
  }

  try {
    console.log("🔌 Creating new MongoDB connection");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);
    // Re-throw the error to ensure the calling function knows about the failure
    throw new Error("Database connection failed");
  }
}
