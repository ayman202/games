"use server";

import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function submitContactMessage(_prevState: { ok?: boolean; error?: string } | undefined, formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    return { error: "Please fill in all fields." };
  }
  if (name.length > 100 || email.length > 200 || message.length > 5000) {
    return { error: "One of the fields is too long." };
  }

  if (!(await checkRateLimit(`contact:${getClientIp()}`, 5, 3600))) {
    return { error: "Too many messages sent recently. Please try again later." };
  }

  await prisma.contactMessage.create({ data: { name, email, message } });
  return { ok: true };
}
