//

import { auth } from "@1.modules/auth.next/auth";
import { PROFILE_UNKNOWN } from "@1.modules/profile.domain";

//

export async function session_profile_id() {
  const session = await auth();
  return session?.profile.id ?? PROFILE_UNKNOWN.id;
}
