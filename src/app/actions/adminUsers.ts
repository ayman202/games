"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/app/actions/auth";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createAdminUser(formData: FormData) {
  const session = await requireRole("SUPER_ADMIN");

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "EDITOR") as any;

  if (!name || !email || password.length < 6) throw new Error("Fill in all fields (password min 6 chars).");

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await prisma.adminUser.create({ data: { name, email, passwordHash, role } });

  await logActivity(session.adminId, "adminUser.create", "AdminUser", admin.id, `${name} (${role})`);
  revalidatePath("/admin/team");
  redirect("/admin/team");
}

export async function deleteAdminUser(id: string) {
  const session = await requireRole("SUPER_ADMIN");
  if (id === session.adminId) throw new Error("You can't delete your own account.");
  await prisma.adminUser.delete({ where: { id } });
  await logActivity(session.adminId, "adminUser.delete", "AdminUser", id);
  revalidatePath("/admin/team");
}

export async function banUser(id: string) {
  const session = await requireRole("SUPER_ADMIN", "MODERATOR");
  await prisma.user.update({ where: { id }, data: { banned: true } });
  await logActivity(session.adminId, "user.ban", "User", id);
  revalidatePath("/admin/users");
}

export async function unbanUser(id: string) {
  const session = await requireRole("SUPER_ADMIN", "MODERATOR");
  await prisma.user.update({ where: { id }, data: { banned: false } });
  await logActivity(session.adminId, "user.unban", "User", id);
  revalidatePath("/admin/users");
}

export async function updateUserByAdmin(id: string, formData: FormData) {
  const session = await requireRole("SUPER_ADMIN", "MODERATOR");
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!name || !email) throw new Error("Name and email are required.");

  await prisma.user.update({ where: { id }, data: { name, email } });
  await logActivity(session.adminId, "user.update", "User", id, `${name} <${email}>`);
  revalidatePath("/admin/users");
}
