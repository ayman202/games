import { prisma } from "@/lib/prisma";

export async function logActivity(
  adminId: string | null,
  action: string,
  entityType?: string,
  entityId?: string,
  details?: string
) {
  try {
    await prisma.activityLog.create({
      data: { adminId: adminId || undefined, action, entityType, entityId, details },
    });

    // Opportunistic cleanup — keeps only the last 2 days of activity, no cron needed.
    if (Math.random() < 0.05) {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      prisma.activityLog.deleteMany({ where: { createdAt: { lt: twoDaysAgo } } }).catch(() => {});
    }
  } catch {
    // Never let logging break the actual operation.
  }
}
