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
      surfaceColor: String(formData.get("surfaceColor") || "#12151c"),
      lightPrimaryColor: String(formData.get("lightPrimaryColor") || "#7c5cff"),
      lightSecondaryColor: String(formData.get("lightSecondaryColor") || "#00997f"),
      lightBackgroundColor: String(formData.get("lightBackgroundColor") || "#f7f7fa"),
      lightSurfaceColor: String(formData.get("lightSurfaceColor") || "#ffffff"),
      defaultTheme: String(formData.get("defaultTheme") || "dark"),
      allowThemeToggle: formData.get("allowThemeToggle") === "on",
      maintenanceMode: formData.get("maintenanceMode") === "on",
      allowRegistration: formData.get("allowRegistration") === "on",
      allowReviews: formData.get("allowReviews") === "on",
      showGameNotes: formData.get("showGameNotes") === "on",
      enableCopyProtection: formData.get("enableCopyProtection") === "on",
      heroImageCount: Number(formData.get("heroImageCount") || 10),
      heroBackgroundColor: String(formData.get("heroBackgroundColor") || "#0b0d12"),
      heroBlob1Color: String(formData.get("heroBlob1Color") || "#7c5cff"),
      heroBlob2Color: String(formData.get("heroBlob2Color") || "#00e5c7"),
      heroBackgroundColorLight: String(formData.get("heroBackgroundColorLight") || "#f7f7fa"),
      heroBlob1ColorLight: String(formData.get("heroBlob1ColorLight") || "#7c5cff"),
      heroBlob2ColorLight: String(formData.get("heroBlob2ColorLight") || "#00997f"),
      noteColor: String(formData.get("noteColor") || "#eab308"),
      adSlotHomeBetweenRows: str(formData, "adSlotHomeBetweenRows"),
      downloadWaitSeconds: Number(formData.get("downloadWaitSeconds") || 10),
      adSlotDownloadTop: str(formData, "adSlotDownloadTop"),
      adSlotDownloadBottom: str(formData, "adSlotDownloadBottom"),
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
      adsTxtContent: str(formData, "adsTxtContent"),
      sitemapExtraUrls: str(formData, "sitemapExtraUrls"),
      robotsExtraDisallow: str(formData, "robotsExtraDisallow"),
    },
    create: { id: "singleton" },
  });

  await logActivity(session.adminId, "settings.update");
  revalidatePath("/", "layout");
}

export async function clearSiteCache() {
  const session = await requireRole("SUPER_ADMIN");
  revalidatePath("/", "layout");
  await logActivity(session.adminId, "cache.clear");
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
