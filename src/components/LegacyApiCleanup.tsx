"use client";

import { useEffect } from "react";

const LEGACY_HOST_MARKERS = ["railway.app", "em-solar-backend"];

/**
 * Drop stale Vite/PWA service workers and cached API entries that still
 * pointed at the old Railway backend.
 */
export default function LegacyApiCleanup() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.getRegistrations().then((regs) => {
        for (const reg of regs) {
          void reg.unregister();
        }
      });
    }

    if ("caches" in window) {
      void caches.keys().then((keys) => {
        for (const key of keys) {
          void caches.delete(key);
        }
      });
    }

    try {
      const cacheKey = "energymart-api-get-cache-v1";
      const raw = localStorage.getItem(cacheKey);
      if (!raw) return;
      if (
        LEGACY_HOST_MARKERS.some((m) => raw.toLowerCase().includes(m))
      ) {
        localStorage.removeItem(cacheKey);
      }
    } catch {
      // ignore
    }
  }, []);

  return null;
}
