import { connectDB } from "@/lib/dbConnect";

export async function GET() {
  try {
    await connectDB();
    return Response.json({ message: "✅ MongoDB connection successful!" });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "❌ MongoDB connection failed" }, { status: 500 });
  }
}
