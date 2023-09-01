//

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { fromClient } from "~/app/api/v1";
import { BookmarksRepository } from "./BookmarksRepository";

//

export function useBookmard_repository() {
  const { data: session } = useSession();

  return useMemo(
    () => new BookmarksRepository(fromClient, session?.user?.jwt),
    [session?.user?.jwt],
  );
}
