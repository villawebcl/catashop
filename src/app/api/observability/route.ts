import { NextRequest, NextResponse } from "next/server";

type IngestPayload = {
  level: "warn" | "error";
  message: string;
  meta?: unknown;
  timestamp: string;
  path?: string;
  userAgent?: string;
};

const ipBucket = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_EVENTS_PER_WINDOW = 60;

const truncate = (value: string, max: number) => value.slice(0, max);

const sanitizeMeta = (meta: unknown): unknown => {
  if (meta == null) return undefined;
  if (typeof meta === "string") return truncate(meta, 1000);
  if (Array.isArray(meta)) return meta.slice(0, 30).map(sanitizeMeta);
  if (typeof meta === "object") {
    const entries = Object.entries(meta as Record<string, unknown>).slice(0, 40);
    return Object.fromEntries(
      entries.map(([key, value]) => [truncate(key, 100), sanitizeMeta(value)]),
    );
  }
  return meta;
};

const getIp = (request: NextRequest) => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return "unknown";
};

const passRateLimit = (ip: string) => {
  const now = Date.now();
  const bucket = ipBucket.get(ip);
  if (!bucket || now > bucket.resetAt) {
    ipBucket.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (bucket.count >= MAX_EVENTS_PER_WINDOW) return false;
  bucket.count += 1;
  return true;
};

const parsePayload = async (request: NextRequest): Promise<IngestPayload | null> => {
  try {
    const payload = (await request.json()) as IngestPayload;
    if (
      !payload ||
      (payload.level !== "warn" && payload.level !== "error") ||
      typeof payload.message !== "string" ||
      typeof payload.timestamp !== "string"
    ) {
      return null;
    }

    return {
      level: payload.level,
      message: truncate(payload.message, 400),
      timestamp: truncate(payload.timestamp, 80),
      path: payload.path ? truncate(payload.path, 300) : undefined,
      userAgent: payload.userAgent ? truncate(payload.userAgent, 400) : undefined,
      meta: sanitizeMeta(payload.meta),
    };
  } catch {
    return null;
  }
};

export async function POST(request: NextRequest) {
  const ip = getIp(request);
  if (!passRateLimit(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const payload = await parsePayload(request);
  if (!payload) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const webhookUrl = process.env.OBSERVABILITY_WEBHOOK_URL;
  const webhookToken = process.env.OBSERVABILITY_WEBHOOK_TOKEN;

  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(webhookToken ? { Authorization: `Bearer ${webhookToken}` } : {}),
        },
        body: JSON.stringify({
          source: "catashop-web",
          ...payload,
          ip,
        }),
        cache: "no-store",
      });
    } catch {
      // Fallback local server log if external sink fails.
      console.error("observability.forward_failed", {
        level: payload.level,
        message: payload.message,
      });
    }
  } else {
    const base = {
      level: payload.level,
      message: payload.message,
      path: payload.path,
      timestamp: payload.timestamp,
    };
    if (payload.level === "error") {
      console.error("observability.event", base, payload.meta ?? "");
    } else {
      console.warn("observability.event", base, payload.meta ?? "");
    }
  }

  return new NextResponse(null, { status: 204 });
}
