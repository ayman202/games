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

  const ok = await bcrypt.compare(password, hash).catch(() => false);

  const debugInfo = `DEBUG -> emailMatch:${email === validEmail} | passOk:${ok} | hashLen:${hash.length} | hashStart:${hash.slice(0, 7)} | envEmail:[${validEmail}] | typedEmail:[${email}]`;

  if (email !== validEmail || !ok) {
    return { error: debugInfo };
  }

  await createSession(email);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
