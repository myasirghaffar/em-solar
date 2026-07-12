/**
 * Storefront API base (no trailing slash).
 * Always same-origin `/api` — never the old Railway host.
 */
export function getApiBaseUrl(): string {
  // Absolute override only for local/dev tooling; never Railway / legacy backend.
  if (typeof window !== "undefined") {
    const fromRuntime = (
      (window as Window & { __EM_SOLAR_API_BASE__?: string }).__EM_SOLAR_API_BASE__ ?? ""
    )
      .trim()
      .replace(/\/$/, "");
    if (
      fromRuntime &&
      (fromRuntime.startsWith("/") || fromRuntime.includes("localhost")) &&
      !fromRuntime.toLowerCase().includes("railway") &&
      !fromRuntime.toLowerCase().includes("em-solar-backend")
    ) {
      return fromRuntime;
    }
  }

  const raw = (process.env.NEXT_PUBLIC_API_URL ?? "").trim().replace(/\/$/, "");
  // Only allow relative same-origin bases (e.g. "/api"). Ignore absolute legacy URLs.
  if (raw.startsWith("/")) {
    return raw;
  }

  return "/api";
}
