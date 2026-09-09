import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "./server.env" });

const JWT_SECRET = process.env.JWT_SECRET || "mpsa_school_jwt_secret_fallback_key";
const JWT_EXPIRES_IN = "24h";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
