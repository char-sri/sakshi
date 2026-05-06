"use client";

import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";

type Toast = {
  id: string;
  message: string;
  type: "success" | "error";
};

let addToastExternal: ((message: string, type: "success" | "error") => void) | null = null;

export function toast(message: string, type: "success" | "error" = "success") {
  if (addToastExternal) {
    addToastExternal(message, type);
  }
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: "success" | "error") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    addToastExternal = addToast;
    return () => {
      addToastExternal = null;
    };
  }, [addToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type} flex items-center gap-3`}>
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="opacity-70 hover:opacity-100 transition-opacity"
            style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
