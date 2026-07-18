import sharp from 'sharp';
import { parseDataUrl } from './product-images';

/** Longest edge for catalog / blog images (keeps DB jsonb payloads small). */
const MAX_EDGE_PX = 1280;
const JPEG_QUALITY = 72;
/** Skip recompression when already a small JPEG. */
const SKIP_UNDER_BYTES = 90 * 1024;

/**
 * Compress a `data:image/...;base64,...` string to a resized JPEG data-URL.
 * Non-image / external URLs / placeholders are returned unchanged.
 */
export async function compressDataUrlImage(input: string): Promise<string> {
  if (typeof input !== 'string' || !input.startsWith('data:image/')) {
    return input;
  }
  const parsed = parseDataUrl(input);
  if (!parsed || parsed.bytes.length === 0) {
    return input;
  }
  if (
    parsed.bytes.length <= SKIP_UNDER_BYTES &&
    /^image\/jpe?g$/i.test(parsed.contentType)
  ) {
    return input;
  }

  try {
    const out = await sharp(parsed.bytes)
      .rotate()
      .resize({
        width: MAX_EDGE_PX,
        height: MAX_EDGE_PX,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toBuffer();

    // Prefer original only when it is already smaller (e.g. tiny PNG icon).
    if (out.length >= parsed.bytes.length && out.length > SKIP_UNDER_BYTES) {
      return input;
    }
    return `data:image/jpeg;base64,${out.toString('base64')}`;
  } catch {
    return input;
  }
}

export async function compressProductImages(images: string[]): Promise<string[]> {
  return Promise.all(
    images.map(async (img) => {
      if (typeof img !== 'string') return img;
      return compressDataUrlImage(img);
    }),
  );
}
