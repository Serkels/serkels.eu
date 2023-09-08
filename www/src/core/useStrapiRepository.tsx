import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { get_api_session } from "~/app/api/auth/[...nextauth]/route";
import { fromClient, fromServer } from "~/app/api/v1";
import { StrapiRepository } from "~/core/StrapiRepository";

//

export function useStrapiRepository() {
  const { data: session } = useSession();

  return useMemo(
    () => new StrapiRepository(fromClient, session?.user?.jwt),
    [session?.user?.jwt],
  );
}

export async function get_StrapiRepository() {
  const session = await get_api_session();

  return new StrapiRepository(fromServer, session?.user?.jwt);
}
