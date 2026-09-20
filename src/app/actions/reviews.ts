"use server";

import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/userAuth";
import { requireRole } from "@/app/actions/auth";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function recalcRating(gameId: string) {
  const agg = await prisma.review.aggregate({
    where: { gameId, approved: true },
    _avg: { rating: true },
    _count: true,
  });
  await prisma.game.update({
    where: { id: gameId },
    data: { avgRating: agg._avg.rating || 0, ratingCount: agg._count },
  });
}

export async function submitReview(gameId: string, formData: FormData) {
  const session = await getUserSession();
  if (!session) redirect("/login");

  const rating = Math.min(5, Math.max(1, Number(formData.get("rating") || 5)));
  const comment = String(formData.get("comment") || "").trim();
  if (!comment) throw new Error("Please write a comment.");

  await prisma.review.upsert({
    where: { userId_gameId: { userId: session.userId, gameId } },
    update: { rating, comment },
    create: { userId: session.userId, gameId, rating, comment },
  });

  await recalcRating(gameId);
  revalidatePath(`/games`);
}

export async function deleteReview(reviewId: string, gameId: string) {
  const admin = await requireRole("SUPER_ADMIN", "MODERATOR");
  await prisma.review.delete({ where: { id: reviewId } });
  await recalcRating(gameId);
  await logActivity(admin.adminId, "review.delete", "Review", reviewId);
  revalidatePath("/admin/reviews");
}
