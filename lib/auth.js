import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_here";

// Generate JWT
export function generateToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role || "employee",
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

// Verify JWT
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function clearToken() {
  document.cookie = "token=; path=/; max-age=0;";
}
