import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Sun } from "lucide-react";
import { authForgotPassword } from "../lib/authApi";
import { isAuthApiError } from "../context/AuthContext";
import { toastError, toastSuccess } from "../lib/toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [devLink, setDevLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const extra = await authForgotPassword(email);
      setDone(true);
      if (extra?.devResetUrl) setDevLink(extra.devResetUrl);
      toastSuccess("If an account exists, you will receive reset instructions.");
    } catch (err) {
      if (isAuthApiError(err)) {
        setError(err.message);
        toastError(err.message);
      } else {
        const msg = "Something went wrong. Try again later.";
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
          <Link to="/" className="flex items-center space-x-2 mb-4">
            <Sun className="w-8 h-8 text-[#FF7A00]" />
            <span className="text-xl font-bold">
              EnergyMart<span className="text-[#FF7A00]">.pk</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold">Forgot password</h1>
          <p className="text-gray-300 mt-1">We will email you a reset link if an account exists</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}
          {done && (
            <div className="bg-emerald-50 text-emerald-800 px-4 py-3 rounded-lg text-sm space-y-2">
              <p>If an account exists for that email, you will receive reset instructions shortly.</p>
              {devLink && (
                <p className="text-xs break-all">
                  Dev link:{" "}
                  <a href={devLink} className="text-[#FF7A00] underline">
                    open reset page
                  </a>
                </p>
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
                disabled={done}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || done}
            className="w-full bg-[#FF7A00] text-white py-3 rounded-lg font-semibold hover:bg-[#FF7A00]/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>

          <p className="text-center text-gray-600 text-sm">
            <Link to="/login" className="text-[#FF7A00] hover:underline">
              ← Back to sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
