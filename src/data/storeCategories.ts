import {
  PanelTop,
  Plug,
  Battery,
  Zap,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

export type StoreCategory = {
  name: string;
  slug: string;
  icon: LucideIcon;
  description: string;
  /** Soft blob behind icon in compact category bar */
  accentClass: string;
  shortName?: string;
};

export const STORE_CATEGORIES: StoreCategory[] = [
  {
    name: "Solar Panels",
    slug: "Solar Panels",
    icon: PanelTop,
    description: "High-efficiency solar panels for maximum energy generation",
    accentClass: "bg-violet-200/80",
    shortName: "Panels",
  },
  {
    name: "Solar Inverters",
    slug: "Solar Inverters",
    icon: Plug,
    description: "Reliable inverters for seamless power conversion",
    accentClass: "bg-fuchsia-200/80",
    shortName: "Inverters",
  },
  {
    name: "Batteries",
    slug: "Batteries",
    icon: Battery,
    description: "Long-lasting batteries for energy storage",
    accentClass: "bg-cyan-200/80",
    shortName: "Batteries",
  },
  {
    name: "Accessories",
    slug: "Accessories",
    icon: Zap,
    description: "Complete range of solar accessories and mounting systems",
    accentClass: "bg-orange-200/80",
    shortName: "Accessories",
  },
];

const DEFAULT_ACCENT = "bg-slate-200/80";

const metaByName = new Map(
  STORE_CATEGORIES.map((c) => [c.name.toLowerCase(), c]),
);

export function categoryShopHref(slug: string) {
  return `/shop?category=${encodeURIComponent(slug)}`;
}

export function resolveStoreCategories(
  apiCategories: { name: string; sortOrder?: number }[] | null | undefined,
): StoreCategory[] {
  if (!apiCategories?.length) return STORE_CATEGORIES;

  const sorted = [...apiCategories].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  const resolved = sorted.map((row) => {
    const known = metaByName.get(row.name.toLowerCase());
    if (known) return known;
    return {
      name: row.name,
      slug: row.name,
      icon: LayoutGrid,
      description: `Browse our ${row.name.toLowerCase()} collection`,
      accentClass: DEFAULT_ACCENT,
      shortName: row.name.split(/\s+/)[0],
    };
  });

  return resolved.length > 0 ? resolved : STORE_CATEGORIES;
}

/** Category names for shop filters/tabs — API order first, then any product-only categories. */
export function getShopCategoryNames(
  apiCategories: { name: string; sortOrder?: number }[] | null | undefined,
  products: { category?: string | null }[] = [],
): string[] {
  const names = resolveStoreCategories(apiCategories).map((c) => c.name);
  const seen = new Set(names);
  const extras: string[] = [];

  for (const product of products) {
    const name = product.category?.trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    extras.push(name);
  }

  return extras.length > 0 ? [...names, ...extras.sort()] : names;
}
