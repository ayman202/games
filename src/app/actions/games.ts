"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";

async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error("Not authorized.");
}

function parseLinks(formData: FormData) {
  const labels = formData.getAll("linkLabel") as string[];
  const urls = formData.getAll("linkUrl") as string[];
  const links: { label: string; url: string }[] = [];
  for (let i = 0; i < urls.length; i++) {
    if (urls[i]?.trim()) {
      links.push({ label: labels[i]?.trim() || `Download ${i + 1}`, url: urls[i].trim() });
    }
  }
  return links;
}

export async function createGame(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("Title is required.");

  const slug = slugify(title, { lower: true, strict: true });

  await prisma.game.create({
    data: {
      title,
      slug,
      description: String(formData.get("description") || ""),
      coverImage: String(formData.get("coverImage") || "") || null,
      version: String(formData.get("version") || "") || null,
      sizeLabel: String(formData.get("sizeLabel") || "") || null,
      category: String(formData.get("category") || "General"),
      links: { create: parseLinks(formData) },
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateGame(id: string, formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("Title is required.");

  await prisma.downloadLink.deleteMany({ where: { gameId: id } });

  await prisma.game.update({
    where: { id },
    data: {
      title,
      description: String(formData.get("description") || ""),
      coverImage: String(formData.get("coverImage") || "") || null,
      version: String(formData.get("version") || "") || null,
      sizeLabel: String(formData.get("sizeLabel") || "") || null,
      category: String(formData.get("category") || "General"),
      links: { create: parseLinks(formData) },
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteGame(id: string) {
  await requireAdmin();
  await prisma.game.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}
