"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/app/actions/auth";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";

export async function createCategory(formData: FormData) {
  const session = await requireRole("SUPER_ADMIN", "EDITOR");
  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Name is required.");

  const category = await prisma.category.create({
    data: {
      name,
      slug: slugify(name, { lower: true, strict: true }),
      icon: String(formData.get("icon") || "") || null,
      image: String(formData.get("image") || "") || null,
      order: Number(formData.get("order") || 0),
    },
  });

  await logActivity(session.adminId, "category.create", "Category", category.id, name);
  revalidatePath("/admin/categories");
  revalidatePath("/");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const session = await requireRole("SUPER_ADMIN", "EDITOR");
  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Name is required.");

  await prisma.category.update({
    where: { id },
    data: {
      name,
      icon: String(formData.get("icon") || "") || null,
      image: String(formData.get("image") || "") || null,
      order: Number(formData.get("order") || 0),
    },
  });

  await logActivity(session.adminId, "category.update", "Category", id, name);
  revalidatePath("/admin/categories");
  revalidatePath("/");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  const session = await requireRole("SUPER_ADMIN", "EDITOR");
  await prisma.category.delete({ where: { id } });
  await logActivity(session.adminId, "category.delete", "Category", id);
  revalidatePath("/admin/categories");
  revalidatePath("/");
}
