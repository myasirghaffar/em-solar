import { useState } from "react";
import { createLead, type LeadRecord } from "../../lib/api";
import { toastError, toastSuccess } from "../../lib/toast";

type Props = {
  /** Called with the new lead so the list can update without a full refetch. */
  onCreated?: (lead: LeadRecord) => void | Promise<void>;
  className?: string;
};

export default function LeadCreateForm({ onCreated, className = "" }: Props) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    location: "",
    productInterest: "Solar Panels",
    notes: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await createLead({
        name: form.name.trim(),
        contact: form.contact.trim(),
        location: form.location.trim(),
        productInterest: form.productInterest,
        notes: form.notes.trim(),
      });
      setForm({
        name: "",
        contact: "",
        location: "",
        productInterest: "Solar Panels",
        notes: "",
      });
      await onCreated?.(created);
      toastSuccess("Lead created");
    } catch {
      toastError("Could not create lead.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={`space-y-3 ${className}`} onSubmit={(e) => void submit(e)}>
      <div>
        <label className="text-xs font-medium text-slate-600">Name</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316]"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600">Contact</label>
        <input
          required
          value={form.contact}
          onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316]"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600">Location</label>
        <input
          required
          value={form.location}
          onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316]"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600">Product interest</label>
        <select
          value={form.productInterest}
          onChange={(e) => setForm((f) => ({ ...f, productInterest: e.target.value }))}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316]"
        >
          <option>Solar Panels</option>
          <option>Inverters</option>
          <option>Batteries</option>
          <option>Mounting Systems</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600">Notes</label>
        <input
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316]"
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="w-full py-2.5 rounded-lg bg-[#F97316] text-white text-sm font-medium hover:bg-[#ea6a0f] disabled:opacity-60"
      >
        {saving ? "Saving…" : "Create lead"}
      </button>
    </form>
  );
}
