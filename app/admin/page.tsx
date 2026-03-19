"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminReviewRow } from "../../components/AdminReviewRow";
import { BusinessFormModal } from "../../components/BusinessFormModal";
import { CategoryManagement } from "../../components/CategoryManagement";
import { ReviewImageControl } from "../../components/ReviewImageControl";
import { StatCard } from "../../components/StatCard";
import { UserManagement } from "../../components/UserManagement";
import {
  adminBusinessesSeed,
  adminCategoriesSeed,
  adminReviewsSeed,
  adminUsersSeed,
  type AdminReview,
} from "../../lib/adminMockData";
import type { Business, User, Category } from "../../lib/types";

function slugifyId(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "reviews" | "businesses" | "users" | "images" | "categories"
  >("overview");

  const [reviews, setReviews] = useState<AdminReview[]>(adminReviewsSeed);
  const [businesses, setBusinesses] = useState<Business[]>(adminBusinessesSeed);
  const [users, setUsers] = useState<User[]>(adminUsersSeed);
  const [categories, setCategories] = useState<Category[]>(adminCategoriesSeed);

 const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editing, setEditing] = useState<Business | undefined>(undefined);

  useEffect(() => {
    const t = window.setTimeout(() => setIsLoading(false), 450);
    return () => window.clearTimeout(t);
  }, []);

  const businessById = useMemo(() => {
    const map = new Map<string, Business>();
    for (const b of businesses) map.set(b.id, b);
    return map;
  }, [businesses]);

  const reviewStats = useMemo(
    () => ({
      pending: reviews.filter((r) => r.status === "pending"),
      approved: reviews.filter((r) => r.status === "approved"),
      rejected: reviews.filter((r) => r.status === "rejected").length,
    }),
    [reviews]
  );

  function setReviewStatus(id: string, status: AdminReview["status"]) {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  function deleteReview(id: string) {
    if (window.confirm("Delete this review?")) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  }

  function openAddBusiness() {
    setModalMode("add");
    setEditing(undefined);
    setModalOpen(true);
  }

  function openEditBusiness(b: Business) {
    setModalMode("edit");
    setEditing(b);
    setModalOpen(true);
  }

  function deleteImage(reviewId: string, imageIndex: number) {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId && r.images) {
          return {
            ...r,
            images: r.images.filter((_, i) => i !== imageIndex),
          };
        }
        return r;
      })
    );
  }

  function blockUser(userId: string, shouldBlock: boolean) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: shouldBlock ? "blocked" : "active" }
          : u
      )
    );
  }

  function deleteUser(userId: string) {
    if (window.confirm("Delete this user? This action cannot be undone.")) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  }

  function addCategory(name: string, subcategories: string[]) {
    const id = slugifyId(name);
    setCategories((prev) => [...prev, { id, name, subcategories }]);
  }

  function deleteCategory(categoryId: string) {
    if (window.confirm("Delete this category?")) {
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    }
  }

  function addSubcategory(categoryId: string, subcategory: string) {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              subcategories: [...c.subcategories, subcategory],
            }
          : c
      )
    );
  }

  function deleteSubcategory(categoryId: string, subcategory: string) {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              subcategories: c.subcategories.filter((s) => s !== subcategory),
            }
          : c
      )
    );
  }

  return (
    <main className="bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-sm text-zinc-600">
                Manage reviews, businesses, users, and categories.
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="mb-8 border-b border-zinc-200">
              <div className="flex gap-1 overflow-x-auto">
                {[
                  { id: "overview", label: "📊 Overview" },
                  { id: "reviews", label: "✍️ Reviews" },
                  { id: "businesses", label: "🏢 Businesses" },
                  { id: "users", label: "👤 Users" },
                  { id: "images", label: "📸 Content" },
                  { id: "categories", label: "📂 Categories" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setActiveTab(
                        tab.id as
                          | "overview"
                          | "reviews"
                          | "businesses"
                          | "users"
                          | "images"
                          | "categories"
                      )
                    }
                    className={`whitespace-nowrap px-4 py-3 text-sm font-medium ${
                      activeTab === tab.id
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB: OVERVIEW */}
            {activeTab === "overview" && (
              <div>
                <h2 className="text-sm font-semibold text-zinc-950">
                  Dashboard stats
                </h2>
                {isLoading ? (
                  <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-[96px] animate-pulse rounded-2xl border border-zinc-200 bg-white"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                      label="Total Users"
                      value={users.filter((u) => u.role === "user").length}
                    />
                    <StatCard label="Total Businesses" value={businesses.length} />
                    <StatCard label="Total Reviews" value={reviews.length} />
                    <StatCard
                      label="Pending Reviews"
                      value={reviewStats.pending.length}
                      hint="Awaiting moderation"
                    />
                  </div>
                )}

                <section className="mt-10 grid gap-6 lg:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-950">
                      Recent Pending Reviews
                    </h3>
                    <div className="mt-3 space-y-3">
                      {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-[120px] animate-pulse rounded-lg border border-zinc-200 bg-white"
                          />
                        ))
                      ) : reviewStats.pending.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-center">
                          <div className="text-sm text-zinc-600">
                            No pending reviews
                          </div>
                        </div>
                      ) : (
                        reviewStats.pending.slice(0, 3).map((r) => (
                          <AdminReviewRow
                            key={r.id}
                            review={r}
                            business={businessById.get(r.businessId)}
                            actions={
                              <div className="flex gap-1">
                                <button
                                  onClick={() =>
                                    setReviewStatus(r.id, "approved")
                                  }
                                  className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                                >
                                  Approve
                                </button>
                                <span className="text-zinc-300">•</span>
                                <button
                                  onClick={() =>
                                    setReviewStatus(r.id, "rejected")
                                  }
                                  className="text-xs font-medium text-red-600 hover:text-red-700"
                                >
                                  Reject
                                </button>
                              </div>
                            }
                          />
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-zinc-950">
                      Latest Businesses
                    </h3>
                    <div className="mt-3 space-y-2">
                      {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-16 animate-pulse rounded-lg border border-zinc-200 bg-white"
                          />
                        ))
                      ) : businesses.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-center">
                          <div className="text-sm text-zinc-600">
                            No businesses
                          </div>
                        </div>
                      ) : (
                        businesses.slice(0, 5).map((b) => (
                          <div
                            key={b.id}
                            className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3"
                          >
                            <div>
                              <div className="text-sm font-medium text-zinc-950">
                                {b.name}
                              </div>
                              <div className="text-xs text-zinc-600">
                                {b.category}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-zinc-950">
                                ⭐ {b.averageRating.toFixed(1)}
                              </div>
                              <div className="text-xs text-zinc-600">
                                {b.ratingCount} reviews
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* TAB: REVIEWS */}
            {activeTab === "reviews" && (
              <div>
                <div className="mb-6 grid gap-3 sm:grid-cols-3">
                  <StatCard label="Pending" value={reviewStats.pending.length} />
                  <StatCard label="Approved" value={reviewStats.approved.length} />
                  <StatCard label="Rejected" value={reviewStats.rejected} />
                </div>

                <section className="grid gap-6 lg:grid-cols-2">
                  <div>
                    <h3 className="mb-4 text-sm font-semibold text-zinc-950">
                      ⏳ Pending ({reviewStats.pending.length})
                    </h3>
                    <div className="space-y-3">
                      {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-[168px] animate-pulse rounded-xl border border-zinc-200 bg-white"
                          />
                        ))
                      ) : reviewStats.pending.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
                          <div className="text-sm font-semibold text-zinc-950">
                            No pending reviews
                          </div>
                          <p className="mt-1 text-sm text-zinc-600">
                            All reviews have been moderated.
                          </p>
                        </div>
                      ) : (
                        reviewStats.pending
                          .slice()
                          .sort((a, b) =>
                            b.createdAtISO.localeCompare(a.createdAtISO)
                          )
                          .map((r) => (
                            <AdminReviewRow
                              key={r.id}
                              review={r}
                              business={businessById.get(r.businessId)}
                              actions={
                                <div className="flex flex-col gap-2 sm:flex-row">
                                  <button
                                    type="button"
                                    onClick={() => setReviewStatus(r.id, "approved")}
                                    className="inline-flex h-9 items-center justify-center rounded-lg bg-emerald-600 px-3 text-sm font-medium text-white hover:bg-emerald-700"
                                  >
                                    ✓ Approve
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setReviewStatus(r.id, "rejected")}
                                    className="inline-flex h-9 items-center justify-center rounded-lg border border-red-300 bg-red-50 px-3 text-sm font-medium text-red-700 hover:bg-red-100"
                                  >
                                    ✕ Reject
                                  </button>
                                </div>
                              }
                            />
                          ))
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-sm font-semibold text-zinc-950">
                      ✅ Approved ({reviewStats.approved.length})
                    </h3>
                    <div className="space-y-3">
                      {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-[168px] animate-pulse rounded-xl border border-zinc-200 bg-white"
                          />
                        ))
                      ) : reviewStats.approved.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
                          <div className="text-sm font-semibold text-zinc-950">
                            No approved reviews
                          </div>
                          <p className="mt-1 text-sm text-zinc-600">
                            Approve pending to publish them.
                          </p>
                        </div>
                      ) : (
                        reviewStats.approved
                          .slice()
                          .sort((a, b) =>
                            b.createdAtISO.localeCompare(a.createdAtISO)
                          )
                          .map((r) => (
                            <AdminReviewRow
                              key={r.id}
                              review={r}
                              business={businessById.get(r.businessId)}
                              actions={
                                <button
                                  type="button"
                                  onClick={() => deleteReview(r.id)}
                                  className="inline-flex h-8 items-center justify-center rounded border border-red-300 bg-red-50 px-2 text-xs font-medium text-red-700 hover:bg-red-100"
                                >
                                  Delete
                                </button>
                              }
                            />
                          ))
                      )}
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* TAB: BUSINESSES */}
            {activeTab === "businesses" && (
              <div>
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <h3 className="text-sm font-semibold text-zinc-950">
                    Businesses ({businesses.length})
                  </h3>
                  <button
                    type="button"
                    onClick={openAddBusiness}
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
                  >
                    ➕ Add
                  </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-zinc-50 text-xs font-semibold text-zinc-600">
                        <tr>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Location</th>
                          <th className="px-4 py-3">Rating</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200">
                        {isLoading ? (
                          Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i} className="animate-pulse">
                              <td className="px-4 py-3">
                                <div className="h-4 w-48 rounded bg-zinc-200" />
                              </td>
                              <td className="px-4 py-3">
                                <div className="h-4 w-20 rounded bg-zinc-200" />
                              </td>
                              <td className="px-4 py-3">
                                <div className="h-4 w-24 rounded bg-zinc-200" />
                              </td>
                              <td className="px-4 py-3">
                                <div className="h-4 w-16 rounded bg-zinc-200" />
                              </td>
                              <td className="px-4 py-3">
                                <div className="ml-auto h-8 w-40 rounded bg-zinc-200" />
                              </td>
                            </tr>
                          ))
                        ) : businesses.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-10 text-center">
                              <div className="text-sm font-semibold text-zinc-950">
                                No businesses
                              </div>
                            </td>
                          </tr>
                        ) : (
                          businesses.map((b) => (
                            <tr key={b.id} className="align-middle hover:bg-zinc-50">
                              <td className="px-4 py-3">
                                <div className="font-semibold text-zinc-950">
                                  {b.name}
                                </div>
                                <div className="mt-0.5 text-xs text-zinc-500">
                                  {b.shortDescription}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                                  {b.category}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-zinc-700">{b.location}</td>
                              <td className="px-4 py-3">
                                <div className="font-semibold text-zinc-700">
                                  ⭐ {b.averageRating.toFixed(1)}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => openEditBusiness(b)}
                                    className="inline-flex h-8 items-center justify-center rounded border border-zinc-200 bg-white px-2 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm(`Delete "${b.name}"?`)) {
                                        setBusinesses((prev) =>
                                          prev.filter((x) => x.id !== b.id)
                                        );
                                      }
                                    }}
                                    className="inline-flex h-8 items-center justify-center rounded border border-red-300 bg-red-50 px-2 text-xs font-medium text-red-700 hover:bg-red-100"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: USERS */}
            {activeTab === "users" && (
              <UserManagement
                users={users}
                isLoading={isLoading}
                onBlockUser={blockUser}
                onDeleteUser={deleteUser}
              />
            )}

            {/* TAB: CONTENT */}
            {activeTab === "images" && (
              <ReviewImageControl
                reviews={reviews}
                businesses={businessById}
                isLoading={isLoading}
                onDeleteImage={deleteImage}
              />
            )}

            {/* TAB: CATEGORIES */}
            {activeTab === "categories" && (
              <CategoryManagement
                categories={categories}
                isLoading={isLoading}
                onAddCategory={addCategory}
                onDeleteCategory={deleteCategory}
                onAddSubcategory={addSubcategory}
                onDeleteSubcategory={deleteSubcategory}
              />
            )}
      </div>

      <BusinessFormModal
        key={`${modalMode}:${editing?.id ?? "new"}`}
        open={modalOpen}
        mode={modalMode}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSave={(draft) => {
          if (modalMode === "add") {
            const id = slugifyId(draft.name) || `biz-${Date.now()}`;
            const next: Business = {
              id,
              name: draft.name,
              category: draft.category,
              location: draft.location,
              priceLevel: "$$",
              shortDescription: draft.shortDescription,
              addressLine: draft.addressLine,
              images: [],
              isOpenNow: true,
              createdAtISO: new Date().toISOString(),
              averageRating: 0,
              ratingCount: 0,
              averageBreakdown: { quality: 0, service: 0, value: 0 },
            };
            setBusinesses((prev) => [next, ...prev]);
          } else if (modalMode === "edit" && editing) {
            setBusinesses((prev) =>
              prev.map((b) =>
                b.id === editing.id
                  ? {
                      ...b,
                      name: draft.name,
                      category: draft.category,
                      location: draft.location,
                      shortDescription: draft.shortDescription,
                      addressLine: draft.addressLine,
                    }
                  : b
              )
            );
          }
          setModalOpen(false);
        }}
      />
    </main>
  );
}

