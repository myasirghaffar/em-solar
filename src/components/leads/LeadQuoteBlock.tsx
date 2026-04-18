import { useEffect, useMemo, useState } from "react";
import { AdminPanel } from "../admin/AdminUI";
import {
  fetchProducts,
  normalizeProduct,
  updateLead,
  type LeadQuoteData,
  type LeadRecord,
  type QuoteLine,
} from "../../lib/api";
import { downloadLeadQuotePdf } from "../../lib/quotePdf";
import { toastError, toastSuccess } from "../../lib/toast";

type CatalogProduct = ReturnType<typeof normalizeProduct>;

function emptyQuote(): LeadQuoteData {
  return {
    lines: [
      {
        description: "",
        quantity: 1,
        unitPrice: 0,
        productId: null,
        variantLabel: null,
      },
    ],
    taxPercent: 0,
    discountAmount: 0,
    notes: "",
    validUntil: "",
  };
}

function normalizeQuote(q: LeadQuoteData | null | undefined): LeadQuoteData {
  if (!q?.lines?.length) return emptyQuote();
  return {
    ...q,
    lines: q.lines.map((l) => ({
      description: l.description,
      quantity: l.quantity || 1,
      unitPrice: l.unitPrice ?? 0,
      productId: l.productId ?? null,
      variantLabel: l.variantLabel ?? null,
    })),
  };
}

function formatDescriptionFromProduct(p: CatalogProduct, variantLabel: string | null): string {
  const brand = (p.brand && String(p.brand).trim()) || "";
  const name = String(p.name ?? "").trim();
  const cat = String(p.category ?? "").trim();
  const base = [brand ? `〔${brand}〕` : null, name, cat ? `· ${cat}` : null]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  if (variantLabel?.trim()) {
    return `${base} — ${variantLabel.trim()}`;
  }
  return base || name;
}

export type LeadQuoteBlockProps = {
  lead: LeadRecord;
  pdfLeadNotes: string;
  preparedByName?: string;
  onLeadUpdated?: (lead: LeadRecord) => void;
  sectionId?: string;
};

