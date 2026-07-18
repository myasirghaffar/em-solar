/**
 * One-time (safe to re-run) compression of product images + blog covers
 * stored as data-URLs in Postgres.
 *
 *   npx tsx src/server/scripts/compress-existing-images.ts
 */
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { resolve } from 'node:path';
import dotenv from 'dotenv';
import { blogs, products } from '../db/schema';
import { compressDataUrlImage, compressProductImages } from '../lib/compress-image';
import { createPostgresFromDatabaseUrl } from '../lib/postgres-from-env-url';
import { resolveDatabaseUrlFromProcessEnv } from '../lib/resolve-database-url';
import { parseDataUrl } from '../lib/product-images';

function loadEnv() {
  const preset = process.env.DATABASE_URL?.trim();
  dotenv.config({ path: resolve(process.cwd(), '.env.local') });
  dotenv.config({ path: resolve(process.cwd(), '.env'), override: true });
  dotenv.config({ path: resolve(process.cwd(), '.dev.vars') });
  if (preset) process.env.DATABASE_URL = preset;
}

function dataUrlBytes(src: string): number {
  const parsed = parseDataUrl(src);
  return parsed?.bytes.length ?? 0;
}

async function main() {
  loadEnv();
  const url = resolveDatabaseUrlFromProcessEnv();
  if (!url) {
    console.error('No DATABASE_URL found. Set it in .env.local and retry.');
    process.exit(1);
  }

  const sql = createPostgresFromDatabaseUrl(url, { max: 1 });
  const db = drizzle(sql);

  console.log('Compressing product images…');
  const productRows = await db.select({ id: products.id, images: products.images }).from(products);
  let productsUpdated = 0;
  let productBytesBefore = 0;
  let productBytesAfter = 0;

  for (const row of productRows) {
    const images = Array.isArray(row.images) ? row.images : [];
    if (images.length === 0) continue;

    const before = images.reduce(
      (sum, img) => sum + (typeof img === 'string' && img.startsWith('data:') ? dataUrlBytes(img) : 0),
      0,
    );
    if (before === 0) continue;

    const compressed = await compressProductImages(images);
    const after = compressed.reduce(
      (sum, img) => sum + (typeof img === 'string' && img.startsWith('data:') ? dataUrlBytes(img) : 0),
      0,
    );

    if (after >= before) {
      console.log(`  product #${row.id}: skip (${(before / 1024).toFixed(0)} KB, already small)`);
      continue;
    }

    await db
      .update(products)
      .set({
        images: compressed,
        imageCount: compressed.length,
        updatedAt: new Date(),
      })
      .where(eq(products.id, row.id));

    productsUpdated += 1;
    productBytesBefore += before;
    productBytesAfter += after;
    console.log(
      `  product #${row.id}: ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB`,
    );
  }

  console.log('Compressing blog cover images…');
  const blogRows = await db.select({ id: blogs.id, imageUrl: blogs.imageUrl }).from(blogs);
  let blogsUpdated = 0;
  let blogBytesBefore = 0;
  let blogBytesAfter = 0;

  for (const row of blogRows) {
    const src = row.imageUrl?.trim() ?? '';
    if (!src.startsWith('data:image/')) continue;

    const before = dataUrlBytes(src);
    if (before === 0) continue;

    const compressed = await compressDataUrlImage(src);
    const after = dataUrlBytes(compressed);
    if (after >= before) {
      console.log(`  blog #${row.id}: skip (${(before / 1024).toFixed(0)} KB)`);
      continue;
    }

    await db
      .update(blogs)
      .set({ imageUrl: compressed, updatedAt: new Date() })
      .where(eq(blogs.id, row.id));

    blogsUpdated += 1;
    blogBytesBefore += before;
    blogBytesAfter += after;
    console.log(
      `  blog #${row.id}: ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB`,
    );
  }

  console.log('\nDone.');
  console.log(
    `Products: ${productsUpdated} updated, ${(productBytesBefore / 1024 / 1024).toFixed(2)} MB → ${(productBytesAfter / 1024 / 1024).toFixed(2)} MB`,
  );
  console.log(
    `Blogs: ${blogsUpdated} updated, ${(blogBytesBefore / 1024 / 1024).toFixed(2)} MB → ${(blogBytesAfter / 1024 / 1024).toFixed(2)} MB`,
  );

  await sql.end({ timeout: 5 });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
