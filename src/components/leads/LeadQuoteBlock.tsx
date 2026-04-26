import { useEffect, useMemo, useRef, useState } from "react";
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
/** Product picker: no catalog product — user types title manually */
const CUSTOM_TITLE_PRODUCT = "__manual_title__";

/** Join title + detail for `description` JSON field. Preserves spaces and newlines while typing. */
function composeLineStorage(itemTitle: string, itemDescription: string): string {
  const t = itemTitle;
  const d = itemDescription;
  const hasT = t.trim().length > 0;
  const hasD = d.trim().length > 0;
  if (!hasT && !hasD) return "";
  if (!hasD) return t;
  if (!hasT) return d;
  return `${t}\n${d}`;
}

function emptyLine(): QuoteLine {
  return {
    description: "",
    quantity: 1,
    unitPrice: 0,
    productId: null,
    variantLabel: null,
    catalogCategoryKey: null,
    catalogCustomCategory: null,
    itemTitle: null,
    itemDescription: null,
    includeInPdf: true,
  };
}

/**
 * Starter title + description per category (matches common EnergyMart-style quotation wording).
 * Keys are matched case-insensitively; add aliases for alternate category names from Admin.
 */
const CATEGORY_QUOTE_DEFAULTS: Record<string, { title: string; description: string }> = {
  Inverter: {
    title: "Inverter 06KW Hybrid IP66",
    description: "(Hybrid Inverter 06KW SOLIS)",
  },
  "Solar Panels": {
    title: "Panels 620W Mono Perc",
    description:
      "(World No .1, Tier 1 Bloomberg certified Solar Panel IEC 61215: 2005 TUV Certifications. TCL Solar /JINKO Solar / Canadian Solar or equivalent, depending upon stock availability)",
  },
  Panels: {
    title: "Panels 620W Mono Perc",
    description:
      "(World No .1, Tier 1 Bloomberg certified Solar Panel IEC 61215: 2005 TUV Certifications. TCL Solar /JINKO Solar / Canadian Solar or equivalent, depending upon stock availability)",
  },
  Structure: {
    title: "Weather Protected Frames",
    description: "(Customized Structure uplifted)",
  },
  Wires: {
    title: "Imported Flexible electric wire",
    description:
      "for System interconnections 1) PV Module Interconnections 2) Module to Controller 3) DC Wires",
  },
  Batteries: {
    title: "Power Bank Lithium Ion",
    description: "(Lithium Ion Battery 5.12KWH PYLON TECH)",
  },
  Battery: {
    title: "Power Bank Lithium Ion",
    description: "(Lithium Ion Battery 5.12KWH PYLON TECH)",
  },
  Installation: {
    title: "Installation Service Charges",
    description: "(Installation, Testing and Commissioning of Solar Power System)",
  },
  Transportation: {
    title: "Transportation Charges",
    description: "",
  },
  Other: {
    title: "Fitting Nut Bolt",
    description: "(Mc4 Connectors, Nut Bolt, Cable Ties, PVC duct, Cable Tray)",
  },
  Accessories: {
    title: "Fitting Nut Bolt",
    description: "(Mc4 Connectors, Nut Bolt, Cable Ties, PVC duct, Cable Tray)",
  },
  "Balance of System": {
    title: "Circuit Breakers & Combiner Box",
    description:
      "(Circuit Breakers /SDPDs/Fuses for equipment protection and safety with Photo Voltaic modules combiner boxed with rated DC Circuit Breakers for series and parallel connections for PV Module)",
  },
  Combiner: {
    title: "Circuit Breakers & Combiner Box",
    description:
      "(Circuit Breakers /SDPDs/Fuses for equipment protection and safety with Photo Voltaic modules combiner boxed with rated DC Circuit Breakers for series and parallel connections for PV Module)",
  },
};

/**
 * Fixed quote grid rows (order preserved). Does not wait on Admin / API — same idea as always having "Other".
 * Extra names from products or `fetchProductCategories` append after this list.
 */
const STATIC_QUOTE_TABLE_CATEGORIES: string[] = [
  "Inverter",
  "Solar Panels",
  "Structure",
  "Wires",
  "Batteries",
  "Balance of System",
  "Installation",
  "Transportation",
  "Other",
];

function resolveCategoryDefaults(cat: string): { title: string; description: string } {
  const trimmed = cat.trim();
  if (!trimmed) {
    return { title: "", description: "" };
  }
  const exact = CATEGORY_QUOTE_DEFAULTS[trimmed];
  if (exact) return exact;
  const lower = trimmed.toLowerCase();
  const hit = Object.entries(CATEGORY_QUOTE_DEFAULTS).find(
    ([k]) => k.toLowerCase() === lower,
  );
  if (hit) return hit[1];
  return {
    title: trimmed,
    description: `Details for ${trimmed} — add specifications, brand, model, and what is included on the PDF.`,
  };
}

