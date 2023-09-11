"use client";

import { useSession } from "next-auth/react";
import { useCallback, useId } from "react";
import { match } from "ts-pattern";
import { fromClient } from "~/app/api/v1";
import { Deal_Message_Controller } from "~/modules/exchange/Deal_Message.controller";
import { Deal_Message_Repository } from "~/modules/exchange/Deal_Message.repository";
import { Exchange_Conversation_Timeline } from "../../../Exchange_Conversation_Timeline";
import { useDeal_Value } from "../Deal.context";

//

export function Deal_Discussion() {
  const [deal] = useDeal_Value();
  const uid = useId();

  const { data: session } = useSession();
  const repository = new Deal_Message_Repository(
    fromClient,
    session?.user?.jwt,
    deal.get("id"),
  );
  // const repository = new Exchange_Repository(fromClient, session?.user?.jwt);
  const {
    list: { useQuery },
    // } = new Exchange_Item_Controller(repository);
  } = new Deal_Message_Controller(repository);

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
