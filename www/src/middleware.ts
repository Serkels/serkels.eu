//

import { withAuth } from "next-auth/middleware";
// import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";
// import { NextFetchEvent, NextRequest } from "next/server";

export default withAuth({
  callbacks: {
    async authorized({ req, token }) {
      console.log();
      console.log("middleware > onSuccess", req.nextUrl.pathname);
      console.log({ token });
      console.log();
      return true;
    },
  },
  //     const token = await getToken({ req, secret })
  //     console.log(token)
  //     if (req.url.includes('admin')) {
  //       console.log('admin')
  //     } else if (req.url.includes('profile')) {
  //       console.log('user')
  //     }
  //     return true
  //   },
  // },
});

export const config = { matcher: ["/exchange", "/my"] };

/*
const publicPages = ["/", "/confirm"];

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
  const publicPathnameRegex = RegExp(`^/(${publicPages.join("|")})?/?$`, "i");
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
  // matcher: [
  /*
   * \from https://nextjs.org/docs/pages/building-your-application/routing/middleware#matcher
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   *
  // "/((?!api|_next/static|_next/image|_next/chunks|favicon.ico).*)",

  //
  // `/((?!${publicPages.join("|")}).*)`,
  // ],

  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
*/
