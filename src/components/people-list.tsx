"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, Users, ArrowDownLeft, ArrowUpRight, Pencil, X, Save, Trash2 } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { updatePerson, deletePerson } from "@/app/actions";

type PersonWithLogs = {
  id: string;
  fullName: string;
  role: string;
  identifier: string | null;
  createdAt: Date;
  logs: {
    id: string;
    type: string;
    timestamp: Date;
  }[];
};

export function PeopleList({
  people,
  initialSearch,
}: {
  people: PersonWithLogs[];
  initialSearch: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    setSearch(value);
    startTransition(() => {
      const params = new URLSearchParams();
      if (value.trim()) params.set("search", value.trim());
      router.push(`/people?${params.toString()}`);
    });
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2
          className="text-sm font-semibold"
          style={{ color: "#18181b", letterSpacing: "-0.01em" }}
        >
          Registered People
        </h2>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: "rgba(0,0,0,0.04)", color: "#71717a" }}
        >
          {people.length} total
        </span>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: "#a1a1aa" }}
        />
        <input
          type="text"
          placeholder="Search by name, identifier, or role..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="input-glass"
          style={{ paddingLeft: "36px" }}
        />
        {isPending && (
          <div
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 rounded-full"
            style={{
              borderColor: "rgba(0,0,0,0.08)",
              borderTopColor: "#3b82f6",
              animation: "spin 0.6s linear infinite",
            }}
          />
        )}
      </div>

      {/* List */}
      {people.length === 0 ? (
        <div className="empty-state">
          <Users size={32} />
          <p className="text-sm font-medium">
            {initialSearch ? "No matching people" : "No people registered"}
          </p>
          <p className="text-xs mt-1">
            {initialSearch
              ? "Try a different search term"
              : "Use the form to register someone"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {people.map((person, i) => {
            const lastLog = person.logs[0];
            const isEditing = editingPersonId === person.id;

            return (
              <div
                key={person.id}
                className="flex items-center gap-3 py-3"
                style={{
                  borderBottom:
                    i < people.length - 1
                      ? "1px solid rgba(0,0,0,0.04)"
                      : "none",
                }}
              >
                {isEditing ? (
                  <form
                    action={async (formData) => {
                      startTransition(async () => {
                        const result = await updatePerson(person.id, formData);
                        if (result.success) {
                          setEditingPersonId(null);
                        } else {
                          console.error(result.message);
                        }
                      });
                    }}
                    className="flex-1 w-full bg-white/50 p-4 rounded-xl border border-black/5 shadow-sm"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_1fr_1.5fr] gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase tracking-wider">Full Name</label>
                          <input
                            type="text"
                            name="fullName"
                            defaultValue={person.fullName}
                            required
                            className="input-glass py-2 text-sm"
                            placeholder="Full Name"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase tracking-wider">Role</label>
                          <select
                            name="role"
                            defaultValue={person.role}
                            required
                            className="select-glass py-2 text-sm"
                          >
                            <option value="Resident">Resident</option>
                            <option value="Staff">Staff</option>
                            <option value="Guest">Guest</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase tracking-wider">Identifier</label>
                          <input
                            type="text"
                            name="identifier"
                            defaultValue={person.identifier || ""}
                            className="input-glass py-2 text-sm"
                            placeholder="Optional"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 mt-1 border-t border-black/5">
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this person? This will also delete all their log entries.")) {
                              startTransition(async () => {
                                await deletePerson(person.id);
                              });
                            }
                          }}
                          disabled={isPending}
                          className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                        
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingPersonId(null)}
                            disabled={isPending}
                            className="btn btn-ghost py-1.5 px-3 text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isPending}
                            className="btn btn-primary py-1.5 px-4 text-xs flex items-center gap-1.5"
                          >
                            <Save size={14} />
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <>
                    {/* Avatar */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold"
                      style={{
                        background:
                          person.role === "Resident"
                            ? "rgba(59, 130, 246, 0.1)"
                            : person.role === "Staff"
                              ? "rgba(16, 185, 129, 0.1)"
                              : "rgba(245, 158, 11, 0.1)",
                        color:
                          person.role === "Resident"
                            ? "#3b82f6"
                            : person.role === "Staff"
                              ? "#10b981"
                              : "#f59e0b",
                      }}
                    >
                      {person.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: "#18181b" }}
                      >
                        {person.fullName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="badge badge-role">{person.role}</span>
                        {person.identifier && (
                          <span className="text-xs" style={{ color: "#a1a1aa" }}>
                            {person.identifier}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions and Status */}
                    <div className="flex items-center gap-4 shrink-0">
                      <button
                        onClick={() => setEditingPersonId(person.id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-black/5 transition-colors"
                        title="Edit person"
                      >
                        <Pencil size={14} />
                      </button>

                      <div className="text-right w-16">
                        {lastLog ? (
                          <div className="flex items-center justify-end gap-1.5">
                            {lastLog.type === "ENTRY" ? (
                              <ArrowDownLeft
                                size={12}
                                style={{ color: "#10b981" }}
                              />
                            ) : (
                              <ArrowUpRight
                                size={12}
                                style={{ color: "#f43f5e" }}
                              />
                            )}
                            <span className="text-xs" style={{ color: "#71717a" }}>
                              {lastLog.type === "ENTRY" ? "Inside" : "Outside"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs" style={{ color: "#d4d4d8" }}>
                            No logs
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
