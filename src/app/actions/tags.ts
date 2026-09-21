"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/app/actions/auth";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

export async function renameTag(id: string, formData: FormData) {
  const session = await requireRole("SUPER_ADMIN", "EDITOR");
  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Name is required.");

  await prisma.tag.update({ where: { id }, data: { name, slug: slugify(name, { lower: true, strict: true }) } });
  await logActivity(session.adminId, "tag.rename", "Tag", id, name);
  revalidatePath("/admin/tags");
}

export async function deleteTag(id: string) {
  const session = await requireRole("SUPER_ADMIN", "EDITOR");
  await prisma.tag.delete({ where: { id } });
  await logActivity(session.adminId, "tag.delete", "Tag", id);
  revalidatePath("/admin/tags");
}
