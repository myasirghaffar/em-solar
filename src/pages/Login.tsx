import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, Sun } from "lucide-react";
import { useAuth, isAuthApiError } from "../context/AuthContext";

function pickPostLoginPath(
  role: "admin" | "user",
  fromPath: string | undefined,
): string {
  if (
    fromPath &&
    typeof fromPath === "string" &&
    fromPath.startsWith("/") &&
    !fromPath.startsWith("//")
  ) {
    if (role === "admin" && fromPath.startsWith("/admin")) return fromPath;
    if (role === "user" && fromPath.startsWith("/profile")) return fromPath;
  }
  return role === "admin" ? "/admin" : "/profile";
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = (location.state as { from?: { pathname?: string } } | null)?.from
    ?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser) {
        navigate(pickPostLoginPath(loggedInUser.role, fromPath), { replace: true });
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      if (isAuthApiError(err)) {
        if (err.code === "AUTH_EMAIL_NOT_VERIFIED") {
          setError(
            "Please verify your email before signing in. You can request a new link below.",
          );
        } else {
          setError(err.message);
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100">
        <div className="bg-[#0B2A4A] text-white p-6">
          <Link to="/" className="flex items-center space-x-2 mb-4">
            <Sun className="w-8 h-8 text-[#FF7A00]" />
            <span className="text-xl font-bold">
              EnergyMart<span className="text-[#FF7A00]">.pk</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="text-gray-300 mt-1">Admin dashboard or customer account</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm space-y-2">
              <p>{error}</p>
              {error.includes("verify your email") && (
                <Link to="/resend-verification" className="font-medium text-[#FF7A00] hover:underline">
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
            <Link to="/forgot-password" className="text-sm text-[#FF7A00] hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF7A00] text-white py-3 rounded-lg font-semibold hover:bg-[#FF7A00]/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-gray-600 text-sm">
            No account?{" "}
            <Link to="/signup" className="text-[#FF7A00] font-medium hover:underline">
              Sign up
            </Link>
          </p>

          <p className="text-center text-gray-600 text-sm">
            <Link to="/" className="text-[#FF7A00] hover:underline">
              ← Back to Store
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
