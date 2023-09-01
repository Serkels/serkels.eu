//

import { useSession } from "next-auth/react";

export function useMyProfileId() {
  const { data: session } = useSession();
  return session?.user?.profile.id;
}
