//

import type { UID } from "@1/core/domain";
import type { Exchange_DealListSchema } from "@1/strapi-openapi";
import { useQuery, type QueryFunction } from "@tanstack/react-query";
import debug from "debug";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import type { Exchange_Repository } from "./Exchange_Repository";
import { Exchange_QueryKeys } from "./queryKeys";

//

const log = debug("~:modules:exchange:Exchange_Item_Controller");

//

export class Exchange_Item_Controller {
  constructor(
    private repository: Exchange_Repository,
    public exchange_id: UID,
  ) {
    log("new");
  }

  item = {
    useQuery: this.useItemQuery.bind(this),
  };
  find_deal_by_participant = {
    useQuery: this.useFindDealByParticipant.bind(this),
  };

  useFindDealByParticipant() {
    const { data: session } = useSession();
    const { id: user_id } = session!.user!;
    const queryKey = Exchange_QueryKeys.deal(this.exchange_id.value());
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
      enabled: this.repository.is_authorized,
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
