/** Client-side resize + JPEG encode before embedding as a data-URL. */

const MAX_EDGE_PX = 1280;
const JPEG_QUALITY = 0.72;

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not decode image'));
    };
    img.src = url;
  });
}

/**
 * Resize and JPEG-compress an image File; returns a `data:image/jpeg;base64,...` string.
 * Falls back to raw FileReader data-URL if canvas encoding fails.
 */
export async function compressImageFileToDataUrl(file: File): Promise<string> {
  try {
    const img = await loadImageFromFile(file);
    const scale = Math.min(1, MAX_EDGE_PX / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas unavailable');
    }
    ctx.drawImage(img, 0, 0, w, h);

    const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
    if (!dataUrl.startsWith('data:image/jpeg')) {
      throw new Error('JPEG encode failed');
    }
    return dataUrl;
  } catch {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = () => reject(r.error ?? new Error('Could not read file'));
      r.readAsDataURL(file);
    });
  }
}
