import {
  PanelTop,
  Plug,
  Battery,
  Zap,
  Truck,
  Cloud,
  Cable,
  Wrench,
  CircleDot,
  Building2,
  Headset,
  Gauge,
  Landmark,
  Sun,
  Shield,
  Boxes,
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

type CategoryMetaTemplate = {
  icon: LucideIcon;
  accentClass: string;
  description: string;
  shortName?: string;
};

const EXACT_META: Record<string, CategoryMetaTemplate> = {
  "solar panels": {
    icon: PanelTop,
    accentClass: "bg-violet-200/80",
    description: "High-efficiency solar panels for maximum energy generation",
    shortName: "Panels",
  },
  panels: {
    icon: PanelTop,
    accentClass: "bg-violet-200/80",
    description: "High-efficiency solar panels for maximum energy generation",
    shortName: "Panels",
  },
  "solar inverters": {
    icon: Plug,
    accentClass: "bg-fuchsia-200/80",
    description: "Reliable inverters for seamless power conversion",
    shortName: "Inverters",
  },
  inverters: {
    icon: Plug,
    accentClass: "bg-fuchsia-200/80",
    description: "Reliable inverters for seamless power conversion",
    shortName: "Inverters",
  },
  inverter: {
    icon: Plug,
    accentClass: "bg-fuchsia-200/80",
    description: "Reliable inverters for seamless power conversion",
    shortName: "Inverters",
  },
  batteries: {
    icon: Battery,
    accentClass: "bg-cyan-200/80",
    description: "Long-lasting batteries for energy storage",
    shortName: "Batteries",
  },
  battery: {
    icon: Battery,
    accentClass: "bg-cyan-200/80",
    description: "Long-lasting batteries for energy storage",
    shortName: "Batteries",
  },
  accessories: {
    icon: Zap,
    accentClass: "bg-orange-200/80",
    description: "Complete range of solar accessories and mounting systems",
    shortName: "Accessories",
  },
  structure: {
    icon: Building2,
    accentClass: "bg-slate-200/80",
    description: "Mounting structures and installation hardware",
    shortName: "Structure",
  },
  wires: {
    icon: Cable,
    accentClass: "bg-amber-200/80",
    description: "Solar cables and wiring solutions",
    shortName: "Wires",
  },
  wire: {
    icon: Cable,
    accentClass: "bg-amber-200/80",
    description: "Solar cables and wiring solutions",
    shortName: "Wires",
  },
  fitting: {
    icon: Wrench,
    accentClass: "bg-emerald-200/80",
    description: "Fittings and connection components",
    shortName: "Fitting",
  },
  fittings: {
    icon: Wrench,
    accentClass: "bg-emerald-200/80",
    description: "Fittings and connection components",
    shortName: "Fittings",
  },
  breakers: {
    icon: CircleDot,
    accentClass: "bg-rose-200/80",
    description: "Circuit breakers and protection gear",
    shortName: "Breakers",
  },
  breaker: {
    icon: CircleDot,
    accentClass: "bg-rose-200/80",
    description: "Circuit breakers and protection gear",
    shortName: "Breakers",
  },
  service: {
    icon: Headset,
    accentClass: "bg-sky-200/80",
    description: "Installation and maintenance services",
    shortName: "Service",
  },
  services: {
    icon: Headset,
    accentClass: "bg-sky-200/80",
    description: "Installation and maintenance services",
    shortName: "Services",
  },
  transportation: {
    icon: Truck,
    accentClass: "bg-lime-200/80",
    description: "Delivery and logistics for your orders",
    shortName: "Transport",
  },
  "net-metering": {
    icon: Gauge,
    accentClass: "bg-indigo-200/80",
    description: "Net metering solutions and support",
    shortName: "Net-Meter",
  },
  "net metering": {
    icon: Gauge,
    accentClass: "bg-indigo-200/80",
    description: "Net metering solutions and support",
    shortName: "Net-Meter",
  },
  earthing: {
    icon: Landmark,
    accentClass: "bg-teal-200/80",
    description: "Earthing and grounding equipment",
    shortName: "Earthing",
  },
  cloud: {
    icon: Cloud,
    accentClass: "bg-pink-200/80",
    description: "Cloud monitoring and smart energy tools",
    shortName: "Cloud",
  },
  solar: {
    icon: Sun,
    accentClass: "bg-yellow-200/80",
    description: "Solar energy products and solutions",
    shortName: "Solar",
  },
  protection: {
    icon: Shield,
    accentClass: "bg-red-200/70",
    description: "Protection and safety equipment",
    shortName: "Protection",
  },
  components: {
    icon: Boxes,
    accentClass: "bg-stone-200/80",
    description: "Solar system components",
    shortName: "Components",
  },
};

const KEYWORD_RULES: { keywords: string[]; meta: CategoryMetaTemplate }[] = [
  { keywords: ["panel"], meta: EXACT_META["solar panels"] },
  { keywords: ["inverter"], meta: EXACT_META.inverters },
  { keywords: ["batter"], meta: EXACT_META.batteries },
  { keywords: ["accessor", "mount"], meta: EXACT_META.accessories },
  { keywords: ["struct", "mounting", "rack"], meta: EXACT_META.structure },
  { keywords: ["wire", "cable"], meta: EXACT_META.wires },
  { keywords: ["fit", "connector"], meta: EXACT_META.fitting },
  { keywords: ["breaker", "mcb", "protection"], meta: EXACT_META.breakers },
  { keywords: ["service", "install", "maintain"], meta: EXACT_META.service },
  { keywords: ["transport", "deliver", "logistic"], meta: EXACT_META.transportation },
  { keywords: ["net", "meter"], meta: EXACT_META["net-metering"] },
  { keywords: ["earth", "ground"], meta: EXACT_META.earthing },
  { keywords: ["cloud", "monitor", "wifi"], meta: EXACT_META.cloud },
];

const FALLBACK_ACCENTS = [
  "bg-violet-200/80",
  "bg-fuchsia-200/80",
  "bg-cyan-200/80",
  "bg-orange-200/80",
  "bg-emerald-200/80",
  "bg-amber-200/80",
  "bg-rose-200/80",
  "bg-sky-200/80",
  "bg-lime-200/80",
  "bg-indigo-200/80",
  "bg-teal-200/80",
  "bg-pink-200/80",
] as const;

const FALLBACK_ICONS: LucideIcon[] = [
  PanelTop,
  Plug,
  Battery,
  Zap,
  Building2,
  Cable,
  Wrench,
  CircleDot,
  Truck,
  Gauge,
  Cloud,
  Headset,
];

function hashLabel(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function resolveCategoryMeta(name: string): CategoryMetaTemplate {
  const key = name.toLowerCase().trim().replace(/\s+/g, " ");

  if (EXACT_META[key]) return EXACT_META[key];

  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some((kw) => key.includes(kw))) return rule.meta;
  }

  const idx = hashLabel(key) % FALLBACK_ACCENTS.length;
  const firstWord = name.split(/\s+/)[0] ?? name;
  return {
    icon: FALLBACK_ICONS[idx % FALLBACK_ICONS.length],
    accentClass: FALLBACK_ACCENTS[idx],
    description: `Browse our ${name.toLowerCase()} collection`,
    shortName: firstWord.length > 12 ? `${firstWord.slice(0, 10)}...` : firstWord,
  };
}

function toStoreCategory(name: string, template: CategoryMetaTemplate): StoreCategory {
  return {
    name,
    slug: name,
    icon: template.icon,
    description: template.description,
    accentClass: template.accentClass,
    shortName: template.shortName,
  };
}

export const STORE_CATEGORIES: StoreCategory[] = [
  toStoreCategory("Solar Panels", EXACT_META["solar panels"]),
  toStoreCategory("Solar Inverters", EXACT_META["solar inverters"]),
  toStoreCategory("Batteries", EXACT_META.batteries),
  toStoreCategory("Accessories", EXACT_META.accessories),
];

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

  const resolved = sorted.map((row) =>
    toStoreCategory(row.name, resolveCategoryMeta(row.name)),
  );

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
