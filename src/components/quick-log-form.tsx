"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { createLogEntry } from "@/app/actions";
import {
  LogIn,
  LogOut,
  Search,
  User,
  ChevronDown,
  StickyNote,
  CheckCircle2,
  Users,
} from "lucide-react";
import { toast } from "@/components/toast";
import Link from "next/link";

type PersonSimple = {
  id: string;
  fullName: string;
  role: string;
  identifier: string | null;
};

export function QuickLogForm({ people }: { people: PersonSimple[] }) {
  const [selectedPerson, setSelectedPerson] = useState<PersonSimple | null>(null);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();
  const [lastAction, setLastAction] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [logMode, setLogMode] = useState<"registered" | "unregistered">("registered");
  const [unregisteredName, setUnregisteredName] = useState("");
  const [unregisteredRole, setUnregisteredRole] = useState("Visitor");

  const filteredPeople = people.filter(
    (p) =>
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      (p.identifier?.toLowerCase() || "").includes(search.toLowerCase()) ||
      p.role.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLog = (type: "ENTRY" | "EXIT") => {
    if (logMode === "registered" && !selectedPerson) {
      toast("Please select a person first.", "error");
      return;
    }
    
    if (logMode === "unregistered") {
      if (!unregisteredName.trim()) {
        toast("Please enter the person's name.", "error");
        return;
      }
    }

    const formData = new FormData();
    if (logMode === "registered" && selectedPerson) {
      formData.append("personId", selectedPerson.id);
    } else {
      formData.append("unregisteredName", unregisteredName);
      formData.append("unregisteredRole", unregisteredRole);
    }
    
    formData.append("type", type);
    if (notes.trim()) formData.append("notes", notes.trim());

    startTransition(async () => {
      const result = await createLogEntry(formData);
      toast(result.message, result.success ? "success" : "error");
      if (result.success) {
        setLastAction(type);
        setNotes("");
        setUnregisteredName("");
        // Brief flash then reset
        setTimeout(() => setLastAction(null), 2000);
      }
    });
  };

  return (
    <div className="glass-card" style={{ padding: "48px" }}>
      {/* Mode Toggle Tabs */}
      <div className="flex p-1 mb-8 rounded-xl bg-black/5" style={{ backdropFilter: "blur(10px)" }}>
        <button
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            logMode === "registered"
              ? "bg-white shadow-sm text-zinc-900"
              : "text-zinc-500 hover:text-zinc-700 hover:bg-black/5"
          }`}
          onClick={() => setLogMode("registered")}
        >
          Registered Person
        </button>
        <button
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            logMode === "unregistered"
              ? "bg-white shadow-sm text-zinc-900"
              : "text-zinc-500 hover:text-zinc-700 hover:bg-black/5"
          }`}
          onClick={() => setLogMode("unregistered")}
        >
          Unregistered / Guest
        </button>
      </div>

      {logMode === "registered" ? (
        /* Person Selector */
        <div className="mb-8">
          <label
            className="block text-sm font-semibold mb-3"
            style={{ color: "#52525b", letterSpacing: "0.03em", textTransform: "uppercase" }}
          >
            Select Person
          </label>
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="input-glass flex items-center justify-between cursor-pointer"
              style={{ padding: "16px 20px" }}
            >
              <div className="flex items-center gap-4">
                {selectedPerson ? (
                  <>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                      style={{
                        background:
                          selectedPerson.role === "Resident"
                            ? "rgba(59, 130, 246, 0.1)"
                            : selectedPerson.role === "Staff"
                              ? "rgba(16, 185, 129, 0.1)"
                              : "rgba(245, 158, 11, 0.1)",
                        color:
                          selectedPerson.role === "Resident"
                            ? "#3b82f6"
                            : selectedPerson.role === "Staff"
                              ? "#10b981"
                              : "#f59e0b",
                      }}
                    >
                      {selectedPerson.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div className="text-left">
                      <p className="text-base font-medium" style={{ color: "#18181b" }}>
                        {selectedPerson.fullName}
                      </p>
                      <p className="text-sm mt-0.5" style={{ color: "#a1a1aa" }}>
                        {selectedPerson.role}
                        {selectedPerson.identifier ? ` · ${selectedPerson.identifier}` : ""}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <User size={18} style={{ color: "#a1a1aa" }} />
                    <span className="text-base" style={{ color: "#a1a1aa" }}>
                      Choose a person...
                    </span>
                  </>
                )}
              </div>
              <ChevronDown
                size={20}
                style={{
                  color: "#a1a1aa",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </button>

            {/* Dropdown */}
            {isOpen && (
              <div
                className="absolute top-full left-0 right-0 mt-3 rounded-2xl z-50 overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                  maxHeight: "320px",
                }}
              >
                {/* Search inside dropdown */}
                <div className="p-4 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ color: "#a1a1aa" }}
                    />
                    <input
                      type="text"
                      placeholder="Search people..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="input-glass text-base"
                      style={{ paddingLeft: "40px", fontSize: "0.95rem" }}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="overflow-y-auto" style={{ maxHeight: "250px" }}>
                  {filteredPeople.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-sm" style={{ color: "#a1a1aa" }}>
                        {people.length === 0 ? (
                          <>
                            No people registered yet.{" "}
                            <Link href="/people" className="underline" style={{ color: "#3b82f6" }}>
                              Add someone first
                            </Link>
                          </>
                        ) : (
                          "No matching people found"
                        )}
                      </p>
                    </div>
                  ) : (
                    filteredPeople.map((person) => (
                      <button
                        key={person.id}
                        type="button"
                        onClick={() => {
                          setSelectedPerson(person);
                          setIsOpen(false);
                          setSearch("");
                        }}
                        className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors"
                        style={{
                          background:
                            selectedPerson?.id === person.id
                              ? "rgba(16, 185, 129, 0.06)"
                              : "transparent",
                          borderBottom: "1px solid rgba(0,0,0,0.03)",
                          cursor: "pointer",
                          border: "none",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(0,0,0,0.03)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            selectedPerson?.id === person.id
                              ? "rgba(16, 185, 129, 0.06)"
                              : "transparent";
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
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
                        <div>
                          <p className="text-base font-medium" style={{ color: "#18181b" }}>
                            {person.fullName}
                          </p>
                          <p className="text-sm mt-0.5" style={{ color: "#a1a1aa" }}>
                            {person.role}
                            {person.identifier ? ` · ${person.identifier}` : ""}
                          </p>
                        </div>
                        {selectedPerson?.id === person.id && (
                          <CheckCircle2
                            size={20}
                            className="ml-auto"
                            style={{ color: "#10b981" }}
                          />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Unregistered Person Inputs */
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4">
          <div>
            <label
              className="block text-sm font-semibold mb-3"
              style={{ color: "#52525b", letterSpacing: "0.03em", textTransform: "uppercase" }}
            >
              Full Name
            </label>
            <input
              type="text"
              value={unregisteredName}
              onChange={(e) => setUnregisteredName(e.target.value)}
              placeholder="e.g. Delivery Driver"
              className="input-glass"
              style={{ padding: "16px 20px" }}
            />
          </div>
          <div>
            <label
              className="block text-sm font-semibold mb-3"
              style={{ color: "#52525b", letterSpacing: "0.03em", textTransform: "uppercase" }}
            >
              Role
            </label>
            <select
              value={unregisteredRole}
              onChange={(e) => setUnregisteredRole(e.target.value)}
              className="select-glass"
              style={{ padding: "16px 20px" }}
            >
              <option value="Visitor">Visitor</option>
              <option value="Courier">Courier</option>
              <option value="Contractor">Contractor</option>
              <option value="Guest">Guest</option>
            </select>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="mb-8">
        <label
          className="block text-sm font-semibold mb-3 flex items-center gap-2"
          style={{ color: "#52525b", letterSpacing: "0.03em", textTransform: "uppercase" }}
        >
          <StickyNote size={14} />
          Notes <span style={{ color: "#a1a1aa", textTransform: "none", fontWeight: 400 }}>(optional)</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Carrying delivery package, visitor pass issued..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input-glass"
          style={{ padding: "16px 20px" }}
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-6">
        <button
          type="button"
          onClick={() => handleLog("ENTRY")}
          disabled={isPending || (logMode === "registered" && !selectedPerson) || (logMode === "unregistered" && !unregisteredName.trim())}
          className="btn btn-entry py-4 text-base"
          style={{ borderRadius: "14px" }}
        >
          {isPending && lastAction === null ? (
            <span
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              style={{ animation: "spin 0.6s linear infinite" }}
            />
          ) : lastAction === "ENTRY" ? (
            <>
              <CheckCircle2 size={18} />
              Recorded!
            </>
          ) : (
            <>
              <LogIn size={18} />
              Record Entry
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => handleLog("EXIT")}
          disabled={isPending || (logMode === "registered" && !selectedPerson) || (logMode === "unregistered" && !unregisteredName.trim())}
          className="btn btn-exit py-4 text-base"
          style={{ borderRadius: "14px" }}
        >
          {isPending && lastAction === null ? (
            <span
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              style={{ animation: "spin 0.6s linear infinite" }}
            />
          ) : lastAction === "EXIT" ? (
            <>
              <CheckCircle2 size={18} />
              Recorded!
            </>
          ) : (
            <>
              <LogOut size={18} />
              Record Exit
            </>
          )}
        </button>
      </div>

      {/* Help text */}
      {logMode === "registered" && !selectedPerson && people.length === 0 && (
        <div className="mt-6 text-center">
          <div className="empty-state" style={{ padding: "24px" }}>
            <Users size={28} />
            <p className="text-sm font-medium" style={{ color: "#71717a" }}>
              No people registered yet
            </p>
            <Link
              href="/people"
              className="btn btn-primary mt-3"
              style={{ fontSize: "0.8125rem" }}
            >
              Register Someone
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
