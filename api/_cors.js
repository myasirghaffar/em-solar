const FRONTEND_ORIGINS = new Set([
  // Production frontend domain
  'https://energymart-pk.vercel.app',
]);

export function applyCors(req, res, { methods, headers }) {
  const origin = req?.headers?.origin;

  // If the browser is sending a known frontend origin, echo it back.
  // Otherwise fall back to '*' to preserve current behavior.
  if (origin && FRONTEND_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  // Helps caches/proxies handle per-origin responses correctly.
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', headers);
}

