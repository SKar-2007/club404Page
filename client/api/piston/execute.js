// Simple in-memory rate limiter (resets on cold start — acceptable for serverless)
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 20; // max 20 executions per minute per IP

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { start: now, count: 1 });
    return true;
  }
  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) return false;
  return true;
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimit) {
    if (now - entry.start > RATE_LIMIT_WINDOW * 2) rateLimit.delete(ip);
  }
}, 60_000);

export default async function handler(req, res) {
  const allowed = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "*";

  res.setHeader("Access-Control-Allow-Origin", allowed);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Rate limit per IP
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip)) {
    return res.status(429).json({
      error: "Too many requests. Please wait a moment and try again.",
    });
  }

  const pistonUrl = process.env.PISTON_API_URL;
  if (!pistonUrl) {
    return res.status(500).json({
      error: "Code execution service is not configured. Please contact the admin.",
    });
  }

  // Validate request body
  const { language, version, files } = req.body || {};
  if (!language || !version || !files?.length) {
    return res.status(400).json({ error: "Missing required fields: language, version, files" });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000); // 30s timeout

    const upstreamRes = await fetch(`${pistonUrl}/api/v2/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, version, files }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!upstreamRes.ok) {
      const text = await upstreamRes.text();
      return res.status(upstreamRes.status).json({ error: text });
    }

    const data = await upstreamRes.json();
    return res.status(200).json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (err.name === "AbortError") {
      return res.status(504).json({
        error: "Code execution timed out. Try simpler code or a different language.",
      });
    }
    return res.status(502).json({
      error: "Code execution service is temporarily unavailable. Please try again later.",
    });
  }
}
