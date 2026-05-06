"use client";

import { useRouter } from "next/navigation";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowUpDown,
  ClipboardList,
  Download,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";

type LogWithPerson = {
  id: string;
  personId: string | null;
  unregisteredName: string | null;
  unregisteredRole: string | null;
  type: string;
  timestamp: Date;
  notes: string | null;
  person: {
    fullName: string;
    role: string;
    identifier: string | null;
  } | null;
};

export function LogHistoryTable({
  logs,
  currentSort,
}: {
  logs: LogWithPerson[];
  currentSort: "asc" | "desc";
}) {
  const router = useRouter();

  const toggleSort = () => {
    const newSort = currentSort === "desc" ? "asc" : "desc";
    router.push(`/history?sort=${newSort}`);
  };

  if (logs.length === 0) {
    return (
      <div className="glass-card">
        <div className="empty-state" style={{ padding: "64px 24px" }}>
          <ClipboardList size={40} />
          <p className="text-sm font-medium" style={{ color: "#71717a" }}>
            No log entries yet
          </p>
          <p className="text-xs mt-1" style={{ color: "#a1a1aa" }}>
            Log entries will appear here once you start recording
          </p>
          <Link
            href="/log"
            className="btn btn-primary mt-4"
            style={{ fontSize: "0.8125rem" }}
          >
            Go to Quick Log
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-semibold"
            style={{ color: "#18181b" }}
          >
            All Records
          </span>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: "rgba(0,0,0,0.04)", color: "#71717a" }}
          >
            {logs.length} entries
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/api/export"
            download
            className="btn btn-ghost flex items-center gap-1.5"
            style={{ padding: "6px 12px", fontSize: "0.75rem" }}
          >
            <Download size={13} />
            Export CSV
          </a>
          <button
            onClick={toggleSort}
            className="btn btn-ghost flex items-center gap-1.5"
            style={{ padding: "6px 12px", fontSize: "0.75rem" }}
          >
            <ArrowUpDown size={13} />
            {currentSort === "desc" ? "Newest first" : "Oldest first"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date / Time</th>
              <th>Person</th>
              <th>Role</th>
              <th>Event</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#18181b" }}
                  >
                    {formatDateTime(log.timestamp)}
                  </span>
                </td>
                <td className="py-4 px-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
                      style={{
                        background: log.person
                          ? log.person.role === "Resident"
                            ? "rgba(59, 130, 246, 0.1)"
                            : log.person.role === "Staff"
                              ? "rgba(16, 185, 129, 0.1)"
                              : "rgba(245, 158, 11, 0.1)"
                          : "rgba(113, 113, 122, 0.1)", // Gray for unregistered
                        color: log.person
                          ? log.person.role === "Resident"
                            ? "#3b82f6"
                            : log.person.role === "Staff"
                              ? "#10b981"
                              : "#f59e0b"
                          : "#71717a",
                      }}
                    >
                      {(log.person ? log.person.fullName : log.unregisteredName || "?")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#18181b" }}>
                        {log.person ? log.person.fullName : log.unregisteredName}
                      </p>
                      {log.person?.identifier && (
                        <p className="text-xs mt-0.5" style={{ color: "#a1a1aa" }}>
                          {log.person.identifier}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 align-middle">
                  <span className="badge badge-role">
                    {log.person ? log.person.role : log.unregisteredRole}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-1.5">
                    {log.type === "ENTRY" ? (
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center"
                        style={{ background: "rgba(16, 185, 129, 0.1)" }}
                      >
                        <ArrowDownLeft size={12} style={{ color: "#10b981" }} strokeWidth={2.5} />
                      </div>
                    ) : (
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center"
                        style={{ background: "rgba(244, 63, 94, 0.1)" }}
                      >
                        <ArrowUpRight size={12} style={{ color: "#f43f5e" }} strokeWidth={2.5} />
                      </div>
                    )}
                    <span
                      className={`badge ${log.type === "ENTRY" ? "badge-entry" : "badge-exit"}`}
                    >
                      {log.type}
                    </span>
                  </div>
                </td>
                <td>
                  <span
                    className="text-xs"
                    style={{ color: log.notes ? "#52525b" : "#d4d4d8" }}
                  >
                    {log.notes || "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
