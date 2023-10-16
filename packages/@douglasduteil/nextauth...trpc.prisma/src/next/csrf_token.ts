//

import { cookies } from "next/headers";

//

export function get_csrf_token() {
  const cookieStore = cookies();
  const token = cookieStore.get("next-auth.csrf-token");
  const csrfToken = token?.value.split("|")[0];

  return csrfToken;
}
