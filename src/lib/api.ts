import { getApiBaseUrl } from "../config/api";
import { humanizeApiError } from "./authApi";

export class ApiError extends Error {
  readonly code: string;
  readonly statusCode: number;

  constructor(code: string, message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

function readAccessToken(): string | null {
  try {
    const raw = localStorage.getItem("energymart-auth");
    if (!raw) return null;
    const p = JSON.parse(raw) as { accessToken?: string };
    return typeof p.accessToken === "string" ? p.accessToken : null;
  } catch {
    return null;
  }
}

async function parseJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function ensureArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

const API_FETCH_TIMEOUT_MS = 25_000;

async function apiRequest<T>(
  path: string,
  init: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const base = getApiBaseUrl();
  if (!base) {
    throw new ApiError("CONFIG", "VITE_API_URL is not set", 0);
  }
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string> | undefined),
  };
  const body = init.body;
  if (body !== undefined && typeof body === "string") {
    headers["Content-Type"] = "application/json";
  }
  if (init.auth) {
    const t = readAccessToken();
    if (!t) {
      throw new ApiError(
        "AUTH_UNAUTHORIZED",
        humanizeApiError("AUTH_UNAUTHORIZED", ""),
        401,
      );
    }
    headers.Authorization = `Bearer ${t}`;
  }
  const { auth: _auth, ...rest } = init;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_FETCH_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`${base}${path}`, {
      ...rest,
      headers,
      signal: controller.signal,
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      throw new ApiError(
        "TIMEOUT",
        "The server took too long to respond. Check your connection and API URL, then try again.",
        0,
      );
    }
    throw e;
  } finally {
    clearTimeout(timeoutId);
  }
  const json = (await parseJson(res)) as {
    success?: boolean;
    data?: T;
    code?: string;
    message?: string;
    statusCode?: number;
  } | null;

  if (!json || typeof json !== "object" || json.success !== true) {
    const code = json?.code ?? "ERROR";
    const msg = humanizeApiError(code, String(json?.message ?? ""));
    throw new ApiError(code, msg, json?.statusCode ?? res.status);
  }
  return json.data as T;
}

function parseJsonField<T>(raw: unknown, fallback: T): T {
  if (raw == null) return fallback;
  if (typeof raw !== "string") return (raw as T) ?? fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function normalizeProduct(p: any) {
  if (p == null || typeof p !== "object") {
    return {
      id: 0,
      name: "",
      category: "",
      price: 0,
      stock: 0,
      description: "",
      longDescription: "",
      brand: "",
      status: "active",
      images: [] as string[],
      specifications: {} as Record<string, string>,
      attachments: [] as { title: string; href: string }[],
    };
  }
  let images = p?.images;
  if (typeof images === "string") images = parseJsonField<string[]>(images, []);
  if (!Array.isArray(images)) images = [];

  let specifications = p?.specifications;
  if (typeof specifications === "string")
    specifications = parseJsonField<Record<string, string>>(specifications, {});
  if (
    !specifications ||
    typeof specifications !== "object" ||
    Array.isArray(specifications)
  )
    specifications = {};

  let attachments = p?.attachments;
  if (typeof attachments === "string")
    attachments = parseJsonField<{ title: string; href: string }[]>(
      attachments,
      [],
    );
  if (!Array.isArray(attachments)) attachments = [];

  return {
    ...p,
    images,
    specifications,
    attachments,
  };
}

function productWritePayload(p: Record<string, unknown>) {
  return {
    name: String(p.name ?? "").trim(),
    category: String(p.category ?? "").trim(),
    price: Number(p.price) || 0,
    stock: Number.parseInt(String(p.stock ?? "0"), 10) || 0,
    description: String(p.description ?? "").trim(),
    longDescription: p.longDescription
      ? String(p.longDescription).trim()
      : undefined,
    brand: p.brand ? String(p.brand).trim() : undefined,
    status:
      p.status === "inactive" ? ("inactive" as const) : ("active" as const),
    images: Array.isArray(p.images) ? (p.images as string[]) : [],
    specifications:
      p.specifications &&
      typeof p.specifications === "object" &&
      !Array.isArray(p.specifications)
        ? (p.specifications as Record<string, string>)
        : {},
    attachments: Array.isArray(p.attachments)
      ? (p.attachments as { title: string; href: string }[])
      : [],
  };
}

export async function fetchProducts(): Promise<any[]> {
  const data = await apiRequest<unknown>("/store/products", { method: "GET" });
  return ensureArray<any>(data).map(normalizeProduct);
}

/** All products including inactive — admin only. */
export async function fetchProductsAdmin(): Promise<any[]> {
  const data = await apiRequest<unknown>("/admin/products", {
    method: "GET",
    auth: true,
  });
  return ensureArray<any>(data).map(normalizeProduct);
}

export async function fetchProductById(id: number): Promise<any> {
  const p = await apiRequest<any>(`/store/products/${id}`, { method: "GET" });
  return normalizeProduct(p);
}

export async function createProduct(payload: any): Promise<boolean> {
  await apiRequest("/admin/products", {
    method: "POST",
    auth: true,
    body: JSON.stringify(productWritePayload(payload)),
  });
  return true;
}

export async function updateProduct(
  id: number,
  payload: any,
): Promise<boolean> {
  await apiRequest(`/admin/products/${id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(productWritePayload(payload)),
  });
  return true;
}

export async function deleteProduct(id: number): Promise<boolean> {
  await apiRequest<null>(`/admin/products/${id}`, {
    method: "DELETE",
    auth: true,
  });
  return true;
}

export async function fetchOrders(): Promise<any[]> {
  const data = await apiRequest<unknown>("/admin/orders", {
    method: "GET",
    auth: true,
  });
  return ensureArray<any>(data);
}

export async function updateOrderStatus(
  id: number,
  order_status: string,
): Promise<boolean> {
  await apiRequest(`/admin/orders/${id}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ order_status }),
  });
  return true;
}

