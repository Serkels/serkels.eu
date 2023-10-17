//

import type { AuthOptions } from "next-auth";
import {
  cookies as next_header_cookies,
  headers as next_headers,
} from "next/headers";
import { defaultCookies } from "./cookie";

//

export function get_csrf_token(authOptions = {} as AuthOptions) {
  const headers = next_headers();
  const cookieStore = next_header_cookies();
  const url = new URL(headers.get("referer") || "http://localhost");
  const next_auth_cookies = {
    ...defaultCookies(
      authOptions.useSecureCookies ?? url.protocol.startsWith("https://"),
    ),
    // Allow user cookie options to override any cookie settings above
    ...(authOptions.cookies ?? {}),
  };
  const token = cookieStore.get(next_auth_cookies.csrfToken.name);
  const csrfToken = token?.value.split("|")[0];

  return csrfToken;
}
