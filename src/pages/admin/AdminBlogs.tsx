import { useCallback, useEffect, useState } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";
import {
  AdminPageHeader,
  AdminPanel,
  AdminTableShell,
} from "../../components/admin/AdminUI";
import {
  createAdminBlog,
  deleteAdminBlog,
  fetchAdminBlogs,
  invalidateAdminBootstrapCache,
  updateAdminBlog,
  type BlogPost,
} from "../../lib/api";
import { toastError, toastSuccess } from "../../lib/toast";

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocal(s: string): string | undefined {
  if (!s.trim()) return undefined;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

const emptyForm = {
  title: "",
  tag: "",
  imageUrl: "",
  excerpt: "",
  body: "",
  isPublished: true,
  publishedAt: "",
};

export default function AdminBlogs() {
  const [rows, setRows] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminBlogs();
      setRows(data);
    } catch {
      toastError("Could not load blogs.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function startCreate() {
    setEditingId(null);
    setShowForm(true);
    setForm({
      ...emptyForm,
      publishedAt: toDatetimeLocal(new Date().toISOString()),
    });
  }

  function startEdit(b: BlogPost) {
    setShowForm(true);
    setEditingId(b.id);
    setForm({
      title: b.title,
      tag: b.tag,
      imageUrl: b.image,
      excerpt: b.excerpt ?? "",
      body: b.body ?? "",
      isPublished: b.is_published,
      publishedAt: toDatetimeLocal(b.published_at),
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const publishedAt = fromDatetimeLocal(form.publishedAt);
      if (editingId != null) {
        const updated = await updateAdminBlog(editingId, {
          title: form.title.trim(),
          tag: form.tag.trim(),
          imageUrl: form.imageUrl.trim(),
          excerpt: form.excerpt.trim(),
          body: form.body.trim(),
          isPublished: form.isPublished,
          ...(publishedAt ? { publishedAt } : {}),
        });
        setRows((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
        toastSuccess("Blog updated");
      } else {
        const created = await createAdminBlog({
          title: form.title.trim(),
          tag: form.tag.trim(),
          imageUrl: form.imageUrl.trim(),
          excerpt: form.excerpt.trim(),
          body: form.body.trim(),
          isPublished: form.isPublished,
          ...(publishedAt ? { publishedAt } : {}),
        });
        setRows((prev) => [created, ...prev]);
        toastSuccess("Blog created");
      }
      invalidateAdminBootstrapCache();
      setEditingId(null);
      setShowForm(false);
      setForm(emptyForm);
    } catch {
      toastError("Could not save blog.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: number) {
    if (!window.confirm("Delete this blog post?")) return;
    setSaving(true);
    try {
      await deleteAdminBlog(id);
      setRows((prev) => prev.filter((x) => x.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setShowForm(false);
        setForm(emptyForm);
      }
      invalidateAdminBootstrapCache();
      toastSuccess("Blog deleted");
    } catch {
      toastError("Could not delete blog.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 min-w-0 w-full max-w-full">
      <AdminPageHeader
        title="Blog & news"
        subtitle="Posts appear on the homepage “Latest news” carousel and the public /news page."
        action={
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF7A00] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#e86e00]"
          >
            <Plus className="h-4 w-4" />
            New post
          </button>
        }
      />

      {showForm && (
        <AdminPanel className="p-4 sm:p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            {editingId != null ? "Edit post" : "New post"}
          </h2>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={(e) => void onSubmit(e)}>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-slate-600">Title</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Tag / category</label>
              <input
                value={form.tag}
                onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                placeholder="e.g. AE Power"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Published</label>
              <input
                type="datetime-local"
                value={form.publishedAt}
                onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-slate-600">Cover image URL</label>
              <input
                required
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                placeholder="https://…"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-slate-600">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                rows={2}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-slate-600">Body (full article)</label>
              <textarea
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                rows={5}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-2 flex flex-wrap items-center gap-4">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                />
                Published (visible on website)
              </label>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#FF7A00] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e86e00] disabled:opacity-60"
              >
                {saving ? "Saving…" : editingId != null ? "Save changes" : "Create post"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setShowForm(false);
                  setForm(emptyForm);
                }}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </AdminPanel>
      )}

      <AdminTableShell>
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-base font-bold text-slate-900">All posts</h2>
          <p className="mt-1 text-sm text-gray-500">Newest first</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full text-sm">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Tag</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                    No blog posts yet. Click “New post” to add one.
                  </td>
                </tr>
              ) : (
                rows.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-slate-900 max-w-xs truncate">{b.title}</td>
                    <td className="px-4 py-3 text-gray-700">{b.tag || "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{b.date}</td>
                    <td className="px-4 py-3">
                      {b.is_published ? (
                        <span className="text-emerald-700 font-medium">Live</span>
                      ) : (
                        <span className="text-slate-500">Draft</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => startEdit(b)}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[#FF7A00] font-medium hover:underline"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void onDelete(b.id)}
                        disabled={saving}
                        className="ml-3 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-rose-600 font-medium hover:underline"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminTableShell>
    </div>
  );
}
