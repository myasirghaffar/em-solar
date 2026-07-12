"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Sun } from "lucide-react";
import { authVerifyEmail } from "../lib/authApi";
import { isAuthApiError, useAuth } from "../context/AuthContext";
import { toastError, toastSuccess } from "../lib/toast";

export default function VerifyEmail() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const router = useRouter();
  const { importSession, logout } = useAuth();
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "working" | "done">("idle");

  useEffect(() => {
    if (!token) {
      const msg = "Missing verification token. Use the link from your email.";
      setError(msg);
      toastError(msg);
      return;
    }
    let cancelled = false;
    (async () => {
      setStatus("working");
      try {
        const result = await authVerifyEmail(token);
        if (cancelled) return;
        importSession({
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });
        setStatus("done");
        toastSuccess("Email verified. Signed in.");
        const role = result.user.role;
        if (role === "admin") {
          router.replace("/admin");
          return;
        }
        if (role === "salesman") {
          await logout();
          const tools = (
            process.env.NEXT_PUBLIC_EM_TOOLS_URL ?? "http://localhost:3000"
          ).replace(/\/$/, "");
          toastError("Sales accounts use EM Tools (CRM).");
          window.location.assign(`${tools}/login`);
          return;
        }
        router.replace("/profile");
      } catch (err) {
        if (!cancelled) {
          setStatus("idle");
          if (isAuthApiError(err)) {
            setError(err.message);
            toastError(err.message);
          } else {
            const msg = "Verification failed.";
            setError(msg);
            toastError(msg);
          }
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, router, importSession, logout]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100 text-center p-8">
        <Link href="/" className="inline-flex items-center space-x-2 mb-6 text-[#0B2A4A]">
          <Sun className="w-8 h-8 text-[#FF7A00]" />
          <span className="text-xl font-bold">
            EnergyMart<span className="text-[#FF7A00]">.pk</span>
          </span>
        </Link>
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>
        )}
        {status === "working" && (
          <p className="text-gray-600">Verifying your email…</p>
        )}
        {status === "done" && (
          <p className="text-emerald-700">Signed in. Redirecting…</p>
        )}
        <p className="mt-6">
          <Link href="/login" className="text-[#FF7A00] text-sm hover:underline">
            Go to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
