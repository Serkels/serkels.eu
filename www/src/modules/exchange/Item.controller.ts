//

import type {
  Exchange_DealListSchema,
  Exchange_ItemSchema,
} from "@1/strapi-openapi";
import { useQuery, type QueryFunction } from "@tanstack/react-query";
import debug from "debug";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import type { Exchange_Repository } from "./infrastructure";
import { Exchange_QueryKeys } from "./queryKeys";

//

const log = debug("~:modules:exchange:Exchange_Item_Controller");

//

export class Exchange_Item_Controller {
  constructor(
    private repository: Exchange_Repository,
    public exchange_id: number,
  ) {
    log("new");
  }

  item = {
    useQuery: this.useItemQuery.bind(this),
  };
  find_deal_by_participant = {
    useQuery: this.useFindDealByParticipant.bind(this),
  };

  useItemQuery() {
    const loadItemFn: QueryFunction<
      Exchange_ItemSchema | undefined,
      ReturnType<typeof Exchange_QueryKeys.item>,
      number
    > = async () => {
      debug("loadItemFn");
      return this.repository.findById(this.exchange_id);
    };

    const query_info = useQuery({
      enabled: Boolean(this.repository.jwt),
      queryFn: useCallback(loadItemFn, [this.repository, this.exchange_id]),
      queryKey: Exchange_QueryKeys.item(this.exchange_id),
      staleTime: Infinity,
    });

    return query_info;
  }

  useFindDealByParticipant() {
    const { data: session } = useSession();
    const { id: user_id } = session!.user!;
    const queryKey = Exchange_QueryKeys.deal(this.exchange_id);
    const find_deal_by_participant: QueryFunction<
      Exchange_DealListSchema,
      typeof queryKey,
      number
    > = async () => {
      debug("find_deal_by_participant");
      return this.repository.find_deal_by_participant(
        this.exchange_id,
        user_id,
      );
    };

    const query_info = useQuery({
      enabled: Boolean(this.repository.jwt),
      queryFn: useCallback(find_deal_by_participant, [
        this.repository,
        this.exchange_id,
      ]),
      queryKey,
      staleTime: Infinity,
    });

    return query_info;
  }
}
