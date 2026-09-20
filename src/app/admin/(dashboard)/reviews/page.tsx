import { prisma } from "@/lib/prisma";
import { deleteReview } from "@/app/actions/reviews";

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } }, game: { select: { title: true, id: true } } },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reviews</h1>
      <div className="card divide-y divide-white/10">
        {reviews.length === 0 && <p className="p-4 text-gray-400">No reviews yet.</p>}
        {reviews.map((r) => (
          <div key={r.id} className="flex items-start justify-between p-4 text-sm gap-4">
            <div>
              <p className="font-semibold">{r.game.title} — {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
              <p className="text-gray-400 text-xs mb-1">{r.user.name} ({r.user.email})</p>
              <p className="text-gray-300">{r.comment}</p>
            </div>
            <form action={deleteReview.bind(null, r.id, r.game.id)}>
              <button className="text-red-400 hover:underline whitespace-nowrap">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
