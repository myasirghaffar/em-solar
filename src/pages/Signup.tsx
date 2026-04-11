import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Sun, User } from "lucide-react";
import { useAuth, isAuthApiError } from "../context/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [devLink, setDevLink] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setDevLink("");
    setLoading(true);
    try {
      const result = await signup({ name, email, password });
      if (!result) {
        setError("Could not create account.");
        return;
      }
      if (result.devVerificationUrl) {
        setInfo(
          "Transactional email is not configured on the API yet, so nothing was sent to your inbox. Use the verification link below, then sign in. To get real emails, add RESEND_API_KEY and EMAIL_FROM to em-solar-backend/.env (see .env.example).",
        );
        setDevLink(result.devVerificationUrl);
      } else {
        setInfo(
          "We sent a message to your email with a verification link. After you verify, you can sign in.",
        );
      }
    } catch (err) {
      if (isAuthApiError(err)) {
        setError(err.message);
      } else {
        setError("Sign up failed. Please try again.");
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
          <h1 className="text-2xl font-bold">Create account</h1>
          <p className="text-gray-300 mt-1">
            Customer account — verify your email after signing up
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {info && (
            <div className="bg-emerald-50 text-emerald-800 px-4 py-3 rounded-lg text-sm space-y-2">
              <p>{info}</p>
              {devLink && (
                <p className="text-xs break-all">
                  Dev link (no email provider):{" "}
                  <a href={devLink} className="text-[#FF7A00] underline">
                    verify now
                  </a>
                </p>
              )}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-[#FF7A00] font-medium hover:underline"
              >
                Go to sign in
              </button>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                placeholder="Your name"
                required
                minLength={1}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                placeholder="At least 8 characters"
                required
                minLength={8}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !!info}
            className="w-full bg-[#FF7A00] text-white py-3 rounded-lg font-semibold hover:bg-[#FF7A00]/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>

          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#FF7A00] hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
          <p className="text-center">
            <Link to="/" className="text-gray-500 text-sm hover:text-[#FF7A00]">
              ← Back to Store
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