function lineForCategory(cat: string): QuoteLine {
  const preset = resolveCategoryDefaults(cat);
  return {
    ...emptyLine(),
    catalogCategoryKey: cat,
    catalogCustomCategory: null,
    itemTitle: preset.title,
    itemDescription: preset.description,
    description: composeLineStorage(preset.title, preset.description),
  };
}

/** If a saved row has no text yet, fill starter copy so the grid is not blank. */
function withCategoryDefaultsIfEmpty(line: QuoteLine, cat: string): QuoteLine {
  const t = String(line.itemTitle ?? "").trim();
  const d = String(line.itemDescription ?? "").trim();
  const legacy = String(line.description ?? "").trim();
  if (t || d || legacy) return line;
  const preset = resolveCategoryDefaults(cat);
  return {
    ...line,
    itemTitle: preset.title,
    itemDescription: preset.description,
    description: composeLineStorage(preset.title, preset.description),
  };
}

/** One row per known category, then any extra lines (custom / duplicates) preserved in order. */
function mergeCategoryGridLines(lines: QuoteLine[], categories: string[]): QuoteLine[] {
  const normalized = categories.filter(Boolean);
  const byCat = new Map<string, QuoteLine>();
  const extras: QuoteLine[] = [];

  for (const l of lines) {
    let key: string | null = null;
    if (l.catalogCategoryKey && l.catalogCategoryKey !== CUSTOM_CATALOG_CATEGORY) {
      key = String(l.catalogCategoryKey).trim();
    } else if (l.catalogCategoryKey === CUSTOM_CATALOG_CATEGORY) {
      const c = String(l.catalogCustomCategory ?? "").trim();
      if (c && normalized.includes(c)) key = c;
    }
    if (key && normalized.includes(key)) {
      if (!byCat.has(key)) {
        byCat.set(key, {
          ...l,
          catalogCategoryKey: key,
          catalogCustomCategory: null,
        });
      } else {
        extras.push(l);
      }
    } else {
      extras.push(l);
    }
  }

  const ordered: QuoteLine[] = [];
  for (const cat of normalized) {
    const row = byCat.get(cat) ?? lineForCategory(cat);
    ordered.push(withCategoryDefaultsIfEmpty(row, cat));
  }
  for (const x of extras) {
    ordered.push(x);
  }
  return ordered;
}

