//

import { useMemo } from "react";
import { OpenAPI_Repository } from "~/app/api/v1/OpenAPI.repository";
import { useInject } from "~/core/react.client";
import { User_useQuery } from "./User_useQuery";

//

export function useUserData() {
  const repository = useInject(OpenAPI_Repository);

  return useMemo(() => new User_useQuery(repository), [repository]);
}
