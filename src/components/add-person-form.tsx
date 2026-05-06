"use client";

import { useActionState, useEffect, useRef } from "react";
import { addPerson, type ActionResult } from "@/app/actions";
import { UserPlus } from "lucide-react";
import { toast } from "@/components/toast";

const initialState: ActionResult = { success: false, message: "" };

export function AddPersonForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: ActionResult, formData: FormData) => {
      return await addPerson(formData);
    },
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      toast(state.message, state.success ? "success" : "error");
      if (state.success) {
        formRef.current?.reset();
      }
    }
  }, [state]);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <div
          className="stat-icon"
          style={{ background: "rgba(59, 130, 246, 0.1)" }}
        >
          <UserPlus size={18} style={{ color: "#3b82f6" }} strokeWidth={2} />
        </div>
        <h2
          className="text-sm font-semibold"
          style={{ color: "#18181b", letterSpacing: "-0.01em" }}
        >
          Register New Person
        </h2>
      </div>

      <form ref={formRef} action={formAction} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="fullName"
            className="block text-xs font-medium mb-1.5"
            style={{ color: "#52525b" }}
          >
            Full Name <span style={{ color: "#f43f5e" }}>*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            placeholder="e.g. John Doe"
            className="input-glass"
          />
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-xs font-medium mb-1.5"
            style={{ color: "#52525b" }}
          >
            Role <span style={{ color: "#f43f5e" }}>*</span>
          </label>
          <select id="role" name="role" required className="select-glass">
            <option value="">Select a role...</option>
            <option value="Resident">Resident</option>
            <option value="Staff">Staff</option>
            <option value="Guest">Guest</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="identifier"
            className="block text-xs font-medium mb-1.5"
            style={{ color: "#52525b" }}
          >
            Identifier{" "}
            <span style={{ color: "#a1a1aa" }}>(optional)</span>
          </label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            placeholder="e.g. Apt 204, Badge #A12"
            className="input-glass"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="btn btn-primary w-full mt-1"
        >
          {isPending ? (
            <>
              <span
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                style={{ animation: "spin 0.6s linear infinite" }}
              />
              Registering...
            </>
          ) : (
            <>
              <UserPlus size={15} />
              Register Person
            </>
          )}
        </button>
      </form>
    </div>
  );
}
