import type { Review } from "../lib/types";
import { RatingStars } from "./RatingStars";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-sm font-semibold text-zinc-950">
              {review.authorName}
            </span>
            <span className="text-xs text-zinc-500">{formatDate(review.createdAtISO)}</span>
          </div>
          <div className="mt-1">
            <RatingStars value={review.overall} size="sm" showValue />
          </div>
        </div>
      </div>

      <h4 className="mt-3 text-sm font-semibold text-zinc-950">{review.title}</h4>
      <p className="mt-1 text-sm leading-6 text-zinc-700">{review.body}</p>

      {review.images && review.images.length > 0 ? (
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {review.images.map((src, idx) => (
            <div key={src} className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
              <img
                src={src}
                alt={`Review image ${idx + 1} by ${review.authorName}`}
                className="h-40 w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-700 tabular-nums">
          Quality: {review.ratings.quality.toFixed(1)}
        </span>
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-700 tabular-nums">
          Service: {review.ratings.service.toFixed(1)}
        </span>
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-700 tabular-nums">
          Value: {review.ratings.value.toFixed(1)}
        </span>
      </div>
    </article>
  );
}

