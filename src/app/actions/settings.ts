"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/app/actions/auth";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

export async function updateSettings(formData: FormData) {
  const session = await requireRole("SUPER_ADMIN");

  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {
      siteName: String(formData.get("siteName") || "GameHub"),
      logoUrl: String(formData.get("logoUrl") || "") || null,
      primaryColor: String(formData.get("primaryColor") || "#7c5cff"),
      maintenanceMode: formData.get("maintenanceMode") === "on",
      allowRegistration: formData.get("allowRegistration") === "on",
      adSlotHeader: String(formData.get("adSlotHeader") || "") || null,
      adSlotSidebar: String(formData.get("adSlotSidebar") || "") || null,
      adSlotFooter: String(formData.get("adSlotFooter") || "") || null,
    },
    create: { id: "singleton" },
  });

  await logActivity(session.adminId, "settings.update");
  revalidatePath("/", "layout");
}

export async function createRedirect(formData: FormData) {
  const session = await requireRole("SUPER_ADMIN", "EDITOR");
  const fromPath = String(formData.get("fromPath") || "").trim();
  const toPath = String(formData.get("toPath") || "").trim();
  const statusCode = Number(formData.get("statusCode") || 301);

  if (!fromPath.startsWith("/") || !toPath) throw new Error("From-path must start with / and to-path is required.");

  await prisma.redirect.create({ data: { fromPath, toPath, statusCode } });
  await logActivity(session.adminId, "redirect.create", "Redirect", undefined, `${fromPath} -> ${toPath}`);
  revalidatePath("/admin/redirects");
}

export async function deleteRedirect(id: string) {
  const session = await requireRole("SUPER_ADMIN", "EDITOR");
  await prisma.redirect.delete({ where: { id } });
  await logActivity(session.adminId, "redirect.delete", "Redirect", id);
  revalidatePath("/admin/redirects");
}
