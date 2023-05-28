//

import { withAuth } from "next-auth/middleware";

//

export const config = { matcher: ["/exchange"] };

export default withAuth({
  pages: {
    signIn: "/signin",
    error: "/",
  },
});

// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   return NextResponse.redirect(new URL("/home", request.url));
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };
