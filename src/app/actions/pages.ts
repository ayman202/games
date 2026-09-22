"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/app/actions/auth";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { sanitizeRichText } from "@/lib/sanitize";

export async function createStaticPage(formData: FormData) {
  const session = await requireRole("SUPER_ADMIN", "EDITOR");
  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("Title is required.");

  const page = await prisma.staticPage.create({
    data: {
      title,
      slug: slugify(title, { lower: true, strict: true }),
      content: sanitizeRichText(String(formData.get("content") || "")),
    },
  });

  await logActivity(session.adminId, "page.create", "StaticPage", page.id, title);
  revalidatePath("/admin/pages");
  redirect("/admin/pages");
}

export async function updateStaticPage(id: string, formData: FormData) {
  const session = await requireRole("SUPER_ADMIN", "EDITOR");
  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("Title is required.");

  await prisma.staticPage.update({
    where: { id },
    data: { title, content: sanitizeRichText(String(formData.get("content") || "")) },
  });

  await logActivity(session.adminId, "page.update", "StaticPage", id, title);
  revalidatePath("/admin/pages");
  redirect("/admin/pages");
}

export async function deleteStaticPage(id: string) {
  const session = await requireRole("SUPER_ADMIN", "EDITOR");
  await prisma.staticPage.delete({ where: { id } });
  await logActivity(session.adminId, "page.delete", "StaticPage", id);
  revalidatePath("/admin/pages");
}
