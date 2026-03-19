"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BusinessCard } from "../../components/BusinessCard";
import { businesses } from "../../lib/mockData";
import { getFavoriteBusinessIds } from "../../lib/userStorage";

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    setFavoriteIds(getFavoriteBusinessIds());
  }, []);

  const favoriteBusinesses = useMemo(
    () => businesses.filter((b) => favoriteIds.includes(b.id)),
    [favoriteIds]
  );

  return (
    <main className="bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Favorites</h1>
        <p className="mt-1 text-sm text-zinc-600">Saved businesses you marked with hearts.</p>

        {favoriteBusinesses.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
            <div className="text-sm font-semibold text-zinc-950">No favorites yet</div>
            <p className="mt-1 text-sm text-zinc-600">Open a business detail page and click Save ♥.</p>
            <Link href="/" className="mt-3 inline-block text-sm font-medium text-blue-700 hover:text-blue-800">
              Browse businesses
            </Link>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteBusinesses.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
