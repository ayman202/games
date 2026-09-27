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
  } catch {
    // Never let logging break the actual operation.
  }
}
