//

import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";
import { NextFetchEvent, NextRequest } from "next/server";

const locales = ["en", "de"];
const publicPages = ["/", "/login"];

const authMiddleware = withAuth(
  // Note that this callback is only invoked if
  // the `authorized` callback has returned `true`
  // and not for pages listed in `pages`.
  function onSuccess(req) {
    console.log();
    console.log("middleware > onSuccess", req.nextUrl.pathname);
    console.log();
    // return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log();
        console.log("middleware > authorized", token);
        console.log();
        return token != null && Boolean(token.name);
      },
    },
    pages: {
      signIn: "/",
    },
  },
);

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join("|")}))?(${publicPages.join("|")})?/?$`,
    "i",
  );
  console.log();
  console.log("middleware", req.nextUrl.pathname);
  console.log();
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return; //intlMiddleware(req);
  } else {
    return authMiddleware(req as NextRequestWithAuth, event);
  }
}

export const config = {
  matcher: [
    // "/((?!api|_next|.*\\..*).*)",
    /*
     * \from https://nextjs.org/docs/pages/building-your-application/routing/middleware#matcher
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    // "/((?!api|_next/static|_next/image|favicon.ico).*)",
    // "/((?!signup).*)",
  ],
};
