const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(SUPABASE_URL, SUPABASE_KEY);
}

function normalizeProduct(p: any) {
  return {
    ...p,
    images: Array.isArray(p?.images) ? p.images : (typeof p?.images === "string" ? (() => { try { return JSON.parse(p.images); } catch { return []; } })() : []),
  };
}

async function apiFetch<T>(url: string, opts?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, opts);
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

// Products
export async function fetchProducts(): Promise<any[]> {
  const data = await apiFetch<any[]>("/api/products");
  if (Array.isArray(data) && data.length > 0) return data.map(normalizeProduct);
  const sb = await getSupabase();
  if (!sb) return [];
  const { data: sbData } = await sb.from("products").select("*").order("id", { ascending: true });
  return (Array.isArray(sbData) ? sbData : []).map(normalizeProduct);
}

export async function createProduct(payload: any): Promise<boolean> {
  const res = await apiFetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  if (res !== null) return true;
  const sb = await getSupabase();
  if (!sb) return false;
  const { error } = await sb.from("products").insert({ ...payload, status: "active" });
  return !error;
}

export async function updateProduct(id: number, payload: any): Promise<boolean> {
  const res = await apiFetch("/api/products", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...payload }) });
  if (res !== null) return true;
  const sb = await getSupabase();
  if (!sb) return false;
  const { error } = await sb.from("products").update(payload).eq("id", id);
  return !error;
}

export async function deleteProduct(id: number): Promise<boolean> {
  const res = await apiFetch("/api/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
  if (res !== null) return true;
  const sb = await getSupabase();
  if (!sb) return false;
  const { error } = await sb.from("products").delete().eq("id", id);
  return !error;
}

// Orders
export async function fetchOrders(): Promise<any[]> {
  const data = await apiFetch<any[]>("/api/orders");
  if (Array.isArray(data)) return data;
  const sb = await getSupabase();
  if (!sb) return [];
  const { data: d } = await sb.from("orders").select("*").order("id", { ascending: false });
  return Array.isArray(d) ? d : [];
}

export async function updateOrderStatus(id: number, order_status: string): Promise<boolean> {
  const res = await apiFetch("/api/orders", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, order_status }) });
  if (res !== null) return true;
  const sb = await getSupabase();
  if (!sb) return false;
  const { error } = await sb.from("orders").update({ order_status }).eq("id", id);
  return !error;
}

// Customers
export async function fetchCustomers(): Promise<any[]> {
  const data = await apiFetch<any[]>("/api/customers");
  if (Array.isArray(data)) return data;
  const sb = await getSupabase();
  if (!sb) return [];
  const { data: d } = await sb.from("customers").select("*").order("id", { ascending: false });
  return Array.isArray(d) ? d : [];
}

// Consultations
export async function fetchConsultations(): Promise<any[]> {
  const data = await apiFetch<any[]>("/api/consultations");
  if (Array.isArray(data)) return data;
  const sb = await getSupabase();
  if (!sb) return [];
  const { data: d } = await sb.from("consultations").select("*").order("id", { ascending: false });
  return Array.isArray(d) ? d : [];
}

export async function updateConsultationStatus(id: number, status: string): Promise<boolean> {
  const res = await apiFetch("/api/consultations", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
  if (res !== null) return true;
  const sb = await getSupabase();
  if (!sb) return false;
  const { error } = await sb.from("consultations").update({ status }).eq("id", id);
  return !error;
}

// Analytics
export async function fetchAnalytics(): Promise<{
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  monthlySales: number[];
  orderGrowth: number[];
}> {
  const data = await apiFetch<any>("/api/analytics");
  if (data && typeof data.totalSales === "number") return data;
  const sb = await getSupabase();
  if (!sb) return { totalSales: 0, totalOrders: 0, totalCustomers: 0, totalProducts: 0, monthlySales: Array(12).fill(0), orderGrowth: Array(12).fill(0) };
  const { data: orders } = await sb.from("orders").select("total_price, created_at");
  const { count: totalCustomers } = await sb.from("customers").select("*", { count: "exact", head: true });
  const { count: totalProducts } = await sb.from("products").select("*", { count: "exact", head: true });
  const totalSales = orders?.reduce((s: number, o: any) => s + (o.total_price || 0), 0) || 0;
  const monthlyOrders = orders || [];
  const monthlySales = Array(12).fill(0).map((_, i) =>
    monthlyOrders.filter((o: any) => {
      const d = new Date(o.created_at);
      return d.getMonth() === i && d.getFullYear() === new Date().getFullYear();
    }).reduce((s: number, o: any) => s + (o.total_price || 0), 0)
  );
  const orderGrowth = Array(12).fill(0).map((_, i) =>
    monthlyOrders.filter((o: any) => {
      const d = new Date(o.created_at);
      return d.getMonth() === i && d.getFullYear() === new Date().getFullYear();
    }).length
  );
  return {
    totalSales,
    totalOrders: orders?.length || 0,
    totalCustomers: totalCustomers || 0,
    totalProducts: totalProducts || 0,
    monthlySales,
    orderGrowth
  };
}
