import { useEffect, useMemo, useState } from "react";
import { HandCoins, ListChecks, Timer, UserCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { fetchLeads, type LeadRecord } from "../../lib/api";
import LeadCreateForm from "../../components/leads/LeadCreateForm";
import LeadStatusChart from "../../components/sales/LeadStatusChart";
import { Link } from "react-router-dom";
import { toastError } from "../../lib/toast";

export default function SalesDashboard() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    try {
      const rows = await fetchLeads();
      setLeads(rows);
    } catch {
      toastError("Could not load leads.");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const myLeads = useMemo(() => {
    if (!user?.id) return [];
    return leads.filter(
      (l) => l.createdByUserId === user.id || l.assignedToUserId === user.id,
    );
  }, [leads, user?.id]);

  const myStats = useMemo(() => {
    const won = myLeads.filter((l) => l.status === "Won").length;
    const inProgress = myLeads.filter((l) => l.status === "In Progress").length;
    return { total: myLeads.length, won, inProgress };
  }, [myLeads]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#F97316]/10 rounded-lg">
          <UserCircle2 className="h-6 w-6 text-[#F97316]" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Salesman dashboard</h1>
          <p className="text-sm text-slate-600 mt-1">
            Welcome back, {user?.name ?? "Sales"}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[#F97316]/30 bg-[#F97316]/5 px-4 py-3 text-sm text-slate-700 flex flex-wrap items-center justify-between gap-2">
        <span>
          Generate line-item quotes and download branded PDFs from the Quotes workspace.
        </span>
        <Link
          to="/salesman/quotes"
          className="font-semibold text-[#F97316] hover:underline shrink-0"
        >
          Open Quotes →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <ListChecks className="w-4 h-4 text-[#F97316]" />
            My leads
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{myStats.total}</p>
          <p className="text-xs text-slate-500 mt-1">Assigned to you or created by you</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <HandCoins className="w-4 h-4 text-[#F97316]" />
            Won
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{myStats.won}</p>
          <p className="text-xs text-slate-500 mt-1">Closed deals</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <Timer className="w-4 h-4 text-[#F97316]" />
            In progress
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{myStats.inProgress}</p>
          <p className="text-xs text-slate-500 mt-1">Active pipeline</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm min-h-[360px]">
          <h3 className="font-semibold text-lg mb-4 text-slate-900">My lead status</h3>
          {loading ? (
            <div className="min-h-[300px] animate-pulse rounded-xl bg-slate-100" />
          ) : (
            <LeadStatusChart leads={leads} scopeUserId={user?.id} variant="detailed" />
          )}
        </div>
        <div className="w-full lg:w-[340px] shrink-0 bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4 text-slate-900">Create new lead</h3>
          <LeadCreateForm
            onCreated={(lead) => {
              setLeads((prev) => {
                const i = prev.findIndex((x) => x.id === lead.id);
                if (i >= 0) {
                  const next = [...prev];
                  next[i] = lead;
                  return next;
                }
                return [lead, ...prev];
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
