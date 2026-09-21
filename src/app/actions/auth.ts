"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, getSession, AdminSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

export async function login(_prevState: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) return { error: "Invalid email or password." };

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return { error: "Invalid email or password." };

  await createSession({ adminId: admin.id, email: admin.email, role: admin.role });
  await logActivity(admin.id, "admin.login");
  redirect("/admin");
}

export async function logout() {
  const session = await getSession();
  if (session) await logActivity(session.adminId, "admin.logout");
  await destroySession();
  redirect("/admin/login");
}

/** Throws if there's no valid admin session. Returns the session otherwise. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) throw new Error("Not authorized.");
  return session;
}

/** Throws unless the current admin has one of the given roles. */
export async function requireRole(...roles: AdminSession["role"][]): Promise<AdminSession> {
  const session = await requireAdmin();
  if (!roles.includes(session.role)) throw new Error("You don't have permission to do this.");
  return session;
}
