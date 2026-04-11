import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Sun } from "lucide-react";
import { authVerifyEmail } from "../lib/authApi";
import { isAuthApiError, useAuth } from "../context/AuthContext";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const navigate = useNavigate();
  const { importSession } = useAuth();
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "working" | "done">("idle");

  useEffect(() => {
    if (!token) {
      setError("Missing verification token. Use the link from your email.");
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
        const role = result.user.role;
        navigate(role === "admin" ? "/admin" : "/profile", { replace: true });
      } catch (err) {
        if (!cancelled) {
          setStatus("idle");
          if (isAuthApiError(err)) {
            setError(err.message);
          } else {
            setError("Verification failed.");
          }
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, navigate, importSession]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100 text-center p-8">
        <Link to="/" className="inline-flex items-center space-x-2 mb-6 text-[#0B2A4A]">
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
          <Link to="/login" className="text-[#FF7A00] text-sm hover:underline">
            Go to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
