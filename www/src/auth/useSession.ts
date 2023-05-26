//

import { useSession } from "next-auth/react";

export const useAuthSession: typeof useSession = (options) =>
  useSession({
    required: true,
    onUnauthenticated() {
      console.log("onUnauthenticated");
    },
    ...options,
  });
