import { NextResponse, type NextRequest } from "next/server";

const buildCsp = () => {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "script-src 'self' 'unsafe-inline'",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "form-action 'self' https://wa.me",
    "upgrade-insecure-requests",
  ].join("; ");
};

const buildNonceReportOnlyCsp = (nonce: string) => {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    `script-src 'self' 'nonce-${nonce}'`,
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "form-action 'self' https://wa.me",
    "upgrade-insecure-requests",
  ].join("; ");
};

export function middleware(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const enableNonceRollout = process.env.CSP_ENFORCE_NONCE === "true";
  const csp = buildCsp();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", csp);
  if (enableNonceRollout) {
    response.headers.set("Content-Security-Policy-Report-Only", buildNonceReportOnlyCsp(nonce));
  }
  response.headers.set("x-nonce", nonce);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
