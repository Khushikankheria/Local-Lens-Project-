import Link from "next/link";
import { BusinessDetailsHeader } from "../../../components/BusinessDetailsHeader";
import { RatingStars } from "../../../components/RatingStars";
import { ReviewCard } from "../../../components/ReviewCard";
import { ReviewFormSection } from "../../../components/ReviewFormSection";
import { businesses, getReviewsForBusiness } from "../../../lib/mockData";

const openingHours = [
  { day: "Monday", time: "8:00 AM - 10:00 PM" },
  { day: "Tuesday", time: "8:00 AM - 10:00 PM" },
  { day: "Wednesday", time: "8:00 AM - 10:00 PM" },
  { day: "Thursday", time: "8:00 AM - 10:00 PM" },
  { day: "Friday", time: "8:00 AM - 11:00 PM" },
  { day: "Saturday", time: "9:00 AM - 11:00 PM" },
  { day: "Sunday", time: "9:00 AM - 9:00 PM" },
];

function RatingRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <div className="grid grid-cols-[90px_1fr_auto] items-center gap-3">
      <div className="text-sm font-medium text-zinc-700">{label}</div>
      <div className="h-2 rounded-full bg-zinc-200">
        <div
          className="h-2 rounded-full bg-amber-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-sm font-medium tabular-nums text-zinc-800">
        {value.toFixed(1)}
      </div>
    </div>
  );
}

export default async function BusinessDetailsPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const routeId = decodeURIComponent(resolvedParams.id ?? "").trim();

  const business = businesses.find((b) => b.id === routeId);

  if (!business) {
    return (
      <main className="bg-zinc-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
            <div className="text-sm font-semibold text-zinc-950">
              Business not found
            </div>
            <p className="mt-1 text-sm text-zinc-600">
              Try going back to browse local businesses.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const businessReviews = getReviewsForBusiness(business.id);

  return (
    <main className="bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 hover:text-zinc-950"
          >
            <span aria-hidden="true">←</span> Back
          </Link>
        </div>

        <BusinessDetailsHeader business={business} />

        <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-zinc-950">Images gallery</h2>
            <div className="text-xs text-zinc-600">{business.images.length} photos</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {business.images.map((src, idx) => (
              <div key={src} className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
                <img
                  src={src}
                  alt={`${business.name} image ${idx + 1}`}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-zinc-950">Timing</h2>
            <div className="text-xs font-semibold text-zinc-700">
              {business.isOpenNow ? "Open now" : "Closed"}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {openingHours.map((row) => (
              <div
                key={row.day}
                className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2"
              >
                <span className="text-sm font-medium text-zinc-700">{row.day}</span>
                <span className="text-sm text-zinc-700">{row.time}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:col-span-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-zinc-950">
                  Rating breakdown
                </h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Quality, service, and value averages
                </p>
              </div>
              <div className="shrink-0">
                <RatingStars value={business.averageRating} size="sm" showValue />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <RatingRow label="Quality" value={business.averageBreakdown.quality} />
              <RatingRow label="Service" value={business.averageBreakdown.service} />
              <RatingRow label="Value" value={business.averageBreakdown.value} />
            </div>

            <div className="mt-5 grid gap-2">
              <a
                href="#write-review"
                className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
              >
                Write a review here
              </a>
              <Link
                href={`/business/${business.id}/review`}
                className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              >
                Add / Edit review page
              </Link>
            </div>
          </section>

          <section className="lg:col-span-2">
            <div className="mb-3 flex items-end justify-between gap-3">
              <h2 className="text-sm font-semibold text-zinc-950">Reviews</h2>
              <div className="text-xs text-zinc-600 tabular-nums">
                {businessReviews.length} review{businessReviews.length === 1 ? "" : "s"}
              </div>
            </div>

            {businessReviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
                <div className="text-sm font-semibold text-zinc-950">
                  No reviews yet
                </div>
                <p className="mt-1 text-sm text-zinc-600">
                  Be the first to write a review.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {businessReviews.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            )}

            <div className="mt-6">
              <ReviewFormSection businessName={business.name} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

