"use server";

import { prisma } from "@/lib/prisma";

export async function submitContactMessage(_prevState: { ok?: boolean; error?: string } | undefined, formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    return { error: "Please fill in all fields." };
  }

  await prisma.contactMessage.create({ data: { name, email, message } });
  return { ok: true };
}
