"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/app/actions/auth";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { sanitizeRichText } from "@/lib/sanitize";

function resolveSlug(formData: FormData, title: string) {
  const manual = String(formData.get("slug") || "").trim();
  return slugify(manual || title, { lower: true, strict: true });
}

export async function createStaticPage(formData: FormData) {
  const session = await requireRole("SUPER_ADMIN", "EDITOR");
  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("Title is required.");

  const slug = resolveSlug(formData, title);
  if (!slug) throw new Error("Please enter a slug using English letters or numbers.");

  const clash = await prisma.staticPage.findUnique({ where: { slug }, select: { id: true } });
  if (clash) throw new Error(`The slug "${slug}" is already used by another page — choose a different one.`);

  const page = await prisma.staticPage.create({
    data: {
      title,
      slug,
      content: sanitizeRichText(String(formData.get("content") || "")),
    },
  });

  await logActivity(session.adminId, "page.create", "StaticPage", page.id, title);
  revalidatePath("/admin/pages");
  revalidatePath("/", "layout");
  redirect("/admin/pages");
}

export async function updateStaticPage(id: string, formData: FormData) {
  const session = await requireRole("SUPER_ADMIN", "EDITOR");
  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("Title is required.");

  const slug = resolveSlug(formData, title);
  if (!slug) throw new Error("Please enter a slug using English letters or numbers.");

  const clash = await prisma.staticPage.findFirst({ where: { slug, id: { not: id } }, select: { id: true } });
  if (clash) throw new Error(`The slug "${slug}" is already used by another page — choose a different one.`);

  await prisma.staticPage.update({
    where: { id },
    data: { title, slug, content: sanitizeRichText(String(formData.get("content") || "")) },
  });

  await logActivity(session.adminId, "page.update", "StaticPage", id, title);
  revalidatePath("/admin/pages");
  revalidatePath("/", "layout");
  redirect("/admin/pages");
}

export async function deleteStaticPage(id: string) {
  const session = await requireRole("SUPER_ADMIN", "EDITOR");
  await prisma.staticPage.delete({ where: { id } });
  await logActivity(session.adminId, "page.delete", "StaticPage", id);
  revalidatePath("/admin/pages");
  revalidatePath("/", "layout");
}
