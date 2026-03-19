"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BusinessCard } from "../../../components/BusinessCard";
import { businesses } from "../../../lib/mockData";

type SortMode = "top-rated" | "most-reviewed" | "newest";

function normalizeCategory(input: string) {
  return input.replace(/-/g, " ").toLowerCase();
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const [sortBy, setSortBy] = useState<SortMode>("top-rated");
  const [location, setLocation] = useState<string>("All");
  const [minRating, setMinRating] = useState<number>(0);
  const categoryName = normalizeCategory(params.category);
  const locationOptions = useMemo(
    () => ["All", ...Array.from(new Set(businesses.map((b) => b.location)))],
    []
  );

  const categoryBusinesses = useMemo(() => {
    const isFoodDining = categoryName === "food & dining" || categoryName === "food and dining";
    const categoryFiltered = businesses.filter((b) => {
      if (isFoodDining) {
        return ["Cafe", "Restaurant", "Bakery"].includes(b.category);
      }
      return b.category.toLowerCase() === categoryName || b.category.toLowerCase().includes(categoryName);
    });

    const filtered = categoryFiltered.filter((b) => {
      if (location !== "All" && b.location !== location) return false;
      if (minRating > 0 && b.averageRating < minRating) return false;
      return true;
    });

    if (sortBy === "top-rated") {
      return filtered.slice().sort((a, b) => b.averageRating - a.averageRating);
    }
    if (sortBy === "most-reviewed") {
      return filtered.slice().sort((a, b) => b.ratingCount - a.ratingCount);
    }
    return filtered.slice().sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO));
  }, [categoryName, sortBy, location, minRating]);

  return (
    <main className="bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Category: {categoryName}</h1>
            <p className="mt-1 text-sm text-zinc-600">Businesses under this category with filtering + sorting.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs font-medium text-zinc-700">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950"
            >
              {locationOptions.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            <label className="text-xs font-medium text-zinc-700">Min rating</label>
            <select
              value={String(minRating)}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950"
            >
              <option value="0">All</option>
              <option value="3.5">3.5+</option>
              <option value="4">4.0+</option>
              <option value="4.5">4.5+</option>
            </select>

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

        {categoryBusinesses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
            <div className="text-sm font-semibold text-zinc-950">No businesses found</div>
            <p className="mt-1 text-sm text-zinc-600">Try another category from the home page.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryBusinesses.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        )}

        <div className="mt-6">
          <Link href="/" className="text-sm font-medium text-blue-700 hover:text-blue-800">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
