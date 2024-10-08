"use client";

import { SeeProfileAvatarMedia } from ":components/avatar";
import { TRPC_React } from ":trpc/client";
import { StateError } from "@1.modules/core/errors";
import { HANDSHAKE_TOCTOC, type Exchange } from "@1.modules/exchange.domain";
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
import { sendGAEvent } from "@next/third-parties/google";
import { useTimeoutEffect } from "@react-hookz/web";
import { useRouter } from "next/navigation";
import { type PropsWithChildren } from "react";
import { createSlot } from "react-slotify";
import { match } from "ts-pattern";

//

export function Ask({
  children,
  exchange,
}: PropsWithChildren<{ exchange: Exchange }>) {
  return (
    <Exchange_Ask_Modal>
      <Exchange_Ask_Modal.Trigger>
        <Ask.Trigger.Renderer childs={children}>...</Ask.Trigger.Renderer>
      </Exchange_Ask_Modal.Trigger>
      <Exchange_Ask_Modal.Dialog>
        <Outlet_Provider exchange={exchange}>
          <Ask_Body />
        </Outlet_Provider>
      </Exchange_Ask_Modal.Dialog>
    </Exchange_Ask_Modal>
  );
}

Ask.Trigger = createSlot();

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
    .with({ state: "sent" }, () => <Sent />)
    .exhaustive();
}

//

function Sent() {
  const { href } = useOutlet_RequireContext({ state: "sent" });
  const router = useRouter();
  const { id: exchange_id } = useOutlet_Exchange();
  const utils = TRPC_React.useUtils();

  useTimeoutEffect(async () => {
    await Promise.all([
      utils.exchanges.me.inbox.by_exchange_id.invalidate({ exchange_id }),
      utils.exchanges.me.find.invalidate({}),
      utils.exchanges.me.deal_by_exchange_id.invalidate(exchange_id),
    ]);

    router.push(href);
  }, 3_333);

  return <MessageSent />;
}

function Sending() {
  const context = useOutlet_RequireContext({ state: "creating deal" });
  const exchange = useOutlet_Exchange();
  const send = useOutlet_Send();
  const exchange_id = exchange.id;

  //

  const create = TRPC_React.exchanges.me.inbox.create_deal.useMutation();
  useTimeoutEffect(async () => {
    const { exchange_threads } = await create.mutateAsync({
      content: context.message === "" ? HANDSHAKE_TOCTOC : context.message,
      exchange_id,
    });

    sendGAEvent("event", "start_exchange", {
      event_category: "exchange",
      event_label: exchange.type,
      value: exchange.id,
    });

    const inbox = exchange_threads.at(0);

    if (!inbox) {
      throw new StateError("Exchange Inbox Thread not found");
    }

    const href = `/@~/exchanges/inbox/${exchange_id}/${inbox.thread_id}`;

    send({ state: "sent", href });
  }, 1_111);

  //

  return <SendingInProgress />;
}