export async function createOrder(payload: any): Promise<boolean> {
  const lines = (Array.isArray(payload.products) ? payload.products : []).map(
    (it: any) => ({
      id: typeof it.id === "number" ? it.id : undefined,
      name: String(it.name ?? ""),
      quantity: Number(it.quantity) || 0,
      price: Number(it.price) || 0,
    }),
  );
  await apiRequest("/store/orders", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      city: payload.city,
      address: payload.address,
      notes: payload.notes ?? "",
      payment_method: payload.payment_method ?? "cod",
      total_price: Number(payload.total_price) || 0,
      products: lines,
    }),
  });
  return true;
}

export async function fetchCustomers(): Promise<any[]> {
  const data = await apiRequest<unknown>("/admin/customers", {
    method: "GET",
    auth: true,
  });
  return ensureArray<any>(data);
}

/** Signed-in customer profile row (from checkout / orders), or null. */
export async function fetchMyCustomer(): Promise<any | null> {
  return apiRequest<any | null>("/users/me/customer", {
    method: "GET",
    auth: true,
  });
}

/** @deprecated Use fetchMyCustomer — kept for older imports */
export async function fetchCustomerByEmail(
  _email: string,
): Promise<any | null> {
  return fetchMyCustomer();
}

export async function fetchMyOrders(_email: string): Promise<any[]> {
  const data = await apiRequest<unknown>("/users/me/orders", {
    method: "GET",
    auth: true,
  });
  return ensureArray<any>(data);
}

export async function fetchConsultations(): Promise<any[]> {
  const data = await apiRequest<unknown>("/admin/consultations", {
    method: "GET",
    auth: true,
  });
  return ensureArray<any>(data);
}

