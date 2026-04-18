import { Link } from "react-router-dom";
import type { LeadRecord, SalesTeamUser } from "../../lib/api";

const STATUS = ["New", "Assigned", "In Progress", "Won", "Lost"] as const;

type Props = {
  leads: LeadRecord[];
  role: "admin" | "salesman";
  basePath: "/admin/leads" | "/salesman/leads";
  salesTeam: SalesTeamUser[];
  query: string;
  onQueryChange: (q: string) => void;
  onPatch: (id: number, patch: Partial<LeadRecord>) => Promise<void>;
};

export default function LeadsTable({
  leads,
  role,
  basePath,
  salesTeam,
  query,
  onQueryChange,
  onPatch,
}: Props) {
  const quotesBase = basePath.replace(/\/leads$/, "/quotes");

  const filtered = leads.filter((l) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.location.toLowerCase().includes(q) ||
      l.productInterest.toLowerCase().includes(q) ||
      String(l.contact).includes(q)
    );
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6">
        <input
          placeholder="Search leads..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316]"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-t border-gray-200 bg-slate-50 text-left text-slate-600">
              <th className="px-4 py-3 font-medium whitespace-nowrap">ID</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium min-w-[140px]">Status</th>
              <th className="px-4 py-3 font-medium min-w-[160px]">Assigned</th>
              <th className="px-4 py-3 font-medium">Created by</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Updated</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-t border-gray-100 hover:bg-slate-50/80">
                <td className="px-4 py-3 font-mono text-xs">{l.id}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{l.name}</td>
                <td className="px-4 py-3">{l.contact}</td>
                <td className="px-4 py-3">{l.location}</td>
                <td className="px-4 py-3">{l.productInterest}</td>
                <td className="px-4 py-3">
                  {role === "admin" ? (
                    <select
                      className="border border-gray-200 rounded-lg px-2 py-1 text-sm w-full max-w-[160px]"
                      value={l.status}
                      onChange={(e) =>
                        void onPatch(l.id, { status: e.target.value as (typeof STATUS)[number] })
                      }
                    >
                      {STATUS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  ) : (
                    l.status
                  )}
                </td>
                <td className="px-4 py-3">
                  {role === "admin" ? (
                    <select
                      className="border border-gray-200 rounded-lg px-2 py-1 text-sm w-full max-w-[180px]"
                      value={l.assignedToUserId ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        void onPatch(l.id, {
                          assignedToUserId: v === "" ? null : v,
                        });
                      }}
                    >
                      <option value="">Unassigned</option>
                      {salesTeam.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  ) : l.assignedToName ? (
                    l.assignedToName
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">{l.createdByName ?? "—"}</td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">
                  {new Date(l.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <Link
                      to={`${basePath}/${l.id}`}
                      className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium border border-[#F97316] text-[#F97316] rounded-lg hover:bg-[#F97316] hover:text-white transition-colors"
                    >
                      View
                    </Link>
                    <Link
                      to={`${quotesBase}?leadId=${l.id}`}
                      className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium bg-[#F97316] text-white rounded-lg hover:bg-[#ea6a0f] transition-colors"
                    >
                      Quote
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                  No leads found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
