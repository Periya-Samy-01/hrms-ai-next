import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import User from '@/models/User';
import Goal from '@/models/Goal'; // Ensure Goal model is imported to be used in populate
import { jwtVerify } from 'jose';

async function verifyAuth(request) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return { authorized: false, status: 401, message: 'Authentication required.' };
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (payload.role === 'admin' || payload.role === 'hr') {
      return { authorized: true, role: payload.role };
    }

    return { authorized: false, status: 403, message: 'Forbidden' };
  } catch (error) {
    return { authorized: false, status: 401, message: 'Invalid token.' };
  }
}

export async function GET(request) {
  const authResult = await verifyAuth(request);
  if (!authResult.authorized) {
    return NextResponse.json({ message: authResult.message }, { status: authResult.status });
  }

  try {
    await connectDB();

    // Fetch all users and populate their performance goals
    const users = await User.find({}).populate('performanceGoals');

    const analyticsData = users.map(user => {
      let riskScore = 10;
      const contributingFactors = [];

      // 1. Tenure check (using ObjectId timestamp)
      const createdAt = user._id.getTimestamp();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      if (createdAt > oneYearAgo) {
        riskScore += 20;
        contributingFactors.push('Low Tenure');
      }

      // 2. Goal completion progress
      if (user.performanceGoals.length > 0) {
        const totalProgress = user.performanceGoals.reduce((acc, goal) => acc + goal.progress, 0);
        const avgProgress = totalProgress / user.performanceGoals.length;
        if (avgProgress < 50) {
          riskScore += 25;
          contributingFactors.push('Low Goal Progress');
        }
      } else {
        // Optional: decide if no goals is also a risk factor
        riskScore += 10; // Lesser penalty for having no goals assigned yet
        contributingFactors.push('No Goals Assigned');
      }

      // 3. Simulated overtime hours
      const overtimeHours = Math.floor(Math.random() * 21); // 0-20 hours
      if (overtimeHours > 10) {
        riskScore += 20;
        contributingFactors.push('High Overtime');
      }

      // 4. Simulated satisfaction score
      const satisfactionScore = Math.floor(Math.random() * 5) + 1; // 1-5
      if (satisfactionScore < 3) {
        riskScore += 25;
        contributingFactors.push('Low Satisfaction');
      }

      return {
        employeeId: user._id,
        name: user.name,
        jobTitle: user.profile.jobTitle,
        riskScore: Math.min(riskScore, 100), // Cap score at 100
        contributingFactors,
        overtimeHours,
        satisfactionScore,
      };
    });

    return NextResponse.json(analyticsData, { status: 200 });
  } catch (error) {
    console.error('GET /api/analytics/attrition-risk Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
