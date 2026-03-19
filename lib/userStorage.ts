"use client";

import type { RatingBreakdown, Review } from "./types";

const FAVORITES_KEY = "locallens_favorites_v1";
const PROFILE_KEY = "locallens_profile_v1";
const PENDING_REVIEWS_KEY = "locallens_pending_reviews_v1";

export type UserProfile = {
  displayName: string;
  bio: string;
};

export type PendingUserReview = Review & {
  status: "pending";
  userEmail: string;
};

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getFavoriteBusinessIds(): string[] {
  return safeRead<string[]>(FAVORITES_KEY, []);
}

export function isBusinessFavorite(businessId: string): boolean {
  return getFavoriteBusinessIds().includes(businessId);
}

export function toggleFavoriteBusiness(businessId: string): boolean {
  const current = getFavoriteBusinessIds();
  if (current.includes(businessId)) {
    const next = current.filter((id) => id !== businessId);
    safeWrite(FAVORITES_KEY, next);
    return false;
  }
  const next = [businessId, ...current];
  safeWrite(FAVORITES_KEY, next);
  return true;
}

export function getUserProfile(): UserProfile {
  return safeRead<UserProfile>(PROFILE_KEY, {
    displayName: "LocalLens User",
    bio: "I explore and review local places.",
  });
}

export function saveUserProfile(profile: UserProfile) {
  safeWrite(PROFILE_KEY, profile);
}

export function getPendingUserReviews(): PendingUserReview[] {
  return safeRead<PendingUserReview[]>(PENDING_REVIEWS_KEY, []);
}

export function savePendingUserReviews(reviews: PendingUserReview[]) {
  safeWrite(PENDING_REVIEWS_KEY, reviews);
}

export function upsertPendingReview(nextReview: PendingUserReview) {
  const reviews = getPendingUserReviews();
  const existingIndex = reviews.findIndex(
    (r) => r.businessId === nextReview.businessId && r.userEmail === nextReview.userEmail
  );

  if (existingIndex >= 0) {
    const next = reviews.slice();
    next[existingIndex] = nextReview;
    savePendingUserReviews(next);
    return;
  }

  savePendingUserReviews([nextReview, ...reviews]);
}

export function createOverall(ratings: RatingBreakdown): number {
  return Number(((ratings.quality + ratings.service + ratings.value) / 3).toFixed(1));
}
