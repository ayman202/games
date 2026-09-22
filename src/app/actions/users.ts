"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { createUserSession, destroyUserSession, getUserSession } from "@/lib/userAuth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function registerUser(_prevState: { error?: string } | undefined, formData: FormData) {
  const settings = await getSettings();
  if (!settings.allowRegistration) {
    return { error: "New registrations are currently disabled." };
  }

  if (!(await checkRateLimit(`register:${getClientIp()}`, 5, 3600))) {
    return { error: "Too many sign-up attempts from your network. Please try again later." };
  }

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!name || !email || password.length < 6) {
    return { error: "Fill in your name, a valid email, and a password of at least 6 characters." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, passwordHash } });

  await createUserSession(user.id, user.email);
  redirect("/");
}

export async function loginUser(_prevState: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!(await checkRateLimit(`user-login:${email}`, 10, 300))) {
    return { error: "Too many attempts. Please wait a few minutes and try again." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "Invalid email or password." };
  if (user.banned) return { error: "This account has been suspended." };

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return { error: "Invalid email or password." };

  await createUserSession(user.id, user.email);
  redirect("/");
}

export async function logoutUser() {
  await destroyUserSession();
  redirect("/");
}

export async function toggleFavorite(gameId: string) {
  const session = await getUserSession();
  if (!session) redirect("/login");

  const existing = await prisma.favorite.findUnique({
    where: { userId_gameId: { userId: session.userId, gameId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({ data: { userId: session.userId, gameId } });
  }

  revalidatePath("/favorites");
  revalidatePath("/games");
}