export default function LeadQuoteBlock({
  lead,
  pdfLeadNotes,
  preparedByName,
  onLeadUpdated,
  sectionId = "lead-quote",
}: LeadQuoteBlockProps) {
  const [quote, setQuote] = useState<LeadQuoteData>(() => normalizeQuote(lead.quoteData));
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);

  useEffect(() => {
    setQuote(normalizeQuote(lead.quoteData));
  }, [lead.id, lead.updatedAt, lead.quoteData]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCatalogLoading(true);
      try {
        const rows = await fetchProducts();
        if (!cancelled) setProducts(rows.map(normalizeProduct));
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const productsByCategory = useMemo(() => {
    const map = new Map<string, CatalogProduct[]>();
    for (const p of products) {
      const c = p.category || "Other";
      if (!map.has(c)) map.set(c, []);
      map.get(c)!.push(p);
    }
    for (const arr of map.values()) {
      arr.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [products]);

  function setLine(i: number, patch: Partial<QuoteLine>) {
    setQuote((q) => {
      const lines = [...q.lines];
      lines[i] = { ...lines[i], ...patch };
      return { ...q, lines };
    });
  }

  function addLine() {
    setQuote((q) => ({
      ...q,
      lines: [
        ...q.lines,
        {
          description: "",
          quantity: 1,
          unitPrice: 0,
          productId: null,
          variantLabel: null,
        },
      ],
    }));
  }

  function removeLine(i: number) {
    setQuote((q) => ({
      ...q,
      lines: q.lines.length > 1 ? q.lines.filter((_, j) => j !== i) : q.lines,
    }));
  }

  function applyProduct(i: number, productIdStr: string) {
    if (!productIdStr) {
      setLine(i, { productId: null, variantLabel: null });
      return;
    }
    const id = Number(productIdStr);
    const p = products.find((x) => x.id === id);
    if (!p) return;
    setLine(i, {
      productId: p.id,
      variantLabel: null,
      description: formatDescriptionFromProduct(p, null),
      unitPrice: Number(p.price) || 0,
    });
  }

  function applyVariant(i: number, line: QuoteLine, variantLabel: string) {
    const id = line.productId;
    const p = id != null ? products.find((x) => x.id === id) : undefined;
    if (!p) {
      setLine(i, { variantLabel: variantLabel || null });
      return;
    }
    const v = variantLabel.trim() || null;
    setLine(i, {
      variantLabel: v,
      description: formatDescriptionFromProduct(p, v),
      unitPrice: Number(p.price) || 0,
    });
  }

  function buildQuotePayload(): LeadQuoteData | null {
    const lines = quote.lines
      .map((l) => ({
        description: l.description.trim(),
        quantity: Number(l.quantity) || 0,
        unitPrice: Number(l.unitPrice) || 0,
        productId: l.productId ?? null,
        variantLabel: l.variantLabel?.trim() || null,
      }))
      .filter((l) => l.description.length > 0 && l.quantity > 0);
    if (lines.length === 0) return null;
    return {
      lines,
      taxPercent: Number(quote.taxPercent) || 0,
      discountAmount: Number(quote.discountAmount) || 0,
      notes: quote.notes?.trim() ?? "",
      validUntil: quote.validUntil?.trim() ?? "",
    };
  }

  async function saveQuoteOnly() {
    const payload = buildQuotePayload();
    if (!payload) {
      toastError("Add at least one line item with description and quantity.");
      return;
    }
    setSaving(true);
    try {
      const updated = await updateLead(lead.id, { quoteData: payload });
      setQuote(normalizeQuote(updated.quoteData));
      onLeadUpdated?.(updated);
      toastSuccess("Quote saved");
    } catch {
      toastError("Could not save quote.");
    } finally {
      setSaving(false);
    }
  }

  function handleDownloadPdf() {
    const payload = buildQuotePayload();
    if (!payload) {
      toastError("Add line items to generate a PDF.");
      return;
    }
    downloadLeadQuotePdf({
      lead: { ...lead, notes: pdfLeadNotes } as LeadRecord,
      quote: payload,
      preparedByName,
    });
    toastSuccess("PDF download started");
  }

  return (
    <div id={sectionId} className="scroll-mt-24">
      <AdminPanel className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Quote & PDF</h2>
        <p className="text-sm text-slate-500 mb-4">
          Pick products from the live shop catalog (same database as the storefront), optional
          specification line for variants, then adjust quantity or price if needed. Download a
          branded quotation PDF.
        </p>

        {catalogLoading ? (
          <p className="text-sm text-slate-500 mb-4">Loading shop catalog…</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-4">
            No products in the catalog yet. Add products in Admin → Products, or enter custom
            lines below.
          </p>
        ) : null}

        <div className="space-y-4">
          {quote.lines.map((line, i) => {
            const selectedProduct =
              line.productId != null ? products.find((p) => p.id === line.productId) : undefined;
            const specEntries = selectedProduct?.specifications
              ? Object.entries(selectedProduct.specifications as Record<string, string>)
              : [];

            return (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-3"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-slate-600">Product (shop catalog)</label>
                    <select
                      value={line.productId != null ? String(line.productId) : ""}
                      onChange={(e) => applyProduct(i, e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316]"
                    >
                      <option value="">— Custom line (type description manually) —</option>
                      {productsByCategory.map(([cat, list]) => (
                        <optgroup key={cat} label={cat}>
                          {list.map((p) => (
                            <option key={p.id} value={String(p.id)}>
                              {p.name} — PKR {Number(p.price || 0).toLocaleString("en-PK")}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {specEntries.length > 0 && (
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-slate-600">
                        Variation / specification
                      </label>
                      <select
                        value={line.variantLabel ?? ""}
                        onChange={(e) => applyVariant(i, line, e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#F97316]"
                      >
                        <option value="">Default (list price)</option>
                        {specEntries.map(([k, val]) => {
                          const label = `${k}: ${val}`;
                          return (
                            <option key={k} value={label}>
                              {label}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-slate-600">Description (PDF)</label>
                    <input
                      value={line.description}
                      onChange={(e) => setLine(i, { description: e.target.value })}
                      placeholder="Product name and details as printed on the quote"
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Filled automatically when you select a catalog product; edit freely for the
                      customer-facing text.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-600">Qty</label>
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={line.quantity}
                      onChange={(e) => setLine(i, { quantity: Number(e.target.value) })}
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600">Unit price (PKR)</label>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      value={line.unitPrice}
                      onChange={(e) => setLine(i, { unitPrice: Number(e.target.value) })}
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeLine(i)}
                    className="text-xs text-red-600 font-medium hover:underline"
                  >
                    Remove line
                  </button>
                </div>
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => addLine()}
            className="text-sm text-[#F97316] font-semibold"
          >
            + Add line item
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mt-4">
          <div>
            <label className="text-xs font-medium text-slate-600">Tax %</label>
            <input
              type="number"
              min={0}
              value={quote.taxPercent ?? 0}
              onChange={(e) => setQuote((q) => ({ ...q, taxPercent: Number(e.target.value) }))}
              className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Discount (PKR)</label>
            <input
              type="number"
              min={0}
              value={quote.discountAmount ?? 0}
              onChange={(e) => setQuote((q) => ({ ...q, discountAmount: Number(e.target.value) }))}
              className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Valid until</label>
            <input
              type="date"
              value={quote.validUntil?.slice(0, 10) ?? ""}
              onChange={(e) => setQuote((q) => ({ ...q, validUntil: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-xs font-medium text-slate-600">Quote notes (shown on PDF)</label>
          <textarea
            value={quote.notes ?? ""}
            onChange={(e) => setQuote((q) => ({ ...q, notes: e.target.value }))}
            rows={2}
            className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            type="button"
            onClick={() => void saveQuoteOnly()}
            disabled={saving}
            className="px-4 py-2 rounded-lg border border-[#F97316] text-[#F97316] text-sm font-medium hover:bg-[#F97316]/10 disabled:opacity-60"
          >
            Save quote
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
          >
            Download PDF
          </button>
        </div>
      </AdminPanel>
    </div>
  );
}
