"use client";

import { useState } from "react";
import { submitReview } from "@/app/actions/reviews";

export default function ReviewForm({ gameId }: { gameId: string }) {
  const [rating, setRating] = useState(5);

  return (
    <form action={submitReview.bind(null, gameId)} className="card p-4 flex flex-col gap-3">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => setRating(n)}
            className={n <= rating ? "text-yellow-400" : "text-gray-600"}
          >
            ★
          </button>
        ))}
      </div>
      <input type="hidden" name="rating" value={rating} />
      <textarea name="comment" placeholder="Write your review..." rows={3} required className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
      <button className="bg-accent btn-on-accent rounded-lg py-2 font-semibold hover:opacity-90 self-start px-6">
        Submit review
      </button>
    </form>
  );
}
