"use client";

import { TRPC_React } from "@1.bff/trpc/react";
import { useInject } from "@1/core/ui/di.context.client";
import { Button } from "@1/ui/components/ButtonV";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import tw from "tailwind-styled-components";
import { z } from "zod";
import { useDoor_Value } from "~/app/(main)/door/door.context";
import { Deal_Message_Controller } from "~/modules/exchange/Deal_Message.controller";
import { useExchange_Value } from "~/modules/exchange/Exchange.context";
import {
  Deal_QueryKeys,
  Exchange_QueryKeys,
} from "~/modules/exchange/queryKeys";
import { useDeal_Value } from "../Deal.context";

//

export function SendActionGroup() {
  const [deal] = useDeal_Value();

  const query_client = useQueryClient();
  const [{ door_id }] = useDoor_Value();
  const [exchange] = useExchange_Value();
  const is_owner = exchange.profile.get("id") === door_id;
  const exchange_deal_id_pair = {
    deal_id: z.coerce
      .number()
      .parse(deal.id.value(), { path: ["deal.id.value()"] }),
    exchange_id: z.coerce
      .number()
      .parse(exchange.id.value(), { path: ["exchange.id.value()"] }),
  };

  const {
    create: { useMutation },
  } = useInject(Deal_Message_Controller);

  const { mutateAsync: send_message, isLoading } = useMutation(deal.id);
  const status = TRPC_React.exchange.deal.status.useMutation();

  const send_okay = useCallback(async () => {
    await status.mutateAsync({
      action: "approve",
      ...exchange_deal_id_pair,
    });
    await query_client.resetQueries(
      Deal_QueryKeys.item(exchange_deal_id_pair.deal_id),
    );
    await query_client.resetQueries(
      Exchange_QueryKeys.item(exchange_deal_id_pair.exchange_id),
    );

    await send_message(
      `/exchange ${
        is_owner ? "server" : "client"
      } handshake accepeted ${deal.get("id")}`,
    );
  }, [is_owner, deal.get("id")]);

  const send_nope = useCallback(async () => {
    await status.mutateAsync({
      action: "denie",
      ...exchange_deal_id_pair,
    });
    await query_client.resetQueries(
      Deal_QueryKeys.item(exchange_deal_id_pair.deal_id),
    );

    await send_message(
      `/exchange ${is_owner ? "server" : "client"} handshake denied ${deal.get(
        "id",
      )}`,
    );
  }, [is_owner, deal.get("id")]);

  const is_closed =
    isLoading || deal.status === "denied" || deal.status === "approved";
  // const is_wait_for_approval = deal.status.

  return (
    <UI.Group>
      <Button
        intent="warning"
        size="lg"
        onPress={send_nope}
        isDisabled={is_closed}
      >
        Plus dispo
      </Button>
      <Button size="lg" onPress={send_okay} isDisabled={is_closed}>
        Accepter
      </Button>
    </UI.Group>
  );
}

//

const Group = tw.div`
  space-x-5
  text-sm
`;

//

const UI = { Group };
