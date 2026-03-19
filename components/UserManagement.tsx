"use client";

import { useMemo, useState } from "react";
import type { User } from "../lib/types";

export interface UserManagementProps {
  users: User[];
  isLoading: boolean;
  onBlockUser: (userId: string, blocked: boolean) => void;
  onDeleteUser: (userId: string) => void;
}

export function UserManagement({
  users,
  isLoading,
  onBlockUser,
  onDeleteUser,
}: UserManagementProps) {
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "blocked">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    return users
      .filter((u) =>
        filterStatus === "all"
          ? true
          : u.status === (filterStatus === "active" ? "active" : "blocked")
      )
      .filter((u) =>
        searchTerm
          ? u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.id.toLowerCase().includes(searchTerm.toLowerCase())
          : true
      )
      .slice()
      .sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO));
  }, [users, filterStatus, searchTerm]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((u) => u.status === "active").length,
      blocked: users.filter((u) => u.status === "blocked").length,
    };
  }, [users]);

  return (
    <section className="mt-10">
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-zinc-950">User Management</h2>
        <p className="mt-1 text-sm text-zinc-600">
          View, block, and manage user accounts.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-3">
          <div className="text-xs font-medium text-zinc-600">Total Users</div>
          <div className="mt-1 text-2xl font-semibold text-zinc-950">
            {stats.total}
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-3">
          <div className="text-xs font-medium text-zinc-600">Active</div>
          <div className="mt-1 text-2xl font-semibold text-emerald-600">
            {stats.active}
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-3">
          <div className="text-xs font-medium text-zinc-600">Blocked</div>
          <div className="mt-1 text-2xl font-semibold text-red-600">
            {stats.blocked}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {(["all", "active", "blocked"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                filterStatus === status
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-semibold text-zinc-600">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Reviews</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3">
                      <div className="h-4 w-40 rounded bg-zinc-200" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-6 w-16 rounded-full bg-zinc-200" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-8 rounded bg-zinc-200" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-24 rounded bg-zinc-200" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="ml-auto h-8 w-32 rounded bg-zinc-200" />
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center">
                    <div className="text-sm font-semibold text-zinc-950">
                      No users found
                    </div>
                    <p className="mt-1 text-sm text-zinc-600">
                      {searchTerm
                        ? "Try adjusting your search"
                        : "No users to display"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="align-middle">
                    <td className="px-4 py-3">
                      <div className="font-medium text-zinc-950">{u.email}</div>
                      <div className="mt-0.5 text-xs text-zinc-500">{u.id}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          u.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {u.status === "active" ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-700">{u.reviewCount}</td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {new Date(u.createdAtISO).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            onBlockUser(u.id, u.status === "active")
                          }
                          className={`inline-flex h-8 items-center justify-center rounded px-2 text-xs font-medium ${
                            u.status === "active"
                              ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                              : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          {u.status === "active" ? "Block" : "Unblock"}
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteUser(u.id)}
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
    </section>
  );
}
