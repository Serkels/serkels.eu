//

import { useMemo } from "react";
import { useStrapiRepository } from "../../core/useStrapiRepository";
import { Categories_useQuery } from "./Categories_useQuery";

//

export function useCategories_Query() {
  const repository = useStrapiRepository();

  return useMemo(() => new Categories_useQuery(repository), [repository]);
}
