"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/app/actions/auth";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";

function parseLinks(formData: FormData) {
  const labels = formData.getAll("linkLabel") as string[];
  const urls = formData.getAll("linkUrl") as string[];
  const providers = formData.getAll("linkProvider") as string[];
  const links: { label: string; url: string; provider: string }[] = [];
  for (let i = 0; i < urls.length; i++) {
    if (urls[i]?.trim()) {
      links.push({
        label: labels[i]?.trim() || `Download ${i + 1}`,
        url: urls[i].trim(),
        provider: providers[i]?.trim() || "direct",
      });
    }
  }
  return links;
}

function parseImages(formData: FormData) {
  const urls = (formData.get("imageUrls") as string) || "";
  return urls
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean)
    .map((url, order) => ({ url, order }));
}

function parseTags(formData: FormData) {
  const raw = (formData.get("tags") as string) || "";
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

async function connectTags(tagNames: string[]) {
  const tagIds: string[] = [];
  for (const name of tagNames) {
    const slug = slugify(name, { lower: true, strict: true });
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    tagIds.push(tag.id);
  }
  return tagIds;
}

export async function createGame(formData: FormData) {
  const session = await requireRole("SUPER_ADMIN", "EDITOR");

  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("Title is required.");

  const slug = slugify(title, { lower: true, strict: true });
  const status = (String(formData.get("status") || "PUBLISHED")) as any;
  const publishAt = formData.get("publishAt") ? new Date(String(formData.get("publishAt"))) : null;
  const tagIds = await connectTags(parseTags(formData));

  const game = await prisma.game.create({
    data: {
      title,
      slug,
      description: String(formData.get("description") || ""),
      coverImage: String(formData.get("coverImage") || "") || null,
      version: String(formData.get("version") || "") || null,
      sizeLabel: String(formData.get("sizeLabel") || "") || null,
      categoryId: String(formData.get("categoryId") || "") || null,
      status,
      publishAt,
      metaTitle: String(formData.get("metaTitle") || "") || null,
      metaDescription: String(formData.get("metaDescription") || "") || null,
      links: { create: parseLinks(formData) },
      images: { create: parseImages(formData) },
      tags: { create: tagIds.map((tagId) => ({ tagId })) },
    },
  });

  await logActivity(session.adminId, "game.create", "Game", game.id, title);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateGame(id: string, formData: FormData) {
  const session = await requireRole("SUPER_ADMIN", "EDITOR");

  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("Title is required.");

  const status = (String(formData.get("status") || "PUBLISHED")) as any;
  const publishAt = formData.get("publishAt") ? new Date(String(formData.get("publishAt"))) : null;

  await prisma.downloadLink.deleteMany({ where: { gameId: id } });
  await prisma.gameImage.deleteMany({ where: { gameId: id } });
  await prisma.gameTag.deleteMany({ where: { gameId: id } });
  const tagIds = await connectTags(parseTags(formData));

  await prisma.game.update({
    where: { id },
    data: {
      title,
      description: String(formData.get("description") || ""),
      coverImage: String(formData.get("coverImage") || "") || null,
      version: String(formData.get("version") || "") || null,
      sizeLabel: String(formData.get("sizeLabel") || "") || null,
      categoryId: String(formData.get("categoryId") || "") || null,
      status,
      publishAt,
      metaTitle: String(formData.get("metaTitle") || "") || null,
      metaDescription: String(formData.get("metaDescription") || "") || null,
      links: { create: parseLinks(formData) },
      images: { create: parseImages(formData) },
      tags: { create: tagIds.map((tagId) => ({ tagId })) },
    },
  });

  await logActivity(session.adminId, "game.update", "Game", id, title);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteGame(id: string) {
  const session = await requireRole("SUPER_ADMIN", "EDITOR");
  const game = await prisma.game.findUnique({ where: { id } });
  await prisma.game.delete({ where: { id } });
  await logActivity(session.adminId, "game.delete", "Game", id, game?.title);
  revalidatePath("/");
  revalidatePath("/admin");
}

/** Auto-promotes any SCHEDULED games whose publishAt has passed. Call before public queries. */
export async function promoteScheduledGames() {
  await prisma.game.updateMany({
    where: { status: "SCHEDULED", publishAt: { lte: new Date() } },
    data: { status: "PUBLISHED" },
  });
}

export async function checkLinkStatus(linkId: string) {
  await requireRole("SUPER_ADMIN", "EDITOR");
  const link = await prisma.downloadLink.findUnique({ where: { id: linkId } });
  if (!link) return;

  let isWorking = false;
  try {
    const res = await fetch(link.url, { method: "HEAD", redirect: "follow" });
    isWorking = res.ok;
  } catch {
    isWorking = false;
  }

  await prisma.downloadLink.update({
    where: { id: linkId },
    data: { isWorking, lastCheckedAt: new Date() },
  });

  revalidatePath("/admin/links");
}
