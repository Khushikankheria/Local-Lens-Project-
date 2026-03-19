export type BusinessCategory =
  | "Cafe"
  | "Restaurant"
  | "Bakery"
  | "Gym"
  | "Salon"
  | "Bookstore";

export type BusinessLocation =
  | "Gurgaon"
  | "Noida"
  | "Connaught Place"
  | "Saket"
  | "Dwarka"
  | "South Delhi";

export type RatingBreakdown = {
  quality: number; // 0..5
  service: number; // 0..5
  value: number; // 0..5
};

export type Review = {
  id: string;
  businessId: string;
  authorName: string;
  createdAtISO: string;
  ratings: RatingBreakdown;
  overall: number; // 0..5
  title: string;
  body: string;
  images?: string[]; // URLs of review images
};

export type Business = {
  id: string;
  name: string;
  category: BusinessCategory;
  location: BusinessLocation;
  priceLevel: "$" | "$$" | "$$$";
  shortDescription: string;
  addressLine: string;
  images: string[];
  isOpenNow: boolean;
  createdAtISO: string;
  averageRating: number; // 0..5
  ratingCount: number;
  averageBreakdown: RatingBreakdown; // 0..5
};

export type User = {
  id: string;
  email: string;
  role: "user" | "admin";
  createdAtISO: string;
  status: "active" | "blocked";
  reviewCount: number;
};

export type Category = {
  id: string;
  name: string;
  subcategories: string[];
};

export type OpeningHours = {
  monday: { open: string; close: string };
  tuesday: { open: string; close: string };
  wednesday: { open: string; close: string };
  thursday: { open: string; close: string };
  friday: { open: string; close: string };
  saturday: { open: string; close: string };
  sunday: { open: string; close: string };
};

