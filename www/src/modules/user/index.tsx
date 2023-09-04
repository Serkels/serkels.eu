//

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { fromClient } from "~/app/api/v1";
import { StrapiRepository } from "~/core/StrapiRepository";
import { User_useQuery } from "./User_useQuery";

//

export function useStrapiRepository() {
  const { data: session } = useSession();

  return useMemo(
    () => new StrapiRepository(fromClient, session?.user?.jwt),
    [session?.user?.jwt],
  );
}

export function useUserData() {
  const repository = useStrapiRepository();

  return useMemo(() => new User_useQuery(repository), [repository]);
}
