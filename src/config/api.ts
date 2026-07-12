/** Same-origin Next.js API. Never fall back to the old Railway host. */
const LOCAL_API_BASE = "/api";

function isDisallowedExternalApi(url: string): boolean {
  const lower = url.toLowerCase();
  return (
    lower.includes("railway.app") ||
    lower.includes("em-solar-backend") ||
    lower.startsWith("http://localhost:8787") ||
    lower.startsWith("https://localhost:8787")
  );
}

/**
 * Base URL for API requests (no trailing slash).
 * Always prefers same-origin `/api` unless NEXT_PUBLIC_API_URL is an explicit non-legacy override.
 */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const fromRuntime = (
      (window as Window & { __EM_SOLAR_API_BASE__?: string }).__EM_SOLAR_API_BASE__ ?? ""
    )
      .trim()
      .replace(/\/$/, "");
    if (fromRuntime && !isDisallowedExternalApi(fromRuntime)) {
      return fromRuntime;
    }
  }

  const raw = (process.env.NEXT_PUBLIC_API_URL ?? "").trim().replace(/\/$/, "");
  if (raw && !isDisallowedExternalApi(raw)) {
    return raw;
  }

  return LOCAL_API_BASE;
}
