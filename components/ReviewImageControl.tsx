"use client";

import { useMemo, useState } from "react";
import type { AdminReview } from "../lib/adminMockData";
import type { Business } from "../lib/types";

export interface ReviewImageControlProps {
  reviews: AdminReview[];
  businesses: Map<string, Business>;
  isLoading: boolean;
  onDeleteImage: (reviewId: string, imageIndex: number) => void;
}

export function ReviewImageControl({
  reviews,
  businesses,
  isLoading,
  onDeleteImage,
}: ReviewImageControlProps) {
  const [filterReviewsWithImages, setFilterReviewsWithImages] =
    useState(false);

  const reviewsWithImages = useMemo(() => {
    return reviews
      .filter((r) => (filterReviewsWithImages ? r.images && r.images.length > 0 : true))
      .slice()
      .sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO));
  }, [reviews, filterReviewsWithImages]);

  const imageStats = useMemo(() => {
    let total = 0;
    let reviewsCount = 0;
    for (const r of reviews) {
      if (r.images && r.images.length > 0) {
        reviewsCount += 1;
        total += r.images.length;
      }
    }
    return { total, reviewsCount };
  }, [reviews]);

  return (
    <section className="mt-10">
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-zinc-950">
          Review Content Control
        </h2>
        <p className="mt-1 text-sm text-zinc-600">
          Manage and delete inappropriate images from reviews.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white p-3">
          <div className="text-xs font-medium text-zinc-600">
            Reviews with Images
          </div>
          <div className="mt-1 text-2xl font-semibold text-zinc-950">
            {imageStats.reviewsCount}
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-3">
          <div className="text-xs font-medium text-zinc-600">Total Images</div>
          <div className="mt-1 text-2xl font-semibold text-zinc-950">
            {imageStats.total}
          </div>
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filterReviewsWithImages}
            onChange={(e) => setFilterReviewsWithImages(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-zinc-700">
            Show only reviews with images
          </span>
        </label>
      </div>

      {/* Reviews Grid */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-lg border border-zinc-200 bg-white"
              />
            ))}
          </div>
        ) : reviewsWithImages.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
            <div className="text-sm font-semibold text-zinc-950">
              {filterReviewsWithImages
                ? "No reviews with images"
                : "No reviews"}
            </div>
            <p className="mt-1 text-sm text-zinc-600">
              {filterReviewsWithImages
                ? "All reviews without images have been filtered out."
                : "No reviews to display."}
            </p>
          </div>
        ) : (
          reviewsWithImages.map((review) => {
            const business = businesses.get(review.businessId);
            const hasImages = review.images && review.images.length > 0;

            return (
              <div
                key={review.id}
                className="rounded-lg border border-zinc-200 bg-white p-4"
              >
                <div className="mb-3 border-b border-zinc-200 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-zinc-950">
                        {review.title}
                      </div>
                      <div className="mt-1 text-xs text-zinc-600">
                        <span className="font-medium">{review.authorName}</span>{" "}
                        on{" "}
                        <span className="font-medium">
                          {business?.name || "Unknown"}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        {new Date(review.createdAtISO).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        review.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : review.status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {review.status}
                    </span>
                  </div>
                </div>

                {hasImages ? (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-zinc-700">
                      {review.images!.length} image{review.images!.length > 1 ? "s" : ""}
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {review.images!.map((img, idx) => (
                        <div key={idx} className="relative">
                          <div className="aspect-square rounded-lg border border-zinc-200 bg-zinc-50 overflow-hidden">
                            <img
                              src={img}
                              alt={`Review image ${idx + 1} for ${review.title}`}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => onDeleteImage(review.id, idx)}
                            className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white hover:bg-red-700"
                            title="Delete image"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-zinc-500">No images</div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
