"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth";

export async function login(_prevState: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  const validEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
  const hash = process.env.ADMIN_PASSWORD_HASH || "";

  if (!validEmail || !hash) {
    return { error: "Admin credentials are not configured yet." };
  }

  if (email !== validEmail) {
    return { error: "Invalid email or password." };
  }

  const ok = await bcrypt.compare(password, hash);
  if (!ok) {
    return { error: "Invalid email or password." };
  }

  await createSession(email);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
