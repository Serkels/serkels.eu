"use client";

import { TRPC_React } from "@1.bff/trpc/react";
import type { Comment_ListSchema } from "@1/strapi-openapi";
import type { UseTRPCInfiniteQueryResult } from "@trpc/react-query/shared";
import dynamic from "next/dynamic";
import { useCallback, useId } from "react";
import { match } from "ts-pattern";
import { useDeal_Value } from "../Deal.context";

const Exchange_Conversation_Timeline = dynamic(() =>
  import("../../../Exchange_Conversation_Timeline").then(
    (m) => m.Exchange_Conversation_Timeline,
  ),
);

//

export function Deal_Discussion() {
  const [deal] = useDeal_Value();
  const uid = useId();

  const query_info = TRPC_React.deal.message.all.useInfiniteQuery({
    deal_id: Number(deal.id.value()),
  });
  const on_refresh = useCallback(() => query_info.refetch(), [query_info]);
  return (
    <div onClick={on_refresh}>
      {match(query_info)
        .with({ status: "error" }, () => null)
        .with({ status: "loading" }, () => null)
        .with({ status: "success" }, () => {
          const __remove_me_plz__ = query_info as UseTRPCInfiniteQueryResult<
            Comment_ListSchema,
            unknown
          >;
          return (
            <Exchange_Conversation_Timeline
              key={uid}
              query_info={__remove_me_plz__}
            />
          );
        })
        .exhaustive()}
    </div>
  );
}
