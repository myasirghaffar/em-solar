import { localStore } from "../data/localStore";

function parseJsonField<T>(raw: unknown, fallback: T): T {
  if (raw == null) return fallback;
  if (typeof raw !== "string") return (raw as T) ?? fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function normalizeProduct(p: any) {
  let images = p?.images;
  if (typeof images === "string") images = parseJsonField<string[]>(images, []);
  if (!Array.isArray(images)) images = [];

  let specifications = p?.specifications;
  if (typeof specifications === "string") specifications = parseJsonField<Record<string, string>>(specifications, {});
  if (!specifications || typeof specifications !== "object" || Array.isArray(specifications)) specifications = {};

  let attachments = p?.attachments;
  if (typeof attachments === "string") attachments = parseJsonField<{ title: string; href: string }[]>(attachments, []);
  if (!Array.isArray(attachments)) attachments = [];

  return {
    ...p,
    images,
    specifications,
    attachments,
  };
}

// Products
export async function fetchProducts(): Promise<any[]> {
  return localStore.getProducts().map(normalizeProduct);
}

export async function createProduct(payload: any): Promise<boolean> {
  return localStore.createProduct(payload);
}

export async function updateProduct(id: number, payload: any): Promise<boolean> {
  return localStore.updateProduct(id, payload);
}

export async function deleteProduct(id: number): Promise<boolean> {
  return localStore.deleteProduct(id);
}

// Orders
export async function fetchOrders(): Promise<any[]> {
  return localStore.getOrders();
}

export async function updateOrderStatus(id: number, order_status: string): Promise<boolean> {
  return localStore.updateOrderStatus(id, order_status);
}

export async function createOrder(payload: any): Promise<boolean> {
  return localStore.createOrder(payload);
}

// Customers
export async function fetchCustomers(): Promise<any[]> {
  return localStore.getCustomers();
}

export async function fetchCustomerByEmail(email: string): Promise<any | null> {
  return localStore.getCustomerByEmail(email);
}

export async function fetchMyOrders(email: string): Promise<any[]> {
  return localStore.getOrdersByCustomerEmail(email);
}

// Consultations
export async function fetchConsultations(): Promise<any[]> {
  return localStore.getConsultations();
}

export async function updateConsultationStatus(id: number, status: string): Promise<boolean> {
  return localStore.updateConsultationStatus(id, status);
}

export async function createConsultation(payload: any): Promise<boolean> {
  return localStore.createConsultation(payload);
}

// Analytics
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
  return localStore.getAnalytics();
}
