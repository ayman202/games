import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export function getClientIp(): string {
  const h = headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/**
 * Returns true if `key` has been used fewer than `max` times in the last `windowSeconds`.
 * Records this attempt regardless of outcome. Works across serverless invocations since
 * it's backed by the database rather than in-memory state.
 *
 * Usage: if (!(await checkRateLimit(`login:${email}`, 5, 60))) return { error: "Too many attempts, try again shortly." };
 */
export async function checkRateLimit(key: string, max: number, windowSeconds: number): Promise<boolean> {
  const since = new Date(Date.now() - windowSeconds * 1000);

  const [count] = await Promise.all([
    prisma.rateLimitLog.count({ where: { key, createdAt: { gte: since } } }),
    prisma.rateLimitLog.create({ data: { key } }),
  ]);

  // Opportunistic cleanup — no cron needed. A small % of calls also sweep out rows
  // older than a day (well past any of our rate-limit windows), so the table never
  // grows unbounded even on a busy site.
  if (Math.random() < 0.05) {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    prisma.rateLimitLog.deleteMany({ where: { createdAt: { lt: oneDayAgo } } }).catch(() => {});
  }

  return count < max;
}