function emptyQuote(): LeadQuoteData {
  return {
    lines: [emptyLine()],
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
        includeInPdf: l.includeInPdf !== false,
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

/**
 * Value for the title input. Must not `.trim()` — onChange passes this into sync while the other
 * field updates; trimming would strip spaces/newlines from the sibling on every keystroke.
 */
function lineTitleForForm(l: QuoteLine): string {
  if (l.itemTitle != null) return String(l.itemTitle);
  if (l.itemDescription != null && String(l.itemDescription).length > 0) return "";
  const raw = String(l.description ?? "");
  if (!raw.trim()) return "";
  const nl = raw.indexOf("\n");
  if (nl >= 0) return raw.slice(0, nl);
  return raw;
}

function lineDetailForForm(l: QuoteLine): string {
  if (l.itemDescription != null) return String(l.itemDescription);
  const raw = String(l.description ?? "");
  const nl = raw.indexOf("\n");
  if (nl >= 0) return raw.slice(nl + 1);
  return "";
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
  const leadSyncKeyRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCatalogLoading(true);
      try {
        const rows = await fetchProducts();
        if (!cancelled) {
          setProducts(rows.map(normalizeProduct));
        }
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }
      if (cancelled) return;
      fetchProductCategories()
        .then((cats) => {
          if (cancelled) return;
          const names = (Array.isArray(cats) ? cats : [])
            .map((c) => String((c as { name?: string })?.name ?? "").trim())
            .filter(Boolean);
          setCategories(names);
        })
        .catch(() => {});
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const computedCategories = useMemo(() => {
    const base = [...STATIC_QUOTE_TABLE_CATEGORIES];
    const seen = new Set(base.map((c) => c.toLowerCase()));
    const extras: string[] = [];
    for (const c of categories) {
      const t = String(c ?? "").trim();
      if (t && !seen.has(t.toLowerCase())) {
        seen.add(t.toLowerCase());
        extras.push(t);
      }
    }
    for (const p of products) {
      const t = (p.category || "Other").trim();
      if (t && !seen.has(t.toLowerCase())) {
        seen.add(t.toLowerCase());
        extras.push(t);
      }
    }
    extras.sort((a, b) => a.localeCompare(b));
    return [...base, ...extras];
  }, [categories, products]);

  useEffect(() => {
    const leadSyncKey = `${lead.id}:${lead.updatedAt}`;
    if (computedCategories.length === 0) {
      leadSyncKeyRef.current = leadSyncKey;
      setQuote(normalizeQuote(lead.quoteData));
      return;
    }
    setQuote((prev) => {
      const base = normalizeQuote(lead.quoteData);
      const leadChanged = leadSyncKeyRef.current !== leadSyncKey;
      leadSyncKeyRef.current = leadSyncKey;
      const linesSource = leadChanged ? base.lines : prev.lines;
      return {
        ...(leadChanged ? base : prev),
        lines: mergeCategoryGridLines(linesSource, computedCategories),
      };
    });
  }, [lead.id, lead.updatedAt, lead.quoteData, computedCategories]);

  const categoryDropdownOptions = useMemo(() => {
    const opts = computedCategories.map((c) => ({ value: c, label: c }));
    return [...opts, { value: CUSTOM_CATALOG_CATEGORY, label: "Custom…" }];
  }, [computedCategories]);

  /** Category string used to filter shop products (no fallback to a random default). */
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
    return "";
  }

  function catalogProductOptionsForLine(filterCat: string) {
    const opts: { value: string; label: string }[] = [
      { value: CUSTOM_TITLE_PRODUCT, label: "— Custom title (type below) —" },
    ];
    if (!filterCat) return opts;
    const list = products.filter((p) => String(p.category ?? "").trim() === filterCat);
    list.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    for (const p of list) {
      opts.push({
        value: String(p.id),
        label: `${filterCat} · ${p.name} — PKR ${Number(p.price || 0).toLocaleString("en-PK")}`,
      });
    }
    return opts;
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
    setLine(i, {
      itemTitle: title.length > 0 ? title : null,
      itemDescription: detail.length > 0 ? detail : null,
      description: composeLineStorage(title, detail),
    });
  }

  function addLine() {
    setQuote((q) => ({
      ...q,
      lines: [
        ...q.lines,
        {
          ...emptyLine(),
          catalogCategoryKey: CUSTOM_CATALOG_CATEGORY,
          catalogCustomCategory: "",
        },
      ],
    }));
  }

  const categoryRowCount =
    computedCategories.length > 0 ? computedCategories.length : 0;

  function removeLine(i: number) {
    if (i < categoryRowCount) return;
    setQuote((q) => {
      if (q.lines.length <= 1) return q;
      return { ...q, lines: q.lines.filter((_, j) => j !== i) };
    });
  }

  function clearLine(i: number) {
    if (i < categoryRowCount && categoryRowCount > 0) {
      const cat = computedCategories[i];
      if (cat) setLine(i, lineForCategory(cat));
      return;
    }
    setLine(i, {
      ...emptyLine(),
      catalogCategoryKey: CUSTOM_CATALOG_CATEGORY,
      catalogCustomCategory: "",
    });
  }

  function applyProduct(i: number, productIdStr: string) {
    if (!productIdStr || productIdStr === CUSTOM_TITLE_PRODUCT) {
      setLine(i, { productId: null, variantLabel: null });
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
          includeInPdf: l.includeInPdf !== false,
        };
      })
      .filter((l) => {
        const title = String(l.itemTitle ?? "").trim();
        const detail = String(l.itemDescription ?? "").trim();
        const desc = String(l.description ?? "").trim();
        const hasText =
          title.length > 0 || detail.length > 0 || desc.length > 0;
        const q = Number(l.quantity) || 0;
        const u = Number(l.unitPrice) || 0;
        return hasText && (q > 0 || u > 0);
      });
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
      toastError("Add at least one row with title or description, plus quantity or unit price.");
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

  async function handleDownloadPdf() {
    const payload = buildQuotePayload();
    if (!payload) {
      toastError("Add line items to generate a PDF.");
      return;
    }
    if (!payload.lines.some((l) => l.includeInPdf !== false)) {
      toastError("Check at least one line (✓) to include on the PDF.");
      return;
    }
    try {
      await downloadLeadQuotePdf({
        lead: { ...lead, notes: pdfLeadNotes } as LeadRecord,
        quote: payload,
        preparedByName,
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
          Each standard <strong>category</strong> has a row immediately (no wait for the server). Extra
          categories from your shop appear once products load. Use the <strong>✓</strong> column to choose
          which lines appear on the PDF. On the <strong>last line only</strong>, pick a <strong>shop product</strong>{" "}
          in place of the title to load price and text, or choose <strong>Custom title</strong> and type
          manually. Other lines use the title field only. Subtitle stays multi-line. Line totals and the
          footer subtotal count only checked lines.
        </p>

        {catalogLoading ? (
          <p className="text-sm text-slate-500 mb-4">Loading products for the shop picker…</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-4">
            No products in the catalog yet. Add products in Admin → Products, or enter custom
            lines below.
          </p>
        ) : null}

        <div className="overflow-x-auto rounded-lg border border-rose-200 bg-white shadow-sm">
          <table className="min-w-[680px] w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#9f1239] text-white">
                <th
                  className="border border-rose-200/80 px-1 py-2.5 text-center font-bold align-bottom w-11"
                  title="Include on PDF"
                >
                  <span className="sr-only">Include on PDF</span>
                  <span aria-hidden className="text-base leading-none">
                    ✓
                  </span>
                </th>
                <th className="border border-rose-200/80 px-2 py-2.5 text-left font-bold align-bottom w-[120px]">
                  Category
                </th>
                <th className="border border-rose-200/80 px-2 py-2.5 text-center font-bold align-bottom w-[72px]">
                  No
                </th>
                <th className="border border-rose-200/80 px-2 py-2.5 text-left font-bold align-bottom min-w-[240px]">
                  Details
                </th>
                <th className="border border-rose-200/80 px-2 py-2.5 text-right font-bold align-bottom w-[108px]">
                  Unit price
                </th>
                <th className="border border-rose-200/80 px-2 py-2.5 text-right font-bold align-bottom w-[108px]">
                  Total
                </th>
                <th className="border border-rose-200/80 px-2 py-2.5 text-right font-bold align-bottom w-[88px]">
                  {" "}
                </th>
              </tr>
            </thead>
            <tbody>
              {quote.lines.map((line, i) => {
                const selectedProduct =
                  line.productId != null ? products.find((p) => p.id === line.productId) : undefined;
                const specEntries = selectedProduct?.specifications
                  ? Object.entries(selectedProduct.specifications as Record<string, string>)
                  : [];
                const isLockedCategory = categoryRowCount > 0 && i < categoryRowCount;
                const catSelectValue = categorySelectValue(line);
                const customCatInput =
                  line.catalogCategoryKey === CUSTOM_CATALOG_CATEGORY
                    ? (line.catalogCustomCategory ?? "")
                    : catSelectValue === CUSTOM_CATALOG_CATEGORY &&
                        selectedProduct &&
                        !computedCategories.includes(String(selectedProduct.category))
                      ? String(selectedProduct.category)
                      : "";
                const stripe = i % 2 === 1 ? "bg-rose-50/60" : "bg-white";
                const qn = Math.max(0, Number(line.quantity) || 0);
                const up = Math.max(0, Number(line.unitPrice) || 0);
                const lineTotal = qn * up;
                const filterCat = productFilterCategory(line);
                const isLastRow = i === quote.lines.length - 1;
                const showProductTitlePicker =
                  isLastRow && filterCat.length > 0 && products.length > 0;
                const productPickerValue =
                  line.productId != null ? String(line.productId) : CUSTOM_TITLE_PRODUCT;

                return (
                  <tr key={`${isLockedCategory ? computedCategories[i] : "row"}-${i}`} className={stripe}>
                    <td className="border border-rose-200 align-top px-1 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={line.includeInPdf !== false}
                        onChange={(e) => setLine(i, { includeInPdf: e.target.checked })}
                        className="h-4 w-4 rounded border-rose-300 text-[#9f1239] focus:ring-[#9f1239]"
                        title="Include this line on the PDF"
                        aria-label={`Include ${isLockedCategory ? computedCategories[i] : "this line"} on PDF`}
                      />
                    </td>
                    <td className="border border-rose-200 align-top px-2 py-2 text-slate-700">
                      {isLockedCategory ? (
                        <span className="font-semibold text-slate-800">{computedCategories[i]}</span>
                      ) : (
                        <div className="space-y-1 relative z-30">
                          <Select
                            options={categoryDropdownOptions}
                            value={catSelectValue}
                            onChange={(v) => applyCatalogCategory(i, v)}
                            placeholder="Category"
                            triggerClassName="rounded-md text-xs h-9"
                          />
                          {catSelectValue === CUSTOM_CATALOG_CATEGORY ? (
                            <input
                              value={customCatInput}
                              onChange={(e) => applyCatalogCustomCategory(i, e.target.value)}
                              placeholder="Custom category name"
                              className="w-full px-2 py-1.5 border border-rose-200 rounded-md text-xs"
                            />
                          ) : null}
                        </div>
                      )}
                    </td>
                    <td className="border border-rose-200 align-top px-1 py-2">
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={qn === 0 ? "" : qn}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "") setLine(i, { quantity: 0 });
                          else setLine(i, { quantity: Math.max(0, Number(v) || 0) });
                        }}
                        className="w-full min-w-0 px-1.5 py-1.5 border border-rose-200 rounded-md text-center text-sm"
                      />
                    </td>
                    <td className="border border-rose-200 align-top px-2 py-2">
                      {showProductTitlePicker ? (
                        <div className="mb-1.5 relative z-20">
                          <Select
                            options={catalogProductOptionsForLine(filterCat)}
                            value={productPickerValue}
                            onChange={(v) => applyProduct(i, v)}
                            placeholder="Product for this category"
                            triggerClassName="rounded-md text-xs h-9 font-semibold"
                          />
                        </div>
                      ) : null}
                      {(!showProductTitlePicker || line.productId == null) ? (
                        <input
                          value={lineTitleForForm(line)}
                          onChange={(e) =>
                            syncLinePdfFields(i, e.target.value, lineDetailForForm(line))
                          }
                          placeholder="Title (bold on PDF)"
                          className="w-full px-2 py-1.5 border border-rose-200 rounded-md text-sm font-semibold mb-1.5"
                        />
                      ) : null}
                      <label className="sr-only" htmlFor={`quote-line-desc-${i}`}>
                        Subtitle and details for PDF (multi-line)
                      </label>
                      <textarea
                        id={`quote-line-desc-${i}`}
                        rows={6}
                        value={lineDetailForForm(line)}
                        onChange={(e) => syncLinePdfFields(i, lineTitleForForm(line), e.target.value)}
                        placeholder="Subtitle / details for PDF — multiple lines OK (specs, brands, numbered lists…)"
                        className="mt-1.5 w-full px-2 py-2 border border-rose-200 rounded-md text-sm resize-y min-h-[8.5rem] text-slate-700 leading-relaxed whitespace-pre-wrap"
                      />
                      {specEntries.length > 0 ? (
                        <div className="mt-1.5 relative z-20">
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
                            placeholder="Variation"
                            triggerClassName="rounded-md text-xs h-8"
                          />
                        </div>
                      ) : null}
                    </td>
                    <td className="border border-rose-200 align-top px-1 py-2">
                      <input
                        type="number"
                        min={0}
                        step={100}
                        value={up === 0 ? "" : up}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "") setLine(i, { unitPrice: 0 });
                          else setLine(i, { unitPrice: Math.max(0, Number(v) || 0) });
                        }}
                        className="w-full min-w-0 px-1.5 py-1.5 border border-rose-200 rounded-md text-right text-sm tabular-nums"
                      />
                    </td>
                    <td className="border border-rose-200 align-top px-2 py-2 text-right font-semibold tabular-nums text-slate-900">
                      PKR {lineTotal.toLocaleString("en-PK")}
                    </td>
                    <td className="border border-rose-200 align-top px-1 py-2 text-right whitespace-nowrap">
                      {isLockedCategory ? (
                        <button
                          type="button"
                          onClick={() => clearLine(i)}
                          className="text-xs text-slate-600 hover:text-slate-900 hover:underline"
                        >
                          Clear
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeLine(i)}
                          className="text-xs text-red-600 font-medium hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-rose-100/80 font-semibold text-slate-900">
                <td
                  colSpan={5}
                  className="border border-rose-200 px-2 py-2.5 text-right text-sm"
                >
                  Subtotal (lines on PDF)
                </td>
                <td className="border border-rose-200 px-2 py-2.5 text-right tabular-nums text-sm">
                  PKR{" "}
                  {quote.lines
                    .filter((l) => l.includeInPdf !== false)
                    .reduce((acc, l) => {
                      const q = Math.max(0, Number(l.quantity) || 0);
                      const u = Math.max(0, Number(l.unitPrice) || 0);
                      return acc + q * u;
                    }, 0)
                    .toLocaleString("en-PK")}
                </td>
                <td className="border border-rose-200" />
              </tr>
            </tfoot>
          </table>
        </div>
        <button
          type="button"
          onClick={() => addLine()}
          className="mt-3 text-sm text-[#F97316] font-semibold"
        >
          + Add another line
        </button>

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
