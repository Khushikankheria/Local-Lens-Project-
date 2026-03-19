import type { Business, Review, User, Category } from "./types";
import { businesses as seedBusinesses, reviews as seedReviews } from "./mockData";

export type AdminReviewStatus = "pending" | "approved" | "rejected";

export type AdminReview = Review & {
  status: AdminReviewStatus;
};

export const adminBusinessesSeed: Business[] = seedBusinesses;

export const adminReviewsSeed: AdminReview[] = [
  // pending
  { ...seedReviews[0], status: "pending" },
  { ...seedReviews[4], status: "pending" },
  { ...seedReviews[6], status: "pending" },
  // approved
  { ...seedReviews[1], status: "approved" },
  { ...seedReviews[2], status: "approved" },
  { ...seedReviews[3], status: "approved" },
  // rejected (kept for stats)
  { ...seedReviews[5], status: "rejected" },
];

export const adminUsersSeed: User[] = [
  {
    id: "user-1",
    email: "alex@example.com",
    role: "user",
    createdAtISO: "2025-12-01T08:00:00.000Z",
    status: "active",
    reviewCount: 3,
  },
  {
    id: "user-2",
    email: "casey@example.com",
    role: "user",
    createdAtISO: "2025-11-15T14:30:00.000Z",
    status: "active",
    reviewCount: 7,
  },
  {
    id: "user-3",
    email: "jordan@example.com",
    role: "user",
    createdAtISO: "2025-10-22T11:00:00.000Z",
    status: "active",
    reviewCount: 12,
  },
  {
    id: "user-4",
    email: "sam@example.com",
    role: "user",
    createdAtISO: "2025-09-10T16:45:00.000Z",
    status: "blocked",
    reviewCount: 2,
  },
  {
    id: "user-5",
    email: "taylor@example.com",
    role: "user",
    createdAtISO: "2025-08-05T09:20:00.000Z",
    status: "active",
    reviewCount: 15,
  },
  {
    id: "admin-1",
    email: "admin@locallens.test",
    role: "admin",
    createdAtISO: "2025-01-01T00:00:00.000Z",
    status: "active",
    reviewCount: 0,
  },
];

export const adminCategoriesSeed: Category[] = [
  {
    id: "food",
    name: "Food & Beverage",
    subcategories: ["Restaurant", "Cafe", "Bakery", "Fast Food", "Dessert Shop"],
  },
  {
    id: "wellness",
    name: "Wellness & Fitness",
    subcategories: ["Gym", "Yoga Studio", "Spa", "Salon", "Therapist"],
  },
  {
    id: "retail",
    name: "Retail",
    subcategories: ["Bookstore", "Clothing", "Electronics", "Grocery", "Gift Shop"],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    subcategories: ["Movie Theater", "Bar", "Live Music", "Gaming Cafe", "Art Gallery"],
  },
  {
    id: "services",
    name: "Services",
    subcategories: ["Repair", "Cleaning", "Photography", "Marketing", "Consulting"],
  },
];

