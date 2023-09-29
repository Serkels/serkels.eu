"use client";

import { useContainer, useInject } from "@1/core/ui/di.context.client";
import { Button } from "@1/ui/components/ButtonV";
import { useCallback } from "react";
import tw from "tailwind-styled-components";
import { useDoor_Value } from "~/app/(main)/door/door.context";
import { Deal_Message_Controller } from "~/modules/exchange/Deal_Message.controller";
import { Deal_Message_Repository } from "~/modules/exchange/Deal_Message.repository";
import { useExchange_Value } from "~/modules/exchange/Exchange.context";
import { useDeal_Value } from "../Deal.context";

//

export function SendActionGroup() {
  const [deal] = useDeal_Value();

  const [{ door_id }] = useDoor_Value();
  const [exchange] = useExchange_Value();
  const is_owner = exchange.profile.get("id") === door_id;

  useContainer().registerInstance(
    Deal_Message_Repository.DEAL_ID_TOKEN,
    deal.get("id"),
  );

  const {
    create: { useMutation },
  } = useInject(Deal_Message_Controller);

  const { mutate: send_message, isLoading } = useMutation();

  const send_okay = useCallback(async () => {
    send_message(
      `/exchange ${
        is_owner ? "server" : "client"
      } handshake accepeted ${deal.get("id")}`,
    );
  }, [is_owner, deal.get("id")]);
  const send_nope = useCallback(async () => {
    send_message(
      `/exchange ${is_owner ? "server" : "client"} handshake denied ${deal.get(
        "id",
      )}`,
    );
  }, [is_owner, deal.get("id")]);

  return (
    <UI.Group>
      <Button
        intent="warning"
        size="lg"
        onPress={send_nope}
        isDisabled={isLoading}
      >
        Plus dispo
      </Button>
      <Button size="lg" onPress={send_okay} isDisabled={isLoading}>
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
