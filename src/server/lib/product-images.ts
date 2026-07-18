import type { ProductRow } from '../db/schema';
import { products } from '../db/schema';

/**
 * Columns for product cards/lists without pulling multi‑MB base64 image blobs.
 * Attachments are omitted from lists (can be huge data-URLs); load via getProduct* for edit/detail.
 */
export const productListColumns = {
  id: products.id,
  name: products.name,
  category: products.category,
  price: products.price,
  stock: products.stock,
  description: products.description,
  longDescription: products.longDescription,
  brand: products.brand,
  status: products.status,
  specifications: products.specifications,
  highlightOptions: products.highlightOptions,
  createdAt: products.createdAt,
  updatedAt: products.updatedAt,
  imageCount: products.imageCount,
};

/** Detail/edit: includes attachments, still omits raw `images` (use proxy URLs + imageCount). */
export const productDetailColumns = {
  ...productListColumns,
  attachments: products.attachments,
};

export function productImageProxyUrl(productId: number, index: number): string {
  return `/api/store/products/${productId}/images/${index}`;
}

export function proxyImageUrls(productId: number, imageCount: number): string[] {
  const n = Number.isFinite(imageCount) ? Math.max(0, Math.floor(imageCount)) : 0;
  return Array.from({ length: n }, (_, i) => productImageProxyUrl(productId, i));
}

export type ProductListRow = Omit<ProductRow, 'images' | 'attachments'> & {
  imageCount: number;
  attachments?: ProductRow['attachments'];
};

/** Match `/api/store/products/:id/images/:index` (with or without origin). */
const PROXY_IMAGE_RE =
  /\/api\/store\/products\/(\d+)\/images\/(\d+)\/?$/i;

export function isProductImageProxyUrl(value: string): boolean {
  try {
    const path = value.startsWith('http') ? new URL(value).pathname : value;
    return PROXY_IMAGE_RE.test(path.split('?')[0] ?? path);
  } catch {
    return false;
  }
}

/**
 * When admin saves a product, keep existing DB base64 for proxy URLs and
 * accept new `data:` / https uploads as-is (caller should compress data-URLs).
 */
export function resolveProductImagesForWrite(
  incoming: string[] | undefined,
  existing: string[] | undefined,
): string[] | undefined {
  if (incoming === undefined) return undefined;
  const prev = Array.isArray(existing) ? existing : [];
  return incoming.map((img, index) => {
    if (typeof img !== 'string' || !img.trim()) return img;
    if (isProductImageProxyUrl(img)) {
      return prev[index] ?? img;
    }
    return img;
  });
}

export function parseDataUrl(dataUrl: string): { contentType: string; bytes: Buffer } | null {
  const match = /^data:([^;,]+);base64,([\s\S]+)$/i.exec(dataUrl);
  if (!match) return null;
  const contentType = match[1]?.trim() || 'application/octet-stream';
  const b64 = match[2] ?? '';
  try {
    return { contentType, bytes: Buffer.from(b64, 'base64') };
  } catch {
    return null;
  }
}
