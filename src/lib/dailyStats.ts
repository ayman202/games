import { prisma } from "@/lib/prisma";

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export async function bumpDailyStat(field: "views" | "downloads") {
  const date = todayKey();
  try {
    await prisma.dailyStat.upsert({
      where: { date },
      update: { [field]: { increment: 1 } },
      create: { date, views: field === "views" ? 1 : 0, downloads: field === "downloads" ? 1 : 0 },
    });
  } catch {
    // Non-critical — never block the request over stats.
  }
}
