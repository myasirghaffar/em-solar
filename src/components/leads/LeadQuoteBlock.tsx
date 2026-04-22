import { useEffect, useMemo, useState } from "react";
import { AdminPanel } from "../admin/AdminUI";
import DatePickerField from "../ui/DatePickerField";
import Select from "../ui/Select";
import {
  fetchProductCategories,
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

/** Select value when the line uses a typed category not in the admin list */
const CUSTOM_CATALOG_CATEGORY = "__custom__";

function composeLineStorage(itemTitle: string, itemDescription: string): string {
  const t = itemTitle.trim();
  const d = itemDescription.trim();
  if (!t && !d) return "";
  if (!d) return t;
  if (!t) return d;
  return `${t}\n${d}`;
}

function emptyQuote(): LeadQuoteData {
  return {
    lines: [
      {
        description: "",
        quantity: 1,
        unitPrice: 0,
        productId: null,
        variantLabel: null,
        catalogCategoryKey: null,
        catalogCustomCategory: null,
        itemTitle: null,
        itemDescription: null,
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
    lines: q.lines.map((l) => {
      let itemTitle = l.itemTitle ?? null;
      let itemDescription = l.itemDescription ?? null;
      if (itemTitle == null && itemDescription == null) {
        const raw = String(l.description ?? "").trim();
        if (raw.includes("\n")) {
          const i = raw.indexOf("\n");
          itemTitle = raw.slice(0, i).trim() || null;
          itemDescription = raw.slice(i + 1).trim() || null;
        }
      }
      return {
        description: l.description ?? "",
        quantity: l.quantity || 1,
        unitPrice: l.unitPrice ?? 0,
        productId: l.productId ?? null,
        variantLabel: l.variantLabel ?? null,
        catalogCategoryKey: l.catalogCategoryKey ?? null,
        catalogCustomCategory: l.catalogCustomCategory ?? null,
        itemTitle,
        itemDescription,
      };
    }),
  };
}

function defaultItemTitleFromProduct(p: CatalogProduct): string {
  const brand = (p.brand && String(p.brand).trim()) || "";
  const name = String(p.name ?? "").trim();
  return [brand ? `[${brand}]` : null, name].filter(Boolean).join(" ").replace(/\s+/g, " ").trim() || name;
}

function defaultItemDescriptionFromProduct(p: CatalogProduct): string {
  const cat = String(p.category ?? "").trim();
  const short = String(p.description ?? "").trim();
  const parts: string[] = [];
  if (cat) parts.push(`Category: ${cat}`);
  if (short) parts.push(short);
  return parts.join("\n");
}

/** Controlled title field: explicit `itemTitle`, else first line of legacy `description`. */
function lineTitleForForm(l: QuoteLine): string {
  const t = String(l.itemTitle ?? "").trim();
  if (t) return t;
  const d = String(l.description ?? "").trim();
  if (!d) return "";
  const nl = d.indexOf("\n");
  return (nl >= 0 ? d.slice(0, nl) : d).trim();
}

/** Controlled description field: `itemDescription`, else body after first newline in `description`. */
function lineDetailForForm(l: QuoteLine): string {
  const id = String(l.itemDescription ?? "").trim();
  if (id) return id;
  const d = String(l.description ?? "").trim();
  const nl = d.indexOf("\n");
  return nl >= 0 ? d.slice(nl + 1).trim() : "";
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
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    setQuote(normalizeQuote(lead.quoteData));
  }, [lead.id, lead.updatedAt, lead.quoteData]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCatalogLoading(true);
      try {
        const [rows, cats] = await Promise.all([
          fetchProducts(),
          fetchProductCategories().catch(() => []),
        ]);
        if (!cancelled) {
          setProducts(rows.map(normalizeProduct));
          const names = (Array.isArray(cats) ? cats : [])
            .map((c) => String((c as any)?.name ?? "").trim())
            .filter(Boolean);
          setCategories(names);
        }
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

  const computedCategories = useMemo(() => {
    const fromApi = categories.filter(Boolean);
    const fallback = Array.from(
      new Set(products.map((p) => (p.category || "Other").trim()).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b));
    const list = (fromApi.length ? fromApi : fallback).slice();
    if (!list.includes("Other")) list.push("Other");
    return list;
  }, [categories, products]);

  const categoryDropdownOptions = useMemo(() => {
    const opts = computedCategories.map((c) => ({ value: c, label: c }));
    return [...opts, { value: CUSTOM_CATALOG_CATEGORY, label: "Custom…" }];
  }, [computedCategories]);

  function productFilterCategory(line: QuoteLine): string {
    if (line.catalogCategoryKey === CUSTOM_CATALOG_CATEGORY) {
      return (line.catalogCustomCategory ?? "").trim();
    }
    if (line.catalogCategoryKey && line.catalogCategoryKey !== CUSTOM_CATALOG_CATEGORY) {
      return line.catalogCategoryKey.trim();
    }
    const p =
      line.productId != null ? products.find((x) => x.id === line.productId) : undefined;
    if (p?.category) return String(p.category).trim();
    return computedCategories[0] ?? "";
  }

  function categorySelectValue(line: QuoteLine): string {
    if (line.catalogCategoryKey === CUSTOM_CATALOG_CATEGORY) return CUSTOM_CATALOG_CATEGORY;
    if (line.catalogCategoryKey && computedCategories.includes(line.catalogCategoryKey)) {
      return line.catalogCategoryKey;
    }
    const p =
      line.productId != null ? products.find((x) => x.id === line.productId) : undefined;
    if (p?.category && computedCategories.includes(String(p.category))) return String(p.category);
    const inferred = productFilterCategory(line);
    if (computedCategories.includes(inferred)) return inferred;
    if (inferred) return CUSTOM_CATALOG_CATEGORY;
    return computedCategories[0] ?? CUSTOM_CATALOG_CATEGORY;
  }

  function catalogProductOptionsForLine(line: QuoteLine) {
    const filterCat = productFilterCategory(line);
    const opts: { value: string; label: string }[] = [
      { value: "", label: "— Custom line (type description manually) —" },
    ];
    const list = products.filter((p) => String(p.category ?? "").trim() === filterCat);
    list.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    for (const p of list) {
      opts.push({
        value: String(p.id),
        label: `${filterCat || "Category"} · ${p.name} — PKR ${Number(p.price || 0).toLocaleString("en-PK")}`,
      });
    }
    return opts;
  }

  function applyCatalogCategory(i: number, nextKey: string) {
    const line = quote.lines[i];
    const p =
      line.productId != null ? products.find((x) => x.id === line.productId) : undefined;
    if (nextKey === CUSTOM_CATALOG_CATEGORY) {
      const nextCustom =
        line.catalogCategoryKey === CUSTOM_CATALOG_CATEGORY
          ? (line.catalogCustomCategory ?? "")
          : p?.category
            ? String(p.category)
            : "";
      const patch: Partial<QuoteLine> = {
        catalogCategoryKey: CUSTOM_CATALOG_CATEGORY,
        catalogCustomCategory: nextCustom,
      };
      if (p && nextCustom.trim() && p.category.trim() !== nextCustom.trim()) {
        patch.productId = null;
        patch.variantLabel = null;
      }
      setLine(i, patch);
      return;
    }
    const patch: Partial<QuoteLine> = {
      catalogCategoryKey: nextKey,
      catalogCustomCategory: null,
    };
    if (p && String(p.category) !== nextKey) {
      patch.productId = null;
      patch.variantLabel = null;
    }
    setLine(i, patch);
  }

  function applyCatalogCustomCategory(i: number, text: string) {
    const line = quote.lines[i];
    const p =
      line.productId != null ? products.find((x) => x.id === line.productId) : undefined;
    const patch: Partial<QuoteLine> = {
      catalogCategoryKey: CUSTOM_CATALOG_CATEGORY,
      catalogCustomCategory: text,
    };
    if (p && text.trim() && p.category.trim() !== text.trim()) {
      patch.productId = null;
      patch.variantLabel = null;
    }
    setLine(i, patch);
  }

  function setLine(i: number, patch: Partial<QuoteLine>) {
    setQuote((q) => {
      const lines = [...q.lines];
      lines[i] = { ...lines[i], ...patch };
      return { ...q, lines };
    });
  }

  function syncLinePdfFields(i: number, title: string, detail: string) {
    const t = title.trim();
    const d = detail.trim();
    setLine(i, {
      itemTitle: t || null,
      itemDescription: d || null,
      description: composeLineStorage(t, d),
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
          catalogCategoryKey: null,
          catalogCustomCategory: null,
          itemTitle: null,
          itemDescription: null,
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
      setLine(i, {
        productId: null,
        variantLabel: null,
        itemTitle: null,
        itemDescription: null,
        description: "",
      });
      return;
    }
    const id = Number(productIdStr);
    const p = products.find((x) => x.id === id);
    if (!p) return;
    const cat = String(p.category ?? "").trim();
    const inList = Boolean(cat && computedCategories.includes(cat));
    const title = defaultItemTitleFromProduct(p);
    const detail = defaultItemDescriptionFromProduct(p);
    setLine(i, {
      productId: p.id,
      variantLabel: null,
      itemTitle: title,
      itemDescription: detail,
      description: composeLineStorage(title, detail),
      unitPrice: Number(p.price) || 0,
      catalogCategoryKey: inList ? cat : CUSTOM_CATALOG_CATEGORY,
      catalogCustomCategory: inList ? null : cat || null,
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
    const title =
      (line.itemTitle && String(line.itemTitle).trim()) || defaultItemTitleFromProduct(p);
    const detailBase =
      (line.itemDescription && String(line.itemDescription).trim()) ||
      defaultItemDescriptionFromProduct(p);
    setLine(i, {
      variantLabel: v,
      itemTitle: title,
      itemDescription: detailBase,
      description: composeLineStorage(title, detailBase),
      unitPrice: Number(p.price) || 0,
    });
  }

  function buildQuotePayload(): LeadQuoteData | null {
    const lines = quote.lines
      .map((l) => {
        const title = String(l.itemTitle ?? "").trim();
        const detail = String(l.itemDescription ?? "").trim();
        const composed = composeLineStorage(title, detail) || String(l.description ?? "").trim();
        return {
          description: composed,
          quantity: Number(l.quantity) || 0,
          unitPrice: Number(l.unitPrice) || 0,
          productId: l.productId ?? null,
          variantLabel: l.variantLabel?.trim() || null,
          catalogCategoryKey: l.catalogCategoryKey ?? null,
          catalogCustomCategory: l.catalogCustomCategory?.trim() || null,
          itemTitle: title || null,
          itemDescription: detail || null,
        };
      })
      .filter((l) => (String(l.itemTitle ?? "").trim() || l.description.trim()).length > 0 && l.quantity > 0);
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

  function productFeatureImageUrl(p: CatalogProduct | undefined): string | null {
    const im = p?.images?.[0];
    if (!im || typeof im !== "string") return null;
    const t = im.trim();
    if (!t) return null;
    if (t.startsWith("data:") || /^https?:\/\//i.test(t)) return t;
    const path = t.startsWith("/") ? t : `/${t}`;
    return `${window.location.origin}${path}`;
  }

  /** One URL (or null) per distinct catalog product on the quote — order matches first appearance in lines. */
  function projectPhotoUrlsForQuote(lines: QuoteLine[]): (string | null)[] {
    const seen = new Set<number>();
    const result: (string | null)[] = [];
    for (const line of lines) {
      if (line.productId == null) continue;
      if (seen.has(line.productId)) continue;
      seen.add(line.productId);
      const p = products.find((x) => x.id === line.productId);
      result.push(productFeatureImageUrl(p));
    }
    return result;
  }

  async function handleDownloadPdf() {
    const payload = buildQuotePayload();
    if (!payload) {
      toastError("Add line items to generate a PDF.");
      return;
    }
    try {
      const projectPhotoUrls = projectPhotoUrlsForQuote(payload.lines);
      await downloadLeadQuotePdf({
        lead: { ...lead, notes: pdfLeadNotes } as LeadRecord,
        quote: payload,
        preparedByName,
        projectPhotoUrls,
      });
      toastSuccess("PDF download started");
    } catch {
      toastError("Could not generate PDF (check network / logo assets).");
    }
  }

  return (
    <div id={sectionId} className="scroll-mt-24">
      <AdminPanel className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Quote & PDF</h2>
        <p className="text-sm text-slate-500 mb-4">
          For each line, choose a <strong>category</strong>, then a <strong>catalog product</strong> (or a
          custom description). Lines can use different categories. Download a branded quotation PDF.
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
            const catSelectValue = categorySelectValue(line);
            const customCatInput =
              line.catalogCategoryKey === CUSTOM_CATALOG_CATEGORY
                ? (line.catalogCustomCategory ?? "")
                : catSelectValue === CUSTOM_CATALOG_CATEGORY &&
                    selectedProduct &&
                    !computedCategories.includes(String(selectedProduct.category))
                  ? String(selectedProduct.category)
                  : "";

            return (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-3"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-slate-600">Category (this line)</label>
                    <div className="mt-1 relative z-30">
                      <Select
                        options={categoryDropdownOptions}
                        value={catSelectValue}
                        onChange={(v) => applyCatalogCategory(i, v)}
                        placeholder="Select category"
                        triggerClassName="rounded-full"
                      />
                    </div>
                  </div>
                  {catSelectValue === CUSTOM_CATALOG_CATEGORY ? (
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-slate-600">Custom category name</label>
                      <input
                        value={customCatInput}
                        onChange={(e) => applyCatalogCustomCategory(i, e.target.value)}
                        placeholder="Must match product category text in the catalog (e.g. Transportation)"
                        className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        Product list filters by this text against each product category in the catalog
                        (exact match).
                      </p>
                    </div>
                  ) : null}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-slate-600">Product (shop catalog)</label>
                    <div className="mt-1 relative z-20">
                      <Select
                        options={catalogProductOptionsForLine(line)}
                        value={line.productId != null ? String(line.productId) : ""}
                        onChange={(v) => applyProduct(i, v)}
                        placeholder="— Custom line (type description manually) —"
                        triggerClassName="rounded-full"
                      />
                    </div>
                  </div>

                  {specEntries.length > 0 && (
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-slate-600">
                        Variation / specification
                      </label>
                      <div className="mt-1 relative z-20">
                        <Select
                          options={[
                            { value: "", label: "Default (list price)" },
                            ...specEntries.map(([k, val]) => {
                              const label = `${k}: ${val}`;
                              return { value: label, label };
                            }),
                          ]}
                          value={line.variantLabel ?? ""}
                          onChange={(v) => applyVariant(i, line, v)}
                          placeholder="Default (list price)"
                          triggerClassName="rounded-full"
                        />
                      </div>
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-slate-600">Product title (PDF, bold)</label>
                    <input
                      value={lineTitleForForm(line)}
                      onChange={(e) => syncLinePdfFields(i, e.target.value, lineDetailForForm(line))}
                      placeholder="Short name as printed in bold on the quote"
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-slate-600">Description (PDF, under title)</label>
                    <textarea
                      rows={4}
                      value={lineDetailForForm(line)}
                      onChange={(e) => syncLinePdfFields(i, lineTitleForForm(line), e.target.value)}
                      placeholder="Specs, brands, bullet points — can span multiple lines"
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-y min-h-[5rem]"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Title and description are filled when you pick a catalog product; edit freely for
                      the customer-facing PDF. Variation (if any) is still appended on the PDF.
                    </p>
                  </div>

                  <div className="sm:col-span-2 grid gap-3 sm:grid-cols-3">
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
                    <div>
                      <label className="text-xs font-medium text-slate-600">Line total</label>
                      <div className="mt-1 w-full px-3 py-2 border border-gray-100 rounded-lg text-sm bg-slate-50 text-slate-800 tabular-nums">
                        PKR{" "}
                        {(
                          Math.max(0, Number(line.quantity) || 0) * Math.max(0, Number(line.unitPrice) || 0)
                        ).toLocaleString("en-PK")}
                      </div>
                    </div>
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
          <div className="relative z-20">
            <label className="text-xs font-medium text-slate-600" htmlFor="quote-valid-until">
              Valid until
            </label>
            <div className="mt-1">
              <DatePickerField
                id="quote-valid-until"
                value={(quote.validUntil?.trim() ?? "").slice(0, 10)}
                onChange={(iso) => setQuote((q) => ({ ...q, validUntil: iso }))}
                placeholder="dd/mm/yyyy"
              />
            </div>
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
