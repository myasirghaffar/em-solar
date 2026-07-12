"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

type AuthGateProps = {
  children: React.ReactNode;
  /** When true, only users with role `admin` may pass. */
  requireAdmin?: boolean;
};

/** Requires a signed-in user; optionally admin-only for the store admin panel. */
export default function AuthGate({ children, requireAdmin = false }: AuthGateProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (requireAdmin && user.role !== "admin") {
      router.replace(user.role === "user" ? "/profile" : "/login");
    }
  }, [isLoading, user, router, requireAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF7A00] border-t-transparent" />
      </div>
    );
  }

  if (!user || (requireAdmin && user.role !== "admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF7A00] border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
