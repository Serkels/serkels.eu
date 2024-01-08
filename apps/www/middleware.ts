//

import { NextRequest, NextResponse } from "next/server";

//
// See https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
//

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = [
    `script-src 'self' ${
      // process.env.NODE_ENV === "development"
      true
        ? ["'unsafe-eval'", "'unsafe-inline'"].join(" ")
        : `'nonce-${nonce}' 'strict-dynamic'`
    }`,
    `style-src 'self' 'unsafe-inline' ${
      // process.env.NODE_ENV === "development"
      true ? "" : `'nonce-${nonce}'`
    }`,
    `img-src 'self' blob: data: ${[
      // Placeholder images
      "https://avatars.githubusercontent.com/",
      "https://cloudflare-ipfs.com/",
      "https://fastly.picsum.photos/",
      "https://loremflickr.com/",
      "https://picsum.photos/",
      "https://www.gravatar.com/avatar/",
    ].join(" ")}`,
    `connect-src 'self' ${[
      process.env["API_URL"],
      process.env["NEXT_PUBLIC_WEBSOCKET_URL"],
      process.env.NODE_ENV === "development" ? "webpack://*" : "",
      "https://*.google-analytics.com",
      ,
    ].join(" ")}`,
    "base-uri 'self'",
    "block-all-mixed-content",
    "default-src 'self'",
    "font-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  return NextResponse.next({
    headers: requestHeaders,
    request: {
      headers: requestHeaders,
    },
  });
}
