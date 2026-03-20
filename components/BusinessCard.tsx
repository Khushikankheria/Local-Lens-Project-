import Link from "next/link";
import type { Business } from "../lib/types";
import { RatingStars } from "./RatingStars";

export function BusinessCard({ business }: { business: Business }) {
  const coverImage = business.images[0];

  return (
    <Link
      href={`/business/${business.id}`}
      className="group block overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/40"
    >
      <div className="relative h-40 w-full overflow-hidden bg-zinc-100">
        {coverImage ? (
          <img
            src={coverImage}
            alt={`${business.name} storefront`}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-zinc-500">
            No image available
          </div>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-zinc-700 shadow-sm">
          {business.category}
        </span>
      </div>

      <div className="p-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-zinc-950">
            {business.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
            {business.shortDescription}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-semibold text-zinc-700">
            {business.location}
          </span>
          <div className="flex items-center gap-2">
            <RatingStars value={business.averageRating} size="sm" />
            <span className="text-xs font-semibold text-zinc-700 tabular-nums">
              {business.averageRating.toFixed(1)} ({business.ratingCount})
            </span>
          </div>
        </div>

        <div className="mt-3 text-xs text-zinc-500">{business.addressLine}</div>

        <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-700 group-hover:text-blue-800">
          View details
          <span aria-hidden="true">→</span>
        </div>
      </div>
    </Link>
  );
}

