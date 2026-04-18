import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Sun, User, KeyRound } from "lucide-react";
import { authRegisterAdmin } from "../lib/authApi";
import { isAuthApiError } from "../context/AuthContext";
import { toastError, toastSuccess } from "../lib/toast";

export default function RegisterAdmin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteSecret, setInviteSecret] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [devLink, setDevLink] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setDevLink("");
    setLoading(true);
    try {
      const result = await authRegisterAdmin({ name, email, password, inviteSecret });
      setInfo("Check your email to verify this admin account, then sign in.");
      if (result.devVerificationUrl) setDevLink(result.devVerificationUrl);
      toastSuccess("Check your email to verify this admin account.");
    } catch (err) {
      if (isAuthApiError(err)) {
        setError(err.message);
        toastError(err.message);
      } else {
        const msg = "Registration failed.";
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
            <span className="text-xl font-bold">Admin registration</span>
          </Link>
          <p className="text-gray-300 text-sm">Requires server `ADMIN_INVITE_SECRET`</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}
          {info && (
            <div className="bg-emerald-50 text-emerald-800 px-4 py-3 rounded-lg text-sm space-y-2">
              <p>{info}</p>
              {devLink && (
                <a href={devLink} className="text-[#FF7A00] underline text-xs break-all block">
                  Dev verify link
                </a>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Invite secret</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={inviteSecret}
                onChange={(e) => setInviteSecret(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                required
                disabled={!!info}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                required
                disabled={!!info}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                required
                disabled={!!info}
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
                required
                minLength={8}
                disabled={!!info}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !!info}
            className="w-full bg-[#FF7A00] text-white py-3 rounded-lg font-semibold disabled:opacity-70"
          >
            {loading ? "Submitting..." : "Create admin account"}
          </button>

          <p className="text-center text-sm">
            <Link to="/login" className="text-[#FF7A00] hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
