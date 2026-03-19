"use client";

import { useEffect, useState } from "react";
import { isBusinessFavorite, toggleFavoriteBusiness } from "../lib/userStorage";

export function FavoriteButton({ businessId }: { businessId: string }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(isBusinessFavorite(businessId));
  }, [businessId]);

  return (
    <button
      type="button"
      onClick={() => setIsFavorite(toggleFavoriteBusiness(businessId))}
      className={`inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium ${
        isFavorite
          ? "bg-rose-600 text-white hover:bg-rose-700"
          : "border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50"
      }`}
      aria-pressed={isFavorite}
    >
      {isFavorite ? "Saved ♥" : "Save ♥"}
    </button>
  );
}
