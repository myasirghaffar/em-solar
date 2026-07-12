/** Fallback catalog used by the storefront when merging with `fetchProducts()` (in-memory demo store). */
export const DUMMY_PRODUCTS = [
  {
    id: 9901,
    name: "Monocrystalline Solar Panel 550W",
    price: 28500,
    description:
      "High-efficiency mono PERC module for residential and commercial rooftops.",
    images: [
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80",
    ],
    category: "Solar Panels",
    status: "active",
    stock: 24,
  },
  {
    id: 9902,
    name: "Hybrid Solar Inverter 5kW",
    price: 112000,
    description:
      "MPPT hybrid inverter with grid-tie and battery backup support.",
    images: [
      "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=800&q=80",
    ],
    category: "Solar Inverters",
    status: "active",
    stock: 12,
  },
  {
    id: 9903,
    name: "Lithium Battery 48V 100Ah",
    price: 198000,
    description: "Deep-cycle LiFePO₄ pack designed for daily solar cycling.",
    images: [
      "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=800&q=80",
    ],
    category: "Batteries",
    status: "active",
    stock: 8,
  },
  {
    id: 9904,
    name: "Roof Mounting Rail Kit",
    price: 18500,
    description: "Aluminum rails, clamps, and hardware for tiled roofs.",
    images: [
      "https://images.unsplash.com/photo-1497435334941-636c87ea4eda?w=800&q=80",
    ],
    category: "Accessories",
    status: "active",
    stock: 40,
  },
  {
    id: 9905,
    name: "Polycrystalline Panel 450W",
    price: 22900,
    description: "Cost-effective poly module for larger array installations.",
    images: [
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
    ],
    category: "Solar Panels",
    status: "active",
    stock: 32,
  },
  {
    id: 9906,
    name: "DC Combiner Box & Surge Protection",
    price: 12400,
    description: "Weatherproof combiner with fuses and SPD for string arrays.",
    images: [
      "https://images.unsplash.com/photo-1559302504-64aae6ca364b?w=800&q=80",
    ],
    category: "Accessories",
    status: "active",
    stock: 18,
  },
] as const;

export function withStoreProductFallback(products: unknown): any[] {
  if (Array.isArray(products) && products.length > 0) return products;
  return [...DUMMY_PRODUCTS];
}
