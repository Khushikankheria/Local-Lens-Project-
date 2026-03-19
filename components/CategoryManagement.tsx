"use client";

import { useState } from "react";
import type { Category } from "../lib/types";

export interface CategoryManagementProps {
  categories: Category[];
  isLoading: boolean;
  onAddCategory: (name: string, subcategories: string[]) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddSubcategory: (categoryId: string, subcategory: string) => void;
  onDeleteSubcategory: (categoryId: string, subcategory: string) => void;
}

export function CategoryManagement({
  categories,
  isLoading,
  onAddCategory,
  onDeleteCategory,
  onAddSubcategory,
  onDeleteSubcategory,
}: CategoryManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategoryInputs, setNewSubcategoryInputs] = useState<string>(
    "Restaurant, Cafe, Bakery"
  );
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(
    null
  );
  const [newSubcategoryByCat, setNewSubcategoryByCat] = useState<
    Record<string, string>
  >({});

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      const subs = newSubcategoryInputs
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);
      onAddCategory(newCategoryName, subs);
      setNewCategoryName("");
      setNewSubcategoryInputs("Restaurant, Cafe, Bakery");
      setShowAddForm(false);
    }
  };

  const handleAddSubcategory = (categoryId: string) => {
    const value = newSubcategoryByCat[categoryId]?.trim();
    if (value) {
      onAddSubcategory(categoryId, value);
      setNewSubcategoryByCat((prev) => ({
        ...prev,
        [categoryId]: "",
      }));
    }
  };

  return (
    <section className="mt-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-950">
            Category Management
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            Create and manage business categories and subcategories.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
        >
          {showAddForm ? "Cancel" : "Add category"}
        </button>
      </div>

      {/* Add Category Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddCategory}
          className="mb-6 rounded-lg border border-zinc-200 bg-white p-4"
        >
          <label className="block">
            <div className="text-xs font-semibold text-zinc-700">
              Category Name
            </div>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g., Food & Beverage"
              className="mt-1 h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </label>

          <label className="mt-3 block">
            <div className="text-xs font-semibold text-zinc-700">
              Subcategories (comma-separated)
            </div>
            <textarea
              value={newSubcategoryInputs}
              onChange={(e) => setNewSubcategoryInputs(e.target.value)}
              placeholder="e.g., Restaurant, Cafe, Bakery, Fast Food"
              rows={3}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </label>

          <button
            type="submit"
            className="mt-3 inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Create category
          </button>
        </form>
      )}

      {/* Categories List */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-lg border border-zinc-200 bg-white"
            />
          ))
        ) : categories.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
            <div className="text-sm font-semibold text-zinc-950">
              No categories
            </div>
            <p className="mt-1 text-sm text-zinc-600">
              Create a category to get started.
            </p>
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-lg border border-zinc-200 bg-white p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedCategoryId(
                        expandedCategoryId === cat.id ? null : cat.id
                      )
                    }
                    className="text-left font-semibold text-zinc-950 hover:text-blue-600"
                  >
                    {cat.name}
                  </button>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {cat.subcategories.map((sub, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-full bg-zinc-100 px-2.5 py-1 text-xs"
                      >
                        <span className="text-zinc-700">{sub}</span>
                        <button
                          type="button"
                          onClick={() =>
                            onDeleteSubcategory(cat.id, sub)
                          }
                          className="text-zinc-500 hover:text-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteCategory(cat.id)}
                  className="ml-2 inline-flex h-8 items-center justify-center rounded border border-red-300 bg-red-50 px-2 text-xs font-medium text-red-700 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>

              {/* Add Subcategory Form */}
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Add subcategory..."
                  value={newSubcategoryByCat[cat.id] || ""}
                  onChange={(e) =>
                    setNewSubcategoryByCat((prev) => ({
                      ...prev,
                      [cat.id]: e.target.value,
                    }))
                  }
                  className="h-8 flex-1 rounded-lg border border-zinc-200 bg-white px-2 text-xs placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
                <button
                  type="button"
                  onClick={() => handleAddSubcategory(cat.id)}
                  className="inline-flex h-8 items-center justify-center rounded bg-emerald-600 px-3 text-xs font-medium text-white hover:bg-emerald-700"
                >
                  Add
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
