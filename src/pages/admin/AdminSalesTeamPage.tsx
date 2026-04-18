import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable, { type DataTableColumn } from "../../components/admin/DataTable";
import { AdminPageHeader, AdminPanel } from "../../components/admin/AdminUI";
import {
  ApiError,
  createSalesTeamMember,
  fetchSalesTeam,
  patchSalesTeamMember,
  type SalesTeamUser,
} from "../../lib/api";
import { toastError, toastSuccess } from "../../lib/toast";

export default function AdminSalesTeamPage() {
  const [rows, setRows] = useState<SalesTeamUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [editing, setEditing] = useState<SalesTeamUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [listError, setListError] = useState("");
  const [actionError, setActionError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setListError("");
    try {
      const data = await fetchSalesTeam();
      setRows(data);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Could not load sales team.";
      setListError(msg);
      toastError(msg);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setActionError("");
    try {
      await createSalesTeamMember({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setForm({ name: "", email: "", password: "" });
      await refresh();
      toastSuccess("Salesperson added");
    } catch (err) {
      const m = err instanceof ApiError ? err.message : "Could not add salesperson.";
      setActionError(m);
      toastError(m);
    } finally {
      setSaving(false);
    }
  }

  async function onSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setActionError("");
    try {
      await patchSalesTeamMember(editing.id, {
        name: form.name.trim(),
        email: form.email.trim(),
        ...(form.password.trim() ? { password: form.password } : {}),
      });
      setEditing(null);
      setForm({ name: "", email: "", password: "" });
      await refresh();
      toastSuccess("Salesperson updated");
    } catch (err) {
      const m = err instanceof ApiError ? err.message : "Could not save changes.";
      setActionError(m);
      toastError(m);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(u: SalesTeamUser) {
    setEditing(u);
    setForm({ name: u.name, email: u.email, password: "" });
  }

  async function toggleActive(u: SalesTeamUser) {
    setSaving(true);
    setActionError("");
    try {
      await patchSalesTeamMember(u.id, { isActive: !u.isActive });
      await refresh();
      toastSuccess(u.isActive ? "User deactivated" : "User activated");
    } catch (err) {
      const m = err instanceof ApiError ? err.message : "Could not update status.";
      setActionError(m);
      toastError(m);
    } finally {
      setSaving(false);
    }
  }

  const salespeopleColumns: DataTableColumn<SalesTeamUser>[] = useMemo(
    () => [
      {
        id: "name",
        header: "Name",
        tdClassName: "font-medium text-slate-900",
        cell: (u) => u.name,
      },
      { id: "email", header: "Email", cell: (u) => u.email },
      {
        id: "active",
        header: "Active",
        cell: (u) => (u.isActive ? "Yes" : "No"),
      },
      {
        id: "actions",
        header: "Actions",
        align: "right",
        cell: (u) => (
          <span className="space-x-2">
            <button
              type="button"
              onClick={() => startEdit(u)}
              className="text-[#F97316] font-medium text-xs hover:underline"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => void toggleActive(u)}
              disabled={saving}
              className="text-slate-600 font-medium text-xs hover:underline"
            >
              {u.isActive ? "Deactivate" : "Activate"}
            </button>
          </span>
        ),
      },
    ],
    [saving],
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Sales team"
        subtitle="Create salesman accounts. They sign in at the same login page and manage their leads."
      />

      {listError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {listError}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <AdminPanel className="p-4 sm:p-6 lg:col-span-2">
          <DataTable<SalesTeamUser>
            title="Salespeople"
            columns={salespeopleColumns}
            data={rows}
            getRowKey={(u) => u.id}
            loading={loading}
            emptyMessage="No salespeople yet. Add one on the right."
          />
        </AdminPanel>

        <AdminPanel className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {editing ? "Edit salesperson" : "Add salesperson"}
          </h2>
          {actionError ? (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {actionError}
            </div>
          ) : null}
          <form
            className="space-y-3"
            onSubmit={editing ? onSaveEdit : onCreate}
          >
            <div>
              <label className="text-xs font-medium text-slate-600">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">
                Password {editing ? "(leave blank to keep)" : ""}
              </label>
              <input
                type="password"
                required={!editing}
                minLength={8}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                placeholder={editing ? "••••••••" : "Min. 8 characters"}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2 rounded-lg bg-[#FF7A00] text-white text-sm font-medium hover:bg-[#e86e00] disabled:opacity-60"
              >
                {saving ? "Saving…" : editing ? "Save" : "Add"}
              </button>
              {editing ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm({ name: "", email: "", password: "" });
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </AdminPanel>
      </div>
    </div>
  );
}
