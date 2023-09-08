//

import { useMemo } from "react";
import { useStrapiRepository } from "../../core/useStrapiRepository";
import { User_useQuery } from "./User_useQuery";

//

export function useUserData() {
  const repository = useStrapiRepository();

  return useMemo(() => new User_useQuery(repository), [repository]);
}
