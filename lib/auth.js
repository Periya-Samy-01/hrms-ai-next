import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-super-secret-jwt-key-that-is-long-and-secure");

// Generate JWT using 'jose'
export async function generateToken(user) {
  // Ensure the user ID is a string in the JWT payload
  const payload = {
    sub: user._id.toString(),
    email: user.email,
    role: user.role || "employee",
  };

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(JWT_SECRET);
}

// Verify JWT using 'jose'
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
}

export function clearToken() {
  if (typeof document !== 'undefined') {
    document.cookie = "token=; path=/; max-age=0;";
  }
}