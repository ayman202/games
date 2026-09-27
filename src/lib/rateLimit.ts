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

  return count < max;
}
