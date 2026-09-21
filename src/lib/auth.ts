import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "gh_admin_session";

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set. Copy .env.example to .env and fill it in.");
  return new TextEncoder().encode(secret);
}

export type AdminSession = { adminId: string; email: string; role: "SUPER_ADMIN" | "EDITOR" | "MODERATOR" };

export async function createSession(session: AdminSession) {
  const token = await new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  cookies().delete(COOKIE_NAME);
}

export async function getSession(): Promise<AdminSession | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as AdminSession;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
