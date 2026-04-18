import { useMemo } from "react";
import { Mail, ShieldCheck, UserCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { AdminPageHeader, AdminPanel } from "../../components/admin/AdminUI";

export default function SalesProfile() {
  const { user } = useAuth();

  const initials = useMemo(() => {
    const basis = user?.name || user?.email || "S";
    return basis.charAt(0).toUpperCase();
  }, [user?.email, user?.name]);

  return (
    <div className="space-y-6 min-w-0 w-full max-w-full">
      <AdminPageHeader title="Profile" subtitle="Your sales workspace account details." />

      <AdminPanel className="p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-[#F97316] to-[#ea6a0f] p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10">
              <span className="text-2xl font-bold">{initials}</span>
            </div>
            <div>
              <p className="text-lg font-semibold">{user?.name ?? "Sales"}</p>
              <p className="text-white/85">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-100 p-5">
            <div className="mb-3 flex items-center gap-3">
              <UserCircle2 className="h-5 w-5 text-[#F97316]" />
              <p className="font-bold text-slate-900">Role</p>
            </div>
            <p className="text-gray-700">Sales</p>
            <p className="mt-1 text-sm text-gray-500">Manage leads, quotes, and customer follow-ups.</p>
          </div>

          <div className="rounded-xl border border-gray-100 p-5">
            <div className="mb-3 flex items-center gap-3">
              <Mail className="h-5 w-5 text-[#F97316]" />
              <p className="font-bold text-slate-900">Email</p>
            </div>
            <p className="text-gray-700">{user?.email}</p>
            <p className="mt-1 text-sm text-gray-500">Used for login and notifications.</p>
          </div>

          <div className="rounded-xl border border-gray-100 p-5 md:col-span-2">
            <div className="mb-3 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[#F97316]" />
              <p className="font-bold text-slate-900">Security</p>
            </div>
            <p className="text-gray-700">Session-based authentication</p>
            <p className="mt-1 text-sm text-gray-500">
              Password changes and additional security options can be added here later.
            </p>
          </div>
        </div>
      </AdminPanel>
    </div>
  );
}
