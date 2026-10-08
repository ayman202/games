"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/app/actions/auth";
import { createSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

export async function updateOwnAccount(_prevState: { error?: string; ok?: boolean } | undefined, formData: FormData) {
  const session = await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");

  if (!name || !email) return { error: "Name and email are required." };

  const admin = await prisma.adminUser.findUnique({ where: { id: session.adminId } });
  if (!admin) return { error: "Account not found." };

  if (newPassword || email !== admin.email) {
    const ok = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!ok) return { error: "Current password is incorrect." };
  }

  const data: any = { name, email };
  if (newPassword) {
    if (newPassword.length < 6) return { error: "New password must be at least 6 characters." };
    data.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  await prisma.adminUser.update({ where: { id: session.adminId }, data });
  await logActivity(session.adminId, "adminUser.selfUpdate");

  // Refresh the session cookie so it reflects the (possibly changed) email.
  await createSession({ adminId: session.adminId, email, role: session.role });
  revalidatePath("/admin/account");
  return { ok: true };
}
