"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  History,
  Building2,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/people", label: "People", icon: Users },
  { href: "/log", label: "Quick Log", icon: ClipboardList },
  { href: "/history", label: "Log History", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-sidebar fixed left-0 top-0 bottom-0 w-[260px] flex flex-col z-50">
      {/* ── Logo ─────────────────────────────────────── */}
      <div className="p-8 pb-4">
        <Link href="/" className="flex items-center gap-4 no-underline">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
            }}
          >
            <Building2 size={24} color="white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span
              className="text-[17px] font-bold"
              style={{ color: "#18181b", letterSpacing: "-0.02em" }}
            >
              Sakshi
            </span>
            <p
              className="text-sm"
              style={{ color: "#a1a1aa", marginTop: "2px" }}
            >
              Entry & Exit System
            </p>
          </div>
        </Link>
      </div>

      {/* ── Divider ──────────────────────────────────── */}
      <div className="mx-6 my-4 h-px bg-black/5" />

      {/* ── Navigation ───────────────────────────────── */}
      <nav className="flex-1 px-6 py-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${isActive ? "active" : ""}`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ───────────────────────────────────── */}
      <div className="p-6 pt-4">
        <div
          className="rounded-xl p-4"
          style={{
            background: "rgba(16, 185, 129, 0.06)",
            border: "1px solid rgba(16, 185, 129, 0.1)",
          }}
        >
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="live-dot" style={{ width: "10px", height: "10px" }} />
            <span
              className="text-sm font-semibold"
              style={{ color: "#059669" }}
            >
              System Active
            </span>
          </div>
          <p className="text-sm" style={{ color: "#71717a" }}>
            Monitoring entries & exits
          </p>
        </div>
      </div>
    </aside>
  );
}
