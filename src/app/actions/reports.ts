"use server";

import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/userAuth";
import { requireRole } from "@/app/actions/auth";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

export async function submitReport(formData: FormData) {
  const session = await getUserSession();

  const gameId = String(formData.get("gameId") || "") || null;
  const linkId = String(formData.get("linkId") || "") || null;
  const reason = String(formData.get("reason") || "").trim();
  const message = String(formData.get("message") || "").trim() || null;

  if (!reason) throw new Error("Please choose a reason.");

  await prisma.report.create({
    data: { gameId, linkId, reason, message, userId: session?.userId || null },
  });

  revalidatePath("/admin/reports");
  return { ok: true };
}

export async function resolveReport(id: string, status: "RESOLVED" | "DISMISSED") {
  const admin = await requireRole("SUPER_ADMIN", "MODERATOR");
  await prisma.report.update({ where: { id }, data: { status } });
  await logActivity(admin.adminId, `report.${status.toLowerCase()}`, "Report", id);
  revalidatePath("/admin/reports");
}