export async function updateConsultationStatus(
  id: number,
  status: string,
): Promise<boolean> {
  await apiRequest(`/admin/consultations/${id}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ status }),
  });
  return true;
}

export async function createConsultation(payload: any): Promise<boolean> {
  await apiRequest("/store/consultations", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name,
      phone: payload.phone,
      city: payload.city,
      monthly_bill: payload.monthly_bill ?? "",
      message: payload.message ?? "",
    }),
  });
  return true;
}

export type ChartPoint = { label: string; sales: number; orders: number };

export async function fetchAnalytics(): Promise<{
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  monthlySales: number[];
  orderGrowth: number[];
  chartSeries: {
    weekly: ChartPoint[];
    monthly: ChartPoint[];
    yearly: ChartPoint[];
  };
}> {
  return apiRequest("/admin/analytics", { method: "GET", auth: true });
}

type AdminBootstrapPayload = {
  products: any[];
  orders: any[];
  customers: any[];
  consultations: any[];
  analytics: any;
  blogs?: any[];
};

let adminBootstrapCache:
  | { atMs: number; data: AdminBootstrapPayload }
  | undefined;

export function getAdminBootstrapCache(): AdminBootstrapPayload | null {
  if (!adminBootstrapCache) return null;
  // Keep cache short-lived so admin changes propagate quickly.
  if (Date.now() - adminBootstrapCache.atMs > 60_000) return null;
  return adminBootstrapCache.data;
}

/** Clear short-lived admin bootstrap cache after mutations (e.g. blogs). */
export function invalidateAdminBootstrapCache(): void {
  adminBootstrapCache = undefined;
}

export async function fetchAdminBootstrap(): Promise<AdminBootstrapPayload> {
  const cached = getAdminBootstrapCache();
  if (cached) return cached;
  const data = await apiRequest<unknown>("/admin/bootstrap", {
    method: "GET",
    auth: true,
  });
  const payload = (data ?? {}) as AdminBootstrapPayload;
  adminBootstrapCache = { atMs: Date.now(), data: payload };
  return payload;
}

/** Public blog card shape (store + admin list). */
export type BlogPost = {
  id: number;
  title: string;
  tag: string;
  image: string;
  date: string;
  excerpt: string;
  body: string;
  is_published: boolean;
  published_at: string;
  created_at?: string;
  updated_at?: string;
};

export async function fetchStoreBlogs(): Promise<BlogPost[]> {
  const data = await apiRequest<unknown>("/store/blogs", { method: "GET" });
  return ensureArray<BlogPost>(data);
}

export async function fetchStoreBlog(id: number): Promise<BlogPost> {
  return apiRequest<BlogPost>(`/store/blogs/${id}`, { method: "GET" });
}

export async function fetchAdminBlogs(): Promise<BlogPost[]> {
  const data = await apiRequest<unknown>("/admin/blogs", { method: "GET", auth: true });
  return ensureArray<BlogPost>(data);
}

export async function createAdminBlog(payload: {
  title: string;
  tag?: string;
  imageUrl: string;
  excerpt?: string;
  body?: string;
  isPublished?: boolean;
  publishedAt?: string;
}): Promise<BlogPost> {
  return apiRequest<BlogPost>("/admin/blogs", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function updateAdminBlog(
  id: number,
  payload: Partial<{
    title: string;
    tag: string;
    imageUrl: string;
    excerpt: string;
    body: string;
    isPublished: boolean;
    publishedAt: string;
  }>,
): Promise<BlogPost> {
  return apiRequest<BlogPost>(`/admin/blogs/${id}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminBlog(id: number): Promise<void> {
  await apiRequest<null>(`/admin/blogs/${id}`, { method: "DELETE", auth: true });
}

// --- Leads & sales team (admin / salesman) ---

export type QuoteLine = {
  description: string;
  quantity: number;
  unitPrice: number;
  /** Shop catalog `products.id` when selected from the store */
  productId?: number | null;
  /** Selected specification line, e.g. `Power: 550W` */
  variantLabel?: string | null;
};

export type LeadQuoteData = {
  lines: QuoteLine[];
  taxPercent?: number;
  discountAmount?: number;
  notes?: string;
  validUntil?: string;
};

export type LeadRecord = {
  id: number;
  name: string;
  contact: string;
  location: string;
  productInterest: string;
  status: string;
  notes: string;
  assignedToUserId: string | null;
  createdByUserId: string;
  quoteData: LeadQuoteData | null;
  createdAt: string;
  updatedAt: string;
  assignedToName: string | null;
  createdByName: string | null;
};

export async function fetchLeads(): Promise<LeadRecord[]> {
  const data = await apiRequest<unknown>("/leads", {
    method: "GET",
    auth: true,
  });
  return ensureArray<LeadRecord>(data);
}

export async function fetchLead(id: number): Promise<LeadRecord> {
  return apiRequest<LeadRecord>(`/leads/${id}`, { method: "GET", auth: true });
}

export async function createLead(payload: {
  name: string;
  contact: string;
  location: string;
  productInterest?: string;
  notes?: string;
  assignedToUserId?: string | null;
}): Promise<LeadRecord> {
  return apiRequest<LeadRecord>("/leads", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function updateLead(
  id: number,
  payload: Partial<{
    name: string;
    contact: string;
    location: string;
    productInterest: string;
    status: string;
    notes: string;
    assignedToUserId: string | null;
    quoteData: LeadQuoteData | null;
  }>,
): Promise<LeadRecord> {
  return apiRequest<LeadRecord>(`/leads/${id}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function deleteLead(id: number): Promise<void> {
  await apiRequest<{ ok: true }>(`/leads/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

export type SalesTeamUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function fetchSalesTeam(): Promise<SalesTeamUser[]> {
  const data = await apiRequest<unknown>("/admin/sales-team", {
    method: "GET",
    auth: true,
  });
  return ensureArray<SalesTeamUser>(data);
}

export async function createSalesTeamMember(body: {
  name: string;
  email: string;
  password: string;
}): Promise<SalesTeamUser> {
  return apiRequest<SalesTeamUser>("/admin/sales-team", {
    method: "POST",
    auth: true,
    body: JSON.stringify(body),
  });
}

export async function patchSalesTeamMember(
  id: string,
  body: Partial<{
    name: string;
    email: string;
    password: string;
    isActive: boolean;
  }>,
): Promise<SalesTeamUser> {
  return apiRequest<SalesTeamUser>(`/admin/sales-team/${id}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(body),
  });
}
