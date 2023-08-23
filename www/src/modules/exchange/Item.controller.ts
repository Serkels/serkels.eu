//

import type { Exchange_ItemSchema } from "@1/strapi-openapi";
import { useQuery, type QueryFunction } from "@tanstack/react-query";
import debug from "debug";
import { useCallback } from "react";
import type { Exchange_Repository } from "./infrastructure";
import { Exchange_QueryKeys } from "./queryKeys";

//

const log = debug("~:modules:exchange:Exchange_Item_Controller");

//

export class Exchange_Item_Controller {
  constructor(private repository: Exchange_Repository) {
    log("new");
  }

  item = {
    useQuery: this.useItemQuery.bind(this),
  };

  useItemQuery(id: number) {
    const loadListFn: QueryFunction<
      Exchange_ItemSchema | undefined,
      ReturnType<typeof Exchange_QueryKeys.item>,
      number
    > = async () => {
      return this.repository.findById(id);
    };

    const query_info = useQuery({
      enabled: Boolean(this.repository.jwt),
      queryFn: useCallback(loadListFn, [this.repository, id]),
      queryKey: Exchange_QueryKeys.item(id),
      staleTime: Infinity,
    });

    return query_info;
  }
}
