"use client";

import { SeeProfileAvatarMedia } from ":components/avatar";
import { TRPC_React } from ":trpc/client";
import type { Exchange } from "@1.modules/exchange.domain";
import {
  Outlet_Provider,
  useOutlet_Context,
  useOutlet_Exchange,
  useOutlet_RequireContext,
  useOutlet_Send,
} from "@1.modules/exchange.ui/ask/context";
import { Ask_Form } from "@1.modules/exchange.ui/ask/form";
import { Exchange_Ask_Modal } from "@1.modules/exchange.ui/ask/modal";
import { SendingInProgress } from "@1.modules/exchange.ui/ask/sending";
import { MessageSent } from "@1.modules/exchange.ui/ask/sent";
import { useTimeoutEffect } from "@react-hookz/web";
import { type PropsWithChildren } from "react";
import { createSlot } from "react-slotify";
import { match } from "ts-pattern";

//

export function Ask_Action({
  children,
  exchange,
}: PropsWithChildren<{ exchange: Exchange }>) {
  return (
    <Exchange_Ask_Modal>
      <Exchange_Ask_Modal.Trigger>
        <Ask_Action.Trigger.Renderer childs={children}>
          ...
        </Ask_Action.Trigger.Renderer>
      </Exchange_Ask_Modal.Trigger>
      <Exchange_Ask_Modal.Dialog>
        <Outlet_Provider exchange={exchange}>
          <Ask_Body></Ask_Body>
        </Outlet_Provider>
      </Exchange_Ask_Modal.Dialog>
    </Exchange_Ask_Modal>
  );
}

Ask_Action.Trigger = createSlot();

//

function Ask_Body() {
  const context = useOutlet_Context();
  const exchange = useOutlet_Exchange();

  return match(context)
    .with({ state: "idle" }, () => (
      <Ask_Form>
        <Ask_Form.AvatarFigure>
          <SeeProfileAvatarMedia profile={exchange.owner.profile} />
        </Ask_Form.AvatarFigure>
      </Ask_Form>
    ))
    .with({ state: "creating deal" }, () => <Sending />)
    .with({ state: "sent" }, () => <MessageSent />)
    .exhaustive();
}

//

function Sending() {
  const context = useOutlet_RequireContext({ state: "creating deal" });
  const exchange = useOutlet_Exchange();
  const send = useOutlet_Send();
  const exchange_id = exchange.id;

  //

  const create = TRPC_React.exchanges.me.inbox.create.useMutation();
  const utils = TRPC_React.useUtils();

  useTimeoutEffect(async () => {
    await create.mutateAsync({
      content: context.message,
      exchange_id,
    });

    await utils.exchanges.me.inbox.by_exchange_id.invalidate({ exchange_id });

    send({ state: "sent" });
  }, 1_111);

  //

  return <SendingInProgress />;
}
