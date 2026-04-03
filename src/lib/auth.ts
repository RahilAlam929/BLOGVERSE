import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export function signToken(payload: { userId: string; email: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
    };
  } catch {
    return null;
  }
}