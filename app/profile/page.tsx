"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../components/AuthProvider";
import { businesses } from "../../lib/mockData";
import {
  getFavoriteBusinessIds,
  getPendingUserReviews,
  getUserProfile,
  saveUserProfile,
  type UserProfile,
} from "../../lib/userStorage";

export default function ProfilePage() {
  const { state } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({ displayName: "", bio: "" });
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [pendingReviews, setPendingReviews] = useState<ReturnType<typeof getPendingUserReviews>>([]);

  useEffect(() => {
    setProfile(getUserProfile());
    setFavoriteIds(getFavoriteBusinessIds());
    setPendingReviews(getPendingUserReviews());
  }, []);

  const favoriteBusinesses = useMemo(
    () => businesses.filter((b) => favoriteIds.includes(b.id)).slice(0, 5),
    [favoriteIds]
  );

  return (
    <main className="bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">User Profile</h1>
        <p className="mt-1 text-sm text-zinc-600">Your info, reviews, and saved places.</p>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:col-span-1">
            <h2 className="text-sm font-semibold text-zinc-950">User info</h2>
            <div className="mt-3 text-sm text-zinc-700">
              Email: <span className="font-medium">{state.status === "authenticated" ? state.user.email : "Guest"}</span>
            </div>

            <label className="mt-4 block">
              <div className="text-xs font-semibold text-zinc-700">Display name</div>
              <input
                value={profile.displayName}
                onChange={(e) => setProfile((p) => ({ ...p, displayName: e.target.value }))}
                className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950"
              />
            </label>

            <label className="mt-3 block">
              <div className="text-xs font-semibold text-zinc-700">Bio</div>
              <textarea
                rows={4}
                value={profile.bio}
                onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950"
              />
            </label>

            <button
              type="button"
              onClick={() => saveUserProfile(profile)}
              className="mt-3 inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Save profile
            </button>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="text-sm font-semibold text-zinc-950">My reviews</h2>
            <div className="mt-3 text-sm text-zinc-700">Pending reviews submitted: <span className="font-semibold">{pendingReviews.length}</span></div>
            <p className="mt-1 text-xs text-zinc-600">All new reviews are submitted with pending status for moderation.</p>

            {pendingReviews.length > 0 ? (
              <div className="mt-3 space-y-2">
                {pendingReviews.slice(0, 5).map((r) => {
                  const business = businesses.find((b) => b.id === r.businessId);
                  return (
                    <div key={r.id} className="rounded-lg border border-zinc-200 p-3">
                      <div className="text-sm font-medium text-zinc-950">{r.title}</div>
                      <div className="mt-0.5 text-xs text-zinc-600">
                        {business?.name ?? "Unknown business"} • {r.status}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            <div className="mt-6 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-950">Favorites ♥</h2>
              <Link href="/favorites" className="text-xs font-medium text-blue-700 hover:text-blue-800">View all</Link>
            </div>

            {favoriteBusinesses.length === 0 ? (
              <div className="mt-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">
                No favorites yet.
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                {favoriteBusinesses.map((b) => (
                  <div key={b.id} className="flex items-center justify-between rounded-lg border border-zinc-200 p-3">
                    <div>
                      <div className="text-sm font-medium text-zinc-950">{b.name}</div>
                      <div className="text-xs text-zinc-600">{b.location} • {b.category}</div>
                    </div>
                    <Link href={`/business/${b.id}`} className="text-xs font-medium text-blue-700 hover:text-blue-800">Open</Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
