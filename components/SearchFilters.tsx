"use client";

import type { BusinessCategory, BusinessLocation } from "../lib/types";

export type SearchFiltersValue = {
  query: string;
  category: BusinessCategory | "All";
  location: BusinessLocation | "All";
  minRating: number;
  price: "$" | "$$" | "$$$" | "All";
};

export function SearchFilters({
  value,
  categories,
  locations,
  onChange,
}: {
  value: SearchFiltersValue;
  categories: Array<BusinessCategory>;
  locations: Array<BusinessLocation>;
  onChange: (next: SearchFiltersValue) => void;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="sm:col-span-1">
          <span className="text-xs font-medium text-zinc-700">Search</span>
          <input
            value={value.query}
            onChange={(e) => onChange({ ...value, query: e.target.value })}
            placeholder="Search businesses…"
            className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none ring-blue-500/30 placeholder:text-zinc-400 focus:ring-2"
          />
        </label>

        <label className="sm:col-span-1">
          <span className="text-xs font-medium text-zinc-700">Category</span>
          <select
            value={value.category}
            onChange={(e) =>
              onChange({
                ...value,
                category: e.target.value as SearchFiltersValue["category"],
              })
            }
            className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none ring-blue-500/30 focus:ring-2"
          >
            <option value="All">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="sm:col-span-1">
          <span className="text-xs font-medium text-zinc-700">Location</span>
          <select
            value={value.location}
            onChange={(e) =>
              onChange({
                ...value,
                location: e.target.value as SearchFiltersValue["location"],
              })
            }
            className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none ring-blue-500/30 focus:ring-2"
          >
            <option value="All">All</option>
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>

        <label className="sm:col-span-1">
          <span className="text-xs font-medium text-zinc-700">Min rating</span>
          <select
            value={String(value.minRating)}
            onChange={(e) =>
              onChange({
                ...value,
                minRating: Number(e.target.value),
              })
            }
            className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none ring-blue-500/30 focus:ring-2"
          >
            <option value="0">All</option>
            <option value="3.5">3.5+</option>
            <option value="4">4.0+</option>
            <option value="4.5">4.5+</option>
          </select>
        </label>

        <label className="sm:col-span-1">
          <span className="text-xs font-medium text-zinc-700">Price</span>
          <select
            value={value.price}
            onChange={(e) =>
              onChange({
                ...value,
                price: e.target.value as SearchFiltersValue["price"],
              })
            }
            className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none ring-blue-500/30 focus:ring-2"
          >
            <option value="All">All</option>
            <option value="$">$</option>
            <option value="$$">$$</option>
            <option value="$$$">$$$</option>
          </select>
        </label>
      </div>
    </div>
  );
}

