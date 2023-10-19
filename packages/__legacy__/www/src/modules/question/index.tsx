//

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { fromClient } from "~/app/api/v1";
import { Question_Repository } from "./repository";

//

export function useQuestion_repository() {
  const { data: session } = useSession();

  return useMemo(
    () => new Question_Repository(fromClient, session?.user?.jwt),
    [session?.user?.jwt],
  );
}
