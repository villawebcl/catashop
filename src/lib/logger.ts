type LogLevel = "info" | "warn" | "error";

const isProd = process.env.NODE_ENV === "production";
const observabilityEnabled = process.env.NEXT_PUBLIC_OBSERVABILITY_ENABLED === "true";
const observabilityUrl = "/api/observability";
const dedupeWindowMs = 4_000;
const recentlySent = new Map<string, number>();

const redact = (value: unknown): unknown => {
  if (typeof value === "string") {
    return value
      .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]")
      .replace(/\+?\d[\d\s-]{7,}\d/g, "[redacted-phone]");
  }

  if (Array.isArray(value)) return value.map(redact);

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [
        key,
        redact(val),
      ]),
    );
  }

  return value;
};

const log = (level: LogLevel, message: string, meta?: unknown) => {
  const payload = meta === undefined ? undefined : redact(meta);

  if (level === "info" && isProd) return;

  if (
    typeof window !== "undefined" &&
    observabilityEnabled &&
    isProd &&
    (level === "warn" || level === "error")
  ) {
    const dedupeKey = `${level}:${message}:${JSON.stringify(payload ?? "")}`;
    const now = Date.now();
    const prev = recentlySent.get(dedupeKey);
    if (!prev || now - prev > dedupeWindowMs) {
      recentlySent.set(dedupeKey, now);

      const body = JSON.stringify({
        level,
        message,
        meta: payload,
        timestamp: new Date(now).toISOString(),
        path: window.location.pathname,
        userAgent: navigator.userAgent,
      });

      try {
        const blob = new Blob([body], { type: "application/json" });
        if (navigator.sendBeacon) {
          navigator.sendBeacon(observabilityUrl, blob);
        } else {
          void fetch(observabilityUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
            keepalive: true,
            cache: "no-store",
          });
        }
      } catch {
        // Intentionally silent: observability never blocks app flow.
      }
    }
  }

  if (level === "error") {
    console.error(message, payload ?? "");
    return;
  }
  if (level === "warn") {
    console.warn(message, payload ?? "");
    return;
  }
  console.info(message, payload ?? "");
};

export const logger = {
  info: (message: string, meta?: unknown) => log("info", message, meta),
  warn: (message: string, meta?: unknown) => log("warn", message, meta),
  error: (message: string, meta?: unknown) => log("error", message, meta),
};
