//

import { getServerSession } from "@1.modules/auth.next.legacy";
import { PROFILE_UNKNOWN } from "@1.modules/profile.domain";

//

export async function session_profile_id() {
  const session = await getServerSession();
  return session?.profile.id ?? PROFILE_UNKNOWN.id;
}
