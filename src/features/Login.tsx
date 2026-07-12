"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Sun } from "lucide-react";
import { ButtonSpinner } from "../components/ui/Button";
import { useAuth, isAuthApiError } from "../context/AuthContext";
import { toastError, toastSuccess } from "../lib/toast";

function emToolsUrl(): string {
  return (process.env.NEXT_PUBLIC_EM_TOOLS_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPath = searchParams.get("from") ?? undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      if (!loggedInUser) {
        const msg = "Invalid email or password";
        setError(msg);
        toastError(msg);
        return;
      }

      if (loggedInUser.role === "admin") {
        toastSuccess("Welcome to store admin");
        router.replace("/admin");
        return;
      }

      if (loggedInUser.role === "salesman") {
        const tools = emToolsUrl();
        const msg = `Sales accounts use EM Tools (CRM). Sign in at ${tools}`;
        setError(msg);
        toastError("Sales team uses EM Tools — redirecting to CRM login…");
        await logout();
        window.location.assign(`${tools}/login`);
        return;
      }

      toastSuccess("Signed in");
      const safeFrom =
        fromPath &&
        fromPath.startsWith("/") &&
        !fromPath.startsWith("//") &&
        !fromPath.startsWith("/admin") &&
        !fromPath.startsWith("/salesman")
          ? fromPath
          : "/profile";
      router.replace(safeFrom);
    } catch (err) {
      if (isAuthApiError(err)) {
        if (err.code === "AUTH_EMAIL_NOT_VERIFIED") {
          const msg =
            "Please verify your email before signing in. You can request a new link below.";
          setError(msg);
          toastError(msg);
        } else {
          setError(err.message);
          toastError(err.message);
        }
      } else {
        const msg = "Login failed. Please try again.";
        setError(msg);
        toastError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100">
        <div className="bg-[#0B2A4A] text-white p-6">
          <Link href="/" className="flex items-center space-x-2 mb-4">
            <Sun className="w-8 h-8 text-[#FF7A00]" />
            <span className="text-xl font-bold">
              EnergyMart<span className="text-[#FF7A00]">.pk</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="text-gray-300 mt-1">Customer or store admin</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm space-y-2">
              <p>{error}</p>
              {error.includes("verify your email") && (
                <Link
                  href="/resend-verification"
                  className="font-medium text-[#FF7A00] hover:underline"
                >
                  Resend verification email
                </Link>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                placeholder="Enter password"
                required
                minLength={8}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm text-[#FF7A00] hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF7A00] py-3 font-semibold text-white transition-colors hover:bg-[#FF7A00]/90 disabled:cursor-not-allowed disabled:opacity-70"
            aria-busy={loading}
          >
            {loading ? <ButtonSpinner /> : null}
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-gray-600 text-sm">
            No account?{" "}
            <Link href="/signup" className="text-[#FF7A00] font-medium hover:underline">
              Sign up
            </Link>
          </p>

          <p className="text-center text-gray-600 text-sm">
            Store admins open the admin panel here. Sales / CRM uses{" "}
            <a href={`${emToolsUrl()}/login`} className="text-[#FF7A00] font-medium hover:underline">
              EM Tools
            </a>
            .
          </p>

          <p className="text-center text-gray-600 text-sm">
            <Link href="/" className="text-[#FF7A00] hover:underline">
              ← Back to Store
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
