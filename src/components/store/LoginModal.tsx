import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Mail, Lock, User } from "lucide-react";
import { useScrollLock } from "../../hooks/useScrollLock";
import { useAuth, isAuthApiError } from "../../context/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [devVerifyUrl, setDevVerifyUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  useScrollLock(isOpen);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setDevVerifyUrl("");
    setLoading(true);
    try {
      if (isLogin) {
        const user = await login(formData.email, formData.password);
        if (user) {
          onClose();
          navigate(user.role === "admin" ? "/admin" : "/profile", { replace: true });
        }
      } else {
        const result = await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        if (result) {
          setInfo(
            result.devVerificationUrl
              ? "Account created. Use the verification link below (local dev), or check your email."
              : "Account created. Check your email to verify, then sign in.",
          );
          if (result.devVerificationUrl) setDevVerifyUrl(result.devVerificationUrl);
        }
      }
    } catch (err) {
      if (isAuthApiError(err)) {
        setError(err.message);
      } else {
        setError(isLogin ? "Sign in failed." : "Sign up failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-[#0B2A4A] text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-300 mt-2">
            {isLogin
              ? "Sign in to access your account"
              : "Join EnergyMart.pk — verify your email after signing up"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}
          {info && (
            <div className="bg-emerald-50 text-emerald-800 px-4 py-3 rounded-lg text-sm space-y-2">
              <p>{info}</p>
              {devVerifyUrl && (
                <a href={devVerifyUrl} className="text-[#FF7A00] underline break-all block text-xs">
                  Open verification link
                </a>
              )}
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                  placeholder="Enter your name"
                  required={!isLogin}
                  disabled={Boolean(info)}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                placeholder="Enter your email"
                required
                disabled={Boolean(info)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                placeholder="At least 8 characters"
                required
                minLength={8}
                disabled={Boolean(info)}
              />
            </div>
          </div>

          {isLogin && (
            <div className="flex justify-end text-sm">
              <Link to="/forgot-password" onClick={onClose} className="text-[#FF7A00] hover:underline">
                Forgot password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || Boolean(info)}
            className="w-full bg-[#FF7A00] text-white py-3 rounded-lg font-semibold hover:bg-[#FF7A00]/90 transition-colors disabled:opacity-70"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>

          <p className="text-center text-gray-600 text-sm">
            {isLogin ? "Need an account? " : "Have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setInfo("");
              }}
              className="text-[#FF7A00] font-semibold hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
