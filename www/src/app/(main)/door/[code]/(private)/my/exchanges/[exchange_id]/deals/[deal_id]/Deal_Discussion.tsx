"use client";

import dynamic from "next/dynamic";
import { useCallback, useId } from "react";
import { match } from "ts-pattern";
import { useInject } from "~/core/react";
import { useContainer } from "~/core/react.client";
import { Deal_Message_Controller } from "~/modules/exchange/Deal_Message.controller";
import { Deal_Message_Repository } from "~/modules/exchange/Deal_Message.repository";
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

  useContainer().registerInstance(
    Deal_Message_Repository.DEAL_ID_TOKEN,
    deal.get("id"),
  );
  const {
    list: { useQuery },
  } = useInject(Deal_Message_Controller);

  const query_info = useQuery({
    sort: ["createdAt:desc"],
    pagination: { pageSize: 42 },
  });
  const on_refresh = useCallback(() => query_info.refetch(), [query_info]);
  return (
    <div onClick={on_refresh}>
      {match(query_info.status)
        .with("error", () => null)
        .with("loading", () => null)
        .with("success", () => {
          return (
            <Exchange_Conversation_Timeline key={uid} query_info={query_info} />
          );
        })
        .exhaustive()}
    </div>
  );
}
