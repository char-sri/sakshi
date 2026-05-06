import {
  Users,
  ClipboardList,
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
  LogIn,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { getDashboardStats, getRecentLogs } from "./actions";
import { formatDateTime, getRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, recentLogs] = await Promise.all([
    getDashboardStats(),
    getRecentLogs(5),
  ]);

  const statCards = [
    {
      label: "Total People",
      value: stats.totalPeople,
      icon: Users,
      color: "#3b82f6",
      bg: "rgba(59, 130, 246, 0.1)",
    },
    {
      label: "Today's Entries",
      value: stats.todayEntries,
      icon: ArrowDownLeft,
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.1)",
    },
    {
      label: "Today's Exits",
      value: stats.todayExits,
      icon: ArrowUpRight,
      color: "#f43f5e",
      bg: "rgba(244, 63, 94, 0.1)",
    },
    {
      label: "Current Inside",
      value: Math.max(0, stats.currentOccupancy),
      icon: Activity,
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.1)",
    },
  ];

  return (
    <div className="max-w-5xl">
      {/* ── Header ───────────────────────────────────── */}
      <div className="mb-10 animate-fade-in">
        <h1
          className="text-3xl font-bold"
          style={{ color: "#18181b", letterSpacing: "-0.03em" }}
        >
          Dashboard
        </h1>
        <p className="text-base mt-2" style={{ color: "#71717a" }}>
          Building access overview and quick actions
        </p>
      </div>

      {/* ── Stat Cards ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`glass-card p-6 animate-fade-in animate-delay-${i + 1}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="stat-icon"
                  style={{ background: stat.bg }}
                >
                  <Icon size={20} style={{ color: stat.color }} strokeWidth={2} />
                </div>
              </div>
              <p
                className="text-3xl font-bold"
                style={{ color: "#18181b", letterSpacing: "-0.02em" }}
              >
                {stat.value}
              </p>
              <p className="text-sm mt-1" style={{ color: "#a1a1aa" }}>
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Quick Actions + Recent Feed ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 glass-card p-8 animate-fade-in animate-delay-3">
          <h2
            className="text-base font-semibold mb-6"
            style={{ color: "#18181b", letterSpacing: "-0.01em" }}
          >
            Quick Actions
          </h2>
          <div className="flex flex-col gap-4">
            <Link href="/log" className="btn btn-entry w-full text-center py-4">
              <LogIn size={18} />
              Log Entry
            </Link>
            <Link href="/log" className="btn btn-exit w-full text-center py-4">
              <LogOut size={18} />
              Log Exit
            </Link>
            <Link href="/people" className="btn btn-ghost w-full text-center py-4 mt-2">
              <Users size={18} />
              Manage People
            </Link>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-3 glass-card p-8 animate-fade-in animate-delay-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2
                className="text-base font-semibold"
                style={{ color: "#18181b", letterSpacing: "-0.01em" }}
              >
                Live Feed
              </h2>
              <div className="live-dot" />
            </div>
            <Link
              href="/history"
              className="text-sm font-medium hover:underline"
              style={{ color: "#3b82f6" }}
            >
              View all →
            </Link>
          </div>

          {recentLogs.length === 0 ? (
            <div className="empty-state">
              <ClipboardList size={40} />
              <p className="text-base font-medium mt-4">No activity yet</p>
              <p className="text-sm mt-2">
                Start by{" "}
                <Link
                  href="/log"
                  className="underline"
                  style={{ color: "#3b82f6" }}
                >
                  logging an entry
                </Link>
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {recentLogs.map((log, i) => (
                <div
                  key={log.id}
                  className={`flex items-center gap-4 py-4 animate-fade-in animate-delay-${i + 1}`}
                  style={{
                    borderBottom:
                      i < recentLogs.length - 1
                        ? "1px solid rgba(0,0,0,0.04)"
                        : "none",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
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
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-base font-medium truncate"
                      style={{ color: "#18181b" }}
                    >
                      {log.person ? log.person.fullName : log.unregisteredName}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="badge badge-role">
                        {log.person ? log.person.role : log.unregisteredRole}
                      </span>
                      {log.person?.identifier && (
                        <span className="text-sm" style={{ color: "#a1a1aa" }}>
                          {log.person.identifier}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`badge ${log.type === "ENTRY" ? "badge-entry" : "badge-exit"}`}
                    >
                      {log.type}
                    </span>
                    <p className="text-sm mt-1.5" style={{ color: "#a1a1aa" }}>
                      {getRelativeTime(log.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
