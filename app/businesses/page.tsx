"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BusinessCard } from "../../components/BusinessCard";
import { businesses } from "../../lib/mockData";

type SortMode = "top-rated" | "most-reviewed" | "newest";

export default function BusinessListingPage() {
  const [sortBy, setSortBy] = useState<SortMode>("top-rated");

  const sortedBusinesses = useMemo(() => {
    const next = businesses.slice();
    if (sortBy === "top-rated") {
      return next.sort((a, b) => b.averageRating - a.averageRating);
    }
    if (sortBy === "most-reviewed") {
      return next.sort((a, b) => b.ratingCount - a.ratingCount);
    }
    return next.sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO));
  }, [sortBy]);

  return (
    <main className="bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Business Listing</h1>
            <p className="mt-1 text-sm text-zinc-600">Discover cafes, gyms, salons, and more in Delhi NCR.</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-zinc-700">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortMode)}
              className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950"
            >
              <option value="top-rated">Top rated</option>
              <option value="most-reviewed">Most reviewed</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        <div className="mb-4 text-xs text-zinc-600">{sortedBusinesses.length} businesses</div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedBusinesses.map((b) => (
            <BusinessCard key={b.id} business={b} />
          ))}
        </div>

        <div className="mt-6">
          <Link href="/" className="text-sm font-medium text-blue-700 hover:text-blue-800">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
