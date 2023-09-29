//

import { useInject } from "@1/core/ui/di.context.client";
import { useMemo } from "react";
import { OpenAPI_Repository } from "~/app/api/v1/OpenAPI.repository";
import { User_useQuery } from "./User_useQuery";

//

export function useUserData() {
  const repository = useInject(OpenAPI_Repository);

  return useMemo(() => new User_useQuery(repository), [repository]);
}
