"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/app/actions/auth";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

function str(formData: FormData, key: string) {
  return String(formData.get(key) || "") || null;
}

export async function updateSettings(formData: FormData) {
  const session = await requireRole("SUPER_ADMIN");

  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {
      siteName: String(formData.get("siteName") || "GameHub"),
      siteDescription: str(formData, "siteDescription"),
      logoUrl: str(formData, "logoUrl"),
      faviconUrl: str(formData, "faviconUrl"),
      primaryColor: String(formData.get("primaryColor") || "#7c5cff"),
      secondaryColor: String(formData.get("secondaryColor") || "#00e5c7"),
      backgroundColor: String(formData.get("backgroundColor") || "#0b0d12"),
      defaultTheme: String(formData.get("defaultTheme") || "dark"),
      allowThemeToggle: formData.get("allowThemeToggle") === "on",
      maintenanceMode: formData.get("maintenanceMode") === "on",
      allowRegistration: formData.get("allowRegistration") === "on",
      allowReviews: formData.get("allowReviews") === "on",
      socialFacebook: str(formData, "socialFacebook"),
      socialTwitter: str(formData, "socialTwitter"),
      socialInstagram: str(formData, "socialInstagram"),
      socialYoutube: str(formData, "socialYoutube"),
      socialDiscord: str(formData, "socialDiscord"),
      seoDefaultTitle: str(formData, "seoDefaultTitle"),
      seoDefaultDescription: str(formData, "seoDefaultDescription"),
      seoKeywords: str(formData, "seoKeywords"),
      showContactInHeader: formData.get("showContactInHeader") === "on",
      showCategoriesInHeader: formData.get("showCategoriesInHeader") === "on",
      footerText: str(formData, "footerText"),
      adSlotHeader: str(formData, "adSlotHeader"),
      adSlotSidebar: str(formData, "adSlotSidebar"),
      adSlotFooter: str(formData, "adSlotFooter"),
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
